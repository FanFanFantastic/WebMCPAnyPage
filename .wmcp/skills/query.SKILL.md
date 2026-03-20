---
name: query_webmcp
description: 在页面 query 优先使用 WebMCP 工具 query-fill-and-search 完成查询操作。
---

# query WebMCP Skill

当用户要求在页面执行“填表并查询”时，优先调用 WebMCP 工具，不要优先走 DOM 点选。

## 前置条件

1. 目标页面已打开并可交互。
2. 当前上下文可执行页面脚本。
3. 工具已通过页面注入脚本注册。

## 运行时检查

```js
({
  hasModelContext: !!navigator.modelContext,
  hasModelContextTesting: !!navigator.modelContextTesting
})
```

若任一为 false，注入 polyfill：

```js
const src = "https://unpkg.com/@mcp-b/webmcp-polyfill@latest/dist/index.iife.js";
if (![...document.scripts].some(s => s.src === src)) {
  const s = document.createElement("script");
  s.src = src;
  document.head.appendChild(s);
}
```

## 确认工具可用

```js
const tools = navigator.modelContextTesting?.listTools?.() || [];
tools.map(t => t.name);
```

若缺少 `query-fill-and-search`，用页面 bridge 注册：

```js
const bridge = window.__wmcpAnyPage?.["query-fill-and-search"];
if (bridge && navigator.modelContext) {
  navigator.modelContext.unregisterTool?.(bridge.toolName);
  bridge.register?.();
}
```

## 执行工具

```js
const result = await navigator.modelContextTesting.executeTool(
  "query-fill-and-search",
  JSON.stringify({
  "asnRelationFlag": "ALL",
  "backStateList": "1001,1002",
  "bookUrgents": "example",
  "brandId": "example"
})
);
const parsed = typeof result === "string" ? JSON.parse(result) : result;
const payload = JSON.parse(parsed.content?.[0]?.text || "{}");
console.log(payload.humanReadable || payload);
```

## 输入字段

- `asnRelationFlag` (enumLike)
- `backStateList` (stringList)
- `bookUrgents` (string)
- `brandId` (string)
- `cate3Id` (string)
- `dcId` (string)
- `deliveryModList` (stringList)
- `inputCustomerOrders` (dateRange)
- `inputPoIds` (stringList)
- `inputRequireIds` (stringList)
- `inputSkuIds` (stringList)
- `inStoreTime` (dateRange)
- `isMulReceiving` (string)
- `isRequirements` (string)
- `markFlag` (enumLike)
- `needTransfer` (string)
- `ouId` (string)
- `outChannelList` (stringList)
- `poBookDate` (dateRange)
- `poCreateDate` (dateRange)
- `poType` (enumLike)
- `queryErpList` (stringList)
- `queryInboundType` (enumLike)
- `queryType` (enumLike)
- `sourceId` (string)
- `stateList` (stringList)
- `subVendorCode` (string)
- `supplyFlag` (enumLike)
- `todoBack` (dateRange)
- `todoCreateAsn` (dateRange)
- `todoMerge` (dateRange)
- `virtualCategoryName` (string)
- `yn` (string)

## 页面信息

- path: `/Users/fanjiongming/Desktop/Projects/collaboration/VC_Pages/yip-paas-procurement/procurement-web-ui/procurement-ui/src/pages/procurement/poQuery/poList/Query.tsx`
- url: `N/A`
- searchButtonId: `po-query-search-btn`

## 兜底

- 若 `modelContextTesting.executeTool` 不可用，调用 bridge：
```js
await window.__wmcpAnyPage?.["query-fill-and-search"]?.call?.({
  "asnRelationFlag": "ALL",
  "backStateList": "1001,1002",
  "bookUrgents": "example",
  "brandId": "example"
});
```
- 若 bridge 也不可用，再退回浏览器自动化。

