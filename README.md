<div align="center">

<img src="assets/logo.png" width="88" alt="FlowMind">

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

## 七个核心能力

| | 能力 | 说明 |
|---|---|---|
| 🗂 | **个人图库** | 所有图集中管理：缩略图网格、搜索、收藏、重命名、回收站；还有 10+ 套模板和「我的模板」 |
| 💾 | **本地存储** | 图就是普通文件，放在你指定的文件夹里；Finder 可见、可备份、可发人 |
| ☁️ | **iCloud 备份** | 可选开启，保存后自动复制一份到 iCloud Drive；由 Apple 负责传输与加密，断网照常保存 |
| 🤖 | **AI 接入** | 内置 Copilot：生成、改图、优化、生成文档；支持 OpenAI 兼容接口或本机 Ollama，Key 存系统钥匙串 |
| 🔌 | **MCP / Agent** | Claude Code、Codex、Cursor 等可直接生成**可编辑**的图，落进你的图库并打上 Agent 标记 |
| 🕘 | **Git 版本历史** | 每次保存自动留档，手动版本永久保留，可给版本写备注 |
| 🔍 | **版本对比与回退** | 三色差异（新增 / 删除 / 修改），连线与文字都参与比对，一键恢复到任意版本 |

## 还支持

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
