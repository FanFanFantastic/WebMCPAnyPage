import { generateTool } from "./generate.js";
import { buildLineDiff, readText, resolveCwdPath, writeText } from "./utils.js";

function removeAllWmcpBlocks(code) {
  return String(code || "").replace(
    /\/\* WMCP_TOOL_INJECT_START:[\s\S]*?WMCP_TOOL_INJECT_END:[^\n]*\*\//g,
    ""
  );
}

export function injectTool({ configPath, pageName, dryRun = false }) {
  const { spec, snippetFile } = generateTool({ configPath, pageName, mode: "query" });
  const targetPath = resolveCwdPath(spec.page.path);
  const targetCode = readText(targetPath);
  const snippetCode = readText(snippetFile).trim();

  const cleaned = removeAllWmcpBlocks(targetCode).trimEnd();
  const merged = `${cleaned}\n\n${snippetCode}\n`;
  const changed = merged !== targetCode;
  const diffPreview = buildLineDiff(targetCode, merged);

  if (!dryRun && changed) {
    writeText(targetPath, merged);
  }

  return {
    toolName: spec.toolName,
    targetPath,
    snippetFile,
    changed,
    dryRun,
    diffPreview
  };
}