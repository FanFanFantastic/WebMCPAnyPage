import { analyzePage } from "./analyze.js";
import { generateTool } from "./generate.js";
import { generateSkill } from "./skill.js";
import { injectTool } from "./inject.js";
import { fileExists, readJson, readText, resolveCwdPath } from "./utils.js";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validateSpec(spec) {
  if (!spec || typeof spec !== "object") return false;
  if (!isNonEmptyString(spec.toolName)) return false;
  if (!spec.page || !isNonEmptyString(spec.page.path)) return false;
  if (!spec.inputSchema || spec.inputSchema.type !== "object") return false;
  if (!spec.inputSchema.properties || typeof spec.inputSchema.properties !== "object") return false;
  if (!Array.isArray(spec.fields)) return false;
  return true;
}

export function verifyProject({ configPath, pageName, deep = false }) {
  const checks = [];

  const { result: scan, outputFile: scanFile } = analyzePage({ configPath, pageName });
  const absPagePath = resolveCwdPath(scan.page.path);

  checks.push({
    name: "page file exists",
    ok: fileExists(absPagePath),
    detail: absPagePath
  });
  if (!checks[0].ok) return { ok: false, checks };

  checks.push({
    name: "scan output generated",
    ok: fileExists(scanFile),
    detail: scanFile
  });

  checks.push({
    name: "scan fields extracted",
    ok: Array.isArray(scan.capabilities?.fields),
    detail: `fields=${scan.capabilities?.fields?.length || 0}`
  });

  const { spec, specFile, snippetFile } = generateTool({ configPath, pageName, mode: "query" });

  checks.push({
    name: "tool spec generated",
    ok: fileExists(specFile),
    detail: specFile
  });

  checks.push({
    name: "inject snippet generated",
    ok: fileExists(snippetFile),
    detail: snippetFile
  });

  const specJson = readJson(specFile);
  checks.push({
    name: "tool spec schema valid",
    ok: validateSpec(specJson),
    detail: specJson?.toolName || ""
  });

  const snippetText = readText(snippetFile);
  checks.push({
    name: "snippet contains markers",
    ok:
      snippetText.includes(`WMCP_TOOL_INJECT_START:${spec.toolName}`) &&
      snippetText.includes(`WMCP_TOOL_INJECT_END:${spec.toolName}`),
    detail: spec.toolName
  });

  const { skillFile } = generateSkill({ configPath, pageName });
  checks.push({
    name: "skill markdown generated",
    ok: fileExists(skillFile),
    detail: skillFile
  });

  const skillText = readText(skillFile);
  checks.push({
    name: "skill contains tool name",
    ok: skillText.includes(spec.toolName),
    detail: spec.toolName
  });

  if (deep) {
    const dry = injectTool({ configPath, pageName, dryRun: true });
    checks.push({
      name: "inject dry-run executable",
      ok: typeof dry.diffPreview === "string",
      detail: dry.targetPath
    });

    const applied = injectTool({ configPath, pageName, dryRun: false });
    const targetText = readText(applied.targetPath);
    checks.push({
      name: "injection marker exists in target file",
      ok: targetText.includes(`WMCP_TOOL_INJECT_START:${spec.toolName}`),
      detail: `${scan.page.path}::${spec.toolName}`
    });
  }

  const ok = checks.every((c) => c.ok);
  return { ok, checks };
}