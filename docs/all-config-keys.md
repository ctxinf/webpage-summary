# 配置项全览与适配分级手册

本文档详尽列出了本项目中所有的配置键名 (Keys)、数据类型、功能描述，并根据 [new-features.md](./new-features.md) 中的重构计划，对配置项进行了“全局设置”与“多级适配（可覆盖）”的分级定义。

## 1. 全量配置项清单 (All Config Keys)

| 键名 (Key) | 数据类型 | 描述 |
| :--- | :--- | :--- |
| **基础配置库** | | |
| `local:model-configs` | `ModelConfigItem[]` | 已保存的所有 LLM 模型配置列表 |
| `local:prompt-configs` | `PromptConfigItem[]` | 已保存的所有提示词 (Prompt) 模板列表 |
| `local:site-customization-list` | `SiteCumstomizationItem[]` | 站点自定义提取规则列表 |
| **当前激活项** | | |
| `local:default-model-id` | `string (uuid)` | 当前默认使用的模型配置 ID |
| `local:default-prompt-id` | `string (uuid)` | 当前默认使用的提示词模板 ID |
| **核心行为控制** | | |
| `local:summary-lang` | `string` | 总结的目标语言代码 (如 `zh-CN`, `en`) |
| `local:summary-input-exceed-behaviour` | `string (enum)` | 内容超长处理策略 (front/middle/back) |
| `local:user-custom-style` | `string` | 用户自定义注入的 CSS 样式代码 |
| **站点过滤** | | |
| `local:site-filter-whitelist` | `WhiteList` | 白名单配置 (包含开启状态和匹配模式) |
| `local:site-filter-blacklist` | `BlackList` | 黑名单配置 (包含开启状态和匹配模式) |
| **功能触发与逻辑** | | |
| `local:enable-auto-begin-summary` | `boolean` | 页面加载完成时是否自动触发总结 |
| `local:enable-auto-begin-summary-by-action...` | `boolean` | 通过点击扩展图标等主动操作时是否直接开始总结 |
| `local:popup-click-trigger` | `boolean` | 点击 Popup 弹出框是否作为总结触发器 |
| `local:context-menu-add-selection-to-chat` | `boolean` | 是否在右键菜单显示“添加选中到对话” |
| `local:enable-context-menu-summarize-this-page`| `boolean` | 是否在右键菜单显示“总结此页” |
| `local:enable-auto-begin-chat-for-add...` | `boolean` | 添加选中内容后是否自动开始对话 |
| **界面展示 (UI)** | | |
| `local:enable-floating-ball` | `boolean` | 是否显示页面右侧悬浮球 |
| `local:enable-summary-window-default` | `boolean` | 总结侧边栏面板是否默认处于展开状态 |
| `local:enable-tokan-usage-view` | `boolean` | 是否显示 Token 消耗情况统计 |
| `local:enable-create-new-panel-button` | `boolean` | 是否在面板上显示“新建独立面板”按钮 |
| `local:enable-chat-input-box` | `boolean` | 是否显示底部的聊天对话框 |
| `local:expand-chat-input-box` | `boolean` | 聊天框是否默认处于扩充状态 |

---

## 2. 配置适配分级 (Adaptability Classification)

根据“配置统一化”重构目标，配置项分为以下两个级别：

### A. 仅全局设置 (Global Only)
这些设置属于扩展的基础设施或浏览器级别的 UI 控制，不随具体站点的不同而改变。

- **配置库/规则定义：** `model-configs`, `prompt-configs`, `site-customization-list`, `site-filter-whitelist`, `site-filter-blacklist`。
- **自定义样式：** `user-custom-style` (全局视觉统一)。
- **浏览器交互：** `enable-context-menu-*` (右键菜单属于浏览器级别权限)。
- **全局统计：** `enable-tokan-usage-view`。

### B. 多级适配/可覆盖项 (Multi-level & Overrideable)
这些设置在“全局设置”中定义默认值，但在“站点规则 (Site Customization)”中可以被单独覆盖，优先级：**站点规则 > 全局设置**。

| 可覆盖项 | 场景举例 |
| :--- | :--- |
| **模型 (`default-model-id`)** | 对技术文档站点使用高性能模型 (GPT-4)，对新闻站点使用轻量级模型。 |
| **提示词 (`default-prompt-id`)** | 对 GitHub 仓库使用专门的代码分析提示词，对普通网页使用通用总结。 |
| **语言 (`summary-lang`)** | 访问外语新闻时固定用中文总结，访问英文技术社区时保留英文总结。 |
| **自动总结开关 (`enable-auto-begin-summary`)** | 仅在个人博客类站点自动开始总结，在社交媒体类站点保持手动触发。 |
| **对话框开关 (`enable-chat-input-box`)** | 在内容密集型站点显示对话框方便深入追问，在简单资讯页隐藏。 |
| **超长处理策略 (`summary-input-exceed-behaviour`)** | 对学术论文保留中间核心内容 (middle)，对教程文章保留开头介绍 (front)。 |
| **面板展开状态 (`enable-summary-window-default`)** | 在某些高频阅读站点让面板默认弹出。 |

---

## 3. 实现建议 (Refactoring Implementation)

为了实现上述多级适配，建议在检索配置时引入 `resolveConfig(key, hostname)` 逻辑：

1. **第一优先级：** 检查 `local:site-customization-list` 中是否有匹配当前 `hostname` 的规则。
2. **第二优先级：** 如果匹配规则中定义了该 key 的覆盖值，则返回覆盖值。
3. **第三优先级 (Fallback)：** 返回 `local:${key}` 对应的全局配置值。

这种架构将极大增强扩展的灵活性，使用户能针对不同类型的生产力环境进行精细化定制。
