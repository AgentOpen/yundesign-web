/* 通用附件上传字段 —— 支持拖拽 / 点击 / 多文件 / 删除
 * 用法：
 *   const up = UploadField.create({ initial: [], hint: '拖拽平面图到此' });
 *   container.appendChild(up.el);
 *   ... 提交时： up.getFiles()  // → [{name, type}]
 */
(function (global) {
  const ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️' };
  function typeFromName(name) {
    const ext = (String(name).split('.').pop() || '').toLowerCase();
    if (ext === 'dwg' || ext === 'dxf') return 'dwg';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].indexOf(ext) >= 0) return 'img';
    if (['xls', 'xlsx', 'csv'].indexOf(ext) >= 0) return 'xls';
    if (['zip', 'rar', '7z'].indexOf(ext) >= 0) return 'zip';
    return 'pdf';
  }
  function ensureStyle() {
    if (document.getElementById('uf-style')) return;
    const s = document.createElement('style');
    s.id = 'uf-style';
    s.textContent = `
      .uf-drop { border: 2px dashed var(--divider); border-radius: 8px; padding: 16px 12px; text-align: center; color: var(--text-secondary); cursor: pointer; transition: var(--transition-fast); }
      .uf-drop:hover { border-color: var(--brand-primary); background: var(--brand-primary-bg); }
      .uf-drop.drag { border-color: var(--brand-primary); background: var(--brand-primary-bg); color: var(--brand-primary); }
      .uf-drop .uf-ico { font-size: 20px; }
      .uf-drop .uf-sub { font-size: 11px; margin-top: 2px; opacity: .8; }
      .uf-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; min-height: 18px; }
      .uf-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--info-bg); color: var(--info); border-radius: 6px; padding: 3px 8px; font-size: 12px; }
      .uf-chip .x { cursor: pointer; font-weight: 700; }
    `;
    document.head.appendChild(s);
  }
  function create(opts) {
    opts = opts || {};
    ensureStyle();
    const files = (opts.initial || []).slice();
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="uf-drop"><div class="uf-ico">📎</div><div>${opts.hint || '拖拽文件到此，或点击选择（支持多文件）'}</div><div class="uf-sub">CAD / PDF / 图片 / Excel / ZIP</div></div>
      <input type="file" multiple style="display:none;">
      <div class="uf-list"></div>`;
    const drop = wrap.querySelector('.uf-drop'), input = wrap.querySelector('input'), list = wrap.querySelector('.uf-list');
    function renderList() {
      list.innerHTML = files.length
        ? files.map((f, i) => `<span class="uf-chip">${ICON[f.type] || '📎'} ${f.name}<span class="x" data-i="${i}">×</span></span>`).join('')
        : '<span class="text-placeholder text-sm">尚未添加附件</span>';
      list.querySelectorAll('[data-i]').forEach(x => x.addEventListener('click', () => { files.splice(+x.dataset.i, 1); renderList(); if (opts.onChange) opts.onChange(files); }));
    }
    function add(fl) {
      const arr = Array.from(fl || []);
      if (!arr.length) return;
      arr.forEach(f => files.push({ name: f.name, type: typeFromName(f.name) }));
      renderList();
      if (opts.onChange) opts.onChange(files);
      if (global.toast) toast(`已添加 ${arr.length} 个附件`, 'success');
    }
    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', e => { add(e.target.files); e.target.value = ''; });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); }));
    ['dragleave', 'dragend'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); add(e.dataTransfer.files); });
    renderList();
    return {
      el: wrap,
      getFiles: () => files.slice(),
      clear: () => { files.length = 0; renderList(); },
      addManual: (name, type) => { if (!name) return; files.push({ name: name, type: type || typeFromName(name) }); renderList(); }
    };
  }
  global.UploadField = { create, typeFromName };
})(window);
