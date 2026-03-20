# WebMCP Tool Generator (WebMCPAnyPage)

一个面向“查询页（Query Page）”的开源 CLI：
- 扫描前端页面能力（字段、查询触发、请求提示）
- 生成 WebMCP tool 壳子（name / description / inputSchema / execute）
- 自动注入页面注册逻辑（navigator.modelContext.registerTool）
- 生成 OpenClaw 可直接使用的 Skill 模板
- 提供 dry-run / diff / verify 校验流程

## 1. 安装与运行

```bash
cd WebMCPAnyPage
npm run start -- help
```

或全局链接本地调试：

```bash
npm link
wmcp help
```

## 2. CLI 命令

```bash
wmcp init
wmcp scan [pageNameOrPath]
wmcp generate [pageNameOrPath] [mode]
wmcp inject [pageNameOrPath] [--dry-run]
wmcp skill [pageNameOrPath]
wmcp verify [pageNameOrPath] [--deep]
```

默认 mode 为 `query`，用于“填表 + 点击查询”场景。

## 3. 配置文件

执行 `wmcp init` 会生成 `webmcp.config.json`（v2）：

- `outputDir`: 产物目录（scan/generated/skills）
- `pages`: 页面配置（可为空；也可命令直接传页面路径）
- `generator`:
  - `toolNameTemplate`
  - `descriptionTemplate`
  - `includeFields` / `excludeFields`
  - `defaultParams`
  - `searchButtonIdHints`
- `integrate`:
  - `polyfillUrl`
  - `bridgeGlobal`
- `i18n.templates`:
  - `humanReadableSuccess`
  - `humanReadableNoChange`

## 4. 推荐工作流（MVP）

### 4.1 扫描页面能力

```bash
wmcp scan src/pages/procurement/poQuery/poList/Query.tsx --json
```

输出：
- `.wmcp/scan/*.scan.json`

### 4.2 生成工具定义与注入片段

```bash
wmcp generate src/pages/procurement/poQuery/poList/Query.tsx query --json
```

输出：
- `.wmcp/generated/*.tool.json`
- `.wmcp/generated/*.inject.snippet.ts`

### 4.3 预览注入 diff（不改文件）

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --dry-run --json
```

### 4.4 注入页面

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --json
```

### 4.5 生成 OpenClaw Skill

```bash
wmcp skill src/pages/procurement/poQuery/poList/Query.tsx --json
```

输出：
- `.wmcp/skills/*.SKILL.md`

### 4.6 全链路校验

```bash
wmcp verify src/pages/procurement/poQuery/poList/Query.tsx --deep --json
```

## 5. 注入后页面能力

注入后会在页面中注册：
- `navigator.modelContext.registerTool(tool)`（可用时）
- 兼容 `provideContext({ tools: [tool] })`

并暴露调试桥：
- `window.__wmcpAnyPage[toolName]`

可用于：
- 手动重注册
- 直接 call 调试
- 供 OpenClaw Skill 作为 fallback

## 6. OpenClaw 使用要点

1. 先检查 runtime：
```js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
```

2. 缺失时注入 polyfill（配置中的 `integrate.polyfillUrl`）。

3. 优先调用：
```js
await navigator.modelContextTesting.executeTool(toolName, JSON.stringify(params))
```

4. 若工具未列出，使用 bridge 重注册：
```js
window.__wmcpAnyPage?.[toolName]?.register?.()
```

5. 再兜底：
```js
window.__wmcpAnyPage?.[toolName]?.call?.(params)
```

## 7. 设计原则

- 面向查询页先做垂直 MVP（高命中场景）
- 幂等注入（清理历史 WMCP 块后再写入）
- dry-run + diff 预览
- 可扩展到 React/Vue 插件化 parser/generator
- 输出结构化 + humanReadable，便于 agent 直接回复

## 8. 下一步 roadmap

- React/Antd parser 插件化（再支持 Vue/Element）
- 更准确 AST 推断（rules / validators / request mapping）
- 多工具生成（query + list-results）
- 单元测试（vitest）
- 发布 npm package 与 examples