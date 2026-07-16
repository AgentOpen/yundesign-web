/* 客户退款 & 分成人工调整 —— 共享编辑器（项目列表弹窗 + 项目详情 Tab 复用） */
(function (global) {
  const MODAL_ID = 'commission-adjust-modal';
  const money = n => (typeof global.formatMoney === 'function' ? global.formatMoney(Math.round(n || 0), 0) : Math.round(n || 0));

  // 注入一次性样式
  function ensureStyle() {
    if (document.getElementById('ca-style')) return;
    const s = document.createElement('style');
    s.id = 'ca-style';
    s.textContent = `
      .ca-wrap { font-size: 13px; }
      .ca-refund { background: var(--bg-hover); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
      .ca-refund.on { background: #fef2f2; border-color: #fecaca; }
      .ca-refund-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .ca-refund-head .t { font-weight: 600; }
      .ca-fee-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
      .ca-fee-cell { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
      .ca-fee-cell .k { font-size: 11px; color: var(--text-secondary); }
      .ca-fee-cell .v { font-size: 17px; font-weight: 700; font-family: var(--font-mono); }
      .ca-fee-cell .v.red { color: var(--danger); }
      .ca-row-in { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
      .ca-row-in .fld { display: flex; flex-direction: column; gap: 4px; }
      .ca-row-in label { font-size: 11px; color: var(--text-secondary); }
      .ca-input { height: 32px; border: 1px solid var(--border); border-radius: 6px; padding: 0 8px; font-family: var(--font-mono); }
      .ca-tbl input.ca-amt { width: 110px; height: 30px; border: 1px solid var(--border); border-radius: 6px; padding: 0 8px; font-family: var(--font-mono); text-align: right; }
      .ca-tbl select.ca-reason { height: 30px; border: 1px solid var(--border); border-radius: 6px; }
      .ca-tbl td { vertical-align: middle; }
      .ca-tbl .auto { font-family: var(--font-mono); color: var(--text-secondary); }
      .ca-sum { display: flex; justify-content: flex-end; gap: 24px; padding: 12px 4px 0; font-size: 13px; }
      .ca-sum b { font-family: var(--font-mono); font-size: 15px; }
      .ca-reassign { background: #fffbeb; border: 1px dashed #fcd34d; border-radius: 6px; padding: 8px; margin-top: 6px; display: flex; gap: 8px; align-items: center; }
      .ca-ro { color: var(--text-secondary); font-size: 12px; padding: 8px 0; }
    `;
    document.head.appendChild(s);
  }

  function roleToDesignerRole(r) { return r === '3D' ? '3D' : (r === '协调员' ? '协调员' : '2D'); }

  function reviewTag(c) {
    if (c.reviewStatus === '待审核') return '<span class="tag tag-warning">待审核</span>';
    if (c.reviewStatus === '已通过') return '<span class="tag tag-success">已通过</span>';
    if (c.reviewStatus === '已驳回') return '<span class="tag tag-danger">已驳回</span>';
    return '<span class="tag">系统自动</span>';
  }

  // 生成编辑器 HTML
  function buildHtml(pid) {
    const M = global.MOCK;
    const p = M.getProject(pid);
    const fee = M.projectDesignFee(p);
    const rows = M.ensureCommissions(pid);
    const editable = M.canAdjustCommission();
    const refund = p.refund;
    const refundAmt = refund ? refund.amount : 0;
    const remain = Math.max(0, fee - refundAmt);
    const kind = M.refundKind(p);

    const reasons = ['系统自动', '客户退款', '员工离职', '离职转派', '其他'];
    let body = `<div class="ca-wrap" data-pid="${pid}">`;

    // 退款登记区
    body += `<div class="ca-refund ${refund ? 'on' : ''}">
      <div class="ca-refund-head">
        <div class="t">💸 客户退款登记 ${refund ? `<span class="tag tag-danger" style="margin-left:6px;">${kind}</span>` : ''}</div>
        ${refund ? `<span class="text-sm text-secondary">${refund.at} · ${refund.by}</span>` : ''}
      </div>
      <div class="ca-fee-grid">
        <div class="ca-fee-cell"><div class="k">设计费总额（退款上限）</div><div class="v">¥${money(fee)}</div></div>
        <div class="ca-fee-cell"><div class="k">已退款金额</div><div class="v red">¥${money(refundAmt)}</div></div>
        <div class="ca-fee-cell"><div class="k">剩余设计费</div><div class="v">¥${money(remain)}</div></div>
      </div>`;
    if (editable) {
      body += `<div class="ca-row-in">
        <div class="fld"><label>退款金额（≤ ¥${money(fee)}）</label><input type="number" min="0" max="${fee}" step="100" class="ca-input" id="ca-refund-amt" value="${refundAmt || ''}" placeholder="0"></div>
        <div class="fld" style="flex:1;min-width:180px;"><label>退款原因</label><input type="text" class="ca-input" style="width:100%;font-family:inherit;" id="ca-refund-reason" value="${refund ? (refund.reason || '') : ''}" placeholder="如：客户解约 / 质量投诉 / 项目取消"></div>
        <button class="btn btn-danger-ghost" id="ca-refund-save">${refund ? '更新退款' : '登记退款'}</button>
        ${refund ? '<button class="btn btn-text" id="ca-refund-clear">撤销退款</button>' : ''}
      </div>`;
    } else {
      body += `<div class="ca-ro">${refund ? `退款原因：${refund.reason || '—'}` : '当前项目无退款记录'}</div>`;
    }
    body += `</div>`;

    // 分成成员表
    body += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="font-weight:600;">🧮 项目分成明细（每人最终实分）</div>
      ${editable && refund ? '<button class="btn btn-text" id="ca-suggest">↺ 按剩余设计费重算建议</button>' : ''}
    </div>`;
    body += `<table class="data-table ca-tbl"><thead><tr>
      <th>设计师</th><th>角色</th><th style="text-align:right;">自动分成</th>
      <th style="text-align:right;">最终分成</th><th>调整原因</th><th>状态</th>${editable ? '<th style="text-align:right;">操作</th>' : ''}
    </tr></thead><tbody>`;

    rows.forEach(c => {
      const cur = c.manualAmount != null ? c.manualAmount : c.actualAmount;
      const nameCell = `<div style="display:flex;align-items:center;gap:6px;"><div class="avatar sm" data-color="${global.colorFrom ? colorFrom(c.designerName) : ''}">${global.initials ? initials(c.designerName) : ''}</div>
        <div><div>${c.designerName}${c.resigned ? ' <span class="tag tag-danger" style="font-size:10px;">离职</span>' : ''}</div>${c.reassignFrom ? `<div style="font-size:11px;color:var(--text-secondary);">接手 ${M.getDesigner(c.reassignFrom).name}</div>` : ''}</div></div>`;
      body += `<tr data-cid="${c.id}" data-role="${c.role}">
        <td>${nameCell}</td>
        <td><span class="tag tag-brand">${c.role}</span></td>
        <td style="text-align:right;" class="auto">¥${money(c.actualAmount)}</td>
        <td style="text-align:right;">${editable
          ? `<input type="number" min="0" step="100" class="ca-amt" value="${cur}">`
          : `<span style="font-family:var(--font-mono);font-weight:600;">¥${money(M.commissionFinal(c))}</span>`}</td>
        <td>${editable
          ? `<select class="ca-reason">${reasons.map(r => `<option ${((c.adjustReason || '系统自动') === r) ? 'selected' : ''}>${r}</option>`).join('')}</select>`
          : (c.adjustReason || '系统自动')}</td>
        <td>${reviewTag(c)}</td>
        ${editable ? `<td style="text-align:right;white-space:nowrap;">
          <button class="btn btn-text ca-resign" title="标记离职并转派">离职转派</button>
        </td>` : ''}
      </tr>`;
    });
    body += `</tbody></table>`;

    // 合计
    const totalFinal = rows.reduce((s, c) => s + M.commissionFinal(c), 0);
    body += `<div class="ca-sum">
      <span>成员合计生效分成：<b style="color:var(--brand-primary);">¥${money(totalFinal)}</b></span>
      <span>占设计费：<b>${fee ? (totalFinal / fee * 100).toFixed(0) : 0}%</b></span>
    </div>`;

    if (editable) {
      body += `<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
        <button class="btn btn-primary" id="ca-submit">提交调整（进入负责人审核）</button>
      </div>
      <div class="text-sm text-secondary" style="margin-top:8px;">提交后手动分成进入「待审核」，由平台负责人在 <b>核算队列</b> 审批通过后生效。</div>`;
    }
    body += `</div>`;
    return body;
  }

  // 绑定交互
  function bind(root, pid, onDone) {
    const M = global.MOCK;
    if (!M.canAdjustCommission()) return;
    const rerender = () => { const el = root; el.innerHTML = buildHtml(pid); bind(el, pid, onDone); if (onDone) onDone(); };

    const save = root.querySelector('#ca-refund-save');
    if (save) save.addEventListener('click', () => {
      const amt = Number(root.querySelector('#ca-refund-amt').value) || 0;
      const reason = root.querySelector('#ca-refund-reason').value.trim();
      const fee = M.projectDesignFee(M.getProject(pid));
      if (amt <= 0) { global.toast && toast('请输入退款金额', 'warning'); return; }
      if (amt > fee) { global.toast && toast('退款金额不能超过设计费总额', 'warning'); return; }
      M.setRefund(pid, amt, reason);
      global.toast && toast('已登记客户退款，可按剩余设计费重算分成建议', 'success');
      rerender();
    });

    const clr = root.querySelector('#ca-refund-clear');
    if (clr) clr.addEventListener('click', () => {
      global.confirmDialog ? confirmDialog('撤销退款', '确认撤销该项目的客户退款状态？').then(ok => { if (ok) { M.clearRefund(pid); rerender(); } })
        : (M.clearRefund(pid), rerender());
    });

    const sug = root.querySelector('#ca-suggest');
    if (sug) sug.addEventListener('click', () => {
      M.commissionsByProject(pid).forEach(c => {
        const tr = root.querySelector(`tr[data-cid="${c.id}"]`);
        if (tr) { const inp = tr.querySelector('.ca-amt'); if (inp) inp.value = M.refundSuggest(c); const sel = tr.querySelector('.ca-reason'); if (sel && sel.value === '系统自动') sel.value = '客户退款'; }
      });
      global.toast && toast('已按剩余设计费填入建议分成，可再手动微调', 'info');
    });

    root.querySelectorAll('.ca-resign').forEach(btn => btn.addEventListener('click', () => {
      const tr = btn.closest('tr'); const cid = tr.dataset.cid; const role = tr.dataset.role;
      if (tr.querySelector('.ca-reassign')) return; // 已展开
      const cands = M.designersByRole(roleToDesignerRole(role));
      const def = M.reassignDefault(cid);
      const box = document.createElement('div');
      box.className = 'ca-reassign';
      box.innerHTML = `<span class="text-sm">离职转派给：</span>
        <select class="ca-reassign-sel" style="height:30px;border:1px solid var(--border);border-radius:6px;">${cands.map(d => `<option value="${d.id}">${d.name}（${M.deptShort(d.dept)}）</option>`).join('')}</select>
        <span class="text-sm">接手分成</span>
        <input type="number" class="ca-input ca-reassign-amt" style="width:110px;" value="${def}">
        <button class="btn btn-primary btn-sm ca-reassign-ok">确认转派</button>
        <button class="btn btn-text btn-sm ca-reassign-cancel">取消</button>`;
      tr.querySelector('td:last-child').appendChild(box);
      box.querySelector('.ca-reassign-cancel').addEventListener('click', () => box.remove());
      box.querySelector('.ca-reassign-ok').addEventListener('click', () => {
        const newId = box.querySelector('.ca-reassign-sel').value;
        const amt = Number(box.querySelector('.ca-reassign-amt').value) || 0;
        // 离职者本人分成 = 当前输入的最终分成
        const resignAmt = Number(tr.querySelector('.ca-amt').value) || 0;
        M.resignCommission(cid, resignAmt, '员工离职');
        M.addReassignCommission(pid, cid, newId, amt);
        global.toast && toast('已标记离职并转派，两条分成均进入待审核', 'success');
        rerender();
      });
    }));

    const submit = root.querySelector('#ca-submit');
    if (submit) submit.addEventListener('click', () => {
      let n = 0;
      M.commissionsByProject(pid).forEach(c => {
        const tr = root.querySelector(`tr[data-cid="${c.id}"]`);
        if (!tr) return;
        const inp = tr.querySelector('.ca-amt'); const sel = tr.querySelector('.ca-reason');
        if (!inp) return;
        const val = Number(inp.value) || 0;
        const reason = sel ? sel.value : '系统自动';
        const changed = (val !== c.actualAmount) || (reason !== '系统自动' && reason !== (c.adjustReason || ''));
        if (reason === '系统自动' && val === c.actualAmount) return; // 无改动
        if (changed || reason !== '系统自动') { M.overrideCommission(c.id, val, reason === '系统自动' ? '其他' : reason, c.adjustNote); n++; }
      });
      if (n === 0) { global.toast && toast('没有检测到分成改动', 'info'); return; }
      global.toast && toast(`已提交 ${n} 条分成调整，等待负责人审核`, 'success');
      rerender();
    });
  }

  function renderInto(container, pid, onDone) {
    ensureStyle();
    container.innerHTML = buildHtml(pid);
    bind(container, pid, onDone);
  }

  function ensureModal() {
    let mask = document.getElementById(MODAL_ID);
    if (mask) return mask;
    ensureStyle();
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.id = MODAL_ID;
    mask.innerHTML = `<div class="modal modal-xl"><div class="modal-header">
        <div><div class="modal-title" id="ca-modal-title">退款与分成调整</div>
        <div class="text-sm text-secondary" id="ca-modal-sub"></div></div>
        <div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('show')">✕</div>
      </div><div class="modal-body" id="ca-modal-body" style="max-height:70vh;overflow-y:auto;"></div>
      <div class="modal-footer"><button class="btn btn-default" onclick="this.closest('.modal-mask').classList.remove('show')">关闭</button></div></div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', e => { if (e.target === mask) mask.classList.remove('show'); });
    return mask;
  }

  function openModal(pid, onDone) {
    const M = global.MOCK; const p = M.getProject(pid);
    const mask = ensureModal();
    mask.querySelector('#ca-modal-title').textContent = `退款与分成调整 · ${p.name}`;
    mask.querySelector('#ca-modal-sub').textContent = `${p.code} · 设计费总额 ¥${money(M.projectDesignFee(p))} · 当前状态 ${M.projectStatus(p)}`;
    renderInto(mask.querySelector('#ca-modal-body'), pid, onDone);
    mask.classList.add('show');
  }

  global.CommissionAdjust = { openModal, renderInto };
})(window);
