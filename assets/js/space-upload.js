/* 按空间上传（设计师版本上传）——「一个文件夹 = 一个空间」
 * 平面设计师(2d)：每空间 平面图 / 产品3D模型 / 产品清单 + 全屋CAD(整套一份)
 * 3D设计师(3d)：每空间 效果图 / 720°全景·VR / 场景模型
 * 上传后按空间沉淀到项目关联案例（我的案例·案例详情），并记录一条版本溯源。
 * 依赖：MOCK、UploadField、openModal/closeModal(可选)、toast
 * API：SpaceUpload.open({ pid, stepCode, mode:'2d'|'3d', onSaved })
 */
(function (global) {
  const BUCKETS = {
    '2d': [
      { field: 'floorplan', label: '本空间平面图', hint: '拖入平面图 / 布局图（.dwg/.pdf/图片）' },
      { field: 'models', label: '产品 3D 模型', hint: '拖入产品模型（.max/.skp/.fbx/.obj）' },
      { field: 'products', label: '产品清单', hint: '拖入产品清单（.xls/.csv/.pdf）' }
    ],
    '3d': [
      { field: 'renders', label: '空间效果图', hint: '拖入效果图（图片/PDF）' },
      { field: 'panorama', label: '720° 全景 / VR', hint: '拖入全景 / VR（图片/.html/视频）' },
      { field: 'models', label: '场景模型（可选）', hint: '拖入场景/产品模型（.max/.skp/.fbx）' }
    ]
  };
  function classify(mode, items) {
    const b = {};
    BUCKETS[mode].forEach(x => b[x.field] = []);
    (items || []).forEach(f => {
      const t = f.type, nm = (f.name || '').toLowerCase();
      if (mode === '3d') {
        if (t === 'vid' || /pano|720|vr|全景|\.html?$/.test(nm)) b.panorama.push(f);
        else if (t === 'model') b.models.push(f);
        else b.renders.push(f);       // 图片 / PDF / 其他 → 效果图
      } else {
        if (t === 'model') b.models.push(f);
        else if (t === 'xls') b.products.push(f);
        else b.floorplan.push(f);     // dwg / 图片 / PDF / 其他 → 平面图
      }
    });
    return b;
  }
  function ensureStyle() {
    if (document.getElementById('su-style')) return;
    const s = document.createElement('style'); s.id = 'su-style';
    s.textContent = `
      .su-drop { border: 2px dashed var(--brand-primary); border-radius: 10px; padding: 18px; text-align: center; color: var(--brand-primary); background: var(--brand-primary-bg); cursor: pointer; transition: var(--transition-fast); }
      .su-drop.drag { background: #e6efff; }
      .su-drop .t { font-weight: 600; }
      .su-drop .s { font-size: 12px; opacity: .85; margin-top: 3px; }
      .su-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
      .su-card { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; background: #fff; }
      .su-card-hd { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .su-card-hd .su-idx { width: 22px; height: 22px; border-radius: 6px; background: var(--brand-primary-bg); color: var(--brand-primary); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
      .su-card-hd select, .su-card-hd input { max-width: 200px; }
      .su-card-hd .su-del { margin-left: auto; color: var(--text-placeholder); cursor: pointer; font-weight: 700; }
      .su-card-hd .su-del:hover { color: var(--danger); }
      .su-buckets { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
      .su-buckets.two { grid-template-columns: 1fr 1fr; }
      .su-bk-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; }
      @media (max-width: 720px) { .su-buckets, .su-buckets.two { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(s);
  }

  function open(o) {
    o = o || {};
    const mode = o.mode === '3d' ? '3d' : '2d';
    const pid = o.pid;
    const stepCode = o.stepCode;
    const cs = MOCK.ensureProjectCase(pid);
    if (!cs) { toast('无法关联项目案例', 'warning'); return; }
    const lib = MOCK.CASE_SPACE_LIB || {};
    const libKeys = Object.keys(lib);
    ensureStyle();

    const modeLabel = mode === '3d' ? '3D 效果图设计师' : '平面设计师';
    let mask = document.getElementById('space-upload-modal');
    if (!mask) { mask = document.createElement('div'); mask.className = 'modal-mask'; mask.id = 'space-upload-modal'; document.body.appendChild(mask); mask.addEventListener('click', e => { if (e.target === mask) mask.classList.remove('open'); }); }
    mask.innerHTML = `<div class="modal modal-lg" style="max-width:920px;display:flex;flex-direction:column;max-height:90vh;">
      <div class="modal-header" style="position:sticky;top:0;background:#fff;z-index:5;border-bottom:1px solid var(--divider);border-radius:var(--radius-xl) var(--radius-xl) 0 0;">
        <div class="modal-title">⬆ 按空间上传 · ${o.stepName || (mode === '3d' ? '3D 效果图' : '平面布局图')}</div>
        <div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('open')">✕</div>
      </div>
      <div class="modal-body">
        <div class="text-sm" style="background:var(--info-bg);border:1px solid #bcd0fa;color:var(--info);border-radius:8px;padding:8px 12px;margin-bottom:12px;">
          👤 ${modeLabel}：<b>一个文件夹 = 一个空间</b>。把每个空间的资料放进各自文件夹，一次可拖入多个空间文件夹；也可手动新增空间。上传后将按空间沉淀到「我的案例 · ${cs.name}」，与案例详情空间一一对应。
        </div>
        ${mode === '2d' ? `<div class="form-group"><label class="form-label">🗂 全屋 CAD 文件（整套项目共用一份，仅需一个）</label><div id="su-cad"></div></div>` : ''}
        <div class="su-drop" id="su-drop">
          <div class="t">📁 拖入空间文件夹到此（每个文件夹 = 一个空间）</div>
          <div class="s">支持一次拖入多个文件夹，保留目录结构；文件将自动按类型归入${mode === '3d' ? '效果图 / 全景 / 模型' : '平面图 / 模型 / 产品清单'}</div>
        </div>
        <div class="su-cards" id="su-cards"></div>
        <div style="margin-top:10px;"><button class="btn btn-default btn-sm" id="su-add">＋ 手动新增一个空间</button></div>
        <div class="form-group" style="margin-top:14px;"><label class="form-label">本版说明 / 变更点</label><textarea class="form-input" id="su-note" rows="2" placeholder="首版方案 / 按客户反馈调整…"></textarea></div>
        <div class="text-sm text-secondary">保存后记录到版本溯源，节点保持进行中；交付时再选择定稿版本推进。</div>
      </div>
      <div class="modal-footer" style="position:sticky;bottom:0;background:#fff;border-top:1px solid var(--divider);">
        <button class="btn btn-default" onclick="this.closest('.modal-mask').classList.remove('open')">取消</button>
        <button class="btn btn-primary" id="su-save">保存版本（按空间归档）</button>
      </div></div>`;

    const cardsBox = mask.querySelector('#su-cards');
    const cards = [];
    let cardSeq = 0;
    let cadUf = null;
    if (mode === '2d') { cadUf = UploadField.create({ hint: '拖入全屋 CAD（.dwg，仅上传一个）', initial: cs.cadFile ? [{ name: cs.cadFile.name, type: 'dwg' }] : [] }); mask.querySelector('#su-cad').appendChild(cadUf.el); }

    function nameFromFolder(folder) {
      const hit = libKeys.find(k => folder.indexOf(lib[k].name) >= 0 || lib[k].name.indexOf(folder) >= 0);
      return hit ? lib[hit].name : folder;
    }
    const bucketHint = mode === '3d' ? '效果图 / 720°全景·VR / 场景模型' : '本空间平面图 / 产品3D模型 / 产品清单';
    function addCard(preset) {
      preset = preset || {};
      const id = 'sc' + (++cardSeq);
      const nameOpts = libKeys.map(k => `<option value="${lib[k].name}" ${preset.name === lib[k].name ? 'selected' : ''}>${lib[k].icon} ${lib[k].name}</option>`).join('') + `<option value="__custom" ${preset.name && !libKeys.some(k => lib[k].name === preset.name) ? 'selected' : ''}>自定义…</option>`;
      const isCustom = preset.name && !libKeys.some(k => lib[k].name === preset.name);
      const card = document.createElement('div'); card.className = 'su-card'; card.dataset.id = id;
      card.innerHTML = `
        <div class="su-card-hd">
          <span class="su-idx">${cards.length + 1}</span>
          <select class="form-input form-input-sm" data-role="sel">${nameOpts}</select>
          <input class="form-input form-input-sm" data-role="custom" placeholder="自定义空间名，如：视听室" value="${isCustom ? preset.name : ''}" style="display:${isCustom ? 'block' : 'none'};">
          <span class="su-del" title="移除该空间">✕</span>
        </div>
        <div class="su-bk-label">📁 该空间资料文件夹（一个文件夹放该空间全部文件：${bucketHint}，系统自动归类）</div>
        <div data-host="files"></div>`;
      cardsBox.appendChild(card);
      const sel = card.querySelector('[data-role="sel"]');
      const customIn = card.querySelector('[data-role="custom"]');
      sel.addEventListener('change', () => { customIn.style.display = sel.value === '__custom' ? 'block' : 'none'; });
      card.querySelector('.su-del').addEventListener('click', () => { const i = cards.findIndex(c => c.id === id); if (i >= 0) cards.splice(i, 1); card.remove(); reindex(); });
      const uf = UploadField.create({ hint: '拖入该空间的整个文件夹（含各种文件，保留目录结构，系统自动归类）', initial: preset.files || [] });
      card.querySelector('[data-host="files"]').appendChild(uf.el);
      cards.push({ id, card, sel, customIn, uf });
    }
    function reindex() { cards.forEach((c, i) => { const el = c.card.querySelector('.su-idx'); if (el) el.textContent = i + 1; }); }

    function groupToSpaces(items) {
      const groups = {}; const order = [];
      (items || []).forEach(f => {
        const parts = (f.path || f.name).split('/');
        const top = parts.length > 1 ? parts[0] : '散件资料';
        if (!groups[top]) { groups[top] = []; order.push(top); }
        groups[top].push(f);
      });
      if (!order.length) return;
      order.forEach(folder => addCard({ name: nameFromFolder(folder), files: groups[folder] }));
      reindex();
      toast(`已按文件夹拆分为 ${order.length} 个空间`, 'success');
    }

    const drop = mask.querySelector('#su-drop');
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); }));
    ['dragleave', 'dragend'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', async e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); const items = await UploadField.readDataTransfer(e.dataTransfer); groupToSpaces(items); });
    mask.querySelector('#su-add').addEventListener('click', () => { addCard({}); reindex(); });

    // 预填：已有空间可继续补充（只带入与当前角色相关的文件）
    function relevantFiles(sp) {
      return mode === '3d'
        ? [].concat(sp.renders || [], sp.panorama || [], sp.models || [])
        : [].concat(sp.floorplan || [], sp.models || [], sp.productFiles || []);
    }
    if ((cs.spaces || []).length) {
      cs.spaces.forEach(sp => addCard({ name: sp.name, files: relevantFiles(sp) }));
    } else { addCard({}); }
    reindex();

    mask.classList.add('open');

    mask.querySelector('#su-save').addEventListener('click', () => {
      const note = mask.querySelector('#su-note').value.trim();
      const all = [];
      let savedSpaces = 0;
      cards.forEach(c => {
        let name = c.sel.value === '__custom' ? c.customIn.value.trim() : c.sel.value;
        if (!name) return;
        const files = c.uf.getFiles();
        if (!files.length) return; // 跳过空空间
        const b = classify(mode, files);   // 文件夹内混合文件自动归类
        const libKey = libKeys.find(k => lib[k].name === name);
        const key = libKey || ('c_' + name.replace(/\s+/g, ''));
        const icon = libKey ? lib[libKey].icon : '🏠';
        const payload = { key, name, icon };
        if (mode === '2d') { payload.floorplan = b.floorplan; payload.models = b.models; payload.productFiles = b.products; }
        else { payload.renders = b.renders; payload.panorama = b.panorama; if (b.models.length) payload.models = b.models; }
        MOCK.saveCaseSpace(cs.id, payload);
        savedSpaces++;
        files.forEach(f => all.push(f));
      });
      if (mode === '2d' && cadUf) { const cad = cadUf.getFiles(); if (cad.length) MOCK.updateCase(cs.id, { cadFile: { name: cad[cad.length - 1].name, format: 'DWG' } }); }
      if (!savedSpaces && !all.length) { toast('请至少为一个空间拖入资料', 'warning'); return; }
      // 记录一条版本溯源（交付并推进时可选定稿）
      if (stepCode) MOCK.addTaskVersion(pid, stepCode, { reason: note, changes: note || `按空间上传 ${savedSpaces} 个空间资料`, deliverables: all.map(f => ({ name: f.name, type: f.type })) });
      mask.classList.remove('open');
      toast(`已按空间归档 ${savedSpaces} 个空间，并记录新版本`, 'success');
      if (o.onSaved) o.onSaved();
    });
  }

  global.SpaceUpload = { open };
})(window);
