// flowmind-mcp 与 flowmind-cli 的共享内核装载器（"一个内核两个入口"）。
// 单一校验源红线：两个入口都只能通过这里拿到 logic.js/mermaid.js 本尊，不许各自 require 出第二套。
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');

// === 内核装载（npm 包布局：同目录；仓库开发布局：../../src/ui/js） ===
function locate(name) {
  const cands = [
    path.join(__dirname, name),
    path.join(__dirname, '..', '..', 'src', 'ui', 'js', name),
  ];
  for (const c of cands) if (fs.existsSync(c)) return c;
  throw new Error('找不到 FlowMind 内核文件 ' + name + '（查找路径：' + cands.join(' / ') + '）');
}
const sandbox = { console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ['logic.js', 'mermaid.js']) {
  const p = locate(f);
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: p });
}
const L = sandbox.FlowMindLogic;
const MermaidIO = sandbox.MermaidIO;

// === 落图目录：Agent 写的图必须落进 App 当前图库 ===
// 解析顺序：FLOWMIND_DOCS_DIR（显式覆盖）→ App 的 settings.json 里用户选的图库
// → 默认 ~/Documents/FlowMind。
// 为什么不读 ~/Documents 就走：沙盒版 App 读不了文稿目录（TCC），而用户选的图库是
// 经面板授权的真实目录，写进去 App 打开就能看见。
function appDataDirs() {
  return [
    // 沙盒版（MAS）容器内
    path.join(os.homedir(), 'Library', 'Containers', 'com.flowmind.desktop', 'Data',
      'Library', 'Application Support', 'com.flowmind.desktop'),
    // 非沙盒版（本地开发/直接运行）
    path.join(os.homedir(), 'Library', 'Application Support', 'com.flowmind.desktop'),
  ];
}

function configuredLibrary() {
  for (const dir of appDataDirs()) {
    try {
      const s = JSON.parse(fs.readFileSync(path.join(dir, 'settings.json'), 'utf8'));
      if (s && typeof s.library_dir === 'string' && s.library_dir.trim()) {
        return s.library_dir.trim();
      }
    } catch (e) { /* 没有设置文件 / 坏档都继续找下一个 */ }
  }
  return null;
}

function docsDir() {
  const explicit = process.env.FLOWMIND_DOCS_DIR;
  if (explicit && explicit.trim()) return path.resolve(explicit);
  const configured = configuredLibrary();
  if (configured) return path.resolve(configured);
  return path.join(os.homedir(), 'Documents', 'FlowMind');
}

function insideDocs(p) {
  const abs = path.resolve(p);
  const root = docsDir();
  return abs === root || abs.startsWith(root + path.sep);
}

function guardPath(raw) {
  const p = path.resolve(String(raw || ''));
  if (!insideDocs(p)) throw new Error('越界路径被拒绝（只许在图库目录内操作）：' + p);
  return p;
}

module.exports = {
  L: L,
  MermaidIO: MermaidIO,
  docsDir: docsDir,
  insideDocs: insideDocs,
  guardPath: guardPath,
  appDataDirs: appDataDirs,
};
