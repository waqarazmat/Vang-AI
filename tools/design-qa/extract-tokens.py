"""Lists every distinct design value (colours, type, spacing, radii, shadows, breakpoints)
used by the VangAI site pages, with counts. Source of truth for the Tailwind tokens."""
import re, glob, json, collections, os
D = os.path.join(os.path.dirname(__file__), '..', '..', 'Website Design')
files = [f for f in glob.glob(os.path.join(D, '*.dc.html')) if re.search(r'(VangAI (Home|Product|Pricing|About|Contact|Privacy|Cookies|Terms|Data and Privacy)|VangCall|VangWhatsApp|VangWebChat|VangLost C)\.dc\.html$', f)]
props = collections.defaultdict(collections.Counter)
colors = collections.Counter()
media = collections.Counter()
for f in files:
    h = open(f, encoding='utf8').read()
    h = re.sub(r'<script type="text/x-dc".*?</script>', '', h, flags=re.S)
    css = ' '.join(re.findall(r'style="([^"]*)"', h)) + ' ' + ' '.join(re.findall(r'<style>(.*?)</style>', h, re.S))
    for m in re.finditer(r'([a-z-]+)\s*:\s*([^;"{}]+)', css):
        p, v = m.group(1), m.group(2).strip()
        if '{{' in v: continue
        props[p][v] += 1
    for c in re.findall(r'#[0-9A-Fa-f]{6}\b|rgba?\([^)]*\)', css): colors[c.upper() if c.startswith('#') else c.replace(' ', '')] += 1
    for q in re.findall(r'@media\s*\(([^)]*)\)', h): media[q.replace(' ', '')] += 1
out = {p: props[p].most_common() for p in ['font-family','font-size','font-weight','letter-spacing','line-height','text-transform','border-radius','padding','gap','max-width','box-shadow','border','transition','animation']}
out['colors'] = colors.most_common()
out['media'] = media.most_common()
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'out', 'design-tokens.json'), 'w'), indent=1)
for k, v in out.items():
    print(f'== {k} ({len(v)})'); print('   ' + ' | '.join(f'{a} ×{b}' for a, b in v[:40]))
