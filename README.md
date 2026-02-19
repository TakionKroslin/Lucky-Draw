# 2026 大版本更新 — 详细说明

> 本次更新为 2026 年大版本迭代，包含若干关键 Bug 修复、功能新增、UI/交互与桌面平台支持。下面结合代码要点做详细说明，便于开发者与维护者快速定位改动。

## 一、重要说明（概要）
- 版本：2026 大版本更新
- 主要变化：修复滚动与头像显示相关 BUG，新增“简易模式”，全面引入玻璃磨砂与交互荧光效果（命名为 **Glow Illume**），并提供基于 Electron 的 Windows x32/x64 桌面发布包。

## 二、Bug 修复（关键点）
1. 修复在滚动（rolling）过程中切换到“直接抽取”（instant）模式后无法抽取的漏洞。
    - 关键修复点：引入并调用了 `forceStopRolling()`，确保在切换模式或打开菜单前强制停止动画和定时器，避免残留状态导致的抽取失败。
    - 参考位置（JS）：`index.html` 中对切换按钮与菜单开关的事件处理处会调用 `forceStopRolling()`。

2. 修复头像动画显示异常的问题。
    - 关键修复点：规范了头像容器与头像元素的显示/隐藏逻辑，确保在“简易模式”或其他模式切换时不会遗留动画类或不正确的内联样式。
    - 参考位置（HTML/CSS/JS）：`#avatar-box` / `.avatar-container` 的显示控制与 `renderResult()` 内对 `avatar` 元素的更新逻辑。

## 三、功能更新
- **简易模式（Simple Mode）**：新增一个便捷开关，命名为“简易模式”（菜单项 ID：`btn-simple-mode`），启用后：
  - 隐藏头像与网名区域（方便不希望看到头像/真实姓名的用户），采用“直接抽取”展示方式。
  - 同时显示一次性提示（Toast）：`#toast-msg`，文案为“简易模式不显示头像和网名，采用直接抽取”。
  - 互斥行为：`简易模式` 与 `直接抽取`（instant）互斥，切换时会触发 `forceStopRolling()` 以保证状态一致。

## 四、UI 与交互更新
1. 全局磨砂玻璃（Glassmorphism）
    - 使用了 CSS 变量和统一 alpha 管理：例如在 `:root` 中定义 `--glass-alpha`，并在主要组件的背景中使用 `rgba(..., var(--glass-alpha))` 来保证整体透明度一致性与可调性。
    - 受影响组件：`#name-display`、按钮、过滤菜单、头像框（`#avatar-box`）以及页脚等均采用磨砂玻璃样式。

2. 流动背景光斑（Background Light Panels）
    - 在 DOM 中新增了 `.bg-dots` 容器与若干 `.bg-dot` 元素，样式采用 `radial-gradient` 并配合 `filter: blur()`、`box-shadow` 与 `mix-blend-mode: screen` 来形成深色/高对比度的移动光板效果，JS 会以小幅随机化 `transform` 让光点呈自然漂浮。
    - 关键样式选择器：`.bg-dot.a`, `.bg-dot.b`, `.bg-dot.c`（位置信息与渐变色在 `index.html` 中定义）。

3. 荧光交互（Glow Illume）
    - 名称：Glow Illume（交互荧光溢光效果）。实现方式为在玻璃组件上使用伪元素（`.glass-hover-target::before`）并结合鼠标位置 CSS 变量 `--mx`/`--my`，通过 `radial-gradient`、`filter: blur()` 与 `mix-blend-mode: screen` 产生中心高亮与周边溢光，鼠标悬停或交互时会显著点亮周围区域。
    - 典型 selector：`.glass-hover-target::before`, `#btn-filter.active::before`。
    - JS 关联：页面 `mousemove` 事件会更新容器的 `--mx/--my` 值以实现跟随光点的效果。

## 五、平台支持
- 已使用 **Electron** 对项目进行了桌面化打包，生成 Windows x32 与 x64 可执行文件，用户可直接运行桌面客户端，无需依赖浏览器。打包与构建说明（简要）：

  1. 安装依赖（示例）

```bash
npm install
```

  2. 打包（示例，项目里如含 Electron 脚本，请按仓库内 `package.json` 的 `build` / `dist` 脚本执行）

```bash
npm run build:windows
```

## 六、关键代码引用（便于快速定位）
- 强制停止滚动：`forceStopRolling()`（在切换模式与打开菜单处调用）
- 简易模式触发器：`#btn-simple-mode`（菜单项）与 `#toast-msg`（提示）
- 全局透明度控制：`--glass-alpha`（`:root`）
- 背景光斑：`.bg-dot.a` / `.bg-dot.b` / `.bg-dot.c`（`index.html` 中样式）
- 荧光溢光：`.glass-hover-target::before`（鼠标跟随伪元素）

## 致谢与新年祝福
感谢大家的反馈与支持。祝大家新年快乐，万事如意！
