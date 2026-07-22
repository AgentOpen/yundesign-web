/* 创建设计单 —— 共享弹窗组件（我的待办 / 设计单池 / 项目列表 复用，替代独立 create.html 页面）
 * 字段规范（CRM 导入自动填写；手动创建必填）：
 *   1 项目订单号（自动生成/CRM 获取）2 项目名称 3 项目类型 4 设计范围(全案/单空间) 5 国家
 *   6 期望完成时间 7 风格备注 8 最终抵扣方案 9 附件(建筑图纸 + 水单截图) 10 客户名称
 *   11 客户等级 12 是否需要协调员（否 → 补 13 紧急程度 / 14 面积）
 *   附件支持拖拽上传；点击提交显示上传进度；水单截图上传即自动开始立项(MS1)
 */
(function (global) {
  const MODAL_ID = 'order-create-modal';
  const ATT_ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️' };
  const COUNTRIES = ['中国', '泰国', '越南', '印度', '日本', '新加坡', '马来西亚', '印度尼西亚', '菲律宾', '阿联酋', '沙特阿拉伯', '卡塔尔', '美国', '加拿大', '英国', '法国', '德国', '澳大利亚'];
  const DESIGN_SCOPES = ['全案设计', '单空间设计'];

  function ensureStyle() {
    if (document.getElementById('oc-style')) return;
    const s = document.createElement('style');
    s.id = 'oc-style';
    s.textContent = `
      .oc-form { font-size: 13px; }
      .oc-crm-banner { background: var(--info-bg); border: 1px solid #bcd0fa; color: var(--info); border-radius: 8px; padding: 10px 14px; font-size: 12.5px; margin-bottom: 14px; }
      .oc-sec { border-top: 1px solid var(--divider); padding-top: 16px; margin-top: 16px; }
      .oc-sec:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
      .oc-sec-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; }
      .oc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .oc-grid .full { grid-column: 1 / -1; }
      @media (max-width: 640px){ .oc-grid { grid-template-columns: 1fr; } }
      .oc-item label { display:block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
      .oc-item .req { color: var(--danger); }
      .oc-item .hint { color: var(--warning); font-weight: 500; }
      .oc-input, .oc-textarea { width: 100%; height: 34px; border: 1px solid var(--border); border-radius: 6px; padding: 0 10px; font-size: 13px; box-sizing:border-box; background:#fff; }
      .oc-input[readonly] { background: var(--bg-hover); color: var(--text-secondary); }
      .oc-textarea { height: auto; padding: 8px 10px; resize: vertical; font-family: inherit; }
      .oc-radio { display:inline-flex; align-items:center; gap:4px; margin-right:12px; font-size:13px; cursor:pointer; }
      .oc-drop { border: 2px dashed var(--divider); border-radius: 8px; padding: 18px 12px; text-align:center; color: var(--text-secondary); cursor:pointer; transition: var(--transition-fast); }
      .oc-drop:hover { border-color: var(--brand-primary); background: var(--brand-primary-bg); }
      .oc-drop.drag { border-color: var(--brand-primary); background: var(--brand-primary-bg); color: var(--brand-primary); }
      .oc-drop .oc-drop-ico { font-size: 22px; }
      .oc-att { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; min-height:20px; }
      .oc-updrops { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      @media (max-width: 640px){ .oc-updrops { grid-template-columns:1fr; } }
      .oc-upnote { font-size: 12px; margin-top: 6px; }
      .oc-upbar-wrap { flex:1; margin-right:12px; }
      .oc-upbar { height:10px; background:var(--bg-hover); border-radius:5px; overflow:hidden; }
      .oc-upbar-fill { height:100%; width:0; background:var(--brand-primary); color:#fff; font-size:8px; line-height:10px; text-align:right; padding-right:4px; box-sizing:border-box; transition: width .1s linear; }
    `;
    document.head.appendChild(s);
  }

  function typeFromName(name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (ext === 'dwg' || ext === 'dxf') return 'dwg';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].indexOf(ext) >= 0) return 'img';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'xls';
    if (['zip', 'rar', '7z'].indexOf(ext) >= 0) return 'zip';
    return 'pdf';
  }
  function plusDays(n) {
    const d = new Date(Date.now() + n * 86400000);
    const p = x => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function today8() { return new Date().toISOString().slice(0, 10).replace(/-/g, ''); }
  function rnd3() { return String(Math.floor(100 + Math.random() * 900)); }
  function genOrderNo(source) { return (source === 'CRM' ? 'CRM-' : 'DO-') + today8() + '-' + rnd3(); }

  function crmSample() {
    return {
      orderNo: 'CRM-' + today8() + '-' + rnd3(),
      name: '龙湖·九里晴川 3-2-1101', type: '家装', designScope: '全案设计', country: '中国',
      deadline: plusDays(60), remark: '现代轻奢，业主偏爱莫兰迪色系；参考案例见附件；主卧需独立衣帽间。',
      deductionPlan: '设计费 8.8 万，签约抵扣 2 万，尾款交付后结清', custLevel: 'VIP', cust: '龙湖客户 A21',
      budgetMin: 60, budgetMax: 90, needCoord: 'yes', urgency: '', area: '',
      attachments: [
        { name: '建筑图纸.dwg', type: 'dwg', cat: 'drawing' },
        { name: '户型结构图.pdf', type: 'pdf', cat: 'drawing' },
        { name: '水单截图.jpg', type: 'img', cat: 'payment' }
      ]
    };
  }

  function build(f) {
    const isCRM = f.source === 'CRM';
    const req = '<span class="req">*</span>';
    const noCoord = f.needCoord === 'no';
    return `<div class="oc-form" id="oc-form">
      ${isCRM ? `<div class="oc-crm-banner">🔗 本单来自 <b>CRM 推送</b>：项目订单号 / 项目资料 / 抵扣方案 / 建筑图纸 & 水单等已自动填写，请核对后创建。</div>` : ''}

      <!-- ① 项目信息 -->
      <div class="oc-sec">
        <div class="oc-sec-title">① 项目信息</div>
        <div class="oc-grid">
          <div class="oc-item"><label>单据来源 ${req}</label>
            <select class="oc-input" id="oc-source">
              <option ${f.source === '手动创建' ? 'selected' : ''}>手动创建</option>
              <option value="CRM" ${f.source === 'CRM' ? 'selected' : ''}>CRM 导入</option>
              <option value="OMS" ${f.source === 'OMS' ? 'selected' : ''}>OMS 导入</option>
            </select></div>
          <div class="oc-item"><label>项目订单号 ${req} <span class="text-placeholder" style="font-weight:400;">（${isCRM ? 'CRM 获取' : '系统自动生成'}）</span></label>
            <input class="oc-input" id="oc-orderno" value="${f.orderNo || ''}" readonly></div>
          <div class="oc-item full"><label>项目名称 ${req}</label><input class="oc-input" id="oc-name" placeholder="例：张宅全案 · 别墅" value="${f.name}"></div>
          <div class="oc-item"><label>项目类型 ${req}</label>
            <select class="oc-input" id="oc-type">${['家装', '工装', '别墅'].map(t => `<option ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="oc-item"><label>设计范围 ${req}</label>
            <select class="oc-input" id="oc-scope">${DESIGN_SCOPES.map(s => `<option ${f.designScope === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
          <div class="oc-item"><label>国家 / 地区 ${req}</label>
            <select class="oc-input" id="oc-country">${COUNTRIES.map(c => `<option ${f.country === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="oc-item"><label>期望设计完成时间 ${req}</label><input class="oc-input" type="date" id="oc-deadline" value="${f.deadline}"></div>
          <div class="oc-item full"><label>风格备注（风格偏好、参考案例、特殊要求）</label><textarea class="oc-textarea" id="oc-remark" rows="3" placeholder="风格偏好、参考案例、特殊要求…">${f.remark}</textarea></div>
          <div class="oc-item full"><label>最终抵扣方案</label><textarea class="oc-textarea" id="oc-deduct" rows="2" placeholder="如：设计费 8.8 万，签约抵扣 2 万，尾款交付后结清">${f.deductionPlan || ''}</textarea></div>
        </div>
      </div>

      <!-- ② 附件（拖拽上传） -->
      <div class="oc-sec">
        <div class="oc-sec-title">② 项目附件 <span class="text-placeholder" style="font-weight:400;font-size:12px;">支持拖拽 / 点击上传，可多文件</span></div>
        <div class="oc-updrops">
          <div>
            <div class="oc-item"><label>建筑图纸 ${req} <span class="text-placeholder" style="font-weight:400;">CAD / PDF / 图片</span></label></div>
            <div class="oc-drop" id="oc-drop-drawing"><div class="oc-drop-ico">📐</div><div>拖拽建筑图纸到此，或点击上传</div></div>
            <input type="file" id="oc-file-drawing" multiple style="display:none;">
            <div class="oc-att" id="oc-att-drawing"></div>
          </div>
          <div>
            <div class="oc-item"><label>水单截图 <span class="text-placeholder" style="font-weight:400;">收款凭证</span></label></div>
            <div class="oc-drop" id="oc-drop-payment"><div class="oc-drop-ico">🧾</div><div>拖拽水单截图到此，或点击上传</div></div>
            <input type="file" id="oc-file-payment" multiple style="display:none;">
            <div class="oc-att" id="oc-att-payment"></div>
            <div class="oc-upnote" id="oc-pay-note"></div>
          </div>
        </div>
      </div>

      <!-- ③ 客户信息 -->
      <div class="oc-sec">
        <div class="oc-sec-title">③ 客户信息</div>
        <div class="oc-grid">
          <div class="oc-item"><label>客户名称 ${req}</label><input class="oc-input" id="oc-cust" placeholder="张先生 / Mr. Kumar" value="${f.cust}"></div>
          <div class="oc-item"><label>客户等级 ${req}</label>
            <select class="oc-input" id="oc-clevel">${['普通', 'VIP'].map(l => `<option ${f.custLevel === l ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <div class="oc-item"><label>客户联系方式</label><input class="oc-input" id="oc-phone" placeholder="手机号 或 邮箱" value="${f.phone}"></div>
          <div class="oc-item"><label>预算区间（万元）</label>
            <div style="display:flex;gap:8px;align-items:center;"><input class="oc-input" type="number" id="oc-bmin" placeholder="80" value="${f.budgetMin}"><span>~</span><input class="oc-input" type="number" id="oc-bmax" placeholder="120" value="${f.budgetMax}"></div></div>
        </div>
      </div>

      <!-- ④ 对接与协作 -->
      <div class="oc-sec">
        <div class="oc-sec-title">④ 对接与协作</div>
        <div class="oc-grid">
          <div class="oc-item"><label>PM（销售负责人）</label>
            <select class="oc-input" id="oc-pm"><option>许光（东南亚 · L5）</option><option>刘 PM（华东）</option></select></div>
          <div class="oc-item"><label>是否需要协调员 ${req}</label>
            <div>${[['yes', '是'], ['no', '否']].map(x => `<label class="oc-radio"><input type="radio" name="oc-coord" value="${x[0]}" ${f.needCoord === x[0] ? 'checked' : ''}>${x[1]}</label>`).join('')}</div></div>
          ${f.needCoord === 'yes' ? `
          <div class="oc-item full">
            <label>协调员（由其接收后补充紧急程度 / 面积）</label>
            <select class="oc-input" id="oc-coord-sel">
              <option value="">-- 系统推荐（按档期 / 客户区域）--</option>
              ${MOCK.designersByRole('协调员').map(d => `<option value="${d.id}" ${f.coord === d.id ? 'selected' : ''}>${d.name}（${MOCK.deptShort(d.dept)} · ${d.level}）</option>`).join('')}
            </select>
          </div>` : `
          <div class="oc-item"><label>紧急程度 ${req} <span class="text-placeholder" style="font-weight:400;">无协调员须填写</span></label>
            <select class="oc-input" id="oc-urgency">
              <option value="" ${!f.urgency ? 'selected' : ''}>— 请选择 —</option>
              ${['正常', '加急', '特急'].map(u => `<option ${f.urgency === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select></div>
          <div class="oc-item"><label>面积 (㎡) ${req} <span class="text-placeholder" style="font-weight:400;">无协调员须填写</span></label>
            <input class="oc-input" type="number" id="oc-area" placeholder="120" value="${f.area}"></div>`}
        </div>
        <div class="text-sm text-secondary" style="margin-top:10px;">提交后单据进入 <b>设计单池</b>，2D/3D 设计师团队将在 <b>智能分单</b> 环节按技能 / 负载 / 区域推荐分派。</div>
      </div>
    </div>`;
  }

  function ensureModal() {
    let mask = document.getElementById(MODAL_ID);
    if (mask) return mask;
    ensureStyle();
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.id = MODAL_ID;
    mask.innerHTML = `<div class="modal modal-lg"><div class="modal-header">
        <div><div class="modal-title">➕ 创建设计单</div><div class="text-sm text-secondary">CRM 导入自动填写；手动创建按 * 必填。附件可拖拽上传</div></div>
        <div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('open')">✕</div>
      </div>
      <div class="modal-body" id="oc-modal-body" style="max-height:72vh;overflow-y:auto;"></div>
      <div class="modal-footer" id="oc-footer">
        <div class="oc-upbar-wrap" id="oc-upbar-wrap" style="display:none;">
          <div class="text-sm text-secondary" style="margin-bottom:4px;" id="oc-upbar-label">正在上传附件…</div>
          <div class="oc-upbar"><div class="oc-upbar-fill" id="oc-upbar-fill">0%</div></div>
        </div>
        <button class="btn btn-default" id="oc-cancel">取消</button>
        <button class="btn btn-ghost" id="oc-save-pool">保存入池</button>
        <button class="btn btn-primary" id="oc-save-assign">创建并去分单 →</button>
      </div></div>`;
    document.body.appendChild(mask);
    mask.querySelector('#oc-cancel').addEventListener('click', () => mask.classList.remove('open'));
    mask.addEventListener('click', e => { if (e.target === mask) mask.classList.remove('open'); });
    return mask;
  }

  function openModal(onDone) {
    const mask = ensureModal();
    const body = mask.querySelector('#oc-modal-body');
    const form = {
      source: '手动创建', orderNo: genOrderNo('手动创建'), name: '', type: '家装',
      designScope: '全案设计', country: '中国', deadline: '', remark: '', deductionPlan: '',
      cust: '', phone: '', custLevel: '普通',
      needCoord: 'yes', urgency: '', area: '', coord: '',
      pm: '许光（东南亚 · L5）', budgetMin: '', budgetMax: '',
      attachments: [{ name: '户型建筑图.dwg', type: 'dwg', cat: 'drawing' }]
    };
    let crmFilled = false, uploading = false;

    function hasPayment() { return form.attachments.some(a => a.cat === 'payment'); }
    function drawings() { return form.attachments.filter(a => a.cat !== 'payment'); }

    function renderAtt() {
      const chip = a => {
        const gi = form.attachments.indexOf(a);
        return `<span class="tag tag-info" style="display:inline-flex;align-items:center;gap:6px;">${ATT_ICON[a.type] || '📎'} ${a.name}<span data-rm="${gi}" style="cursor:pointer;font-weight:700;">×</span></span>`;
      };
      const dl = body.querySelector('#oc-att-drawing'), pl = body.querySelector('#oc-att-payment');
      if (dl) dl.innerHTML = drawings().length ? drawings().map(chip).join('') : '<span class="text-placeholder text-sm">尚未上传建筑图纸</span>';
      if (pl) pl.innerHTML = form.attachments.filter(a => a.cat === 'payment').length ? form.attachments.filter(a => a.cat === 'payment').map(chip).join('') : '<span class="text-placeholder text-sm">尚未上传水单</span>';
      const note = body.querySelector('#oc-pay-note');
      if (note) note.innerHTML = hasPayment()
        ? '<span style="color:var(--success);">✓ 已上传水单，创建后立项 / 收款（MS1）将自动完成</span>'
        : '<span style="color:var(--warning);">⚠ 未上传水单，项目暂不可开工；补齐水单后自动开始第一步</span>';
      body.querySelectorAll('[data-rm]').forEach(x => x.addEventListener('click', () => { form.attachments.splice(+x.dataset.rm, 1); renderAtt(); }));
    }

    function collect() {
      const q = id => body.querySelector(id);
      if (q('#oc-source')) form.source = q('#oc-source').value;
      if (q('#oc-orderno')) form.orderNo = q('#oc-orderno').value.trim();
      if (q('#oc-name')) form.name = q('#oc-name').value.trim();
      if (q('#oc-type')) form.type = q('#oc-type').value;
      if (q('#oc-scope')) form.designScope = q('#oc-scope').value;
      if (q('#oc-country')) form.country = q('#oc-country').value;
      if (q('#oc-deadline')) form.deadline = q('#oc-deadline').value;
      if (q('#oc-remark')) form.remark = q('#oc-remark').value;
      if (q('#oc-deduct')) form.deductionPlan = q('#oc-deduct').value;
      if (q('#oc-cust')) form.cust = q('#oc-cust').value.trim();
      if (q('#oc-clevel')) form.custLevel = q('#oc-clevel').value;
      if (q('#oc-phone')) form.phone = q('#oc-phone').value;
      if (q('#oc-bmin')) form.budgetMin = q('#oc-bmin').value;
      if (q('#oc-bmax')) form.budgetMax = q('#oc-bmax').value;
      if (q('#oc-pm')) form.pm = q('#oc-pm').value;
      const nc = body.querySelector('[name="oc-coord"]:checked'); if (nc) form.needCoord = nc.value;
      if (q('#oc-coord-sel')) form.coord = q('#oc-coord-sel').value;
      if (q('#oc-urgency')) form.urgency = q('#oc-urgency').value;
      if (q('#oc-area')) form.area = q('#oc-area').value;
    }

    function render() { body.innerHTML = build(form); bind(); renderAtt(); }

    function addFiles(files, cat) {
      if (!files || !files.length) return;
      files.forEach(f => form.attachments.push({ name: f.name, type: typeFromName(f.name), cat }));
      renderAtt();
      global.toast && toast(`已添加 ${files.length} 个${cat === 'payment' ? '水单' : '图纸'}附件`, 'success');
    }
    function wireDrop(dropId, fileId, cat) {
      const drop = body.querySelector(dropId), file = body.querySelector(fileId);
      if (!drop || !file) return;
      drop.addEventListener('click', () => file.click());
      file.addEventListener('change', e => { addFiles(Array.from(e.target.files || []), cat); e.target.value = ''; });
      ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); }));
      ['dragleave', 'dragend'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); }));
      drop.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); addFiles(Array.from(e.dataTransfer.files || []), cat); });
    }

    function bind() {
      body.querySelector('#oc-source').addEventListener('change', e => {
        collect(); form.source = e.target.value;
        if (form.source === 'CRM') {
          if (!crmFilled) { Object.assign(form, crmSample()); crmFilled = true; }
          else if (String(form.orderNo).indexOf('CRM-') !== 0) form.orderNo = genOrderNo('CRM');
        } else {
          form.orderNo = genOrderNo(form.source);
        }
        render();
      });
      wireDrop('#oc-drop-drawing', '#oc-file-drawing', 'drawing');
      wireDrop('#oc-drop-payment', '#oc-file-payment', 'payment');
      // 是否需要协调员 → 切换 紧急/面积 vs 协调员（重渲染）
      body.querySelectorAll('[name="oc-coord"]').forEach(r => r.addEventListener('change', () => { collect(); render(); }));
    }

    render();

    function validate() {
      collect();
      if (!form.name) { global.toast && toast('请填写项目名称', 'warning'); return false; }
      if (!form.deadline) { global.toast && toast('请选择期望设计完成时间', 'warning'); return false; }
      if (!form.orderNo) { global.toast && toast('项目订单号缺失', 'warning'); return false; }
      if (drawings().length === 0) { global.toast && toast('请至少上传 1 份建筑图纸，否则设计师无法开工', 'warning'); return false; }
      if (!form.cust) { global.toast && toast('请填写客户名称', 'warning'); return false; }
      if (form.needCoord === 'no' && (!form.urgency || !form.area)) { global.toast && toast('未选择协调员，须填写紧急程度与面积', 'warning'); return false; }
      return true;
    }

    function doCreate() {
      const payload = Object.assign({}, form);
      payload.scope = [form.designScope];
      payload.paid = hasPayment();
      return MOCK.createOrder(payload);
    }

    // 上传进度（提交时按附件数量模拟进度条）
    function runUpload(done) {
      if (uploading) return;
      uploading = true;
      const wrap = mask.querySelector('#oc-upbar-wrap');
      const fill = mask.querySelector('#oc-upbar-fill');
      const label = mask.querySelector('#oc-upbar-label');
      const n = form.attachments.length;
      label.textContent = `正在上传 ${n} 个附件…`;
      wrap.style.display = 'block';
      mask.querySelector('#oc-save-pool').disabled = true;
      mask.querySelector('#oc-save-assign').disabled = true;
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + Math.random() * 18 + 7);
        fill.style.width = pct + '%'; fill.textContent = Math.floor(pct) + '%';
        if (pct >= 100) {
          clearInterval(iv);
          label.textContent = '上传完成，正在创建设计单…';
          setTimeout(() => {
            uploading = false;
            wrap.style.display = 'none'; fill.style.width = '0'; fill.textContent = '0%';
            mask.querySelector('#oc-save-pool').disabled = false;
            mask.querySelector('#oc-save-assign').disabled = false;
            done();
          }, 300);
        }
      }, 110);
    }

    function finish(mode) {
      const o = doCreate();
      mask.classList.remove('open');
      const supp = o.needSupplement ? '（待协调员补充紧急/面积）' : '';
      const pay = o.paid ? '，已收款立项自动开始' : '，待补水单后开工';
      global.toast && toast(`已创建设计单 ${o.code}${supp}${pay}${mode === 'assign' ? '，前往智能分单' : '，进入设计单池'}`, 'success');
      if (onDone) onDone(o, mode);
      else if (mode === 'assign') location.href = (location.pathname.indexOf('/ops/') >= 0 ? './assign-board.html' : '../ops/assign-board.html');
    }

    mask.querySelector('#oc-save-pool').onclick = () => { if (!validate()) return; runUpload(() => finish('pool')); };
    mask.querySelector('#oc-save-assign').onclick = () => { if (!validate()) return; runUpload(() => finish('assign')); };

    mask.classList.add('open');
  }

  global.OrderCreate = { openModal };
})(window);
