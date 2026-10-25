# flowmind-mcp 发布说明（GitHub Release 分发）

App 里的「接入提示词」会让 Agent 执行：

```
npx -y https://github.com/<你的仓库>/releases/download/v<版本>/flowmind-mcp-<版本>.tgz
```

所以发一版 = 打一个 tarball + 挂到 GitHub Release 上。不需要 npm 账号。

## 一、版本对齐（红线）

- `packages/flowmind-mcp/package.json` 的 `version` **必须等于** App 的版本号
- 顺序：**先发工具，再发 App**。反了的话，App 生成的下载链接指向一个还不存在的附件，用户的 Agent 会 404

## 二、发一版

```bash
cd packages/flowmind-mcp   # 主仓库内路径
npm pack                     # 产出 flowmind-mcp-<版本>.tgz，prepack 会自动同步内核
# 然后把包里的 3 个源码文件同步到本仓库 mcp/ 目录并提交
```

然后：

1. GitHub 仓库 → Releases → Draft a new release
2. Tag 填 `v<版本>`（与 package.json 一致），标题随意
3. 把刚生成的 `.tgz` 拖进附件
4. Publish

## 三、把地址接到 App 上

`src-tauri/src/ai.rs` 顶部只有一个常量：

```rust
const MCP_DIST_BASE: &str = "https://github.com/<owner>/<repo>/releases/download";
```

换成你的仓库地址即可，提示词会自动拼成
`{BASE}/v{版本}/flowmind-mcp-{版本}.tgz`。

## 四、发完自测

```bash
npx -y https://github.com/<你的仓库>/releases/download/v0.7.0/flowmind-mcp-0.7.0.tgz --version
```

能打印版本号，就说明用户侧那条命令跑得通。

## 五、将来上 npm（可选）

npm 账号就绪后，把同一份 tarball `npm publish` 上去，再把提示词形态换成
`npx -y flowmind-mcp@<版本>` 即可 —— 用户无感。
