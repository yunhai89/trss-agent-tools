/**
 * Pixiv 客户端单例 —— 基于 npm 库 @ibaraki-douji/pixivts。
 *
 * 配置：工具配置 `agent.tools.pixiv`（enable / refreshToken / imageProxy / apiProxy / maxImages）。
 * - 懒加载库（ESM 动态导入 CommonJS 包）、refresh_token 登录、缓存登录态；token 变更自动重建。
 * - 图片代理：Pixiv 原图在 i.pximg.net，QQ 直连因无 Referer 显示不了，经代理替换主机即可在 QQ 渲染。
 */
import Log from '../../utils/Log.js'
import { getToolConfig } from '../../model/toolkit/index.js'

function cfg() {
  return getToolConfig('pixiv')
}

/** 把 i.pximg.net 的图片地址换成代理主机（路径不变） */
export function proxyImage(url) {
  if (!url) return url
  const proxy = (cfg().imageProxy || 'https://i.yuki.sh').replace(/\/+$/, '')
  return String(url).replace(/^[a-z]+:\/\/i\.pximg\.net/i, proxy)
}

let _client = null // { pixiv, illusts, users, tags, novels, token }
let _loading = null // in-flight 登录 promise（并发安全：多调用方共享同一次登录）

/**
 * 取已登录的 Pixiv 客户端域对象。
 * @returns {Promise<{ok:true,illusts,users,tags,novels}|{ok:false,error}>}
 */
export async function getPixiv() {
  const c = cfg()
  if (c.enable === false) return { error: 'Pixiv 功能未启用（agent.tools.pixiv.enable）' }
  if (!c.refreshToken) {
    return { error: '未配置 Pixiv refreshToken（agent.tools.pixiv.refreshToken；用 gppt / pxrepo 等工具获取后填入，或到 web「系统 → 外置工具」配置）' }
  }
  if (_client && _client.token !== c.refreshToken) _client = null
  if (_client) return { ok: true, ..._client }

  if (!_loading) {
    _loading = (async () => {
      try {
        const { Pixiv, Illusts, Users, Tags, Novels } = await import('@ibaraki-douji/pixivts')
        const hosts = c.apiProxy ? String(c.apiProxy).replace(/\/+$/, '') : 'https://app-api.pixiv.net'
        const pixiv = new Pixiv({ hosts, autoRenewAuth: true })
        await pixiv.login(c.refreshToken)
        _client = {
          pixiv,
          token: c.refreshToken,
          illusts: new Illusts(pixiv),
          users: new Users(pixiv),
          tags: new Tags(pixiv),
          novels: new Novels(pixiv),
        }
        Log.mark('[pixiv] 登录成功 user=', pixiv.userId)
      } catch (e) {
        _client = null
        Log.warn('[pixiv] 初始化失败', e?.message || e)
        throw e
      } finally {
        _loading = null
      }
    })()
  }

  try {
    await _loading
  } catch (e) {
    const hint = /oauth|auth|token|refresh/i.test(e?.message || '') ? '（多半是 refreshToken 失效）' : '（检查 apiProxy/网络：app-api.pixiv.net 是否可达）'
    return { error: `Pixiv 初始化失败：${e?.message || e}${hint}` }
  }
  if (!_client) return { error: 'Pixiv 初始化失败' }
  return { ok: true, ..._client }
}

/** 仅供测试：重置缓存 */
export function _reset() {
  _client = null
  _loading = null
}
