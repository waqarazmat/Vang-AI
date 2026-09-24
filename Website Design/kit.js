(() => {
const F = {
  home:'./VangAI Home.dc.html', product:'./VangAI Product.dc.html',
  pricing:'./VangAI Pricing.dc.html', about:'./VangAI About.dc.html',
  data:'./VangAI Data and Privacy.dc.html', privacy:'./VangAI Privacy.dc.html',
  cookies:'./VangAI Cookies.dc.html', contact:'./VangAI Contact.dc.html', terms:'./VangAI Terms.dc.html'
};
const BOOK = './VangAI Contact.dc.html';
const EMAIL = '[email address]';
const MONO = "font-family:'IBM Plex Mono',monospace";
const ARROW = '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;display:block"><path d="M4 12h14"/><path d="M12.5 5.5 19.5 12l-7 6.5"/></svg>';
const CHECK = (c='#D85A30') => `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-top:3px"><path d="M4 12.5l5 5L20 6.5"/></svg>`;
// variants: primary (coral/white), outline (dark line on light), outlineLight (cream line on dark), dark (brown/cream, for coral grounds)
const btn = (label, href, v='primary', extra='') => {
  const book = '';
  const base = 'font-size:15px;font-weight:600;padding:14px 26px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;gap:9px;white-space:nowrap;transition:background 180ms ease,color 180ms ease,border-color 180ms ease';
  const s = {
    primary: ['background:#D85A30;color:#FFFFFF;border:1px solid #D85A30', 'background:#2B2118;border-color:#2B2118;color:#FFFFFF'],
    primaryOnDark: ['background:#D85A30;color:#FFFFFF;border:1px solid #D85A30', 'background:#FAEEDA;border-color:#FAEEDA;color:#2B2118'],
    outline: ['background:transparent;color:#2B2118;border:1px solid rgba(43,33,24,0.35)', 'border-color:#2B2118;background:#2B2118;color:#FAEEDA'],
    outlineLight: ['background:transparent;color:#FAEEDA;border:1px solid rgba(250,238,218,0.5)', 'border-color:#FAEEDA;background:#FAEEDA;color:#2B2118'],
    dark: ['background:#2B2118;color:#FAEEDA;border:1px solid #2B2118', 'background:#FAEEDA;border-color:#FAEEDA;color:#2B2118']
  }[v];
  return `<a href="${href}"${book} style="${base};${s[0]}${extra?';'+extra:''}" style-hover="${s[1]}">${label} ${ARROW}</a>`;
};
const navLink = (l, h, on) => `<a href="${h}" style="font-size:16px;font-weight:600;color:${on?'#D85A30':'#2B2118'};transition:color 180ms ease" style-hover="color:#D85A30">${l}</a>`;
const langSwitch = `<div role="group" aria-label="Language" style="display:flex;align-items:center;gap:2px;border:1px solid rgba(43,33,24,0.22);border-radius:99px;padding:3px;${MONO};font-size:11.5px;letter-spacing:0.08em">
          <a href="#nl" data-set-lang="nl" style="padding:6px 10px;border-radius:99px;color:rgba(43,33,24,0.7)">NL</a>
          <a href="#fr" data-set-lang="fr" style="padding:6px 10px;border-radius:99px;color:rgba(43,33,24,0.7)">FR</a>
          <a href="#en" data-set-lang="en" style="padding:6px 10px;border-radius:99px;color:rgba(43,33,24,0.7)">EN</a>
        </div>`;
const nav = (active, uid) => `  <div style="position:sticky;top:0;z-index:40;background:rgba(250,238,218,0.94);backdrop-filter:blur(10px);border-bottom:1px solid rgba(43,33,24,0.12)">
    <div style="max-width:1200px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:12px 28px;flex-wrap:wrap">
      <a href="${F.home}" aria-label="VangAI home" style="flex:none;display:flex;align-items:center;gap:11px;margin-right:auto">
        <div style="width:34px;height:34px;flex:none"><dc-import name="Mark" uid="${uid}nav" radius="{{ 0 }}" bg="transparent" hint-size="34px,34px"></dc-import></div>
        <div style="font-size:21px;font-weight:800;letter-spacing:-0.03em">VangAI</div>
      </a>
      <div style="display:flex;align-items:center;gap:10px 26px;flex-wrap:wrap;font-family:Archivo,sans-serif">
        <div onMouseEnter="{{ navEnter }}" onMouseLeave="{{ navLeave }}" style="position:relative;padding:6px 0">
          <a href="${F.product}" style="display:flex;align-items:center;gap:6px;font-size:16px;font-weight:600;color:${active==='Product'?'#D85A30':'#2B2118'};transition:color 180ms ease" style-hover="color:#D85A30">Product <span aria-hidden="true" style="font-size:11px">▾</span></a>
          <div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);display:{{ ddDisplay }};flex-direction:column;gap:2px;background:#FAEEDA;border:1px solid rgba(43,33,24,0.16);border-radius:16px;padding:10px;min-width:210px;box-shadow:0 14px 34px rgba(43,33,24,0.14);z-index:50">
            <a href="${F.product}#voice" style="padding:10px 14px;border-radius:10px;font-size:15px;font-weight:500;text-align:center" style-hover="background:#FFF6E6;color:#D85A30">VangVoice</a>
            <a href="${F.product}#whatsapp" style="padding:10px 14px;border-radius:10px;font-size:15px;font-weight:500;text-align:center" style-hover="background:#FFF6E6;color:#D85A30">VangMessage</a>
            <a href="${F.product}#chat" style="padding:10px 14px;border-radius:10px;font-size:15px;font-weight:500;text-align:center" style-hover="background:#FFF6E6;color:#D85A30">VangChat</a>
          </div>
        </div>
        ${navLink('Pricing', F.pricing, active==='Pricing')}
        ${navLink('About us', F.about, active==='About')}
        ${langSwitch}
        <a href="${BOOK}" style="flex:none;background:#D85A30;color:#FFFFFF;font-size:15px;font-weight:600;padding:11px 20px;border-radius:99px;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:background 180ms ease" style-hover="background:#2B2118;color:#FFFFFF">Book a call ${ARROW}</a>
      </div>
    </div>
  </div>
`;
const footer = (uid) => `  <div style="max-width:1200px;margin:0 auto;padding:8px 40px 40px">
    <footer style="background:#2B2118;color:#FAEEDA;border-radius:24px;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:rgba(250,238,218,0.12);border-bottom:1px solid rgba(250,238,218,0.12)">
        <a href="./VangAI Product.dc.html#voice" data-ft-card="1" style="min-width:0;display:flex;flex-direction:column;gap:10px;padding:32px;background:#2B2118;color:#FAEEDA;transition:background 250ms ease" style-hover="background:#352A20;color:#FAEEDA">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="flex:none;width:40px;height:40px;border-radius:12px;background:rgba(216,90,48,0.18);color:#E8763F;display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg></span>
            <span style="font-size:24px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:#FAEEDA">VangVoice</span>
          </div>
          <span style="font-size:15px;line-height:1.5;color:#CDBBA2;text-wrap:pretty">Your phone, answered every time.</span>
          <span data-ft-go="1" style="display:inline-flex;align-items:center;gap:8px;margin-top:4px;font-size:14.5px;font-weight:700;color:#E8763F;transition:transform 250ms ease">See product <svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;display:block"><path d="M4 12h14"/><path d="M12.5 5.5 19.5 12l-7 6.5"/></svg></span>
        </a>
        <a href="./VangAI Product.dc.html#whatsapp" data-ft-card="1" style="min-width:0;display:flex;flex-direction:column;gap:10px;padding:32px;background:#2B2118;color:#FAEEDA;transition:background 250ms ease" style-hover="background:#352A20;color:#FAEEDA">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="flex:none;width:40px;height:40px;border-radius:12px;background:rgba(216,90,48,0.18);color:#E8763F;display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg></span>
            <span style="font-size:24px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:#FAEEDA">VangMessage</span>
          </div>
          <span style="font-size:15px;line-height:1.5;color:#CDBBA2;text-wrap:pretty">WhatsApp replies within seconds.</span>
          <span data-ft-go="1" style="display:inline-flex;align-items:center;gap:8px;margin-top:4px;font-size:14.5px;font-weight:700;color:#E8763F;transition:transform 250ms ease">See product <svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;display:block"><path d="M4 12h14"/><path d="M12.5 5.5 19.5 12l-7 6.5"/></svg></span>
        </a>
        <a href="./VangAI Product.dc.html#chat" data-ft-card="1" style="min-width:0;display:flex;flex-direction:column;gap:10px;padding:32px;background:#2B2118;color:#FAEEDA;transition:background 250ms ease" style-hover="background:#352A20;color:#FAEEDA">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="flex:none;width:40px;height:40px;border-radius:12px;background:rgba(216,90,48,0.18);color:#E8763F;display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H8l-4 4V6c0-1.1.9-2 2-2zm3 6v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/></svg></span>
            <span style="font-size:24px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:#FAEEDA">VangChat</span>
          </div>
          <span style="font-size:15px;line-height:1.5;color:#CDBBA2;text-wrap:pretty">Answers on your website, 24/7.</span>
          <span data-ft-go="1" style="display:inline-flex;align-items:center;gap:8px;margin-top:4px;font-size:14.5px;font-weight:700;color:#E8763F;transition:transform 250ms ease">See product <svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;display:block"><path d="M4 12h14"/><path d="M12.5 5.5 19.5 12l-7 6.5"/></svg></span>
        </a>
      </div>
      <div style="position:relative;overflow:hidden">
        <div aria-hidden="true" data-no-i18n="1" style="position:absolute;left:24px;bottom:0.02em;display:flex;align-items:baseline;font-family:Archivo,Helvetica,sans-serif;font-size:clamp(96px,17vw,210px);font-weight:800;letter-spacing:-0.05em;line-height:0.78;color:#33281F;white-space:nowrap;pointer-events:none;user-select:none">VangAI<span style="display:inline-block;flex:none;width:0.15em;height:0.15em;border-radius:50%;background:#D85A30;margin-left:0.05em;opacity:0.55"></span></div>
        <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px 32px;flex-wrap:wrap;padding:30px 32px">
          <a href="./VangAI Home.dc.html" aria-label="VangAI home" style="display:flex;align-items:center;gap:11px;color:#FAEEDA" style-hover="color:#FAEEDA">
            <div style="width:34px;height:34px;flex:none"><dc-import name="Mark" uid="${uid}ft" radius="{{ 0 }}" bg="transparent" hint-size="34px,34px"></dc-import></div>
            <div style="font-size:21px;font-weight:800;letter-spacing:-0.03em">VangAI</div>
          </a>
          <div style="display:flex;align-items:center;gap:10px 28px;flex-wrap:wrap">
            <a href="./VangAI Pricing.dc.html" style="font-size:16px;font-weight:500;color:rgba(250,238,218,0.88)" style-hover="color:#E8763F">Pricing</a>
            <a href="./VangAI About.dc.html" style="font-size:16px;font-weight:500;color:rgba(250,238,218,0.88)" style-hover="color:#E8763F">About us</a>
            <a href="./VangAI Contact.dc.html" style="font-size:16px;font-weight:500;color:rgba(250,238,218,0.88)" style-hover="color:#E8763F">Contact</a>
            <a href="mailto:[email address]" data-todo="[email address]" style="font-size:16px;font-weight:600;color:#E8763F" style-hover="color:#FAEEDA">[email address]</a>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <div role="group" aria-label="Language" style="display:flex;align-items:center;gap:2px;border:1px solid rgba(250,238,218,0.28);border-radius:99px;padding:3px;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.08em">
              <a href="#nl" data-set-lang="nl" data-lang-dark="1" style="padding:6px 10px;border-radius:99px;color:rgba(250,238,218,0.7)">NL</a>
              <a href="#fr" data-set-lang="fr" data-lang-dark="1" style="padding:6px 10px;border-radius:99px;color:rgba(250,238,218,0.7)">FR</a>
              <a href="#en" data-set-lang="en" data-lang-dark="1" style="padding:6px 10px;border-radius:99px;color:rgba(250,238,218,0.7)">EN</a>
            </div>
            <a href="./VangAI Contact.dc.html" style="font-size:15px;font-weight:600;padding:14px 26px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;gap:9px;white-space:nowrap;transition:background 180ms ease,color 180ms ease,border-color 180ms ease;background:#D85A30;color:#FFFFFF;border:1px solid #D85A30" style-hover="background:#FAEEDA;border-color:#FAEEDA;color:#2B2118">Book a call <svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;display:block"><path d="M4 12h14"/><path d="M12.5 5.5 19.5 12l-7 6.5"/></svg></a>
          </div>
        </div>
        <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px 20px;flex-wrap:wrap;padding:16px 32px 20px;border-top:1px solid rgba(250,238,218,0.12);font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(250,238,218,0.62)">
          <span>© 2026 VangAI, Hasselt, Belgium, [company number]</span>
          <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
            <a href="./VangAI Privacy.dc.html" style="color:rgba(250,238,218,0.62)" style-hover="color:#FAEEDA">Privacy</a>
            <a href="./VangAI Cookies.dc.html" style="color:rgba(250,238,218,0.62)" style-hover="color:#FAEEDA">Cookies</a>
            <a href="./VangAI Terms.dc.html" style="color:rgba(250,238,218,0.62)" style-hover="color:#FAEEDA">Terms</a>
            <a href="./VangAI Data and Privacy.dc.html" style="color:rgba(250,238,218,0.62)" style-hover="color:#FAEEDA">Data &amp; privacy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
`;
const LOGIC = (extra, state, mount) => `class Component extends DCLogic {
  state = Object.assign({ nav: false, faq: {} }, ${state||'{}'});
${mount||''}
  renderVals() {
    const v = {
      ddDisplay: this.state.nav ? 'flex' : 'none',
      navEnter: () => this.setState({ nav: true }),
      navLeave: () => this.setState({ nav: false })
    };
    for (let i = 0; i < 40; i++) {
      const open = !!this.state.faq[i];
      v['faqR' + i] = open ? '1fr' : '0fr';
      v['faqSign' + i] = open ? '–' : '+';
      v['faqX' + i] = open ? 'true' : 'false';
      v['faqT' + i] = () => this.setState(s => ({ faq: Object.assign({}, s.faq, { [i]: !s.faq[i] }) }));
    }
${extra||''}    return v;
  }
}`;
const esc = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const page = (o) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-nl="${esc(o.titleNl)}">${o.title}</title>
<meta name="description" content="${esc(o.desc)}" data-nl="${esc(o.descNl)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VangAI">
<meta property="og:title" content="${esc(o.title)}" data-nl="${esc(o.titleNl)}">
<meta property="og:description" content="${esc(o.desc)}" data-nl="${esc(o.descNl)}">
<meta property="og:image" content="./assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="./assets/favicon.png">
<link rel="apple-touch-icon" href="./assets/favicon.png">
<script src="./support.js"></script>
<script src="./i18n-nl.js"></script>
<script src="./i18n-fr.js"></script>
<script src="./site.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
${o.extraHead||''}<style>
body{margin:0;background:#FAEEDA;}
a{color:#2B2118;text-decoration:none;}
a:hover{color:#D85A30;}
::selection{background:#D85A30;color:#FAEEDA;}
[data-ft-card]:hover [data-ft-go]{transform:translateX(4px);}
[data-paused="1"],[data-paused="1"] *{animation-play-state:paused !important;}
@media (prefers-reduced-motion: reduce){*{animation-duration:1ms !important;animation-iteration-count:1 !important;transition-duration:1ms !important;}}
</style>
</helmet>
<div style="font-family:Archivo,Helvetica,sans-serif;color:#2B2118;background:#FAEEDA;min-height:100vh">

${nav(o.active, o.uid)}
${o.body}
${footer(o.uid)}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script${o.props?` data-props="${esc(o.props)}"`:''}>
${LOGIC(o.logicExtra, o.state, o.mount)}
</script>
</body>
</html>
`;
const H = 'font-family:Archivo,Helvetica,sans-serif';
const eyebrow = (t, c='#D85A30') => `<div style="${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${c}">/ ${t}</div>`;
const h2 = (t, dark, size=44, mw=22) => `<h2 style="${H};font-size:${size}px;font-weight:800;letter-spacing:-0.035em;line-height:1.05;margin:18px 0 0;max-width:${mw}ch;text-wrap:balance${dark?';color:#FAEEDA':''}">${t}</h2>`;
const lede = (t, dark, mw=60) => `<p style="font-size:18px;line-height:1.7;color:${dark?'rgba(250,238,218,0.85)':'rgba(43,33,24,0.8)'};max-width:${mw}ch;margin:18px 0 0;text-wrap:pretty">${t}</p>`;
const hero = (eye, h1, sub, extra) => `  <div id="top" style="max-width:1200px;margin:0 auto;padding:80px 40px 56px">
    ${eyebrow(eye)}
    <h1 style="${H};font-size:62px;line-height:0.99;font-weight:800;letter-spacing:-0.04em;margin:24px 0 0;max-width:20ch;text-wrap:balance">${h1}</h1>
    <p style="font-size:20px;line-height:1.6;color:rgba(43,33,24,0.78);max-width:54ch;margin:22px 0 0;text-wrap:pretty">${sub}</p>
${extra||''}  </div>
`;
// accordion FAQ; items = [[q,a]]; dark = dark section; compact = small boxes
const faqItem = (q, a, i, dark, compact) => {
  const pad = compact ? '13px 16px' : '15px 22px';
  const qs = compact ? 'font-size:16.5px' : 'font-size:18.5px';
  const as = compact ? 'padding:0 18px 16px;font-size:15.5px;line-height:1.6' : 'padding:0 22px 16px;font-size:17px;line-height:1.7';
  return `        <div style="background:${dark?'rgba(250,238,218,0.06)':'#FAEEDA'};border:1px solid ${dark?'rgba(250,238,218,0.14)':'rgba(43,33,24,0.1)'};border-radius:${compact?14:18}px;overflow:hidden">
          <div onClick="{{ faqT${i} }}" role="button" tabindex="0" aria-expanded="{{ faqX${i} }}" style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:${pad};cursor:pointer">
            <span style="${H};${qs};font-weight:700;letter-spacing:-0.02em;line-height:1.35;text-wrap:pretty${dark?';color:#FAEEDA':''}">${q}</span>
            <span aria-hidden="true" style="${MONO};font-size:20px;line-height:1.1;color:#D85A30;flex:none">{{ faqSign${i} }}</span>
          </div>
          <div style="display:grid;grid-template-rows:{{ faqR${i} }};transition:grid-template-rows 380ms cubic-bezier(.22,.61,.36,1)"><div style="overflow:hidden;min-height:0"><div style="${as};color:${dark?'rgba(250,238,218,0.82)':'rgba(43,33,24,0.8)'};max-width:64ch;text-wrap:pretty">${a}</div></div></div>
        </div>`;
};
const faq = (items, base, title, opt={}) => `  <div style="${opt.dark?'background:#2B2118;color:#FAEEDA':'background:#F3E4CC;border-top:1px solid rgba(43,33,24,0.12);border-bottom:1px solid rgba(43,33,24,0.12)'}">
    <div style="max-width:1200px;margin:0 auto;padding:88px 40px">
      ${eyebrow('FAQ')}
      ${h2(title||'Questions we get a lot', opt.dark, 40)}
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:34px;max-width:880px">
${items.map(([q,a],n)=>faqItem(q,a,base+n,opt.dark,false)).join('\n')}
      </div>
    </div>
  </div>
`;
const cta = (uid, head, sub, dark) => `  <div style="max-width:1200px;margin:0 auto;padding:88px 40px 104px">
    <div style="background:${dark?'#2B2118':'#D85A30'};border-radius:28px;padding:64px 56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:36px 40px;align-items:center">
      <div style="min-width:0;display:flex;flex-direction:column;align-items:flex-start">
        <h2 style="${H};font-size:48px;font-weight:800;letter-spacing:-0.04em;line-height:1.02;margin:0;color:#FAEEDA;max-width:20ch;text-wrap:balance">${head}</h2>
        <p style="font-size:18px;line-height:1.6;color:#FAEEDA;max-width:44ch;margin:18px 0 30px;text-wrap:pretty">${sub}</p>
        ${btn('Book a call', BOOK, dark?'primaryOnDark':'dark')}
      </div>
      <div style="min-width:0;display:flex;justify-content:center">
        <div style="width:180px;height:180px"><dc-import name="Mark" uid="${uid}cta" tone="cream" radius="{{ 0 }}" bg="transparent" hint-size="180px,180px"></dc-import></div>
      </div>
    </div>
  </div>
`;
const checks = (items, dark) => `<div style="display:flex;flex-direction:column;gap:2px">
${items.map(t=>`          <div style="display:flex;align-items:flex-start;gap:12px;padding:8px 0">${CHECK()}<span style="font-size:16.5px;line-height:1.55;color:${dark?'rgba(250,238,218,0.88)':'rgba(43,33,24,0.86)'};text-wrap:pretty">${t}</span></div>`).join('\n')}
        </div>`;
const website = (uid) => `  <div style="max-width:1200px;margin:0 auto;padding:0 40px 88px">
    <div style="background:#2B2118;color:#FAEEDA;border-radius:24px;padding:40px 44px;display:flex;align-items:center;justify-content:space-between;gap:24px 40px;flex-wrap:wrap">
      <div style="min-width:0;max-width:60ch">
        ${eyebrow('Extra service')}
        <div style="${H};font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin-top:14px;color:#FAEEDA">No website yet? We build those too.</div>
        <p style="font-size:16.5px;line-height:1.65;color:rgba(250,238,218,0.85);margin:12px 0 0;text-wrap:pretty">Most owners know they need a proper website. They just do not have the time. We build one around your business, in your style, with your assistant already on it.</p>
        <div style="${MONO};font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:#E8763F;margin-top:14px">Simple sites from €500, bigger builds quoted on the call.</div>
      </div>
      ${btn('Request a quote', BOOK, 'outlineLight')}
    </div>
  </div>
`;
const built = (withBook) => `  <div style="max-width:1200px;margin:0 auto;padding:88px 40px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px 64px;align-items:center">
      <div style="min-width:0">
        ${eyebrow('Done for you')}
        ${h2('Built around your business, not a template', false, 40, 18)}
        ${lede('We do not hand you a standard bot and wish you luck. We build your assistant around your services, your prices and the way you talk to customers. Need more than one channel? We connect phone, WhatsApp and website chat into one system with one memory. No website yet? We build that too. One partner for your whole front desk, with one goal: more customers and more revenue for your business.', false, 56)}
      </div>
      <div style="min-width:0;background:#FFF6E6;border:1px solid rgba(43,33,24,0.12);border-radius:24px;padding:30px 30px 34px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">
        ${checks(['Tailored to your services, prices and tone','Connected to the calendar you already use','Phone, WhatsApp, website chat, and a website if you need one','We stay with you: weekly updates, support and a monthly report'])}
        ${withBook ? btn('Book a call', BOOK) : btn('See how it works', '#voice', 'outline')}
      </div>
    </div>
  </div>
`;
return {F,BOOK,EMAIL,MONO,ARROW,CHECK,H,btn,nav,footer,page,eyebrow,h2,lede,hero,faq,faqItem,cta,checks,website,built,esc};
})()
