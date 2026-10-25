# flowmind-mcp

FlowMind 的 MCP 服务与命令行工具：让 Claude Code / Codex / Cursor 等 Agent 直接生成**可编辑**的 `.flowmind` 流程图。

## 用法

不需要安装，`npx` 直接从 Release 取：

```
npx -y https://github.com/diqibadao/flowmind-mcp/releases/download/v0.7.0/flowmind-mcp-0.7.0.tgz
```

在 FlowMind App 的「设置 → MCP」里点「复制接入提示词」，粘给 Agent 即可——它会自己注册、自测、报结果。

## 工具

| 工具 | 作用 |
|---|---|
| `create_diagram` | 用 Mermaid 或 FlowMind JSON 生成一张图，落进 App 当前图库 |
| `list_documents` / `get_document` | 列出 / 读取图库里的图 |
| `export_document` | 转成 Mermaid / draw.io / JSON |
| `open_document` | 用 FlowMind 打开某张图，供人验收 |

## 说明

- 仅本机 stdio，不开网络端口
- 只读写 App 图库目录，越界路径直接拒绝
- 校验与 FlowMind App 使用**同一份内核**，不会接受 App 打不开的文件

本仓库只分发工具，不含 FlowMind App 源码。发布流程见 [RELEASE.md](RELEASE.md)。
