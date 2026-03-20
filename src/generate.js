import path from "node:path";
import { analyzePage } from "./analyze.js";
import { loadConfig } from "./config.js";
import {
  ensureDir,
  pickPageByNameOrPath,
  renderTemplate,
  resolveCwdPath,
  toCamelName,
  toSafeName,
  writeJson,
  writeText
} from "./utils.js";

function renderToolName(template, pageName) {
  const safePageName = toSafeName(pageName);
  return renderTemplate(template || "{{pageName}}-query", { pageName: safePageName });
}

function normalizeFields(scannedFields, includeFields, excludeFields) {
  const includeSet = new Set((includeFields || []).map((s) => String(s)));
  const excludeSet = new Set((excludeFields || []).map((s) => String(s)));
  return (scannedFields || [])
    .filter((f) => !includeSet.size || includeSet.has(f.name))
    .filter((f) => !excludeSet.has(f.name));
}

function fieldSchemaOf(field) {
  if (field.type === "dateRange") {
    return {
      description: "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      anyOf: [
        { type: "array", minItems: 2, maxItems: 2, items: { type: "string" } },
        {
          type: "object",
          properties: {
            start: { type: "string" },
            end: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            from: { type: "string" },
            to: { type: "string" }
          }
        },
        { type: "string" }
      ]
    };
  }

  if (field.type === "stringList") {
    return {
      description: "列表输入。可传逗号分隔字符串或字符串数组。",
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
    };
  }

  if (field.type === "number") {
    return {
      description: "数字输入。",
      anyOf: [{ type: "number" }, { type: "string" }]
    };
  }

  if (field.type === "enumLike") {
    return {
      type: "string",
      description: "枚举/状态类字段。"
    };
  }

  return { type: "string", description: "文本输入。" };
}

function pickSearchButtonId({ pageCfg, scan, hints = [] }) {
  if (pageCfg?.searchButtonId) return pageCfg.searchButtonId;
  const ids = scan?.capabilities?.searchButtonIds || [];
  if (ids.length === 0) return "";
  const loweredHints = hints.map((h) => String(h).toLowerCase());
  const preferred =
    ids.find((id) => loweredHints.some((h) => String(id).toLowerCase().includes(h))) || ids[0];
  return preferred || "";
}

