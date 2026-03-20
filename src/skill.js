import path from "node:path";
import { generateTool } from "./generate.js";
import { loadConfig } from "./config.js";
import { ensureDir, resolveCwdPath, toSafeName, writeText } from "./utils.js";

function buildInputExample(fields) {
  return Object.fromEntries(
    (fields || []).slice(0, 4).map((field) => {
      if (field.type === "dateRange") return [field.name, ["2026-03-01", "2026-03-19"]];
      if (field.type === "stringList") return [field.name, "1001,1002"];
      if (field.type === "number") return [field.name, 1];
      if (field.type === "enumLike") return [field.name, "ALL"];
      return [field.name, "example"];
    })
  );
}

function renderSkillMarkdown(spec, config) {
  const fields = spec.fields || [];
  const example = buildInputExample(fields);
  const polyfillUrl = config.integrate?.polyfillUrl || "";
  const bridgeGlobal = config.integrate?.bridgeGlobal || "__wmcpAnyPage";

  return `---
name: ${toSafeName(spec.page.name)}_webmcp
description: 在页面 ${spec.page.name} 优先使用 WebMCP 工具 ${spec.toolName} 完成查询操作。
---

# ${spec.page.name} WebMCP Skill

当用户要求在页面执行“填表并查询”时，优先调用 WebMCP 工具，不要优先走 DOM 点选。

## 前置条件

1. 目标页面已打开并可交互。
2. 当前上下文可执行页面脚本。
3. 工具已通过页面注入脚本注册。

## 运行时检查

\`\`\`js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
\`\`\`

若任一为 false，注入 polyfill：

\`\`\`js
const src = "${polyfillUrl}";
if (![...document.scripts].some(s => s.src === src)) {
  const s = document.createElement("script");
  s.src = src;
  document.head.appendChild(s);
}
\`\`\`

## 确认工具可用

\`\`\`js
const tools = navigator.modelContextTesting?.listTools?.() || [];
tools.map(t => t.name);
\`\`\`

若缺少 \`${spec.toolName}\`，用页面 bridge 注册：

\`\`\`js
const bridge = window.${bridgeGlobal}?.["${spec.toolName}"];
if (bridge && navigator.modelContext) {
  navigator.modelContext.unregisterTool?.(bridge.toolName);
  bridge.register?.();
}
\`\`\`

## 执行工具

\`\`\`js
const result = await navigator.modelContextTesting.executeTool(
  "${spec.toolName}",
  JSON.stringify(${JSON.stringify(example, null, 2)})
);
const parsed = typeof result === "string" ? JSON.parse(result) : result;
const payload = JSON.parse(parsed.content?.[0]?.text || "{}");
console.log(payload.humanReadable || payload);
\`\`\`

## 输入字段

${fields.map((f) => `- \`${f.name}\` (${f.type}${f.required ? ", required" : ""})`).join("\n") || "- (none)"}

## 页面信息

- path: \`${spec.page.path}\`
- url: \`${spec.page.url || "N/A"}\`
- searchButtonId: \`${spec.searchButtonId || "auto-detect"}\`

## 兜底

- 若 \`modelContextTesting.executeTool\` 不可用，调用 bridge：
\`\`\`js
await window.${bridgeGlobal}?.["${spec.toolName}"]?.call?.(${JSON.stringify(example, null, 2)});
\`\`\`
- 若 bridge 也不可用，再退回浏览器自动化。
`;
}

export function generateSkill({ configPath, pageName }) {
  const { config } = loadConfig(configPath);
  const { spec } = generateTool({ configPath, pageName, mode: "query" });

  const outputDir = resolveCwdPath(config.outputDir || ".wmcp", "skills");
  ensureDir(outputDir);

  const skillFile = path.join(outputDir, `${toSafeName(spec.page.name)}.SKILL.md`);
  writeText(skillFile, `${renderSkillMarkdown(spec, config)}\n`);

  return { skillFile, toolName: spec.toolName };
}