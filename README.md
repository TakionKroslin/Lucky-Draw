# Lucky-Draw（别紧张）

## 项目目的
本项目是一个课堂点名与“幸运抽取”工具，面向班级教学场景。  
目标是让老师在课堂中快速、直观地完成抽取，同时具备较强的趣味性与可视化反馈（头像、动画、稀有度、音效）。

## 主要功能
- 学生抽取：显示昵称、可切换真名，支持头像加载失败回退。
- 特殊项抽取：支持“老师/技能”两类特殊项，按 `legend / epic / rare` 播放不同动画。
- 稀有度音效：老师/技能出现时，按稀有度触发不同音效序列。
- 功能面板：右下角胶囊打开面板，集成抽取模式与筛选项。
- 模式支持：
  - 直接抽取模式
  - 简易模式（隐藏头像与昵称）
- 头像预加载：启动后预加载头像，面板可手动重试。
- 彩蛋：连续点击底部版权 3 次触发“新春祝福”动画。

## 目录结构
- `index.html`：核心页面、样式与前端逻辑（单文件主入口）。
- `main.js`：Electron 主进程（窗口创建、请求头处理、自动更新）。
- `preload.js`：预加载脚本。
- `easter-egg.js` / `easter-egg.css`：彩蛋逻辑与样式。
- `build/`：应用图标与签名证书等资源。
- `data/`：可选数据文件目录（按需扩展）。

## 配置方法
### 1. 基础数据配置（在 `index.html` 中）
- 学生数据：`database`
- 技能数据：`SKILLS`
- 老师数据：`TEACHERS`
- 开场文案：`startPhrases`

每条记录可配置字段示例：
- `nickname`：昵称
- `realname`：真实姓名
- `avatarUrl`：头像地址
- `subject`：学科分组
- `rarity`：稀有度（`legend` / `epic` / `rare`）

### 2. Electron 配置（`package.json`）
- 当前版本：`2.2.0`
- Electron：`22.3.27`（兼容 Windows 7）
- 打包输出目录：`dist`
- 打包脚本：
  - `npm run build`
  - `npm run build:win`

## 部署到网页的方法
可直接静态部署，无需前端构建流程。

### 方式 A：GitHub Pages
1. 将项目推送到 GitHub 仓库。  
2. 仓库 `Settings -> Pages`，选择 `Deploy from a branch`。  
3. 选择 `main` 分支和根目录 `/`。  
4. 保存后等待生成访问链接。

### 方式 B：本地静态服务器
在项目根目录执行（任选其一）：

```bash
npx serve .
```

或

```bash
python -m http.server 8080
```

然后浏览器访问对应地址。

## 打包为桌面端（Electron）
> 本项目已按 Win7 兼容要求固定 Electron 22。

### 1. 安装依赖
```bash
npm install
```

### 2. 清理旧包（可选但推荐）
```bash
PowerShell: Remove-Item -Recurse -Force dist, dist-* -ErrorAction SilentlyContinue
```

### 3. 打包 Windows 安装包（x64 + ia32）
```bash
npm run build:win
```

### 4. 产物位置
默认在 `dist/` 下生成：
- `*-x64.exe`
- `*-ia32.exe`

## 开发说明
- 启动开发模式：
```bash
npm start
```
- 若修改了动画或音效逻辑，建议先在 Electron 中回归：
  - 学生抽取动画
  - 老师/技能稀有度动画与音效
  - 面板开关动画与模式切换

## 许可证
Apache-2.0
