// ============ utils.js - 通用工具函数 ============
(function (global) {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.substring(2).toLowerCase(), v);
      else if (k === 'html') node.innerHTML = v;
      else if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v === true ? '' : v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function formatMoney(n, digits = 2) {
    if (n == null || isNaN(n)) return '-';
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  function formatNumber(n) {
    if (n == null || isNaN(n)) return '-';
    return Number(n).toLocaleString('zh-CN');
  }
  function formatDate(d, withTime = false) {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    const pad = n => String(n).padStart(2, '0');
    const s = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
    return withTime ? `${s} ${pad(dt.getHours())}:${pad(dt.getMinutes())}` : s;
  }
  function relativeTime(d) {
    const now = new Date();
    const dt = new Date(d);
    const diff = (now - dt) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    if (diff < 86400 * 30) return Math.floor(diff / 86400) + ' 天前';
    return formatDate(d);
  }

  function initials(name) {
    if (!name) return '?';
    return name.slice(0, 1);
  }

  function colorFrom(name) {
    if (!name) return 1;
    let s = 0;
    for (let i = 0; i < name.length; i++) s = (s + name.charCodeAt(i)) % 6;
    return s + 1;
  }

  // ============ Toast ============
  let toastContainer;
  function toast(message, type = 'info', duration = 2600) {
    if (!toastContainer) {
      toastContainer = el('div', { class: 'toast-container' });
      document.body.appendChild(toastContainer);
    }
    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      danger: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    const t = el('div', { class: `toast ${type}`, html: `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>` });
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.3s, transform 0.3s';
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  // ============ Modal helpers ============
  function openModal(id) {
    const mask = typeof id === 'string' ? document.getElementById(id) : id;
    if (mask) mask.classList.add('open');
  }
  function closeModal(id) {
    const mask = typeof id === 'string' ? document.getElementById(id) : id;
    if (mask) mask.classList.remove('open');
  }
  function confirmDialog(title, message, opts = {}) {
    return new Promise(resolve => {
      const mask = el('div', { class: 'modal-mask' });
      const modal = el('div', { class: 'modal modal-sm' }, [
        el('div', { class: 'modal-header' }, [
          el('div', { class: 'modal-title' }, title),
          el('div', { class: 'modal-close', html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' })
        ]),
        el('div', { class: 'modal-body' }, [el('div', { style: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }, html: message })]),
        el('div', { class: 'modal-footer' }, [
          el('button', { class: 'btn btn-default' }, opts.cancelText || '取消'),
          el('button', { class: `btn ${opts.danger ? 'btn-danger' : 'btn-primary'}` }, opts.okText || '确定')
        ])
      ]);
      mask.appendChild(modal);
      document.body.appendChild(mask);
      requestAnimationFrame(() => mask.classList.add('open'));
      const close = (v) => {
        mask.classList.remove('open');
        setTimeout(() => mask.remove(), 250);
        resolve(v);
      };
      mask.querySelector('.modal-close').onclick = () => close(false);
      mask.querySelectorAll('.modal-footer .btn')[0].onclick = () => close(false);
      mask.querySelectorAll('.modal-footer .btn')[1].onclick = () => close(true);
      mask.onclick = e => { if (e.target === mask) close(false); };
    });
  }

  // ============ Drawer helpers ============
  function openDrawer(id) {
    const mask = typeof id === 'string' ? document.querySelector(`#${id}-mask`) : id.mask;
    const drawer = typeof id === 'string' ? document.getElementById(id) : id.drawer;
    if (mask) mask.classList.add('open');
    if (drawer) drawer.classList.add('open');
  }
  function closeDrawer(id) {
    const mask = typeof id === 'string' ? document.querySelector(`#${id}-mask`) : id.mask;
    const drawer = typeof id === 'string' ? document.getElementById(id) : id.drawer;
    if (mask) mask.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
  }

  // ============ Query params ============
  function getQuery(k) {
    return new URLSearchParams(location.search).get(k);
  }

  // ============ Debounce ============
  function debounce(fn, wait = 200) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Export
  global.$ = $;
  global.$$ = $$;
  global.el = el;
  global.formatMoney = formatMoney;
  global.formatNumber = formatNumber;
  global.formatDate = formatDate;
  global.relativeTime = relativeTime;
  global.initials = initials;
  global.colorFrom = colorFrom;
  global.toast = toast;
  global.openModal = openModal;
  global.closeModal = closeModal;
  global.confirmDialog = confirmDialog;
  global.openDrawer = openDrawer;
  global.closeDrawer = closeDrawer;
  global.getQuery = getQuery;
  global.debounce = debounce;
})(window);