function renderInjectSnippet(spec, config) {
  const varName = `__wmcpTool_${toCamelName(spec.page.name) || "page"}`;
  const schemaText = JSON.stringify(spec.inputSchema, null, 2);
  const fieldDefsText = JSON.stringify(spec.fields, null, 2);
  const defaultParamsText = JSON.stringify(spec.defaultParams || {}, null, 2);
  const humanTemplatesText = JSON.stringify(config.i18n?.templates || {}, null, 2);
  const bridgeGlobal = config.integrate?.bridgeGlobal || "__wmcpAnyPage";

  return `/* WMCP_TOOL_INJECT_START:${spec.toolName} */
const ${varName} = {
  name: "${spec.toolName}",
  description: "${spec.description}",
  inputSchema: ${schemaText},
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  execute: async (params = {}) => {
    const fieldDefs = ${fieldDefsText};
    const defaultParams = ${defaultParamsText};
    const humanTemplates = ${humanTemplatesText};
    const merged = { ...defaultParams, ...(params || {}) };

    const toText = (v) => {
      if (v == null) return "";
      if (Array.isArray(v)) return v.join(",");
      return String(v);
    };

    const renderHuman = (template, vars = {}) =>
      String(template || "").replace(/\\{\\{([a-zA-Z0-9_]+)\\}\\}/g, (_, key) => {
        const value = vars[key];
        return value == null ? "" : String(value);
      });

    const setTextField = (fieldName, value) => {
      const selectors = [
        "#" + CSS.escape(fieldName),
        '[name="' + fieldName.replace(/"/g, '\\"') + '"]',
        '[data-field="' + fieldName.replace(/"/g, '\\"') + '"]',
        '[data-testid="' + fieldName.replace(/"/g, '\\"') + '"]'
      ];
      let target = null;
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          target = el;
          break;
        }
      }
      if (!target) return false;

      const inputEl =
        target.matches?.("input,textarea,select")
          ? target
          : target.querySelector?.("input,textarea,select") || target;

      if (!inputEl) return false;
      const str = toText(value);

      if (inputEl instanceof HTMLSelectElement) {
        inputEl.value = str;
      } else {
        const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inputEl), "value");
        if (desc && typeof desc.set === "function") {
          desc.set.call(inputEl, str);
        } else {
          inputEl.value = str;
        }
      }

      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      inputEl.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    };

    const parseDateRange = (input) => {
      if (input == null || input === "") return null;
      if (Array.isArray(input) && input.length >= 2) return [input[0], input[1]];
      if (typeof input === "object") {
        const start = input.start ?? input.startDate ?? input.from;
        const end = input.end ?? input.endDate ?? input.to;
        if (start && end) return [start, end];
      }
      if (typeof input === "string") {
        const parts = input.split(/\\s*(?:,|~|至|to)\\s*/i).filter(Boolean);
        if (parts.length >= 2) return [parts[0], parts[1]];
      }
      return null;
    };

    const changedFields = [];
    for (const field of fieldDefs) {
      if (!(field.name in merged)) continue;
      const value = merged[field.name];

      if (field.type === "dateRange") {
        const range = parseDateRange(value);
        if (!range) continue;
        if (setTextField(field.name, range.join(","))) changedFields.push(field.name);
        continue;
      }

      if (field.type === "stringList" && Array.isArray(value)) {
        if (setTextField(field.name, value.join(","))) changedFields.push(field.name);
        continue;
      }

      if (setTextField(field.name, value)) changedFields.push(field.name);
    }

    let searchTriggered = false;
    let searchTarget = "${spec.searchButtonId || ""}";
    if ("${spec.searchButtonId || ""}") {
      const byId = document.getElementById("${spec.searchButtonId || ""}");
      if (byId && typeof byId.click === "function") {
        byId.click();
        searchTriggered = true;
      }
    }

    if (!searchTriggered) {
      const candidates = [...document.querySelectorAll("button,input[type=button],input[type=submit],a")]
        .filter((el) => {
          const text = (el.innerText || el.textContent || el.value || "").trim().toLowerCase();
          return /search|query|查询|查詢|submit/.test(text);
        });
      const first = candidates[0];
      if (first && typeof first.click === "function") {
        first.click();
        searchTriggered = true;
        searchTarget = first.id || first.getAttribute("name") || "text-matched-search-button";
      }
    }

    const payload = {
      tool: "${spec.toolName}",
      changedFields,
      changedCount: changedFields.length,
      searchTriggered,
      searchTarget,
      page: "${spec.page.path}",
      ts: new Date().toISOString()
    };

    payload.humanReadable = changedFields.length
      ? renderHuman(
          humanTemplates.humanReadableSuccess || "已填写 {{changedCount}} 个字段并触发查询。",
          payload
        )
      : renderHuman(
          humanTemplates.humanReadableNoChange || "未匹配到可填写字段，已尝试触发查询。",
          payload
        );

    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
      isError: false
    };
  }
};

(() => {
  let timer = null;

  const register = () => {
    const modelContext = navigator.modelContext;
    if (!modelContext) return false;
    try {
      modelContext.unregisterTool?.(${varName}.name);
    } catch (err) {}

    try {
      if (typeof modelContext.registerTool === "function") {
        modelContext.registerTool(${varName});
        return true;
      }
      if (typeof modelContext.provideContext === "function") {
        modelContext.provideContext({ tools: [${varName}] });
        return true;
      }
    } catch (error) {
      console.warn("wmcp register failed", error);
    }
    return false;
  };

  const registerWithRetry = () => {
    const ok = register();
    if (!ok) timer = window.setTimeout(registerWithRetry, 600);
  };

  registerWithRetry();

  window.${bridgeGlobal} = window.${bridgeGlobal} || {};
  window.${bridgeGlobal}["${spec.toolName}"] = {
    toolName: ${varName}.name,
    description: ${varName}.description,
    inputSchema: ${varName}.inputSchema,
    register,
    call: async (params = {}) => ${varName}.execute(params),
    polyfillUrl: "${config.integrate?.polyfillUrl || ""}"
  };
})();
/* WMCP_TOOL_INJECT_END:${spec.toolName} */`;
}

export function generateTool({ configPath, pageName, mode = "query" }) {
  const { config } = loadConfig(configPath);
  const pageCfg = pickPageByNameOrPath(config.pages, pageName);
  const { result: scan } = analyzePage({ configPath, pageName });

  const fields = normalizeFields(
    scan.capabilities?.fields || [],
    config.generator?.includeFields,
    config.generator?.excludeFields
  );

  const toolName =
    pageCfg?.toolName ||
    renderToolName(config.generator?.toolNameTemplate || "{{pageName}}-query", scan.page.name);

  const description = renderTemplate(config.generator?.descriptionTemplate, {
    pageName: scan.page.name,
    mode: mode || "query",
    toolName
  });

  const searchButtonId = pickSearchButtonId({
    pageCfg,
    scan,
    hints: config.generator?.searchButtonIdHints || []
  });

  const inputSchema = {
    type: "object",
    properties: Object.fromEntries(fields.map((field) => [field.name, fieldSchemaOf(field)])),
    required: fields.filter((f) => f.required).map((f) => f.name),
    additionalProperties: true
  };

  const spec = {
    page: scan.page,
    mode: mode || "query",
    toolName,
    description,
    fields,
    searchButtonId,
    inputSchema,
    defaultParams: config.generator?.defaultParams || {},
    runtime: {
      polyfillUrl: config.integrate?.polyfillUrl || "",
      bridgeGlobal: config.integrate?.bridgeGlobal || "__wmcpAnyPage"
    },
    generatedAt: new Date().toISOString()
  };

  const outputDir = resolveCwdPath(config.outputDir || ".wmcp", "generated");
  ensureDir(outputDir);

  const base = toSafeName(scan.page.name);
  const specFile = path.join(outputDir, `${base}.tool.json`);
  const snippetFile = path.join(outputDir, `${base}.inject.snippet.ts`);

  writeJson(specFile, spec);
  writeText(snippetFile, `${renderInjectSnippet(spec, config)}\n`);

  return { spec, specFile, snippetFile };
}