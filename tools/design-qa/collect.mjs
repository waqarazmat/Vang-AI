// In-page collectors, run via page.evaluate on both design and build.

// Every visible element that carries its own text, or is interactive.
// Tags each with data-qa-idx so it can be hovered afterwards.
export function collectElements() {
  // Normalised computed styles: oklab()/color() values reported as rgba() (see lib.mjs).
  const N = window.__qaNormColor || ((x) => x);
  const GCS = (el) => new Proxy(getComputedStyle(el), { get: (t, k) => (typeof t[k] === 'string' ? N(t[k]) : t[k]) });
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK']);
  const PROPS = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textTransform',
    'textAlign',
    'textDecorationLine',
    'color',
    'backgroundColor',
    'backgroundImage',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'boxShadow',
    'opacity',
    'cursor',
  ];
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const out = [];
  let idx = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (SKIP.has(el.tagName) || el instanceof SVGElement) continue;
    const own = norm(
      [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.data)
        .join(' '),
    );
    const interactive = el.matches(
      'a[href],button,[role=button],input,textarea,select,label,[tabindex]:not([tabindex="-1"])',
    );
    if (!own && !interactive) continue;
    const r = el.getBoundingClientRect();
    const cs = GCS(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
    let hidden = false;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const pcs = GCS(p);
      if (pcs.opacity === '0' || pcs.display === 'none' || pcs.visibility === 'hidden') {
        hidden = true;
        break;
      }
    }
    if (hidden) continue;
    const label =
      own || norm(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent || '').slice(0, 80);
    const style = {};
    for (const p of PROPS) style[p] = cs[p];
    el.setAttribute('data-qa-idx', String(idx));
    out.push({
      idx: idx++,
      key: `${interactive ? 'I' : 'T'}:${label}`,
      text: label,
      tag: el.tagName.toLowerCase(),
      interactive,
      rect: {
        x: Math.round(r.left + scrollX),
        y: Math.round(r.top + scrollY),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
      },
      style,
    });
  }
  return out;
}

// Every colour actually painted, with an example element for each.
export function collectColors() {
  // Normalised computed styles: oklab()/color() values reported as rgba() (see lib.mjs).
  const N = window.__qaNormColor || ((x) => x);
  const GCS = (el) => new Proxy(getComputedStyle(el), { get: (t, k) => (typeof t[k] === 'string' ? N(t[k]) : t[k]) });
  const found = {};
  const add = (c, where) => {
    if (!c || c === 'none' || /rgba\(0, 0, 0, 0\)|transparent/.test(c)) return;
    (found[c] ||= { count: 0, examples: [] }).count++;
    if (found[c].examples.length < 3) found[c].examples.push(where);
  };
  const colorsIn = (s) => s.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}\b/g) || [];
  const desc = (el) => {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${t}"`;
  };
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    const cs = GCS(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    const d = desc(el);
    if (el instanceof SVGElement) {
      if (cs.fill && cs.fill !== 'none') add(cs.fill, `fill ${d}`);
      if (cs.stroke && cs.stroke !== 'none') add(cs.stroke, `stroke ${d}`);
      if (el.tagName.toLowerCase() === 'stop') add(cs.stopColor, `stop ${d}`);
      continue;
    }
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
    if (own) add(cs.color, `text ${d}`);
    add(cs.backgroundColor, `bg ${d}`);
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none')
        add(cs[`border${s}Color`], `border ${d}`);
    }
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) add(cs.outlineColor, `outline ${d}`);
    for (const c of colorsIn(cs.backgroundImage)) add(c, `gradient ${d}`);
    for (const c of colorsIn(cs.boxShadow)) add(c, `shadow ${d}`);
  }
  return found;
}

// Text contrast against the nearest opaque background.
export function collectContrast() {
  // Normalised computed styles: oklab()/color() values reported as rgba() (see lib.mjs).
  const N = window.__qaNormColor || ((x) => x);
  const GCS = (el) => new Proxy(getComputedStyle(el), { get: (t, k) => (typeof t[k] === 'string' ? N(t[k]) : t[k]) });
  const parse = (c) => {
    const m = c.match(/[\d.]+/g);
    return m ? m.map(Number) : null;
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const blend = (fg, bg) => {
    const a = fg[3] ?? 1;
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  const bgOf = (el) => {
    const layers = [];
    for (let p = el; p; p = p.parentElement) {
      const c = parse(GCS(p).backgroundColor);
      if (c && (c[3] ?? 1) > 0) {
        layers.push(c);
        if ((c[3] ?? 1) >= 1) break;
      }
    }
    let base = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el instanceof SVGElement || ['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.data)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    // WCAG exemptions: decorative (aria-hidden), single symbols (icon rules, 3:1), disabled controls.
    if (own.length < 2 || el.closest('[aria-hidden="true"]')) continue;
    if (
      el.matches('[role=button][tabindex="-1"],[disabled],[aria-disabled="true"]') ||
      (el.matches('[role=button]') && GCS(el).cursor === 'default')
    )
      continue;
    const cs = GCS(el);
    const r = el.getBoundingClientRect();
    if (!r.width || cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    if (GCS(el).backgroundImage !== 'none') continue; // cannot resolve gradients reliably
    const bg = bgOf(el);
    const fg = blend(parse(cs.color), bg);
    const L1 = lum(fg),
      L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize),
      weight = parseInt(cs.fontWeight, 10);
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    out.push({
      text: own.slice(0, 60),
      ratio: +ratio.toFixed(2),
      large,
      size,
      weight,
      fg: cs.color,
      bg: `rgb(${bg.map(Math.round).join(', ')})`,
    });
  }
  return out;
}
