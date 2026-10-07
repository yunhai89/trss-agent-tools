# trss-agent-tools

[trss-agent-plugin](https://github.com/yunhai89/trss-agent-plugin) 的**外置工具 / 技能收集仓**（类似云崽插件库）：把可复用的 Agent 工具包与技能集中在这里，按约定放入插件即可使用。

> 面向 [TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai) 的 agents-plugin。

## 目录结构

```
tools/                 # 外置工具包（每个子目录 = 一个工具包）
  qqmusic/             # QQ 音乐工具（示例）
    index.js           # 入口：defineToolPack 定义工具
    tool.config.js     # 固定模板：工具信息 + 配置 schema
    api.js / sign.js / util.js ...  # 辅助模块（由入口 import）
skills/                # 技能（*.md，YAML frontmatter，随插件 skills/ 加载）
```

## 安装

把需要的工具包目录整个复制到插件的 `tools/` 下（技能复制到 `skills/`）：

```bash
# 假设插件部署在 Yunzai/plugins/agents-plugin
cp -r tools/qqmusic  /path/to/Yunzai/plugins/agents-plugin/tools/
cp    skills/*.md    /path/to/Yunzai/plugins/agents-plugin/skills/
```

然后在 web 面板「系统 → 外置工具」里配置，或直接编辑插件 `config/config.yaml` 的 `agent.tools.<包名>`；改完热加载（重启/重载插件）。

## 工具配置约定（tool.config.js）

工具作者在工具包目录内放一个固定模板 `tool.config.js`，插件运行时自动发现并导入配置，web 面板「外置工具」页按 schema 动态渲染（列表卡片 + 点击弹窗配置），**无需为每个工具改前端**：

```js
export default {
  info: {
    title: 'QQ 音乐',            // 卡片显示名
    description: '一句话简介',    // 卡片介绍
    author: 'your-name',         // 卡片作者
    version: '1.0.0',
    homepage: '',                // 可选
    icon: 'music',               // 可选：内置图标名或 http(s)/data: 图片 URL
  },
  config: [
    { key: 'enable', type: 'boolean', label: '启用', default: true },
    { key: 'cookie', type: 'text', label: '登录 Cookie', default: '', secret: true },
    { key: 'quality', type: 'enum', label: '默认音质', default: '320',
      options: [{ value: '320', label: '320kbps' }, { value: 'flac', label: 'FLAC' }] },
    { key: 'maxResults', type: 'number', label: '搜索条数', default: 10, min: 1, max: 30, step: 1 },
  ],
}
```

- 字段类型：`string | text | number | boolean | enum | json`；`key` 需匹配 `[A-Za-z0-9_]+`。
- 用户值统一存插件集中配置 `agent.tools.<包名>`；schema 的 `default` 只作默认值。
- 运行时读取：`import { getToolConfig } from '../../model/toolkit/index.js'` → `getToolConfig('包名')`。

## 工具列表

| 工具包 | 说明 | 依赖 |
| --- | --- | --- |
| `qqmusic` | QQ 音乐检索 / 详情 / 歌词 / 榜单 / 歌单；可发 QQ 音乐分享卡片、语音 | 可选：QQ 音乐登录 Cookie（播放直链/高音质） |

### qqmusic

- 工具：`qqmusic__search`、`qqmusic__song`、`qqmusic__lyric`、`qqmusic__top`、`qqmusic__playlist`。
- 逆向接口来源：[L-1124/QQMusicApi](https://github.com/L-1124/QQMusicApi)（zzc 签名 / 现代签名网关）、[sansenjian/qq-music-api](https://github.com/sansenjian/qq-music-api)（旧网关接口）。
- 播放直链需登录 Cookie（`uin` + `qqmusic_key`）；非会员通常仅 128k/m4a，320k/flac 需绿钻，取不到会自动降档。
- 分享卡片走 NapCat 自定义音乐卡片（依赖 NapCat 的音乐签名服务 `musicSignUrl`）。

## 技能（skills）

每个 `skills/*.md` 为一个技能：YAML frontmatter（`name`/`description`/`always`/`priority` 等）+ 正文说明；复制到插件 `skills/` 即被加载。

## 开发与测试

工具包的离线测试放在工具目录内（`*.test.mjs`），插件根执行 `npm test` 会自动发现并运行。

## 许可

GPL-3.0（与 trss-agent-plugin 一致）。仅用于学习研究，请遵守各平台服务条款与版权。
