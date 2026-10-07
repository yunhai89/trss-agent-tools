/**
 * 哔哩哔哩工具辅助（纯函数，无网络 / 无 Config 依赖，便于离线测试）。
 */

export const HOSTS = {
  api: 'https://api.bilibili.com',
  www: 'https://www.bilibili.com',
}

export const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** 默认请求头（B站对 Referer/Origin 敏感，缺失易被风控） */
export function defaultHeaders(cookie) {
  const h = {
    'User-Agent': DEFAULT_UA,
    Referer: `${HOSTS.www}/`,
    Origin: HOSTS.www,
  }
  const c = String(cookie || '').trim()
  if (c) h.Cookie = c
  return h
}

/** 清晰度（qn）映射 */
export const QUALITY_MAP = {
  16: '360P',
  32: '480P',
  64: '720P',
  74: '720P60',
  80: '1080P',
  112: '1080P+',
  116: '1080P60',
  120: '4K',
  125: 'HDR',
  126: '杜比视界',
  127: '8K',
}

/**
 * 从输入解析视频标识：支持 bvid / av号 / 视频页 URL / b23.tv 短链。
 * @returns {{bvid?:string, aid?:number, short?:string}|null}
 */
export function parseVideoId(input) {
  const s = String(input || '').trim()
  if (!s) return null
  const bv = s.match(/BV[0-9A-Za-z]{10}/)
  if (bv) return { bvid: bv[0] }
  const av = s.match(/\bav(\d+)/i)
  if (av) return { aid: Number(av[1]) }
  if (/^https?:\/\/(b23\.tv|bili2233\.cn)\//i.test(s)) return { short: s }
  return null
}

/** 从 UP 主输入解析 mid（数字 / space 链接 / @） */
export function parseMid(input) {
  const s = String(input || '').trim()
  const m = s.match(/space\.bilibili\.com\/(\d+)/i) || s.match(/\bmid[=:]\s*(\d+)/i) || s.match(/^(\d+)$/)
  return m ? m[1] : ''
}

/** 秒 → mm:ss / h:mm:ss */
export function fmtDuration(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const mm = String(m).padStart(h ? 2 : 1, '0')
  const ss = String(r).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/** 数字 → 万/亿 */
export function fmtCount(n) {
  const v = Number(n) || 0
  if (v >= 1e8) return (v / 1e8).toFixed(1) + '亿'
  if (v >= 1e4) return (v / 1e4).toFixed(1) + '万'
  return String(v)
}

/** 去 HTML 标签（搜索结果标题含 <em>） */
export function stripTags(text) {
  return String(text ?? '').replace(/<[^>]*>/g, '')
}

/** 升级 http 图片到 https */
export function httpsUrl(url) {
  const s = String(url || '')
  return s.startsWith('//') ? `https:${s}` : s.replace(/^http:\/\//i, 'https://')
}

/** 拼接 Cookie（buvid3/4 与 SESSDATA 等；空值跳过） */
export function buildCookie(obj = {}) {
  return Object.entries(obj)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join('; ')
}

/** 把 view 接口返回归一为精简结构 */
export function normalizeVideo(v) {
  if (!v || typeof v !== 'object') return null
  const pages = Array.isArray(v.pages)
    ? v.pages.map((p) => ({ cid: p.cid, page: p.page, part: p.part, duration: p.duration }))
    : []
  const stat = v.stat || {}
  return {
    bvid: v.bvid || '',
    aid: v.aid || 0,
    cid: v.cid || (pages[0]?.cid ?? 0),
    title: stripTags(v.title || ''),
    desc: String(v.desc || '').slice(0, 500),
    cover: httpsUrl(v.pic || ''),
    duration: Number(v.duration || 0),
    durationText: fmtDuration(v.duration),
    pubdate: v.pubdate || 0,
    tname: v.tname || '',
    owner: { mid: v.owner?.mid || 0, name: v.owner?.name || '', face: httpsUrl(v.owner?.face || '') },
    stat: {
      view: stat.view || 0,
      danmaku: stat.danmaku || 0,
      reply: stat.reply || 0,
      like: stat.like || 0,
      coin: stat.coin || 0,
      favorite: stat.favorite || 0,
      share: stat.share || 0,
    },
    pages,
  }
}

/** 归一化搜索结果项 */
export function normalizeSearchItem(item) {
  if (!item || typeof item !== 'object') return null
  return {
    bvid: item.bvid || '',
    aid: item.aid || 0,
    title: stripTags(item.title || ''),
    author: item.author || '',
    mid: item.mid || 0,
    duration: typeof item.duration === 'string' ? item.duration : fmtDuration(item.duration),
    play: item.play || 0,
    playText: fmtCount(item.play),
    danmaku: item.video_review || item.danmaku || 0,
    pubdate: item.pubdate || 0,
    description: stripTags(item.description || '').slice(0, 120),
    cover: httpsUrl(item.pic || ''),
  }
}

/** 秒时间戳 → YYYY-MM-DD */
export function fmtDate(ts) {
  const n = Number(ts)
  if (!n) return ''
  return new Date(n * 1000).toISOString().slice(0, 10)
}
