/**
 * 哔哩哔哩工具包配置（固定模板）—— 详见插件开发指南「外置工具配置约定」。
 * 用户值统一保存在集中配置 `agent.tools.bilibili`。
 */
export default {
  info: {
    title: '哔哩哔哩',
    description: 'B站视频搜索/详情/内容分析/下载/字幕/评论/弹幕/榜单/热门/UP主（逆向接口：SocialSisterYi/bilibili-API-collect）',
    author: 'trss-agent-plugin',
    version: '1.0.0',
    icon: 'play',
  },
  config: [
    { key: 'enable', type: 'boolean', label: '启用', default: true, description: '关闭后不注册 bilibili__* 工具，零影响' },
    {
      key: 'cookie', type: 'text', label: '登录 Cookie', default: '', secret: true,
      placeholder: 'SESSDATA=xxx; bili_jct=xxx; ...',
      description: 'AI总结/字幕/UP主空间/高清晰度需要；仅填 SESSDATA 也可。匿名可搜索/详情/播放/评论/弹幕/榜单',
    },
    { key: 'maxResults', type: 'number', label: '搜索默认条数', default: 10, min: 1, max: 30, step: 1 },
    { key: 'timeout', type: 'number', label: '请求超时(ms)', default: 15000, min: 3000, max: 60000, step: 1000 },
    { key: 'sendMedia', type: 'boolean', label: '下载后自动发送', default: false, description: 'bilibili__download 默认是否把下载的文件发到当前会话（工具参数可覆盖）' },
    { key: 'maxMediaMB', type: 'number', label: '发送大小上限(MB)', default: 80, min: 1, max: 600, step: 1, description: '超过则只返回本地路径不发送' },
    { key: 'enableStt', type: 'boolean', label: '无字幕时语音转录', default: true, description: 'bilibili__analyze 在无字幕时下载音频并用 agent.stt 转录（需配置 agent.stt）' },
  ],
}
