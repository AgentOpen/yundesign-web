/* 案例发布 / 分空间上传（供 案例广场·我的案例 与 项目详情·发布案例 共用）
 * 依赖：MOCK(mock-data.js)、UploadField(upload-field.js)、openModal/closeModal/toast
 * API：
 *   CaseEdit.openPublish(onSaved)                 // 新建案例草稿
 *   CaseEdit.openSpace(caseId, spaceKey, onSaved) // 新增/编辑空间（分空间上传交付物）
 */
(function (global) {
  const STYLES = ['现代简约', '新中式', '北欧', '轻奢', '工业风', '日式', '美式乡村', '侘寂风', '法式'];
  const COUNTRIES = ['中国', '美国', '马来西亚', '新加坡', '欧美', '阿联酋', '澳大利亚', '加拿大', '泰国'];
  const SOFTWARES = ['3DMax', 'SketchUp草图大师', '三维家', '酷家乐'];
  const DELIVERY = ['虚拟现实', '效果图'];

  function ensureMask(id) {
    let m = document.getElementById(id);
    if (!m) {
      m = document.createElement('div'); m.className = 'modal-mask'; m.id = id;
      document.body.appendChild(m);
      m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    }
    return m;
  }
  const opt = (arr, v) => arr.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');

  // ---------- 新建案例草稿 ----------
  function openPublish(onSaved) {
    const m = ensureMask('case-publish-modal');
    m.innerHTML = `<div class="modal modal-md"><div class="modal-header">
        <div class="modal-title">🏛 发布新案例</div><div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('open')">✕</div>
      </div>
      <div class="modal-body">
        <div class="text-sm text-secondary" style="margin-bottom:12px;">先创建案例草稿，保存后可逐个空间上传产品清单 / 3D 模型 / CAD / 平面图 / 全景。</div>
        <div class="form-group"><label class="form-label">案例名称 <span style="color:var(--danger)">*</span></label><input class="form-input" id="cp-name" placeholder="如：滨海现代别墅全案"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">风格</label><select class="form-input" id="cp-style">${opt(STYLES, '现代简约')}</select></div>
          <div class="form-group"><label class="form-label">国家 / 地区</label><select class="form-input" id="cp-country">${opt(COUNTRIES, '中国')}</select></div>
          <div class="form-group"><label class="form-label">面积（㎡）</label><input class="form-input" id="cp-area" type="number" min="0" placeholder="120"></div>
          <div class="form-group"><label class="form-label">预算（万）</label><input class="form-input" id="cp-budget" type="number" min="0" placeholder="40"></div>
          <div class="form-group"><label class="form-label">设计软件</label><select class="form-input" id="cp-soft">${opt(SOFTWARES, '3DMax')}</select></div>
          <div class="form-group"><label class="form-label">交付类型</label><select class="form-input" id="cp-delivery">${opt(DELIVERY, '虚拟现实')}</select></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" onclick="this.closest('.modal-mask').classList.remove('open')">取消</button>
        <button class="btn btn-primary" id="cp-save">创建案例草稿</button>
      </div></div>`;
    m.classList.add('open');
    m.querySelector('#cp-save').addEventListener('click', () => {
      const name = m.querySelector('#cp-name').value.trim();
      if (!name) { toast('请填写案例名称', 'warning'); return; }
      const cs = MOCK.publishCase({
        name, style: m.querySelector('#cp-style').value, country: m.querySelector('#cp-country').value,
        area: m.querySelector('#cp-area').value, budget: m.querySelector('#cp-budget').value,
        software: m.querySelector('#cp-soft').value, delivery: m.querySelector('#cp-delivery').value
      });
      m.classList.remove('open');
      toast('案例草稿已创建，请继续添加空间与交付物', 'success');
      if (onSaved) onSaved(cs);
    });
  }

  // ---------- 新增 / 编辑空间（分空间上传） ----------
  function openSpace(caseId, spaceKey, onSaved) {
    const cs = MOCK.getCase(caseId); if (!cs) { toast('案例不存在', 'warning'); return; }
    const sp = spaceKey ? (cs.spaces || []).find(s => s.key === spaceKey) : null;
    const lib = MOCK.CASE_SPACE_LIB || {};
    const spaceOpts = Object.keys(lib).map(k => `<option value="${k}" ${sp && sp.key === k ? 'selected' : ''}>${lib[k].icon} ${lib[k].name}</option>`).join('') + '<option value="__custom">＋ 自定义空间</option>';
    const m = ensureMask('case-space-modal');
    m.innerHTML = `<div class="modal modal-lg"><div class="modal-header">
        <div class="modal-title">${sp ? '编辑空间' : '添加空间'} · ${cs.name}</div><div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('open')">✕</div>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">空间 <span style="color:var(--danger)">*</span></label><select class="form-input" id="cs-space">${spaceOpts}</select>
            <input class="form-input" id="cs-custom" placeholder="自定义空间名，如：视听室" style="margin-top:8px;display:none;"></div>
          <div class="form-group"><label class="form-label">面积（㎡）</label><input class="form-input" id="cs-area" type="number" min="0" value="${sp ? sp.area : ''}"></div>
        </div>

        <div class="cs-sec">
          <div class="cs-sec-hd"><b>🧾 产品清单</b><button class="btn btn-xs btn-default" id="cs-add-prod">＋ 添加产品</button></div>
          <table class="data-table" style="margin-top:6px;"><thead><tr><th style="width:34%">产品名</th><th>SKU</th><th>品类</th><th style="width:64px">数量</th><th style="width:40px"></th></tr></thead><tbody id="cs-prod-body"></tbody></table>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;">
          <div><div class="cs-sec-hd"><b>🧊 3D 模型文件</b><span class="text-sm text-secondary">产品清单的 3D（.max/.skp/.fbx）</span></div><div id="cs-up-model"></div></div>
          <div><div class="cs-sec-hd"><b>📐 全屋 CAD 文件</b><span class="text-sm text-secondary">平面布局 / 立面 / 节点大样（.dwg）</span></div><div id="cs-up-cad"></div></div>
          <div><div class="cs-sec-hd"><b>🗺 本空间平面图</b></div><div id="cs-up-floor"></div></div>
          <div><div class="cs-sec-hd"><b>🌐 本空间全景 / 效果图</b><span class="text-sm text-secondary">${cs.delivery === '虚拟现实' ? '720° 全景' : '高清效果图'}</span></div><div id="cs-up-pano"></div></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" onclick="this.closest('.modal-mask').classList.remove('open')">取消</button>
        <button class="btn btn-primary" id="cs-save">保存空间</button>
      </div></div>`;
    ensureStyle();
    m.classList.add('open');

    // 自定义空间输入切换
    const spaceSel = m.querySelector('#cs-space'), customIn = m.querySelector('#cs-custom');
    function syncCustom() { customIn.style.display = spaceSel.value === '__custom' ? 'block' : 'none'; }
    spaceSel.addEventListener('change', syncCustom); syncCustom();

    // 产品清单编辑
    const prodBody = m.querySelector('#cs-prod-body');
    const seed = sp && sp.products && sp.products.length ? sp.products : [{ name: '', sku: '', cat: '', qty: 1 }];
    function prodRow(p) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><input class="form-input form-input-sm" value="${(p.name || '').replace(/"/g, '&quot;')}" placeholder="产品名"></td>
        <td><input class="form-input form-input-sm" value="${p.sku || ''}" placeholder="SKU"></td>
        <td><input class="form-input form-input-sm" value="${p.cat || ''}" placeholder="品类"></td>
        <td><input class="form-input form-input-sm" type="number" min="1" value="${p.qty || 1}"></td>
        <td><button class="btn btn-xs btn-text" style="color:var(--danger)">✕</button></td>`;
      tr.querySelector('button').addEventListener('click', () => tr.remove());
      return tr;
    }
    seed.forEach(p => prodBody.appendChild(prodRow(p)));
    m.querySelector('#cs-add-prod').addEventListener('click', () => prodBody.appendChild(prodRow({ qty: 1 })));

    // 上传区
    const upModel = UploadField.create({ hint: '拖拽 3D 模型（.max/.skp/.fbx）', initial: sp ? (sp.models || []).map(f => ({ name: f.name, type: 'zip' })) : [] });
    const upCad = UploadField.create({ hint: '拖拽 CAD（.dwg）', initial: sp ? (sp.cad || []).map(f => ({ name: f.name, type: 'dwg' })) : [] });
    const upFloor = UploadField.create({ hint: '拖拽本空间平面图', initial: sp ? (sp.floorplan || []).map(f => ({ name: f.name, type: 'dwg' })) : [] });
    const upPano = UploadField.create({ hint: '拖拽全景 / 效果图', initial: sp ? (sp.panorama || []).map(f => ({ name: f.name, type: 'img' })) : [] });
    m.querySelector('#cs-up-model').appendChild(upModel.el);
    m.querySelector('#cs-up-cad').appendChild(upCad.el);
    m.querySelector('#cs-up-floor').appendChild(upFloor.el);
    m.querySelector('#cs-up-pano').appendChild(upPano.el);

    m.querySelector('#cs-save').addEventListener('click', () => {
      let key, name, icon;
      if (spaceSel.value === '__custom') {
        name = customIn.value.trim(); if (!name) { toast('请填写自定义空间名', 'warning'); return; }
        key = sp ? sp.key : ('sp' + Date.now().toString().slice(-6)); icon = '🏠';
      } else {
        key = spaceSel.value; const d = lib[key] || {}; name = d.name; icon = d.icon || '🏠';
      }
      const products = [];
      prodBody.querySelectorAll('tr').forEach(tr => {
        const c = tr.querySelectorAll('input');
        const nm = c[0].value.trim(); if (!nm) return;
        products.push({ name: nm, sku: c[1].value.trim() || '—', cat: c[2].value.trim() || '—', qty: Number(c[3].value) || 1 });
      });
      MOCK.saveCaseSpace(caseId, {
        key: sp ? sp.key : key, name, icon, area: m.querySelector('#cs-area').value,
        products,
        models: upModel.getFiles().map(f => ({ name: f.name, format: fmtOf(f.name) })),
        cad: upCad.getFiles().map(f => ({ name: f.name, format: 'DWG' })),
        floorplan: upFloor.getFiles().map(f => ({ name: f.name, format: fmtOf(f.name) })),
        panorama: upPano.getFiles().map(f => ({ name: f.name, type: cs.delivery === '虚拟现实' ? '720' : 'img' }))
      });
      m.classList.remove('open');
      toast('空间已保存', 'success');
      if (onSaved) onSaved();
    });
  }
  function fmtOf(name) {
    const e = (String(name).split('.').pop() || '').toLowerCase();
    if (e === 'max') return '3DMax'; if (e === 'skp') return 'SketchUp'; if (e === 'fbx') return 'FBX（通用导出）';
    if (e === 'dwg' || e === 'dxf') return 'DWG'; if (e === 'pdf') return 'PDF';
    return e.toUpperCase() || '文件';
  }
  function ensureStyle() {
    if (document.getElementById('case-edit-style')) return;
    const s = document.createElement('style'); s.id = 'case-edit-style';
    s.textContent = `.cs-sec{margin-top:14px;} .cs-sec-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;} .form-input-sm{padding:4px 8px;font-size:12px;height:30px;}`;
    document.head.appendChild(s);
  }

  global.CaseEdit = { openPublish, openSpace };
})(window);
