# trss-agent-plugin 外置工具 / 技能索引

## 📜 阅前须知

此仓库用于收集 [trss-agent-plugin](https://github.com/yunhai89/trss-agent-plugin)（TRSS-Yunzai 的 AI Agent 插件）的**外置工具包**与**技能**。

- 此仓库既作为**索引**（下表/分类页），也**托管**可直接放入插件的工具包与技能文件。
- 对收集内容的质量不做全面验证，使用第三方代码前请确保你已知晓可能存在的风险。
- 排序无先后，以上新下旧为准（推荐内容除外）。

## 📤 发布内容

请参考 ☞[贡献指南](./CONTRIBUTING.md) 向此仓库发起 Pull Request。

## 🤖 相关框架

| 名称 | 作者 | GitHub | Gitee | 备注 |
|------| ---- | ------ | ----- | ---- |
| agents-plugin | [@云汐](https://github.com/yunhai89) | [☞GitHub](https://github.com/yunhai89/trss-agent-plugin) | [☞Gitee](https://gitee.com/YunXi-67/trss-agent-plugin) | 本索引服务的插件本体：LLM 对话 / 工具调用 / 长期记忆 / MCP / 工具进化 |
| TRSS-Yunzai | [@时雨🌌星空](https://github.com/TimeRainStarSky) | [☞GitHub](https://github.com/TimeRainStarSky/Yunzai) | [☞Gitee](https://gitee.com/TimeRainStarSky/Yunzai) | Yunzai 应用端 |

## ⭐️ 推荐工具

| 名称 | 作者 | 备注 |
|------| ---- | ---- |
| [哔哩哔哩 (bilibili)](./tools/bilibili) | [@云汐](https://github.com/yunhai89) | B站视频搜索/详情/内容分析/下载/字幕/评论/弹幕/榜单/热门/UP主 |
| [QQ 音乐 (qqmusic)](./tools/qqmusic) | [@云汐](https://github.com/yunhai89) | 检索 / 详情 / 歌词 / 榜单 / 歌单；支持分享卡片与语音 |

## 🛠️ 工具包

大多数工具包类外置工具。

[>>>点击此处跳转<<<](./Tool-Plugin.md)

## 🧩 技能

`skills/*.md` 技能（YAML frontmatter + 正文）。

[>>>点击此处跳转<<<](./Skill-Plugin.md)

## 📦 使用方式

把需要的工具包目录整个复制到插件的 `tools/` 下，技能复制到 `skills/`：

```bash
cp -r tools/qqmusic  /path/to/Yunzai/plugins/agents-plugin/tools/
cp    skills/*.md    /path/to/Yunzai/plugins/agents-plugin/skills/
```

工具包内的 `tool.config.js` 为固定配置模板；插件运行时自动发现，web 面板「系统 → 外置工具」按 schema 动态渲染，用户值存 `agent.tools.<包名>`。详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可

GPL-3.0（与 trss-agent-plugin 一致）。仅用于学习研究，请遵守各平台服务条款与版权。
