# 配置结构与实现方式深度分析

本项目基于 **WXT (Web Extension Toolbox)** 和 **Vue 3** 构建了一套高性能、跨上下文同步的配置管理系统。以下是关于配置键名、分类及其实现细节的详细说明。

## 1. 配置键名 (Storage Keys) 全景图

所有键名均定义在 `src/constants/storage-key.ts` 中，统一使用 `local:` 前缀（对应 `browser.storage.local`）。

### A. 核心数据列表 (CRUD 级)
这些 Key 存储复杂的对象数组，通常通过专门的 Composable 进行管理。

| 键名 (Key) | 说明 | 数据类型 |
| :--- | :--- | :--- |
| `local:model-configs` | 所有已保存的模型供应服务配置 | `ModelConfigItem[]` |
| `local:prompt-configs` | 所有自定义的提示词模板 | `PromptConfigItem[]` |
| `local:site-customization-list` | 针对特定站点的提取规则列表 | `SiteCumstomizationItem[]` |

### B. 全局指针 (Pointers)
用于标记当前激活或默认使用的项。

| 键名 (Key) | 说明 | 数据类型 |
| :--- | :--- | :--- |
| `local:default-model-id` | 当前选中的默认模型配置 ID | `string` |
| `local:default-prompt-id` | 当前选中的默认提示词模板 ID | `string` |

### C. 通用行为设置 (General Behavior)
控制扩展的核心逻辑和偏好。

| 键名 (Key) | 说明 | 数据类型 |
| :--- | :--- | :--- |
| `local:summary-lang` | 总结目标语言 (如 `zh-CN`, `en`) | `string` |
| `local:summary-input-exceed-behaviour` | 文本超长时的裁剪策略 | `enum (cut-front/back/middle)` |
| `local:user-custom-style` | 用户自定义的全局注入 CSS | `string` |

### D. 功能开关与 UI 控制 (Feature Toggles)
控制各个功能模块的启用状态。

| 分类 | 键名 (Key) | 功能说明 |
| :--- | :--- | :--- |
| **触发器** | `local:enable-auto-begin-summary` | 打开页面是否自动开始总结 |
| | `local:enable-auto-begin-summary-by-action...` | 点击图标/快捷键时是否自动开始 |
| | `local:popup-click-trigger` | 点击 Popup 按钮是否触发总结 |
| **右键菜单** | `local:enable-context-menu-summarize-this-page` | 是否显示“总结此页”菜单 |
| | `local:context-menu-add-selection-to-chat` | 是否显示“添加选中内容到对话” |
| **UI 元素** | `local:enable-floating-ball` | 是否显示页面右侧悬浮球 |
| | `local:enable-summary-window-default` | 总结窗口是否默认展开 |
| | `local:enable-tokan-usage-view` | 是否显示 Token 消耗统计 |
| | `local:enable-create-new-panel-button` | 是否显示“新建面板”按钮 |
| | `local:enable-chat-input-box` | 是否显示底部对话框 |

---

## 2. 代码实现示例

### A. 声明与定义 (Declaration)
配置通常在 `src/types/config/` 定义类型，在 `src/constants/` 定义键名和默认值。

```typescript
// src/types/config/model.ts
export type ModelConfigItem = {
  id: string;
  name: string;
  providerType: string;
  apiKey?: string;
  // ... 其他 LLM 参数
};

// src/constants/storage-key.ts
export const MODEL_CONFIG_KEY = "local:model-configs";

// src/constants/default-config.ts
export const DefaultConfig = {
  SUMMARY_LANG: 'zh-CN',
  ENABLE_FLOATING_BALL: true,
  // ...
};
```

### B. 响应式检索 (Reactive Retrieve)
使用 `useWxtStorage` 组合式函数，实现 UI 与存储的实时同步。

```typescript
// 在 Vue 组件中使用
import { useSummaryLanguage } from '@/composables/general-config';

const { summaryLanguage } = useSummaryLanguage();

// summaryLanguage 是一个 WritableComputedRef
console.log(summaryLanguage.value); // 获取值
```

### C. 创建与修改 (Create & Modify)
对于复杂列表，使用管理类 Composable；对于简单开关，直接对响应式状态赋值。

**1. 修改简单开关：**
```typescript
const { enableFloatingBall } = useEnableFloatingBall();
// 直接修改 value，底层会自动调用 storage.setItem 并通知其他上下文
enableFloatingBall.value = false;
```

**2. 创建复杂项 (如模型配置)：**
```typescript
// src/composables/model-config.ts 内部逻辑
export function useModelConfigStorage() {
  const modelStorage = storage.defineItem<ModelConfigItem[]>(MODEL_CONFIG_KEY, { fallback: [] });

  async function createItem(configItem: ModelConfigItem) {
    const models = await modelStorage.getValue();
    configItem.id = uid(16); // 生成 ID
    models.push(configItem);
    await modelStorage.setValue(models); // 写入存储
    return true;
  }

  return { createItem };
}
```

### D. 静态检索 (Static Retrieve)
在非 Vue 环境（如 Background Service Worker）中，直接使用 WXT 的异步 API。

```typescript
import { storage } from "wxt/storage";
import { SUMMARY_LANG_KEY } from "@/constants/storage-key";

async function getLang() {
  // 直接从存储读取，支持 fallback
  const lang = await storage.getItem(SUMMARY_LANG_KEY, { fallback: 'en' });
  return lang;
}
```

---

## 3. 实现核心机制：`useWxtStorage`

这是本项目最关键的工具函数，其简化逻辑如下：

```typescript
export default function <T>(key: StorageItemKey, initialValue: T) {
  // 1. 使用 vueuse 的 useAsyncState 异步获取初始值
  const { state } = useAsyncState(() => storage.getItem(key), initialValue);

  // 2. 监听存储变化 (跨窗口/跨上下文同步)
  onMounted(() => {
    storage.watch<T>(key, (newValue) => {
      state.value = newValue ?? initialValue;
    });
  });

  // 3. 返回一个可读写的 computed 属性
  return {
    state: computed({
      get: () => state.value,
      set: (val) => {
        storage.setItem(key, val); // 异步保存
        state.value = val;        // 同步 UI
      }
    })
  };
}
```

这种模式确保了：
1. **开发者体验：** 像操作普通 Vue 变量一样操作持久化存储。
2. **多端同步：** 选项页改了配置，打开的网页（Content Script）会立即感应并生效。
