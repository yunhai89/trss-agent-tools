# 贡献指南

感谢你为 trss-agent-plugin 的外置工具 / 技能索引做贡献。

## 一、提交索引条目

按如下格式组合（中文备注请使用中文逗号，多个作者用空格分隔）：

```markdown
| [名称](仓库/主页地址) | [@作者名](作者主页地址) | 备注 |
```

- 工具包：添加到 [`Tool-Plugin.md`](./Tool-Plugin.md) 的表格**表首**。
- 技能：添加到 [`Skill-Plugin.md`](./Skill-Plugin.md) 的表格**表首**。

然后发起 Pull Request。

> [!TIP]
> 名称**不推荐**使用大写、中文和特殊字符，避免不同系统出现编码问题。推荐命名为 `myname-tool` 或 `myname.js`。

## 二、提交工具包（托管在本仓 `tools/`）

1. 在 `tools/<包名>/` 下提供入口与辅助文件：

```
tools/<包名>/
  index.js         # 入口：export default defineToolPack({ name:'<包名>', tools:[...] })
  tool.config.js   # 固定配置模板（见下）
  api.js / util.js / ...   # 可选辅助模块（由入口 import）
  <包名>.test.mjs  # 可选离线测试
```

2. `tool.config.js` 固定模板（插件运行时读取，web 面板动态渲染）：

```js
export default {
  info: {
    title: '工具显示名',
    description: '一句话简介',
    author: 'your-name',
    version: '1.0.0',
    homepage: '',      // 可选
    icon: 'tool',      // 可选：内置图标名或 http(s)/data: 图片 URL
  },
  config: [
    { key: 'enable', type: 'boolean', label: '启用', default: true, description: '关闭后不注册工具' },
    { key: 'token', type: 'string', label: '令牌', default: '', secret: true, placeholder: '' },
    { key: 'mode', type: 'enum', label: '模式', default: 'a', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] },
    { key: 'count', type: 'number', label: '数量', default: 10, min: 1, max: 50, step: 1 },
  ],
}
```

- 字段类型：`string | text | number | boolean | enum | json`；`key` 需匹配 `[A-Za-z0-9_]+`。
- 用户值统一存插件集中配置 `agent.tools.<包名>`；`default` 只作默认值。
- 运行时读取：`import { getToolConfig } from '../../model/toolkit/index.js'` → `getToolConfig('<包名>')`。

3. 工具契约：`defineTool({ name, description, parameters, category, execute })`，详见插件仓库 `开发指南.md`。

## 三、提交技能（`skills/*.md`）

```markdown
---
name: my-skill
description: 何时使用（模型据此判断）
always: false      # 可选：常驻注入
priority: 5        # 可选：排序
---
正文说明……
```

复制到插件 `skills/` 即被加载。

## 四、注意事项

- 工具包不得包含密钥、账号等敏感信息；敏感项一律走 `tool.config.js` 的 `config`（`secret: true`）。
- 提交前建议在插件根执行 `npm test`（离线测试会被自动发现）。
- 因过多推送造成合并冲突，请自觉撤回推送，并解决冲突后再发起 PR。
