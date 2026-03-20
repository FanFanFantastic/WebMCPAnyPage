import path from "node:path";
import {
  DEFAULT_CONFIG_FILE,
  fileExists,
  nowIso,
  readJson,
  resolveCwdPath,
  writeJson
} from "./utils.js";

export function createDefaultConfig() {
  return {
    version: 2,
    createdAt: nowIso(),
    outputDir: ".wmcp",
    pages: [],
    generator: {
      mode: "query",
      toolNameTemplate: "{{pageName}}-query",
      descriptionTemplate: "Auto-generated query tool for {{pageName}}.",
      includeFields: [],
      excludeFields: [],
      defaultParams: {},
      searchButtonIdHints: ["search", "query", "submit"]
    },
    integrate: {
      polyfillUrl: "https://unpkg.com/@mcp-b/webmcp-polyfill@latest/dist/index.iife.js",
      bridgeGlobal: "__wmcpAnyPage"
    },
    i18n: {
      locale: "zh-CN",
      templates: {
        humanReadableSuccess: "已填写 {{changedCount}} 个字段并触发查询。",
        humanReadableNoChange: "未匹配到可填写字段，已尝试触发查询。"
      }
    }
  };
}

function mergeConfig(userConfig) {
  const defaults = createDefaultConfig();
  const cfg = userConfig && typeof userConfig === "object" ? userConfig : {};
  return {
    ...defaults,
    ...cfg,
    pages: Array.isArray(cfg.pages) ? cfg.pages : defaults.pages,
    generator: {
      ...defaults.generator,
      ...(cfg.generator || {})
    },
    integrate: {
      ...defaults.integrate,
      ...(cfg.integrate || {})
    },
    i18n: {
      ...defaults.i18n,
      ...(cfg.i18n || {}),
      templates: {
        ...defaults.i18n.templates,
        ...((cfg.i18n && cfg.i18n.templates) || {})
      }
    }
  };
}

export function getConfigPath(inputPath) {
  if (inputPath) return path.resolve(process.cwd(), inputPath);
  return resolveCwdPath(DEFAULT_CONFIG_FILE);
}

export function loadConfig(inputPath) {
  const configPath = getConfigPath(inputPath);
  if (!fileExists(configPath)) {
    throw new Error(`Config not found: ${configPath}. Run "wmcp init" first.`);
  }
  const raw = readJson(configPath);
  if (!raw || typeof raw !== "object") {
    throw new Error(`Invalid config JSON: ${configPath}`);
  }
  const config = mergeConfig(raw);
  return { configPath, configDir: path.dirname(configPath), config };
}

export function initConfig(inputPath, force = false) {
  const configPath = getConfigPath(inputPath);
  if (!force && fileExists(configPath)) {
    throw new Error(`Config already exists: ${configPath}. Use --force to overwrite.`);
  }
  const cfg = createDefaultConfig();
  writeJson(configPath, cfg);
  return configPath;
}