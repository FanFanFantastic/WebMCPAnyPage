import fs from "node:fs";
import path from "node:path";

export const DEFAULT_CONFIG_FILE = "webmcp.config.json";

export function resolveCwdPath(...parts) {
  return path.resolve(process.cwd(), ...parts);
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

export function safeJsonParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}

export function writeJson(filePath, obj) {
  writeText(filePath, `${JSON.stringify(obj, null, 2)}\n`);
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function nowIso() {
  return new Date().toISOString();
}

export function pickPageByNameOrPath(pages, value) {
  if (!Array.isArray(pages) || pages.length === 0) return null;
  if (!value) return pages[0];
  return pages.find((p) => p.name === value || p.path === value) || null;
}

export function toSafeName(name) {
  return String(name || "page")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function toCamelName(name) {
  const safe = toSafeName(name).replace(/-/g, "_");
  return safe.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

export function toPascalName(name) {
  const camel = toCamelName(name);
  return camel ? camel[0].toUpperCase() + camel.slice(1) : "Page";
}

export function looksLikeFilePath(input) {
  if (!input) return false;
  return /[\\/]/.test(input) || /\.(tsx|ts|jsx|js)$/.test(input);
}

export function inferPageNameFromPath(inputPath) {
  const base = path.basename(String(inputPath || ""), path.extname(String(inputPath || "")));
  return toSafeName(base || "page");
}

export function renderTemplate(template, vars = {}) {
  return String(template || "").replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    const value = vars[key];
    return value == null ? "" : String(value);
  });
}

export function buildLineDiff(oldText, newText, maxChangedLines = 120) {
  if (oldText === newText) return "No changes.";
  const oldLines = String(oldText || "").split("\n");
  const newLines = String(newText || "").split("\n");
  const max = Math.max(oldLines.length, newLines.length);
  const out = [];
  for (let i = 0; i < max; i += 1) {
    const a = oldLines[i];
    const b = newLines[i];
    if (a === b) continue;
    out.push(`- ${a ?? ""}`);
    out.push(`+ ${b ?? ""}`);
    if (out.length >= maxChangedLines) {
      out.push("...diff truncated...");
      break;
    }
  }
  return out.join("\n");
}