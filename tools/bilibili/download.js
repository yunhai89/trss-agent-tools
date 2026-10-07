/**
 * 哔哩哔哩媒体下载（纯 Node 流式，无需 yt-dlp/ffmpeg）。
 *
 * - 视频：playurl 的 durl（fnval=1）是**已合并**的 MP4，直接下载即可播放（匿名通常 360P，登录后更高）。
 * - 音频：dash 的 audio 轨（m4a）单独下载，供 STT 转录或当音频文件发送。
 *   dash 的视频/音频是分轨的，无 ffmpeg 时无法合并，故“视频下载”走 durl。
 */
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import Config from '../../utils/Config.js'
import { getPlayInfo, pickBestAudio, pickBestDurl, BiliError } from './api.js'
import { defaultHeaders } from './util.js'

const DOWNLOAD_TIMEOUT_MS = 120000

function safeName(s) {
  return String(s || 'bilibili').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 60)
}

function outDir(cfg = {}) {
  const dir = cfg.dir || path.join(Config.path.temp, 'bilibili')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

/** 流式下载 URL 到本地文件（带 Referer/Cookie，防 CDN 403） */
export async function downloadToFile(url, destPath, { fetcher, cookie, timeoutMs = DOWNLOAD_TIMEOUT_MS } = {}) {
  const f = fetcher || globalThis.fetch
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await f(url, { headers: defaultHeaders(cookie), signal: controller.signal })
    if (!res.ok || !res.body) throw new BiliError(`下载失败 HTTP ${res.status}`, { kind: 'http' })
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(destPath))
    const size = fs.statSync(destPath).size
    return { path: destPath, size }
  } catch (e) {
    try { fs.rmSync(destPath, { force: true }) } catch { /* noop */ }
    if (e?.name === 'AbortError') throw new BiliError(`下载超时（${Math.round(timeoutMs / 1000)}s）`, { kind: 'http' })
    throw e
  } finally { clearTimeout(timer) }
}

/** 下载合并 MP4 视频（durl） */
export async function downloadVideo({ bvid, cid, title }, opts = {}) {
  const info = await getPlayInfo({ bvid, cid }, opts)
  const d = pickBestDurl(info.durl)
  if (!d?.url) throw new BiliError('未取到可下载的视频流（durl 为空，可能需登录或该视频受限）', { kind: 'need_login' })
  const dest = path.join(outDir(opts.cfg), `${safeName(title)}_${bvid}.mp4`)
  const r = await downloadToFile(d.url, dest, opts)
  return { ...r, quality: info.quality, acceptQuality: info.acceptQuality, kind: 'video', ext: 'mp4' }
}

/** 下载最优 dash 音频（m4a） */
export async function downloadAudio({ bvid, cid, title }, opts = {}) {
  const info = await getPlayInfo({ bvid, cid }, opts)
  const a = pickBestAudio(info.dash)
  if (!a?.baseUrl) throw new BiliError('未取到可下载的音频流（dash.audio 为空）', { kind: 'need_login' })
  const dest = path.join(outDir(opts.cfg), `${safeName(title)}_${bvid}.m4a`)
  const r = await downloadToFile(a.baseUrl, dest, opts)
  return { ...r, audioId: a.id, kind: 'audio', ext: 'm4a' }
}
