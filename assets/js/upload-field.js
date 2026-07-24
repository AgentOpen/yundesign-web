/* 通用附件上传字段 —— 支持拖拽（文件 / 整个文件夹）/ 点击 / 多文件 / 删除
 * - 拖入整个文件夹时保留目录结构（path 字段），树状展示，不打散层级
 * 用法：
 *   const up = UploadField.create({ initial: [], hint: '拖拽平面图到此' });
 *   container.appendChild(up.el);
 *   ... 提交时： up.getFiles()  // → [{name, type, path}]
 * 复用：UploadField.readDataTransfer(dataTransfer) -> Promise<[{name,type,path}]>
 */
(function (global) {
  const ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️', model: '🧊', vid: '🎬', doc: '📎' };
  function typeFromName(name) {
    const ext = (String(name).split('.').pop() || '').toLowerCase();
    if (ext === 'dwg' || ext === 'dxf') return 'dwg';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].indexOf(ext) >= 0) return 'img';
    if (['xls', 'xlsx', 'csv'].indexOf(ext) >= 0) return 'xls';
    if (['zip', 'rar', '7z'].indexOf(ext) >= 0) return 'zip';
    if (['max', 'skp', 'fbx', 'obj', '3ds', '3dm', 'blend', 'kjl', '3d'].indexOf(ext) >= 0) return 'model';
    if (['mp4', 'mov', 'webm', 'avi'].indexOf(ext) >= 0) return 'vid';
    if (ext === 'pdf') return 'pdf';
    return 'doc';
  }
  let _seq = 0;
  function normItem(f) {
    return { name: f.name, type: f.type || typeFromName(f.name), path: f.path || f.name, _id: ++_seq };
  }

  // ---- 目录遍历（拖拽 webkitGetAsEntry）----
  function readAllEntries(reader) {
    return new Promise(res => {
      const acc = [];
      (function step() {
        reader.readEntries(es => { if (!es.length) { res(acc); return; } acc.push.apply(acc, es); step(); }, () => res(acc));
      })();
    });
  }
  async function walkEntry(entry, prefix) {
    const out = [];
    if (entry.isFile) {
      await new Promise(r => entry.file(f => { out.push(normItem({ name: entry.name, path: (prefix ? prefix + '/' : '') + entry.name })); r(); }, () => r()));
    } else if (entry.isDirectory) {
      const es = await readAllEntries(entry.createReader());
      for (const e of es) { const sub = await walkEntry(e, (prefix ? prefix + '/' : '') + entry.name); out.push.apply(out, sub); }
    }
    return out;
  }
  // 从 DataTransfer 读取拖入内容（保留文件夹结构）
  async function readDataTransfer(dt) {
    let collected = [];
    const items = dt && dt.items;
    if (items && items.length && items[0].webkitGetAsEntry) {
      const entries = [];
      for (let i = 0; i < items.length; i++) { const en = items[i].webkitGetAsEntry && items[i].webkitGetAsEntry(); if (en) entries.push(en); }
      for (const en of entries) { const sub = await walkEntry(en, ''); collected.push.apply(collected, sub); }
    }
    if (!collected.length && dt && dt.files) {
      collected = Array.from(dt.files).map(f => normItem({ name: f.name, path: f.webkitRelativePath || f.name }));
    }
    return collected;
  }

  function ensureStyle() {
    if (document.getElementById('uf-style')) return;
    const s = document.createElement('style');
    s.id = 'uf-style';
    s.textContent = `
      .uf-drop { border: 2px dashed var(--divider); border-radius: 8px; padding: 14px 12px; text-align: center; color: var(--text-secondary); cursor: pointer; transition: var(--transition-fast); }
      .uf-drop:hover { border-color: var(--brand-primary); background: var(--brand-primary-bg); }
      .uf-drop.drag { border-color: var(--brand-primary); background: var(--brand-primary-bg); color: var(--brand-primary); }
      .uf-drop .uf-ico { font-size: 20px; }
      .uf-drop .uf-sub { font-size: 11px; margin-top: 2px; opacity: .8; }
      .uf-drop .uf-actions { margin-top: 8px; display: flex; gap: 8px; justify-content: center; }
      .uf-btn { border: 1px solid var(--border); background: #fff; border-radius: 6px; padding: 3px 10px; font-size: 12px; cursor: pointer; color: var(--text-secondary); }
      .uf-btn:hover { border-color: var(--brand-primary); color: var(--brand-primary); }
      .uf-list { margin-top: 8px; min-height: 18px; }
      .uf-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .uf-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--info-bg); color: var(--info); border-radius: 6px; padding: 3px 8px; font-size: 12px; }
      .uf-chip .x { cursor: pointer; font-weight: 700; margin-left: 2px; }
      .uf-tree { border: 1px solid var(--divider); border-radius: 8px; padding: 8px 10px; background: var(--bg-page); }
      .uf-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; padding: 2px 0; color: var(--text-primary); }
      .uf-row .uf-line { display: flex; align-items: center; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .uf-row .uf-pre { font-family: Consolas, Menlo, Monaco, "Courier New", monospace; white-space: pre; color: var(--text-placeholder); flex: none; }
      .uf-row .uf-x { cursor: pointer; font-weight: 700; color: var(--text-placeholder); padding: 0 4px; flex: none; }
      .uf-row .uf-x:hover { color: var(--danger); }
    `;
    document.head.appendChild(s);
  }

  function buildTree(files) {
    const root = { dirs: {}, order: [], files: [] };
    files.forEach(f => {
      const parts = (f.path || f.name).split('/');
      let node = root;
      for (let i = 0; i < parts.length - 1; i++) {
        const d = parts[i];
        if (!node.dirs[d]) { node.dirs[d] = { dirs: {}, order: [], files: [] }; node.order.push(d); }
        node = node.dirs[d];
      }
      node.files.push(f);
    });
    return root;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // 生成 ├── / └── / │ 结构；同层先文件后文件夹
  function renderTree(files) {
    const root = buildTree(files);
    let h = '';
    function walk(node, prefix) {
      const entries = [];
      node.files.forEach(f => entries.push({ dir: false, file: f }));
      node.order.forEach(d => entries.push({ dir: true, name: d, node: node.dirs[d] }));
      entries.forEach((e, i) => {
        const last = i === entries.length - 1;
        const branch = prefix + (last ? '└── ' : '├── ');
        if (e.dir) {
          h += `<div class="uf-row"><span class="uf-line"><span class="uf-pre">${branch}</span>📂 ${esc(e.name)}/</span></div>`;
          walk(e.node, prefix + (last ? '    ' : '│   '));
        } else {
          h += `<div class="uf-row"><span class="uf-line"><span class="uf-pre">${branch}</span>${ICON[e.file.type] || '📎'} ${esc(e.file.name)}</span><span class="uf-x" data-id="${e.file._id}">×</span></div>`;
        }
      });
    }
    walk(root, '');
    return h;
  }

  function create(opts) {
    opts = opts || {};
    ensureStyle();
    const files = (opts.initial || []).map(normItem);
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="uf-drop"><div class="uf-ico">📎</div><div>${opts.hint || '拖拽文件或整个文件夹到此'}</div>
        <div class="uf-sub">支持文件夹（保留目录结构）· CAD / 图片 / 模型 / Excel / PDF / ZIP</div>
        <div class="uf-actions"><button type="button" class="uf-btn" data-pick="file">选择文件</button><button type="button" class="uf-btn" data-pick="dir">📁 选择文件夹</button></div>
      </div>
      <input type="file" multiple style="display:none;" data-inp="file">
      <input type="file" multiple webkitdirectory directory style="display:none;" data-inp="dir">
      <div class="uf-list"></div>`;
    const drop = wrap.querySelector('.uf-drop');
    const fileInp = wrap.querySelector('[data-inp="file"]');
    const dirInp = wrap.querySelector('[data-inp="dir"]');
    const list = wrap.querySelector('.uf-list');

    function renderList() {
      if (!files.length) { list.innerHTML = '<span class="text-placeholder text-sm">尚未添加附件</span>'; return; }
      const hasFolders = files.some(f => (f.path || '').indexOf('/') >= 0);
      if (hasFolders) {
        list.innerHTML = `<div class="uf-tree">${renderTree(files)}</div>`;
      } else {
        list.innerHTML = `<div class="uf-chips">${files.map(f => `<span class="uf-chip">${ICON[f.type] || '📎'} ${f.name}<span class="x" data-id="${f._id}">×</span></span>`).join('')}</div>`;
      }
      list.querySelectorAll('[data-id]').forEach(x => x.addEventListener('click', () => {
        const idx = files.findIndex(f => String(f._id) === x.dataset.id);
        if (idx >= 0) { files.splice(idx, 1); renderList(); if (opts.onChange) opts.onChange(files); }
      }));
    }
    function addItems(items) {
      if (!items || !items.length) return;
      items.forEach(it => files.push(it._id ? it : normItem(it)));
      renderList();
      if (opts.onChange) opts.onChange(files);
      if (global.toast) toast(`已添加 ${items.length} 个文件`, 'success');
    }
    function addFileList(fl, useRelative) {
      const arr = Array.from(fl || []).map(f => normItem({ name: f.name, path: useRelative && f.webkitRelativePath ? f.webkitRelativePath : f.name }));
      addItems(arr);
    }

    drop.addEventListener('click', e => { if (e.target.closest('[data-pick]')) return; fileInp.click(); });
    wrap.querySelector('[data-pick="file"]').addEventListener('click', e => { e.stopPropagation(); fileInp.click(); });
    wrap.querySelector('[data-pick="dir"]').addEventListener('click', e => { e.stopPropagation(); dirInp.click(); });
    fileInp.addEventListener('change', e => { addFileList(e.target.files, false); e.target.value = ''; });
    dirInp.addEventListener('change', e => { addFileList(e.target.files, true); e.target.value = ''; });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); }));
    ['dragleave', 'dragend'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', async e => {
      e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag');
      const items = await readDataTransfer(e.dataTransfer);
      addItems(items);
    });
    renderList();
    return {
      el: wrap,
      getFiles: () => files.map(f => ({ name: f.name, type: f.type, path: f.path })),
      clear: () => { files.length = 0; renderList(); },
      addManual: (name, type) => { if (!name) return; files.push(normItem({ name: name, type: type })); renderList(); }
    };
  }
  global.UploadField = { create, typeFromName, readDataTransfer };
})(window);
