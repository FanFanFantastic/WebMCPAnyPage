# WebMCP Tool Generator

[简体中文](./README.zh-CN.md)

A production-oriented CLI for turning web query pages into WebMCP tools that AI agents can call directly.

It helps you:

- Analyze page capabilities (form fields, search triggers, request hints)
- Generate WebMCP tool scaffolding (`name`, `description`, `inputSchema`, `execute`)
- Inject idempotent tool registration code into target pages
- Generate OpenClaw-ready skill docs
- Verify the full pipeline with dry-run and structured checks

---

## Why this project

Many AI agents still rely on brittle DOM actuation for web tasks.  
This CLI enables a practical path to WebMCP-first interaction for real query pages:

- **Higher reliability** via first-class tool invocation
- **Reuse of existing frontend logic**
- **Human-in-the-loop compatibility**
- **Fast MVP path** for React + query-form workflows

---

## Features

- **Analyze**: scans React-like page files and infers field metadata
- **Generate**: emits query tool spec + injection snippet
- **Integrate**: injects registration logic (`registerTool` / `provideContext` fallback)
- **Skill output**: generates OpenClaw skill markdown with runtime checks
- **Safe integration**: supports `--dry-run` and diff preview
- **Verification**: checks outputs, schema shape, snippet markers, and skill integrity

---

## Installation

```bash
cd WebMCPAnyPage
npm install
npm run start -- help
```

Optional local linking:

```bash
npm link
wmcp help
```

---

## CLI Commands

```bash
wmcp init
wmcp scan [pageNameOrPath]
wmcp generate [pageNameOrPath] [mode]
wmcp inject [pageNameOrPath] [--dry-run]
wmcp skill [pageNameOrPath]
wmcp verify [pageNameOrPath] [--deep]
```

Common options:

- `--config <path>`: custom config file path
- `--json`: machine-readable output
- `--dry-run`: preview injection without writing target file
- `--deep`: run deeper verification (including injection checks)

---

## Quick Start (Query Page MVP)

### 1) Initialize config

```bash
wmcp init
```

### 2) Scan a page

```bash
wmcp scan src/pages/procurement/poQuery/poList/Query.tsx --json
```

Output:
- `.wmcp/scan/*.scan.json`

### 3) Generate tool artifacts

```bash
wmcp generate src/pages/procurement/poQuery/poList/Query.tsx query --json
```

Output:
- `.wmcp/generated/*.tool.json`
- `.wmcp/generated/*.inject.snippet.ts`

### 4) Preview injection safely

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --dry-run --json
```

### 5) Inject into page

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --json
```

### 6) Generate OpenClaw skill

```bash
wmcp skill src/pages/procurement/poQuery/poList/Query.tsx --json
```

Output:
- `.wmcp/skills/*.SKILL.md`

### 7) Verify end-to-end

```bash
wmcp verify src/pages/procurement/poQuery/poList/Query.tsx --deep --json
```

---

## Configuration (`webmcp.config.json`)

`wmcp init` generates a v2 config with these sections:

- `outputDir`: artifact root (`scan`, `generated`, `skills`)
- `pages`: optional page registry (you can still pass direct file paths)
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

---

## Runtime Integration Model

Injected code will:

- Register tools via `navigator.modelContext.registerTool(...)` when available
- Fallback to `provideContext({ tools: [...] })` if needed
- Expose a debug bridge:
  - `window.__wmcpAnyPage[toolName]`

Bridge can be used for:

- manual re-registration
- direct local calls
- fallback execution from skill/runtime scripts

---

## OpenClaw Usage Notes

Before executing a generated tool, check runtime:

```js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
```

If runtime is missing, inject polyfill from `integrate.polyfillUrl`, then:

```js
await navigator.modelContextTesting.executeTool(toolName, JSON.stringify(params))
```

Fallback order:

1. `executeTool`
2. bridge `register()`
3. bridge `call()`
4. DOM/browser actuation as last resort

---

## Design Principles

- Vertical MVP first (query pages)
- Idempotent injection
- Dry-run before write
- Structured + human-readable tool output
- Gradual extension toward plugin architecture

---

## Roadmap

- Parser plugins (React/Antd first, then Vue/Element)
- AST-based stronger inference
- Multi-tool generation (`query` + `list-results`)
- Automated tests (Vitest)
- npm package publishing + example templates# WebMCP Tool Generator

