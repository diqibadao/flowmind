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
  // 测试与特殊部署用：显式指定 App 数据目录
  if (process.env.FLOWMIND_APPDATA) return [process.env.FLOWMIND_APPDATA];
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

// === 版本握手 ===
// App 启动时把 {appVersion, docSchema} 写进 app_data_dir/mcp_contract.json。
// 工具写文件前先核对：App 的文档格式版本与本工具支持的版本不一致就明确拒绝，
// 而不是写出一份 App 打不开（或读歪）的图。
const DOC_SCHEMA = 1;

function readContract() {
  for (const dir of appDataDirs()) {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, 'mcp_contract.json'), 'utf8'));
    } catch (e) { /* 没有就继续找下一个布局 */ }
  }
  return null;
}

function checkContract() {
  const c = readContract();
  if (!c) return { ok: true, appVersion: null, note: '没读到 FlowMind 的版本契约（App 可能还没运行过），按兼容处理' };
  const theirs = Number(c.docSchema);
  if (!Number.isFinite(theirs)) return { ok: true, appVersion: c.appVersion || null, note: '契约文件缺 docSchema，按兼容处理' };
  if (theirs !== DOC_SCHEMA) {
    return {
      ok: false,
      appVersion: c.appVersion || null,
      message: '版本不匹配：FlowMind App 的文档格式是 v' + theirs + '，本工具只支持 v' + DOC_SCHEMA +
        '。请升级 FlowMind 或改用配套版本的工具，避免写出 App 打不开的图。',
    };
  }
  return { ok: true, appVersion: c.appVersion || null, note: null };
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
  DOC_SCHEMA: DOC_SCHEMA,
  checkContract: checkContract,
};
