<div align="center">

<img src="assets/logo.png" width="88" alt="FlowMind">

# FlowMind

**让流程画得对，而不是只画得出来。**

结构化流程图与思维导图工具 · macOS 原生 · 本地优先

[![Platform](https://img.shields.io/badge/platform-macOS%2011%2B-000000?style=flat-square&logo=apple&logoColor=white)](#)
[![App Store](https://img.shields.io/badge/App%20Store-即将上架-0A84FF?style=flat-square&logo=appstore&logoColor=white)](#)
[![Privacy](https://img.shields.io/badge/数据-不出本机-16A34A?style=flat-square)](#隐私承诺)
[![Telemetry](https://img.shields.io/badge/遥测-无-16A34A?style=flat-square)](#隐私承诺)
[![MCP](https://img.shields.io/badge/MCP-Agent%20可调用-4F55E8?style=flat-square)](#让-agent-帮你画)

[产品主页](https://diqibadao.github.io/flowmind/) · [隐私协议](https://diqibadao.github.io/flowmind/privacy.html) · [支持与反馈](https://diqibadao.github.io/flowmind/support.html)

</div>

---

## 这是什么

FlowMind 是一个专注「**结构**」的绘图工具。它不追求手绘般的自由，而是把每一根连线、每一个锚点、每一条泳道都当成真正的对象来管理——所以你画出来的图能改、能对齐、能重排，而不是一张截图。

三件事让它和常见画图工具不同：

| | 常见做法 | FlowMind |
|---|---|---|
| **图元** | 图片或自由曲线 | 结构化对象：正交连线、锚点吸附、泳道、ER 表、思维导图 |
| **文件** | 存进 App 私有数据库 | 普通文件，落在**你自己选的文件夹**里，Finder 可见、可 git、可发人 |
| **AI** | 生成一张图替换掉你的 | 先给**差异预览**，你确认后才改动画布，并且每一步都可回滚 |

## 功能全景

### 画布
- 流程图、思维导图、泳道图、ER 图、鱼骨图、组织架构
- 19 种节点类型：开始/结束、判断、输入输出、文档、数据库、LLM、Agent、便签、图片…
- 正交连线自动绕行、锚点吸附、箭头与线型可配、连线标签
- 网格吸附、智能参考线、多选对齐/分布/等距、层级调整、节点锁定、方向键微调
- 无限撤销重做、自动保存、崩溃后草稿恢复、多标签

### 布局
- 三种自动布局：分层（默认）、树状、力导向
- 一键整理整张图，也可只整理选中部分

### 图库与模板
- 缩略图网格、搜索、收藏、重命名、回收站
- 10+ 套模板：微服务架构、数据湖仓、RAG 问答、订单履约泳道、状态机、ER、用户旅程、学科导图…
- 「我的模板」：把任何一张图存成模板

### AI（可选）
- 单一 Copilot 面板：一句话生成、改图、优化、生成文档
- **差异预览**：改动先给你看，确认才落到画布
- 支持 OpenAI 兼容接口，或本机 Ollama（数据不出本机）
- Key 只存在 macOS 钥匙串

### 版本历史
- 每次保存自动留档，手动版本永久保留
- 三色差异对比（新增/删除/修改），连线与文字都参与比对
- 一键恢复到任意版本

### 格式
- 导入导出：Mermaid、draw.io、Markdown、OPML、CSV、FreeMind
- 导出图片：SVG、PNG、PDF（整幅画布，样式与字体一致）

### Agent 接入
- 内置 MCP 工具，Claude Code / Codex / Cursor 等可直接生成**可编辑**的图

## 快捷键（节选）

| 操作 | 快捷键 | 操作 | 快捷键 |
|---|---|---|---|
| 命令面板 | `⌘K` | 智能布局 | `⌘L` |
| 新建 / 打开 / 保存 | `⌘N` / `⌘O` / `⌘S` | 导出 | `⌘E` |
| 撤销 / 重做 | `⌘Z` / `⇧⌘Z` | 原位复制 | `⌘D` |
| 复制为 Mermaid | `⇧⌘C` | 编辑文字 | `Enter` |
| 对齐（左/中/右…） | `⇧⌘L/C/R…` | 缩放 100% / 适应 | `⌘0` / `⌘9` |

## 让 Agent 帮你画

```bash
npx -y https://github.com/diqibadao/flowmind/releases/download/v0.7.0/flowmind-mcp-0.7.0.tgz
```

在 FlowMind 里打开 **设置 → MCP**，点「复制接入提示词」，粘进任意 Agent 的对话框——它会自己安装、注册、画一张测试图并确认落地。你只需要等它说「成功了」。

工具能力：`create_diagram` / `list_documents` / `get_document` / `export_document` / `open_document`。
仅本机 stdio，不开网络端口；只在你指定的图库目录内读写。

## 隐私承诺

- **没有账号**，不需要注册就能用
- **没有遥测**：不收集使用行为、不上报崩溃、不接入任何分析或广告 SDK
- **数据在本机**：图是你的文件；设置与草稿在应用沙盒目录；AI Key 在钥匙串
- **AI 可选**：只有你主动使用时，内容才会发往*你自己配置*的模型服务；用 Ollama 则完全不出本机
- **iCloud 备份可选**（默认关闭）：由 macOS 负责传输与加密，我们没有服务器

完整条款见 [隐私协议](https://diqibadao.github.io/flowmind/privacy.html)。

## 路线图

- [x] 结构化画布、智能布局、版本历史、MCP 接入
- [ ] App Store 上架
- [ ] 更多行业图元库（云架构 / 网络拓扑 / 线框）
- [ ] 界面中英双语收口

## 本仓库说明

本仓库用于**产品介绍、隐私协议、问题反馈与 MCP 工具分发**。
FlowMind App 的源码不在本仓库中。

## 反馈

- 发现 Bug：[提 Issue](https://github.com/diqibadao/flowmind/issues/new?template=bug_report.yml)
- 想要功能：[提需求](https://github.com/diqibadao/flowmind/issues/new?template=feature_request.yml)

---

<div align="center">

**FlowMind** — 人专注逻辑，工具负责排版。

</div>
