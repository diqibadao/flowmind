#!/usr/bin/env node
// flowmind-mcp — FlowMind 的 Agent 接口（npm 包分发）
//
// 定位：不是"FlowMind 帮 AI 写代码"，而是 **AI 帮 FlowMind 画图**。
// Agent（Claude Code / Codex / Cursor）一句话生图 → 落到 App 当前的图库目录 → 图库立刻可见 → 点开可编辑。
//
// 红线：
//  · 仅本机 stdio，不开任何网络端口；
//  · 只在图库目录内读写（App 设置里的 library_dir；env FLOWMIND_DOCS_DIR 覆盖），
//    路径一律 resolve 后核"仍在目录内"，越界显式拒绝；
//  · 校验只走 logic.js / mermaid.js **同一份源码**（与 App 前端同一个文件）——
//    MCP 不持有第二套判据。
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const KERNEL = require('./kernel.js');
const L = KERNEL.L;
const MermaidIO = KERNEL.MermaidIO;
const docsDir = KERNEL.docsDir;
const guardPath = KERNEL.guardPath;

// === 目录边界（内核经 kernel.js 单源装载） ===

// Agent 未读角标簿（App 图库读它；两处路径解析必须同文件）
function inboxFile() {
  if (process.env.FLOWMIND_INBOX) return process.env.FLOWMIND_INBOX;
  // 簿记放图库目录：App 容器被 macOS 保护，跨进程读不了也写不进（实测 EPERM）
  return path.join(docsDir(), '.flowmind-agent-inbox.json');
}
function markUnread(p) {
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(inboxFile(), 'utf8')); if (!Array.isArray(arr)) arr = []; } catch (e) { /* 首次/坏档都按空表起步 */ }
  if (!arr.includes(p)) arr.push(p);
  try { fs.mkdirSync(path.dirname(inboxFile()), { recursive: true }); fs.writeFileSync(inboxFile(), JSON.stringify(arr, null, 2)); } catch (e) {
    // 合法沉默：角标是锦上添花，写入失败不影响图已落盘的事实（批3-24 口径，理由写在这）
  }
}

