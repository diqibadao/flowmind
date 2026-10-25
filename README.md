<div align="center">

**简体中文** · [English](README.en.md)

<img src="docs/assets/logo.png" width="88" alt="FlowMind">

# FlowMind

**画流程图，也管好你的图。**

macOS 原生 · 本地存储 + iCloud 备份 · AI 改图 · Git 版本历史 · Agent 可调用

[![Platform](https://img.shields.io/badge/platform-macOS%2011%2B-000000?style=flat-square&logo=apple&logoColor=white)](#)
[![App Store](https://img.shields.io/badge/App%20Store-即将上架-0A84FF?style=flat-square&logo=appstore&logoColor=white)](#)
[![iCloud](https://img.shields.io/badge/iCloud-备份副本-0A84FF?style=flat-square&logo=icloud&logoColor=white)](#)
[![Git](https://img.shields.io/badge/Git-版本历史-F05032?style=flat-square&logo=git&logoColor=white)](#)
[![MCP](https://img.shields.io/badge/MCP-Agent%20可调用-4F55E8?style=flat-square)](#)
[![Privacy](https://img.shields.io/badge/遥测-无-16A34A?style=flat-square)](#隐私)

[产品主页](https://diqibadao.github.io/flowmind/) · [隐私协议](https://diqibadao.github.io/flowmind/privacy.html) · [支持与反馈](https://diqibadao.github.io/flowmind/support.html)

</div>

---


## 界面

<p align="center">
  <img src="docs/assets/screenshots/00-home.webp" width="100%" alt="首页：开始创作、最近编辑与模板">
</p>
<p align="center">
  <img src="docs/assets/screenshots/01-mindmap.webp" width="49%" alt="思维导图 · 学科导图">
  <img src="docs/assets/screenshots/02-templates.webp" width="49%" alt="模板库">
</p>
<p align="center">
  <img src="docs/assets/screenshots/03-er.webp" width="49%" alt="电商核心实体关系图">
  <img src="docs/assets/screenshots/04-journey.webp" width="49%" alt="用户旅程地图">
</p>
<p align="center">
  <img src="docs/assets/screenshots/05-versions.webp" width="49%" alt="版本管理与版本预览">
  <img src="docs/assets/screenshots/06-versions-diff.webp" width="49%" alt="三色差异对比">
</p>
<p align="center">
  <img src="docs/assets/screenshots/07-mindmap-copilot.webp" width="100%" alt="AI Copilot 侧栏">
</p>

## 为什么做 FlowMind

画流程图的人都经历过这样的时刻：一张图改到一半，手一滑拖歪了一片，一路按撤销回去，结果连带着把别的地方也撤了；或者你只想改个框里的字，它却跟着上面的箭头一起挪了位。

还有更常见的一种：三个月前画的那张架构图，存在某个聊天记录里，找不到了。就算找到了，也说不清还跟现在的系统对不对得上。

所以我们做了一个很具体的决定：**让图里的每一样东西都成为真正的对象。** 节点是对象、连线是对象、泳道和表格字段也是。有了身份，它才能被单独选中、被精确对齐、被记住、被比较。这不是好不好看的差别，是「改完之后还能不能改回来」的差别。

第二个决定来自更朴素的恐惧：**改坏了怎么办。** 于是每张图都有完整的版本历史——每次保存留一档，手动存的版本永久保留；改完能看三色差异，哪根线挪了、哪段文字删了、哪个框改了颜色，一笔一笔列出来；不满意，一键回到上一版。我们做这件事的理由很简单：**只有当「回得去」的时候，人才敢大胆改。** 一个不敢改的画图工具，最后只会越画越保守。

第三个决定：**AI 是副驾，不是代驾。** 它读得懂你的图，也能动手改，但改之前先把差异摆在你面前，你点头它才落笔。生成一张好看的图片很容易，难的是生成之后你还能继续改它——所以我们坚持让它改「对象」，而不是给你换一张图。

第四个决定关于归属：**图是你的。** 它就是一个普通文件，放在你自己选的文件夹里：Finder 里看得见，能备份，能进 git，能直接发给同事，哪天不用这个软件了也能带走。iCloud 备份是一份额外的副本（可选、默认关闭），而不是把你锁进谁的服务器。

最后一个决定是克制。FlowMind 没打算什么都能画——自由画布、白板、贴纸、批注，那些有更合适的工具。我们只想把一件事做扎实：**结构化的图，从一张草图到可以交付，全程撑得住。**

## 做到什么



| | 能力 | 说明 |
|---|---|---|
| 🗂 | **个人图库** | 所有图集中管理：缩略图网格、搜索、收藏、重命名、回收站；还有 10+ 套模板和「我的模板」 |
| 💾 | **本地存储** | 图就是普通文件，放在你指定的文件夹里；Finder 可见、可备份、可发人 |
| ☁️ | **iCloud 备份** | 可选开启，保存后自动复制一份到 iCloud Drive；由 Apple 负责传输与加密，断网照常保存 |
| 🤖 | **AI 接入** | 内置 Copilot：生成、改图、优化、生成文档；支持 OpenAI 兼容接口或本机 Ollama，Key 存系统钥匙串 |
| 🔌 | **MCP / Agent** | Claude Code、Codex、Cursor 等可直接生成**可编辑**的图，落进你的图库并打上 Agent 标记 |
| 🕘 | **Git 版本历史** | 每次保存自动留档，手动版本永久保留，可给版本写备注 |
| 🔍 | **版本对比与回退** | 三色差异（新增 / 删除 / 修改），连线与文字都参与比对，一键恢复到任意版本 |

## 还顺手做了这些

- **多格式互通**：导入 Mermaid、draw.io、Markdown、OPML、CSV、FreeMind；导出 SVG / PNG / PDF
- **智能布局**：分层、树状、力导向，一键整理整张图
- **结构化画布**：泳道、ER 表、思维导图、鱼骨图、组织架构，19 种节点类型，正交连线自动绕行
- **精细编辑**：对齐 / 分布 / 等距、层级、锁定、网格吸附、参考线、无限撤销
- **多标签 + 自动保存 + 崩溃恢复**

## 为什么把「版本」做重

画图最怕的不是画不出来，是**改坏了回不去**。

FlowMind 把每次保存都记进本地 Git 仓库（每张图一个仓库）：
自动版本按内容去重，手动版本永久保留；对比时新增标绿、删除标红、修改标蓝，
连线与连线文字也参与比对；看中哪一版，一键回去。

## 让 Agent 帮你画

```bash
npx -y https://github.com/diqibadao/flowmind/releases/download/v0.7.0/flowmind-mcp-0.7.0.tgz
```

在 FlowMind 里 **设置 → MCP → 复制接入提示词**，粘进任意 Agent 的对话框——它会自己安装、注册、画一张测试图并确认落地。你只需等它说「成功了」。

工具能力：`create_diagram` / `list_documents` / `get_document` / `export_document` / `open_document`。
仅本机 stdio，不开网络端口；只在你指定的图库目录内读写；生成的图会带 **Agent 徽标**，你能一眼分清哪张是机器画的。

## 快捷键（节选）

| 操作 | 快捷键 | 操作 | 快捷键 |
|---|---|---|---|
| 命令面板 | `⌘K` | 智能布局 | `⌘L` |
| 新建 / 打开 / 保存 | `⌘N` / `⌘O` / `⌘S` | 导出 | `⌘E` |
| 撤销 / 重做 | `⌘Z` / `⇧⌘Z` | 原位复制 | `⌘D` |
| 复制为 Mermaid | `⇧⌘C` | 编辑文字 | `Enter` |
| 对齐（左/中/右…） | `⇧⌘L/C/R…` | 缩放 100% / 适应 | `⌘0` / `⌘9` |

## 隐私

- 没有账号，不需要注册
- 没有遥测：不收集行为、不上报崩溃、无分析或广告 SDK
- 数据在本机：图是你的文件；AI Key 只进钥匙串
- AI 可选：只有你主动使用时才发请求，且发往**你自己配置**的模型服务；用 Ollama 完全不出本机
- iCloud 备份由 macOS 负责，我们不运营任何服务器

完整条款见 [隐私协议](https://diqibadao.github.io/flowmind/privacy.html)。

## 路线图

- [x] 图库 / 模板 / 多格式导入导出
- [x] AI Copilot（差异预览后落画布）
- [x] Git 版本历史 + 三色对比 + 回退
- [x] MCP 接入（Agent 直接出图）
- [ ] App Store 上架
- [ ] 行业图元库（云架构 / 网络拓扑 / 线框）
- [ ] 界面中英双语收口

## 本仓库说明

本仓库用于**产品介绍、隐私协议、问题反馈与 MCP 工具分发**。FlowMind App 的源码不在本仓库中。

## 反馈

- [报告 Bug](https://github.com/diqibadao/flowmind/issues/new?template=bug_report.yml) · [提需求](https://github.com/diqibadao/flowmind/issues/new?template=feature_request.yml)

---

<div align="center">

**FlowMind** — 画得清楚，改得回去。

</div>
