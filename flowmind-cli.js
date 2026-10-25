#!/usr/bin/env node
// flowmind-cli — 图即代码的命令行入口（v0.5.8 C4）
//
// 与 flowmind-mcp **一个内核两个入口**：都经 kernel.js 装载同一份 logic.js/mermaid.js，
// Git pre-commit / CI 里批量转格式走这里，Agent 对话生图走 MCP。
// 范围口径（如实）：文本三格式 mermaid | drawio | json；png/svg 是栅格活，住在 App 的
// webview 渲染管线里，CLI 不做（要做得拖整个渲染层，超出一行命令的性价比）。
'use strict';
const fs = require('fs');
const path = require('path');
const KERNEL = require('./kernel.js');
const L = KERNEL.L;
const MermaidIO = KERNEL.MermaidIO;

function usage() {
  console.log([
    '用法：',
    '  flowmind export <图.flowmind> --format=mermaid|drawio|json [--out 路径]   转出（缺省打印到 stdout）',
    '  flowmind import <图.mmd|图.drawio> [--out 图.flowmind] [--title 名]        转成 .flowmind（只落 FlowMind 文档目录）',
    '  flowmind validate <图.flowmind>                                            走 App 同一份 sanitizeDoc 校验',
    '',
    '安全：路径只许在文档目录内（默认 ~/Documents；FLOWMIND_DOCS_DIR 可覆盖）。',
    'png/svg 导出请在 FlowMind App 里做（CLI 只搬文本格式）。',
  ].join('\n'));
}

function readFlowDoc(p) {
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  return L.sanitizeDoc(raw).doc;
}

function pickFormat(fmt) {
  if (fmt === 'mermaid' || fmt === 'drawio' || fmt === 'json') return fmt;
  throw new Error('format 只认 mermaid | drawio | json（png/svg 走 App）：给了 ' + fmt);
}

function main(argv) {
  const cmd = argv[0];
  const file = argv[1];
  if (!cmd || cmd === '-h' || cmd === '--help') { usage(); return file === '-h' ? 0 : 2; }
  // --k=v 与 --k v 两种写法都收（首跑冒烟只认 = 号，--title 冒烟 直接丢了值）
  const opts = {};
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const m = /^--(\w+)(?:=(.*))?$/.exec(rest[i]);
    if (!m) continue;
    if (m[2] !== undefined) opts[m[1]] = m[2];
    else if (i + 1 < rest.length && !rest[i + 1].startsWith('--')) opts[m[1]] = rest[++i];
    else opts[m[1]] = true;
  }
  if (!file) { usage(); return 2; }
  let p;
  try { p = KERNEL.guardPath(file); } catch (e) { console.error(String(e.message)); return 2; }
  if (cmd === 'export') {
    if (!fs.existsSync(p)) { console.error('文件不存在：' + p); return 2; }
    let fmt;
    try { fmt = pickFormat(opts.format || 'mermaid'); } catch (e) { console.error(String(e.message)); return 2; }
    const doc = readFlowDoc(p);
    const text = fmt === 'mermaid' ? MermaidIO.docToMermaid(doc)
      : fmt === 'drawio' ? L.exportDrawio(doc) : L.serializeFlowDoc(doc);
    if (opts.out) {
      const out = KERNEL.guardPath(opts.out);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, text);
      console.log('已写出 ' + out);
    } else {
      process.stdout.write(text);
    }
    return 0;
  }
  if (cmd === 'import') {
    if (!fs.existsSync(p)) { console.error('文件不存在：' + p); return 2; }
    const text = fs.readFileSync(p, 'utf8');
    let doc, notes = '';
    if (/\.mmd$|\.mermaid$/i.test(p) || /^\s*(flowchart|graph)\s/m.test(text)) {
      const parsed = MermaidIO.mermaidToDoc(text);
      const outcome = L.mermaidImportOutcome(text, parsed);
      if (outcome.kind !== 'ok') { console.error('Mermaid 校验失败：' + outcome.message); return 2; }
      doc = parsed;
    } else if (/\.drawio$/i.test(p)) {
      const got = L.importDrawio(text);
      if (!got) { console.error(L.DRAWIO.labels.notDrawio); return 2; }
      if (got.error) { console.error(got.error === 'compressed' ? L.DRAWIO.labels.compressed : L.DRAWIO.labels.empty); return 2; }
      doc = got.doc;
      notes = '（' + got.degraded.length + ' 形状降级，' + got.droppedEdges + ' 悬空边丢弃）';
    } else {
      console.error('import 只认 .mmd/.mermaid/.drawio 或含 flowchart 头的文本');
      return 2;
    }
    if (opts.title) doc.title = String(opts.title);
    let outPath;
    if (opts.out) outPath = KERNEL.guardPath(String(opts.out));
    else {
      const stem = String(doc.title || path.basename(p)).replace(/[\/\\:*?"<>|\u0000-\u001f]/g, ' ').trim().slice(0, 60) || '导入图';
      outPath = path.join(KERNEL.docsDir(), stem + '.flowmind');
      for (let i = 2, guard = 1; fs.existsSync(outPath); i++) { outPath = path.join(KERNEL.docsDir(), stem + '-' + i + '.flowmind'); if (++guard > 99) { console.error('同名文件太多，用 --out 指定'); return 2; } }
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, L.serializeFlowDoc(doc));
    console.log('已生成 ' + outPath + '（' + doc.nodes.length + ' 节点 / ' + doc.edges.length + ' 边）' + notes);
    return 0;
  }
  if (cmd === 'validate') {
    if (!fs.existsSync(p)) { console.error('文件不存在：' + p); return 2; }
    const res = L.sanitizeDoc(JSON.parse(fs.readFileSync(p, 'utf8')));
    console.log('可打开：' + res.doc.nodes.length + ' 节点 / ' + res.doc.edges.length + ' 边，修复 ' + res.issues.length + ' 处');
    res.issues.forEach(function (i) { console.log('  - ' + i); });
    return 0;
  }
  usage();
  return 2;
}

process.exit(main(process.argv.slice(2)));