[简体中文](./README.zh-CN.md)

A production-oriented CLI for turning web query pages into WebMCP tools that AI agents can call directly.

It helps you:

- Analyze page capabilities (form fields, search triggers, request hints)
- Generate WebMCP tool scaffolding (`name`, `description`, `inputSchema`, `execute`)
- Inject idempotent tool registration code into target pages
- Generate OpenClaw-ready skill docs
- Verify the full pipeline with dry-run and structured checks

---

## Why this project

Many AI agents still rely on brittle DOM actuation for web tasks.  
This CLI enables a practical path to WebMCP-first interaction for real query pages:

- **Higher reliability** via first-class tool invocation
- **Reuse of existing frontend logic**
- **Human-in-the-loop compatibility**
- **Fast MVP path** for React + query-form workflows

---

## Features

- **Analyze**: scans React-like page files and infers field metadata
- **Generate**: emits query tool spec + injection snippet
- **Integrate**: injects registration logic (`registerTool` / `provideContext` fallback)
- **Skill output**: generates OpenClaw skill markdown with runtime checks
- **Safe integration**: supports `--dry-run` and diff preview
- **Verification**: checks outputs, schema shape, snippet markers, and skill integrity

---

## Installation

```bash
cd WebMCPAnyPage
npm install
npm run start -- help
```

Optional local linking:

```bash
npm link
wmcp help
```

---

## CLI Commands

```bash
wmcp init
wmcp scan [pageNameOrPath]
wmcp generate [pageNameOrPath] [mode]
wmcp inject [pageNameOrPath] [--dry-run]
wmcp skill [pageNameOrPath]
wmcp verify [pageNameOrPath] [--deep]
```

Common options:

- `--config <path>`: custom config file path
- `--json`: machine-readable output
- `--dry-run`: preview injection without writing target file
- `--deep`: run deeper verification (including injection checks)

---

## Quick Start (Query Page MVP)

### 1) Initialize config

```bash
wmcp init
```

### 2) Scan a page

```bash
wmcp scan src/pages/procurement/poQuery/poList/Query.tsx --json
```

Output:
- `.wmcp/scan/*.scan.json`

### 3) Generate tool artifacts

```bash
wmcp generate src/pages/procurement/poQuery/poList/Query.tsx query --json
```

Output:
- `.wmcp/generated/*.tool.json`
- `.wmcp/generated/*.inject.snippet.ts`

### 4) Preview injection safely

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --dry-run --json
```

### 5) Inject into page

```bash
wmcp inject src/pages/procurement/poQuery/poList/Query.tsx --json
```

### 6) Generate OpenClaw skill

```bash
wmcp skill src/pages/procurement/poQuery/poList/Query.tsx --json
```

Output:
- `.wmcp/skills/*.SKILL.md`

### 7) Verify end-to-end

```bash
wmcp verify src/pages/procurement/poQuery/poList/Query.tsx --deep --json
```

---

## Configuration (`webmcp.config.json`)

`wmcp init` generates a v2 config with these sections:

- `outputDir`: artifact root (`scan`, `generated`, `skills`)
- `pages`: optional page registry (you can still pass direct file paths)
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

---

## Runtime Integration Model

Injected code will:

- Register tools via `navigator.modelContext.registerTool(...)` when available
- Fallback to `provideContext({ tools: [...] })` if needed
- Expose a debug bridge:
  - `window.__wmcpAnyPage[toolName]`

Bridge can be used for:

- manual re-registration
- direct local calls
- fallback execution from skill/runtime scripts

---

## OpenClaw Usage Notes

Before executing a generated tool, check runtime:

```js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
```

If runtime is missing, inject polyfill from `integrate.polyfillUrl`, then:

```js
await navigator.modelContextTesting.executeTool(toolName, JSON.stringify(params))
```

Fallback order:

1. `executeTool`
2. bridge `register()`
3. bridge `call()`
4. DOM/browser actuation as last resort

---

## Design Principles

- Vertical MVP first (query pages)
- Idempotent injection
- Dry-run before write
- Structured + human-readable tool output
- Gradual extension toward plugin architecture

---

## Roadmap

- Parser plugins (React/Antd first, then Vue/Element)
- AST-based stronger inference
- Multi-tool generation (`query` + `list-results`)
- Automated tests (Vitest)
- npm package publishing + example templates