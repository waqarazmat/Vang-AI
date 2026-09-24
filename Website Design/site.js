(function () {
  var DICT = { nl: window.VANG_NL || {}, fr: window.VANG_FR || {} };
  var PAT = { nl: window.VANG_NL_PATTERNS || [], fr: window.VANG_FR_PATTERNS || [] };
  var LANGS = ['nl', 'fr', 'en'];
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  var stored = null;
  try { stored = localStorage.getItem('vang-lang'); } catch (e) {}
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  var lang = LANGS.indexOf(stored) >= 0 ? stored : (/^nl/i.test(nav) ? 'nl' : (/^fr/i.test(nav) ? 'fr' : 'en'));
  window.VangLang = lang;

  function tr(s) {
    var L = window.VangLang;
    if (L === 'en') return s;
    var D = DICT[L] || {}, P = PAT[L] || [];
    var k = norm(s);
    if (!k) return s;
    if (D[k] !== undefined) return D[k];
    for (var i = 0; i < P.length; i++) { if (P[i][0].test(k)) return k.replace(P[i][0], P[i][1]); }
    return s;
  }
  window.VangT = tr;

  var orig = new WeakMap(), mine = new WeakMap(), attrOrig = new WeakMap();
  var ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, 'X-DC': 1, TEMPLATE: 1 };

  function skipEl(el) {
    while (el && el.nodeType === 1) {
      if (SKIP[el.tagName] || el.hasAttribute('data-no-i18n')) return true;
      el = el.parentNode;
    }
    return false;
  }
  function doText(n) {
    if (!orig.has(n)) orig.set(n, n.data);
    var src = orig.get(n);
    if (!norm(src)) return;
    var m = src.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var out = window.VangLang !== 'en' ? m[1] + tr(m[2]) + m[3] : src;
    if (n.data !== out) { mine.set(n, out); n.data = out; }
    else mine.set(n, out);
  }
  function doAttrs(el) {
    var o = attrOrig.get(el);
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      if (!o) { o = {}; attrOrig.set(el, o); }
      if (o[a] === undefined) o[a] = el.getAttribute(a);
      var v = window.VangLang !== 'en' ? tr(o[a]) : o[a];
      if (el.getAttribute(a) !== v) el.setAttribute(a, v);
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!skipEl(root.parentNode)) doText(root); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return (SKIP[n.tagName] || n.hasAttribute('data-no-i18n')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(doText);
    root.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(function (el) { if (!skipEl(el)) doAttrs(el); });
  }

  function meta() {
    var L = window.VangLang;
    document.documentElement.lang = L === 'nl' ? 'nl-BE' : (L === 'fr' ? 'fr-BE' : 'en');
    var t = document.querySelector('title');
    if (t) {
      if (!t.hasAttribute('data-en')) t.setAttribute('data-en', t.textContent);
      document.title = (L !== 'en' && t.getAttribute('data-' + L)) || t.getAttribute('data-en');
    }
    document.querySelectorAll('meta[data-nl],meta[data-fr]').forEach(function (m) {
      if (!m.hasAttribute('data-en')) m.setAttribute('data-en', m.getAttribute('content'));
      m.setAttribute('content', (L !== 'en' && m.getAttribute('data-' + L)) || m.getAttribute('data-en'));
    });
  }
  function paintSwitch() {
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      var on = b.getAttribute('data-set-lang') === window.VangLang;
      var dark = b.hasAttribute('data-lang-dark');
      b.style.background = on ? (dark ? '#FAEEDA' : '#2B2118') : 'transparent';
      b.style.color = on ? (dark ? '#2B2118' : '#FAEEDA') : (dark ? 'rgba(250,238,218,0.7)' : 'rgba(43,33,24,0.7)');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function apply() { walk(document.body); meta(); paintSwitch(); }

  window.VangSetLang = function (l) {
    if (LANGS.indexOf(l) < 0) return;
    window.VangLang = l;
    try { localStorage.setItem('vang-lang', l); } catch (e) {}
    apply();
    window.dispatchEvent(new Event('vang-lang'));
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-set-lang]');
    if (b) { e.preventDefault(); window.VangSetLang(b.getAttribute('data-set-lang')); }
  });

  var pending = new Set(), sched = false;
  function flush() {
    sched = false;
    pending.forEach(function (n) {
      if (!n.isConnected) return;
      if (n.nodeType === 3) {
        if (mine.get(n) === n.data) return;
        orig.set(n, n.data);
        if (!skipEl(n.parentNode)) doText(n);
      } else walk(n);
    });
    pending.clear();
    paintSwitch();
  }
  var mo = new MutationObserver(function (recs) {
    recs.forEach(function (r) {
      if (r.type === 'characterData') pending.add(r.target);
      else if (r.type === 'attributes') { if (!skipEl(r.target)) { var o = attrOrig.get(r.target); var v = r.target.getAttribute(r.attributeName); if (o && v !== tr(o[r.attributeName]) && v !== o[r.attributeName]) { o[r.attributeName] = v; } pending.add(r.target); } }
      else r.addedNodes.forEach(function (n) { pending.add(n); });
    });
    if (!sched) { sched = true; setTimeout(flush, 0); }
  });

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.setAttribute('data-paused', e.isIntersecting ? '0' : '1'); });
  }) : null;
  function watchAnim() { if (io) document.querySelectorAll('[data-anim]:not([data-anim-w])').forEach(function (el) { el.setAttribute('data-anim-w', '1'); io.observe(el); }); }

  function boot() {
    apply();
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    watchAnim();
    setInterval(watchAnim, 1500);
    var n = 0, t = setInterval(function () { apply(); if (++n > 20) clearInterval(t); }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
