import path from "node:path";
import { loadConfig } from "./config.js";
import {
  ensureDir,
  fileExists,
  inferPageNameFromPath,
  looksLikeFilePath,
  pickPageByNameOrPath,
  readText,
  resolveCwdPath,
  toSafeName,
  writeJson
} from "./utils.js";

function detectFieldType(fieldName) {
  const lower = String(fieldName || "").toLowerCase();
  if (!lower) return "string";
  if (/(date|time|range|from|to)/.test(lower)) return "dateRange";
  if (/(ids|id_list|list|codes)$/.test(lower) || /(^ids?$)/.test(lower)) return "stringList";
  if (/(amount|qty|count|num|price|total)/.test(lower)) return "number";
  if (/(status|state|type|flag|mode)/.test(lower)) return "enumLike";
  return "string";
}

function parseFieldName(attrText) {
  if (!attrText) return null;
  const m1 = attrText.match(/\bname\s*=\s*["']([^"']+)["']/);
  if (m1) return m1[1];
  const m2 = attrText.match(/\bname\s*=\s*\{\s*["']([^"']+)["']\s*\}/);
  if (m2) return m2[1];
  const m3 = attrText.match(/\bname\s*=\s*\{\s*\[\s*["']([^"']+)["']/);
  if (m3) return m3[1];
  const m4 = attrText.match(/\bcode\s*=\s*["']([^"']+)["']/);
  if (m4) return m4[1];
  const m5 = attrText.match(/\bcode\s*=\s*\{\s*["']([^"']+)["']\s*\}/);
  if (m5) return m5[1];
  return null;
}

function parseFieldRequired(attrText) {
  if (!attrText) return false;
  return (
    /required\s*:\s*true/.test(attrText) ||
    /\brequired\s*=\s*\{?\s*true\s*\}?/.test(attrText)
  );
}

function extractFormFields(code) {
  const fields = new Map();
  const tagRegex = /<(Form\.Item|lsc-searchbox-item)\b([\s\S]*?)>/g;
  let match;
  while ((match = tagRegex.exec(code))) {
    const attr = match[2] || "";
    const name = parseFieldName(attr);
    if (!name) continue;
    const required = parseFieldRequired(attr);
    const prev = fields.get(name) || {
      name,
      type: detectFieldType(name),
      required: false,
      source: []
    };
    prev.required = prev.required || required;
    if (!prev.source.includes(match[1])) prev.source.push(match[1]);
    fields.set(name, prev);
  }
  return [...fields.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function extractSearchButtonIds(code) {
  const ids = new Set();

  const byGetElement = /getElementById\(\s*["']([^"']+)["']\s*\)/g;
  let m;
  while ((m = byGetElement.exec(code))) ids.add(m[1]);

  const byJsxId = /\bid\s*=\s*["']([^"']*(search|query|submit)[^"']*)["']/gi;
  while ((m = byJsxId.exec(code))) ids.add(m[1]);

  const byTestId = /\bdata-testid\s*=\s*["']([^"']*(search|query|submit)[^"']*)["']/gi;
  while ((m = byTestId.exec(code))) ids.add(m[1]);

  return [...ids];
}

function extractSearchHandlers(code) {
  const names = new Set();
  const onClickRegex = /onClick\s*=\s*\{([A-Za-z0-9_$.]+)\}/g;
  const onFinishRegex = /onFinish\s*=\s*\{([A-Za-z0-9_$.]+)\}/g;
  const fnRegex = /(const|function)\s+([A-Za-z0-9_]+)\s*=?\s*(async\s*)?\(/g;

  let m;
  while ((m = onClickRegex.exec(code))) {
    if (/(search|query|submit)/i.test(m[1])) names.add(m[1]);
  }
  while ((m = onFinishRegex.exec(code))) names.add(m[1]);
  while ((m = fnRegex.exec(code))) {
    if (/(search|query|submit|finish)/i.test(m[2])) names.add(m[2]);
  }
  return [...names];
}

function extractRequestHints(code) {
  const hints = new Set();
  const apiPathRegex = /["'](\/api\/[^"']*(query|search)[^"']*)["']/gi;
  const fnRegex = /\b([A-Za-z0-9_]*(query|search)[A-Za-z0-9_]*)\s*\(/gi;
  let m;
  while ((m = apiPathRegex.exec(code))) hints.add(m[1]);
  while ((m = fnRegex.exec(code))) hints.add(m[1]);
  return [...hints].slice(0, 20);
}

function extractToolNames(code) {
  const names = new Set();
  const constRegex = /\bTOOL_NAME[A-Z0-9_]*\s*=\s*["']([^"']+)["']/g;
  const directRegex = /registerTool\(\s*\{[\s\S]*?name:\s*["']([^"']+)["']/g;
  let m;
  while ((m = constRegex.exec(code))) names.add(m[1]);
  while ((m = directRegex.exec(code))) names.add(m[1]);
  return [...names];
}

function resolvePage(config, selector) {
  if (looksLikeFilePath(selector)) {
    const fromConfig = pickPageByNameOrPath(config.pages, selector);
    if (fromConfig) return { ...fromConfig, __source: "config" };
    return {
      name: inferPageNameFromPath(selector),
      path: selector,
      url: "",
      searchButtonId: "",
      __source: "adhoc"
    };
  }

  const inConfig = pickPageByNameOrPath(config.pages, selector);
  if (inConfig) return { ...inConfig, __source: "config" };

  if (!selector && Array.isArray(config.pages) && config.pages.length > 0) {
    return { ...config.pages[0], __source: "config" };
  }

  throw new Error(
    selector
      ? `Page not found: ${selector}. Use page name from config or pass page file path.`
      : "No page selected. Configure pages[] or pass a page file path."
  );
}

export function analyzePage({ configPath, pageName }) {
  const { config } = loadConfig(configPath);
  const page = resolvePage(config, pageName);
  const absPagePath = resolveCwdPath(page.path);

  if (!fileExists(absPagePath)) {
    throw new Error(`Page file not found: ${absPagePath}`);
  }

  const code = readText(absPagePath);
  const fields = extractFormFields(code);

  const result = {
    page: {
      name: page.name,
      path: page.path,
      absPath: absPagePath,
      url: page.url || "",
      searchButtonId: page.searchButtonId || "",
      source: page.__source
    },
    capabilities: {
      fields,
      searchButtonIds: extractSearchButtonIds(code),
      searchHandlers: extractSearchHandlers(code),
      requestHints: extractRequestHints(code)
    },
    existingToolNames: extractToolNames(code),
    generatedAt: new Date().toISOString()
  };

  const outputDir = resolveCwdPath(config.outputDir || ".wmcp", "scan");
  ensureDir(outputDir);
  const outputFile = path.join(outputDir, `${toSafeName(page.name)}.scan.json`);
  writeJson(outputFile, result);

  return { result, outputFile };
}