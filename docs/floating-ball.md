# 悬浮球组件 (RightFloatingBallContainer) 分析

## 1. 原组件实现分析 (`reference/src/components/container/RightFloatingBallContainer.vue`)

- **功能定位**:
  - 一个固定吸附在页面最右侧的悬浮球容器组件。
  - 支持拖拽改变垂直位置，松开鼠标后自动吸附到最右端（清除 x 坐标，保留 y 坐标百分比）。
  - 支持将垂直位置 (y 轴 `top` 百分比) 持久化至 Chrome/WXT storage 中。
  - 鼠标悬停 (hover) 时显示关闭按钮，鼠标离开时隐藏关闭按钮。
  - 点击关闭按钮会隐藏/销毁悬浮球。

- **核心属性 (Props)**:
  - `storageKey` (string): 用于持久化位置的唯一标识（保存的 key 格式为 `local:right-floating-ball-top-${storageKey}`，默认值为 `'page'`）。
  - `class` (string): 自定义样式类。
  - `initClosedBtnHidden` (boolean): 关闭按钮最初是否隐藏（在 Vue 代码中，hover 时会延迟 100ms 显示关闭按钮）。

- **状态管理**:
  - `isCloseBtnHidden`: 关闭按钮的显隐状态。
  - `isClose`: 是否已被关闭。
  - `positionStorage`: 垂直位置的持久化状态，通过 `useWxtStorage` (底层为 `browser.storage.local`) 加载。
  - `isDragging`: 是否正在进行拖拽。

- **拖拽与定位逻辑**:
  - 鼠标在悬浮球上按下 (`mousedown`) 时触发 `startDrag`，注册 `mousemove` 和 `mouseup` 全局监听器。
  - 拖拽过程中 (`drag`):
    - 根据鼠标位移计算新的 `left` (x) 和 `top` (y) 像素坐标。
    - 结合视口宽高 (`window.innerWidth`, `window.innerHeight`) 与阈值 (THRESHOLD = 10px) 限制悬浮球拖拽边界，不超出边界。
    - 垂直方向计算百分比 `top = 100 * newY / windowHeight + '%'` 并应用。
  - 鼠标释放 (`endDrag`):
    - 取消全局监听器。
    - 清除 `left` 属性，设置 `right = '0px'` 或 `right = '${THRESHOLD}px'` (自动吸附到右侧)。
    - 保存最新的 `top` 百分比到 storage。

- **DOM 挂载**:
  - 在内容脚本中通过 Shadow DOM 容器挂载。

---

## 2. React 重写方案

### 2.1 依赖与设计
- 使用 React 标准的 Hook (`useState`, `useEffect`, `useRef`) 重写拖拽逻辑。
- 创建 React 版的 `useWxtStorage` Hook 用于读取/写入 WXT `storage` 状态，并使用 `storage.watch` 实现多窗口/多上下文状态同步。
- 采用 Tailwind CSS 还原悬浮球样式，保持与原 Vue 页面一致。
- 重写原 Vue 中的 `<slot>` 结构为 React 的 `children`。

### 2.2 重写接口规划 (`components/container/RightFloatingBallContainer.tsx`)
```typescript
interface RightFloatingBallContainerProps {
  storageKey?: string;
  className?: string;
  initClosedBtnHidden?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
```
