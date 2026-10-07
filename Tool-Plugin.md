## 工具包索引

`tools/` 下的外置工具包（每个子目录一个工具包，含 `tool.config.js`）。点击名称查看源码；复制整个目录到插件 `tools/` 即可使用。

<!-- [GUOBA:TOOL_PLUGIN:BEGIN] 锅巴插件访问标记，请勿移动 -->

<!-- 请在表首添加新行 -->
| 名称 | 作者 | 备注 |
| --- | --- | --- |
| [哔哩哔哩 (bilibili)](./tools/bilibili) | [@云汐](https://github.com/yunhai89) | B站视频搜索/详情/内容分析/下载/字幕/评论/弹幕/榜单/热门/UP主。`bilibili__analyze` 汇总元数据+B站AI总结+字幕/无字幕时音频STT转录+热评+弹幕交主模型分析；`bilibili__download` 下载合并MP4/音频。逆向接口来源 SocialSisterYi/bilibili-API-collect |
| [QQ 音乐 (qqmusic)](./tools/qqmusic) | [@云汐](https://github.com/yunhai89) | QQ 音乐检索 / 详情 / 歌词 / 榜单 / 歌单；`qqmusic__song` 可发分享卡片/语音。播放直链需登录 Cookie，非会员通常 128k/m4a。逆向接口来源 L-1124/QQMusicApi、sansenjian/qq-music-api |