function safeStem(title) {
  const t = String(title || 'agent 图').replace(/[\/\\:*?"<>|\u0000-\u001f]/g, ' ').trim().slice(0, 60);
  return t || 'agent 图';
}
function uniquePath(stem) {
  const root = docsDir();
  let cand = path.join(root, stem + '.flowmind');
  for (let i = 2; fs.existsSync(cand) && i < 100; i++) cand = path.join(root, stem + '-' + i + '.flowmind');
  return cand;
}

// === 工具实现（返回 {text, isError?}） ===
const tools = {
  create_diagram: function (a) {
    // 版本握手：先确认 App 能读我们写的格式，再动手
    const k = KERNEL.checkContract();
    if (k.ok === false) return { text: k.message, isError: true };
    let doc = null, outcome = null;
    if (a && typeof a.mermaid === 'string' && a.mermaid.trim()) {
      const parsed = MermaidIO.mermaidToDoc(a.mermaid);
      outcome = L.mermaidImportOutcome(a.mermaid, parsed);
      if (outcome.kind !== 'ok') return { text: 'Mermaid 校验失败：' + outcome.message, isError: true };
      doc = parsed;
      if (a.title) doc.title = String(a.title);
    } else if (a && a.docJson && typeof a.docJson === 'object') {
      const res = L.sanitizeDoc(a.docJson);
      doc = res.doc;
      if (!doc.nodes.length && !doc.edges.length) return { text: 'docJson 里没有任何有效节点/边，拒收（不落半张图）', isError: true };
    } else {
      return { text: '需要 mermaid 文本或 docJson 之一（参数名：mermaid / docJson）', isError: true };
    }
    doc.source = 'agent';
    doc.sourceAgent = String((a && a.agent) || 'mcp');
    doc.modifiedAt = new Date().toISOString();
    const p = uniquePath(safeStem(doc.title));
    fs.mkdirSync(docsDir(), { recursive: true });
    fs.writeFileSync(p, L.serializeFlowDoc(doc));
    markUnread(p);
    return { text: '已创建：' + p + '（' + doc.nodes.length + ' 节点 / ' + doc.edges.length + ' 边）。在 FlowMind 图库可见（Agent 徽标 + 未读点）。' };
  },

  list_documents: function () {
    const root = docsDir();
    const out = [];
    (function walk(dir, depth) {
      if (depth > 3 || out.length >= 2000) return;
      let ents;
      try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
      ents.forEach(function (en) {
        const full = path.join(dir, en.name);
        if (en.isDirectory()) return walk(full, depth + 1);
        if (!en.name.endsWith('.flowmind')) return;
        let st = null; try { st = fs.statSync(full); } catch (e) { /* 单条元数据坏不拖垮整表 */ }
        out.push({ name: en.name, path: full, size: st ? st.size : 0, modifiedAt: st ? st.mtime.toISOString() : '' });
      });
    })(root, 1);
    if (!out.length) return { text: '文档目录为空：' + root };
    return { text: JSON.stringify(out, null, 2) };
  },

  get_document: function (a) {
    const p = guardPath(a && a.path);
    if (!fs.existsSync(p)) return { text: '文件不存在：' + p, isError: true };
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    const res = L.sanitizeDoc(raw);
    return { text: JSON.stringify(res.doc, null, 2) };
  },

  export_document: function (a) {
    const p = guardPath(a && a.path);
    const fmt = String((a && a.format) || 'mermaid');
    if (!fs.existsSync(p)) return { text: '文件不存在：' + p, isError: true };
    const doc = L.sanitizeDoc(JSON.parse(fs.readFileSync(p, 'utf8'))).doc;
    let text, ext;
    if (fmt === 'mermaid') { text = MermaidIO.docToMermaid(doc); ext = '.mmd'; }
    else if (fmt === 'drawio') { text = L.exportDrawio(doc); ext = '.drawio'; }
    else if (fmt === 'json') { text = L.serializeFlowDoc(doc); ext = '.flowmind.json'; }
    else return { text: 'format 只认 mermaid | drawio | json', isError: true };
    let written = null;
    if (a && a.outPath) {
      const out = guardPath(a.outPath);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, text);
      written = out;
    }
    const head = written ? '已写到 ' + written + '（' + text.length + ' 字符）。' : '';
    return { text: head + '\n' + (text.length > 200000 ? text.slice(0, 200000) + '\n…（截断，用 outPath 落盘取全文）' : text) };
  },

  open_document: function (a) {
    const p = guardPath(a && a.path);
    if (!fs.existsSync(p)) return { text: '文件不存在：' + p, isError: true };
    cp.spawn('open', ['-a', 'FlowMind', p], function () {});
    return { text: '已请求 macOS 用 FlowMind 打开：' + p };
  },
};

const TOOL_DEFS = [
  { name: 'create_diagram', description: '把 Mermaid 文本或 FlowMind docJson 落成一张可编辑的 .flowmind 图（落进文档目录、图库立即可见，带 Agent 来源徽标）。校验走 FlowMind 同一份内核，不合格拒收并说明原因。', inputSchema: { type: 'object', properties: { mermaid: { type: 'string', description: 'Mermaid flowchart 文本' }, docJson: { type: 'object', description: 'FlowMind 文档对象（nodes/edges…）' }, title: { type: 'string' }, agent: { type: 'string', description: '调用方名字，写进图元数据' } } } },
  { name: 'list_documents', description: '列出文档目录里全部 .flowmind 图（名称/路径/大小/更新时间）。', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_document', description: '读一张图的完整 FlowMind JSON（经 sanitizeDoc 校验）。', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
  { name: 'export_document', description: '把图转成 mermaid / drawio / json 文本；给 outPath 则同时落盘（只许文档目录内）。', inputSchema: { type: 'object', properties: { path: { type: 'string' }, format: { type: 'string', enum: ['mermaid', 'drawio', 'json'] }, outPath: { type: 'string' } }, required: ['path'] } },
  { name: 'open_document', description: '让 macOS 用 FlowMind App 打开一张图（用户即时验收）。', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
];

// === MCP 协议：JSON-RPC 2.0 over stdio（Content-Length 帧，零依赖手写） ===
function send(msg) {
  const body = JSON.stringify(msg);
  process.stdout.write('Content-Length: ' + Buffer.byteLength(body, 'utf8') + '\r\n\r\n' + body);
}
function onMessage(msg) {
  const id = msg.id;
  const method = msg.method;
  if (method === 'initialize') {
    return send({ jsonrpc: '2.0', id: id, result: {
      protocolVersion: (msg.params && msg.params.protocolVersion) || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'flowmind-mcp', version: '0.5.8' },
    }});
  }
  if (method === 'ping') return send({ jsonrpc: '2.0', id: id, result: {} });
  if (method === 'tools/list') return send({ jsonrpc: '2.0', id: id, result: { tools: TOOL_DEFS } });
  if (method === 'tools/call') {
    const name = msg.params && msg.params.name;
    const fn = tools[name];
    if (!fn) return send({ jsonrpc: '2.0', id: id, error: { code: -32601, message: '未知工具：' + name } });
    let res;
    try { res = fn(msg.params.arguments || {}); }
    catch (e) { res = { text: '执行失败：' + (e && e.message ? e.message : String(e)), isError: true }; }
    return send({ jsonrpc: '2.0', id: id, result: { content: [{ type: 'text', text: res.text }], isError: !!res.isError } });
  }
  if (id !== undefined) send({ jsonrpc: '2.0', id: id, error: { code: -32601, message: '不支持的方法：' + method } });
}

let buf = Buffer.alloc(0);
process.stdin.on('data', function (chunk) {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headEnd = buf.indexOf('\r\n\r\n');
    if (headEnd < 0) return;
    const head = buf.slice(0, headEnd).toString('utf8');
    const m = /Content-Length:\s*(\d+)/i.exec(head);
    if (!m) { buf = buf.slice(headEnd + 4); continue; }
    const len = parseInt(m[1], 10);
    if (buf.length < headEnd + 4 + len) return;
    const body = buf.slice(headEnd + 4, headEnd + 4 + len).toString('utf8');
    buf = buf.slice(headEnd + 4 + len);
    let msg; try { msg = JSON.parse(body); } catch (e) { continue; }
    onMessage(msg);
  }
});
process.stdin.on('end', function () { process.exit(0); });
