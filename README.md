# Titanfy · 涂腾辉 / 产品、设计与影像

个人作品集，依据 Titanfy Figma Edition 05 原型实现。围绕产品定义、设计、实物验证与影像表达展开，包含首页、项目总览、五个项目、BOARD-MIND 技术能力、设计、影视、两部影片、关于、联系和简历，共 15 个页面。

## 本地运行

使用 Node.js 22 或更新版本：

```sh
npm ci
npm run dev
```

打开 http://localhost:4173 。`npm run build` 生成静态网站 `dist/`，`npm run preview` 预览构建结果。无需服务端或环境密钥。

在本项目指定的 Windows 工作区开发时，将临时目录和工具缓存保存在工作区内：

```powershell
$env:TEMP = 'E:/personal-resume/tmp'
$env:TMP = $env:TEMP
$env:TMPDIR = $env:TEMP
$env:npm_config_cache = 'E:/personal-resume/cache/npm'
$env:PLAYWRIGHT_BROWSERS_PATH = 'E:/personal-resume/cache/playwright'
```

## 内容和交互

- `app.js`、`site-data.js`、`narrative.json`：页面、作品数据与产品叙事。
- `styles.css`：原型排版、桌面与移动布局。
- `motion.js`：所有页面共用完整 T 形窗口进出场；退出后留白 0.5 秒，加载 T 旋转放大、匀速旋转，图片就绪后旋转缩至消失，再依次组装横线和竖线、停留、放大展开。
- `glass-edge.js`：沿横竖笔画的合并轮廓绘制液态玻璃边缘，结合局部背景柔化、半透明高光与阴影；厚度保持屏幕像素尺寸，窗口中心清晰，加载阶段隐藏边缘。
- `entry-assets.js`：等待首屏图片、素描图层与视频封面加载并解码后再进入；失败时保持遮罩并允许重试。
- `scroll.js`：首页笔触显影、五阶段产品过程和 About 教育玻璃面板上浮。
- `material.js`：真实 GLB 模型、表面采样粒子和随滚动在原位生成的产品材质。
- `assets/`：本地字体、图片、影片、模型与产品经理简历。

关于页使用不含内部信息的场景视觉；实习经历文案保留。Education 玻璃面板连续上浮进入实习场景，作为此次对原型的调整。影片详情保留起始封面，点击后播放。支持减少动态效果设置；3D 加载失败时显示产品图片。

## 验证

```sh
npm test
```

Playwright 在 Windows 使用本机 Chrome；其他环境先运行 `npx playwright install chromium`。测试覆盖 15 个页面的桌面与移动布局、资源请求、T 转场、滚动交互、项目筛选、视频、PDF、GLB 材质生成及失败回退，以及进入前的慢网等待、图片解码、失败重试与历史导航取消。

## 发布

目标站点：https://titfly77-cyber.github.io/

GitHub Actions 在 `main` 更新后构建并部署 `dist/`。仓库 Settings → Pages 的 Source 应为 GitHub Actions。资源使用相对路径，页面使用哈希路由，详情页可直接访问和刷新。

当前版本使用本地 Manrope 与 Noto Sans SC 字体，许可证随字体存放。模型已进行纹理压缩及 Meshopt 编码；运行时解码器随网站打包。原始资料与测试输出不属于发布产物。
