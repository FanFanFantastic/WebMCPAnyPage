# WebMCP Tool Generator

[English](./README.md)

一个面向 Web 查询页场景的生产级 CLI，用于把页面能力快速转换为可供 AI Agent 调用的 WebMCP 工具。

---

## 项目价值

传统 Agent 在网页上常依赖 DOM 点击与输入，稳定性和可维护性都有限。  
本项目提供“页面能力 -> WebMCP 工具”自动化链路，让 Agent 优先通过工具调用完成任务。

核心收益：

- 提升执行稳定性（工具调用优先，减少脆弱 actuation）
- 复用页面已有业务逻辑与状态
- 支持人机协作（human-in-the-loop）
- 低成本落地（先聚焦 Query Page MVP）

---

## 功能概览

- **analyze**：扫描页面字段、查询按钮与请求提示
- **generate**：生成工具定义（name/description/inputSchema/execute）
- **inject**：幂等注入注册逻辑（registerTool / provideContext 兼容）
- **skill**：生成 OpenClaw 可直接使用的技能文档
- **verify**：校验产物完整性与注入结果
- **dry-run + diff**：注入前先预览变化

---

## 安装与启动

```bash
cd WebMCPAnyPage
npm install
npm run start -- help
```

可选：本地链接命令

```bash
npm link
wmcp help
```

---

## CLI 命令

```bash
wmcp init
wmcp scan [pageNameOrPath]
wmcp generate [pageNameOrPath] [mode]
wmcp inject [pageNameOrPath] [--dry-run]
wmcp skill [pageNameOrPath]
wmcp verify [pageNameOrPath] [--deep]
```

常用参数：

- `--config <path>`：指定配置文件
- `--json`：结构化输出
- `--dry-run`：只预览注入 diff，不写回文件
- `--deep`：执行深度校验（含注入检查）

---

## 快速开始（查询页 MVP）

### 1) 初始化

```bash
wmcp init
```

### 2) 扫描页面

```bash
wmcp scan src/pages/procurement/poQuery/poList/Query.tsx --json
```

输出：`.wmcp/scan/*.scan.json`

### 3) 生成工具产物

```bash
wmcp generate src/pages/procurement/poQuery/poList/Query.tsx query --json
```

输出：

- `.wmcp/generated/*.tool.json`
- `.wmcp/generated/*.inject.snippet.ts`

### 4) 预览注入（安全）

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --dry-run --json
```

### 5) 正式注入

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --json
```

### 6) 生成 OpenClaw Skill

```bash
wmcp skill src/pages/procurement/poQuery/poList/Query.tsx --json
```

输出：`.wmcp/skills/*.SKILL.md`

### 7) 全链路校验

```bash
wmcp verify src/pages/procurement/poQuery/poList/Query.tsx --deep --json
```

---

## 配置说明（webmcp.config.json）

`wmcp init` 会生成 v2 配置，主要包含：

- `outputDir`：产物根目录（scan / generated / skills）
- `pages`：页面注册表（也可直接传文件路径）
- `generator`：命名模板、字段筛选、默认参数、按钮提示词
- `integrate`：polyfill 地址、bridge 全局变量
- `i18n.templates`：工具人类可读文案模板

---

## 运行时接入模型

注入后页面会：

- 优先 `navigator.modelContext.registerTool(...)`
- 回退 `provideContext({ tools: [...] })`
- 暴露 `window.__wmcpAnyPage[toolName]` 调试桥

调试桥可用于：

- 手动重注册工具
- 直接调用 `call(params)` 调试
- 作为 skill fallback 执行入口

---

## OpenClaw 使用建议

先检查运行时：

```js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
```

若缺失 runtime，注入 polyfill 后优先执行：

```js
await navigator.modelContextTesting.executeTool(toolName, JSON.stringify(params));
```

推荐回退顺序：

1. `executeTool`
2. bridge `register()`
3. bridge `call()`
4. DOM 自动化（最后兜底）

---

## Roadmap

- React/Antd -> Vue/Element 插件化解析
- AST 推断增强（校验规则、请求映射）
- 多工具生成（query + list-results）
- Vitest 测试补齐
- npm 发布与示例模板