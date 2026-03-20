import { initConfig } from "./config.js";
import { analyzePage } from "./analyze.js";
import { generateTool } from "./generate.js";
import { injectTool } from "./inject.js";
import { generateSkill } from "./skill.js";
import { verifyProject } from "./verify.js";

function printHelp() {
  console.log(`wmcp - WebMCP Tool Generator CLI

Usage:
  wmcp <command> [pageNameOrPath] [options]

Commands:
  init                        初始化 webmcp.config.json
  scan [page]                 扫描页面能力（字段/搜索按钮/请求提示）
  generate [page] [mode]      生成工具定义与注入片段（默认 mode=query）
  inject [page]               注入工具注册代码（支持 --dry-run）
  skill [page]                生成 OpenClaw Skill 模板
  verify [page]               校验 scan/generate/skill/inject 流程
  help                        显示帮助

Examples:
  wmcp init
  wmcp scan src/pages/procurement/poQuery/poList/Query.tsx
  wmcp generate po-query query
  wmcp inject po-query --dry-run
  wmcp skill po-query
  wmcp verify po-query --deep

Options:
  --config <path>             配置文件路径（默认 webmcp.config.json）
  --force                     init 时覆盖已有配置
  --deep                      verify 深度校验（包含注入）
  --dry-run                   inject 仅输出 diff 预览，不落盘
  --json                      输出 JSON
`);
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    if (token === "--force" || token === "--deep" || token === "--json" || token === "--dry-run") {
      options[token.slice(2)] = true;
      continue;
    }
    const key = token.slice(2);
    const value = argv[i + 1];
    if (value == null || value.startsWith("--")) {
      throw new Error(`Missing value for option: --${key}`);
    }
    options[key] = value;
    i += 1;
  }
  return { positional, options };
}

function output(data, asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (typeof data === "string") {
    console.log(data);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

export async function runCli(argv) {
  const { positional, options } = parseArgs(argv);
  const command = positional[0] || "help";
  const pageName = positional[1];
  const mode = positional[2] || "query";
  const configPath = options.config;
  const asJson = !!options.json;

  switch (command) {
    case "help":
    case "-h":
    case "--help":
      printHelp();
      return;

    case "init": {
      const configFile = initConfig(configPath, !!options.force);
      output({ ok: true, command, configFile }, asJson);
      return;
    }

    case "scan": {
      const { result, outputFile } = analyzePage({ configPath, pageName });
      output(
        {
          ok: true,
          command,
          page: result.page,
          fields: result.capabilities?.fields?.length || 0,
          outputFile
        },
        asJson
      );
      return;
    }

    case "generate": {
      const { spec, specFile, snippetFile } = generateTool({ configPath, pageName, mode });
      output(
        {
          ok: true,
          command,
          mode: spec.mode,
          toolName: spec.toolName,
          specFile,
          snippetFile
        },
        asJson
      );
      return;
    }

    case "inject": {
      const ret = injectTool({ configPath, pageName, dryRun: !!options["dry-run"] });
      output(
        {
          ok: true,
          command,
          ...ret
        },
        asJson
      );
      return;
    }

    case "skill": {
      const ret = generateSkill({ configPath, pageName });
      output({ ok: true, command, ...ret }, asJson);
      return;
    }

    case "verify": {
      const report = verifyProject({
        configPath,
        pageName,
        deep: !!options.deep
      });
      output({ ok: report.ok, command, checks: report.checks }, asJson);
      if (!report.ok) {
        throw new Error("Verify failed. Run with --json for details.");
      }
      return;
    }

    default:
      throw new Error(`Unknown command: ${command}. Run "wmcp help".`);
  }
}