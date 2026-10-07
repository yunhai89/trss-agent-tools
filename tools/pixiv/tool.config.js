/**
 * Pixiv 工具包配置（固定模板）—— 详见插件开发指南「外置工具配置约定」。
 * 用户值统一保存在集中配置 `agent.tools.pixiv`。
 */
export default {
  info: {
    title: 'Pixiv',
    description: 'Pixiv 插画：搜索 / 作品(自动发图) / 排行榜 / 用户 / 标签补全（基于 @ibaraki-douji/pixivts）',
    author: 'trss-agent-plugin',
    version: '1.0.0',
    icon: 'image',
  },
  config: [
    { key: 'enable', type: 'boolean', label: '启用', default: true, description: '关闭后不注册 pixiv__* 工具，零影响' },
    {
      key: 'refreshToken', type: 'text', label: 'refreshToken', default: '', secret: true,
      placeholder: 'Pixiv refresh token',
      description: '用 gppt / pxrepo 等工具获取 Pixiv refresh token 后填入（鉴权用；不需要 puppeteer）',
    },
    { key: 'imageProxy', type: 'string', label: '图片代理', default: 'https://i.yuki.sh', description: '替换 i.pximg.net（QQ 无 Referer 直连 pximg 显示不了）' },
    { key: 'apiProxy', type: 'string', label: 'API 反代(可选)', default: '', placeholder: '留空=直连 app-api.pixiv.net', description: '国内被墙时填反代地址' },
    { key: 'maxImages', type: 'number', label: '单次最大图', default: 4, min: 1, max: 10, step: 1, description: 'pixiv__illust 单次最多发送图片数' },
  ],
}
