/* WMCP_TOOL_INJECT_START:query-fill-and-search */
const __wmcpTool_query = {
  name: "query-fill-and-search",
  description: "Auto-generated query tool for query.",
  inputSchema: {
  "type": "object",
  "properties": {
    "asnRelationFlag": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "backStateList": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "bookUrgents": {
      "type": "string",
      "description": "文本输入。"
    },
    "brandId": {
      "type": "string",
      "description": "文本输入。"
    },
    "cate3Id": {
      "type": "string",
      "description": "文本输入。"
    },
    "dcId": {
      "type": "string",
      "description": "文本输入。"
    },
    "deliveryModList": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "inputCustomerOrders": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "inputPoIds": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "inputRequireIds": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "inputSkuIds": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "inStoreTime": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "isMulReceiving": {
      "type": "string",
      "description": "文本输入。"
    },
    "isRequirements": {
      "type": "string",
      "description": "文本输入。"
    },
    "markFlag": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "needTransfer": {
      "type": "string",
      "description": "文本输入。"
    },
    "ouId": {
      "type": "string",
      "description": "文本输入。"
    },
    "outChannelList": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "poBookDate": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "poCreateDate": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "poType": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "queryErpList": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "queryInboundType": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "queryType": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "sourceId": {
      "type": "string",
      "description": "文本输入。"
    },
    "stateList": {
      "description": "列表输入。可传逗号分隔字符串或字符串数组。",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      ]
    },
    "subVendorCode": {
      "type": "string",
      "description": "文本输入。"
    },
    "supplyFlag": {
      "type": "string",
      "description": "枚举/状态类字段。"
    },
    "todoBack": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "todoCreateAsn": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "todoMerge": {
      "description": "日期范围。支持 [start,end] / {start,end} / \"start,end\"。",
      "anyOf": [
        {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "string"
          }
        },
        {
          "type": "object",
          "properties": {
            "start": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          }
        },
        {
          "type": "string"
        }
      ]
    },
    "virtualCategoryName": {
      "type": "string",
      "description": "文本输入。"
    },
    "yn": {
      "type": "string",
      "description": "文本输入。"
    }
  },
  "required": [],
  "additionalProperties": true
},
  annotations: {
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  execute: async (params = {}) => {
    const fieldDefs = [
  {
    "name": "asnRelationFlag",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "backStateList",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "bookUrgents",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "brandId",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "cate3Id",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "dcId",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "deliveryModList",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "inputCustomerOrders",
    "type": "dateRange",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "inputPoIds",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "inputRequireIds",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "inputSkuIds",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "inStoreTime",
    "type": "dateRange",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "isMulReceiving",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "isRequirements",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "markFlag",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "needTransfer",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "ouId",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "outChannelList",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "poBookDate",
    "type": "dateRange",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "poCreateDate",
    "type": "dateRange",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "poType",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "queryErpList",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "queryInboundType",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "queryType",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item"
    ]
  },
  {
    "name": "sourceId",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "stateList",
    "type": "stringList",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "subVendorCode",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "supplyFlag",
    "type": "enumLike",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "todoBack",
    "type": "dateRange",
    "required": false,
    "source": [
      "Form.Item"
    ]
  },
  {
    "name": "todoCreateAsn",
    "type": "dateRange",
    "required": false,
    "source": [
      "Form.Item"
    ]
  },
  {
    "name": "todoMerge",
    "type": "dateRange",
    "required": false,
    "source": [
      "Form.Item"
    ]
  },
  {
    "name": "virtualCategoryName",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  },
  {
    "name": "yn",
    "type": "string",
    "required": false,
    "source": [
      "lsc-searchbox-item",
      "Form.Item"
    ]
  }
];
    const defaultParams = {};
    const humanTemplates = {
  "humanReadableSuccess": "已填写 {{changedCount}} 个字段并触发查询。",
  "humanReadableNoChange": "未匹配到可填写字段，已尝试触发查询。"
};
    const merged = { ...defaultParams, ...(params || {}) };

    const toText = (v) => {
      if (v == null) return "";
      if (Array.isArray(v)) return v.join(",");
      return String(v);
    };

    const renderHuman = (template, vars = {}) =>
      String(template || "").replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
        const value = vars[key];
        return value == null ? "" : String(value);
      });

    const setTextField = (fieldName, value) => {
      const selectors = [
        "#" + CSS.escape(fieldName),
        '[name="' + fieldName.replace(/"/g, '\"') + '"]',
        '[data-field="' + fieldName.replace(/"/g, '\"') + '"]',
        '[data-testid="' + fieldName.replace(/"/g, '\"') + '"]'
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
        const parts = input.split(/\s*(?:,|~|至|to)\s*/i).filter(Boolean);
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
    let searchTarget = "po-query-search-btn";
    if ("po-query-search-btn") {
      const byId = document.getElementById("po-query-search-btn");
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
      tool: "query-fill-and-search",
      changedFields,
      changedCount: changedFields.length,
      searchTriggered,
      searchTarget,
      page: "/Users/fanjiongming/Desktop/Projects/collaboration/VC_Pages/yip-paas-procurement/procurement-web-ui/procurement-ui/src/pages/procurement/poQuery/poList/Query.tsx",
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
      modelContext.unregisterTool?.(__wmcpTool_query.name);
    } catch (err) {}

    try {
      if (typeof modelContext.registerTool === "function") {
        modelContext.registerTool(__wmcpTool_query);
        return true;
      }
      if (typeof modelContext.provideContext === "function") {
        modelContext.provideContext({ tools: [__wmcpTool_query] });
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

  window.__wmcpAnyPage = window.__wmcpAnyPage || {};
  window.__wmcpAnyPage["query-fill-and-search"] = {
    toolName: __wmcpTool_query.name,
    description: __wmcpTool_query.description,
    inputSchema: __wmcpTool_query.inputSchema,
    register,
    call: async (params = {}) => __wmcpTool_query.execute(params),
    polyfillUrl: "https://unpkg.com/@mcp-b/webmcp-polyfill@latest/dist/index.iife.js"
  };
})();
/* WMCP_TOOL_INJECT_END:query-fill-and-search */
