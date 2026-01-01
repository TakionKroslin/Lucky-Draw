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

# README

This web-app is a random pick-up website intended for students in Class 17, Grade 2024 of Mianyang Dongchen Middle School, which includes a funny "lucky draw" which calls individuals by their nickname, showing their avatar with a hovering animation, and have an alternative to see their real names. Users are required to customize the database before using. Follow the instructions to set up.

## START UP

Clone this repository to your local, including intex.html, database-generator.py (optional) and nicknames.xlsx (optional).

## STATISTICS COLLECTING

To start with, you need to open up a new .xlsx form which contains all your statistics. The form should have several columns, each named "网名""真实姓名""头像位置""分科" in their first row. The order of the columns is not limited. The form should look like this:
![](https://pic1.imgdb.cn/item/693e2ab425ec9c13612c6c20.png)

## DATABASE GENERATING

After collecting and analyzing your statistics, you'll need to convert your statistics into a utilizable database which the web can read. The database consists of four parts: students, skills, teachers and start phrases.

The formation of the student database should be like this:

```html
const database = [
            { nickname: "A", realname: "AA", avatarUrl: "https://AAA.jpg", subject: "政治" },
            { nickname: "B", realname: "BB", avatarUrl: "https://BBB.jpg", subject: "生物" },
            { nickname: "C", realname: "CC", avatarUrl: "https://CCC.jpg", subject: "政治" },
            { nickname: "D", realname: "DD", avatarUrl: "https://DDD.jpg", subject: "生物" },

        ];
```

You can customize nickname, real name, avatar URL and subject up to your need.

But if your form is too big to type in one by one, here's a short cut for you. Just clone the database-generator.py in this repository, and put the .py file and your .xlsx file in the same folder. Then replace the example .xlsx name in line 95 by your file name.

![](https://pic1.imgdb.cn/item/693e2faffe7cfeca38251c82.png)

Then open Terminal or PowerShell.

```python
pip install pandas openpyxl
```

Then type in:

```python
python database-generator.py
```

You would get a .txt file in the same folder where the .py file lies, named database_output.txt. With just a simple copy and paste, you can finish the setup of student database.

![](https://pic1.imgdb.cn/item/693e312025ec9c13612ca7c2.png)

The formation of the skill database should be like this:

```
        const SKILLS = [
            { type: "skill", nickname: "万箭齐发", realname: "万箭齐发", avatarUrl: "", isSpecial: true, rarity: 'legend', className: 'skill-item' },
            { type: "skill", nickname: "铁索连环", realname: "铁索连环", avatarUrl: "", isSpecial: true, rarity: 'epic', className: 'skill-item' },
        ];
```

You can customize nickname, real name( the two should be the same) ,and rarity( choose from "epic""legend""rare").

The formation of the teacher database should be like this:

```html
        const TEACHERS = [
            { type: "teacher", nickname: "E", realname: "EE", avatarUrl: "", isSpecial: true, rarity: 'legend', className: 'teacher-item' },
            { type: "teacher", nickname: "F", realname: "FF", avatarUrl: "", isSpecial: true, rarity: 'epic', className: 'teacher-item' },
        ];
```

The rule is the same as the skills.

The formation of the start phrases should be like this:

```
        const startPhrases = [
            "让我看看谁在紧张", "是谁的小鹿在乱撞", "深呼吸，头晕是正常的",
            "别躲了，我都看到你了", "此时一名幸运观众汗流浃背", "命运的齿轮开始转动",
            "只是抽个查，别慌", "眼神别飘，看着我", "准备好你的表演了吗", "让我康康是谁这么幸运"
        ];
```

You can add your own interesting statistics.

Then fill your own statistics respectively into intex.html.

## DEPLOYMENT

You can host it on GitHub Pages in 3 minutes (zero-config, no build step)

First,you create a new repo and upload the files(intex.html must, others optional).

Then turn on GitHub Pages, choose deploy from a branch → choose main (or master) → / (root) → Save.

GitHub will give you a live URL in 5-30 s, e.g.
`https://YOUR_USERNAME.github.io/REPO_NAME/`
Copy it—that’s your public site.

## Done! Share the URL with the class.