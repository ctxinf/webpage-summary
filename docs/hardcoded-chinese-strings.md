# 遗漏的写死中文分析 (i18n Hardcoded Strings)

在审查代码库时，发现了以下遗漏的、未经过 i18n（国际化）处理的写死中文。主要集中在确认框、提示消息 (toast)、以及部分 UI 渲染文本中。

## 1. 配置管理页面 (`entrypoints/options/pages/ConfigManagerPage.tsx`)
这个页面包含了大量的写死中文，特别是导入审阅的表格和部分提示：
- **Confirm 确认框:**
  - `window.confirm('确定要清除所有配置吗？此操作无法撤销。')`
- **Toast 提示消息:**
  - `toast.info('未发现任何变更', { description: '剪贴板中的配置与当前配置完全一致。' });`
  - `toast.info('请审阅即将导入的配置');`
  - `toast.success(..., { description: \`成功导入了 \${Object.keys(dataToSave).length} 项配置。\`, });`
  - `toast.info('未选择任何配置进行导入。');`
  - `toast.success(..., { description: '所有配置已被清除。', });`
- **UI 文本 (导入审阅模态框/表格):**
  - `导入审阅 (Import Review)`
  - `确认导入`、`全部接受`、`全部拒绝`、`取消`
  - `配置项`、`旧的值`、`新的值`、`操作`
  - `冲突`、`新增`
  - `✅ 覆盖`、`✅ 接受`
  - `❌ 跳过`、`❌ 放弃`

## 2. 总结内容框 (`entrypoints/content/summary/ContentAppFrame.tsx`)
- **Toast 提示消息:**
  - `toast.error(error.message || '发生未知错误，请重试')`
- **UI 文本:**
  - `title={messages.length > 0 ? '重新总结' : '总结'}` (虽然有 fallback 但硬编码了中文)
  - `<span>{pageContentTokenCount !== null ? pageContentTokenCount : '计算中...'}</span>`

## 3. 内容应用 Hook (`entrypoints/content/summary/useContentApp.ts`)
- **Toast 提示消息:**
  - `toast.error(error.message || '发生未知错误，请重试');`
  - `toast.success('复制成功');`
  - `toast.error('复制失败');`

## 4. 模型编辑器 (`entrypoints/options/pages/models/ModelEditor.tsx`)
- **UI 文本:**
  - `收起`
  - `更多...`

## 5. 示例代码 (`sample` 目录下)
> 注意：根据规范，示例代码通过 `constants` 控制开关。这里列出可能也需要考虑的中文，尽管它们属于示例内容。
- `entrypoints/options/sample/sonner-toast/SonnerToastSample.tsx` 中的 Toast 通知（"普通通知", "保存成功", "请求失败" 等）。
- `entrypoints/options/sample/gpt-tokenizer/GptTokenizerSample.tsx` 中的计算状态（"计算中", "截断中", "拆分中" 等）。
- `entrypoints/options/sample/SamplePage.tsx` 和阿里云 API 示例中的 UI 文本（"返回", "示例导航", "示例不可用" 等）。
- 各种 sample 默认的 prompt 中的中文提示语。

---
建议后续将上述提取出的中文统一加入到 `lib/i18n.ts` 中以完成彻底的国际化。
