"""Converts a design fragment (HTML/SVG with inline styles) to JSX, mechanically:
kebab-case SVG attributes -> camelCase, style="..." -> style={{...}}, class -> className.
Usage: python scripts/html-to-jsx.py <file.dc.html> <start marker> <end marker>"""
import re, sys, json
h = open(sys.argv[1], encoding='utf8').read()
a = h.index(sys.argv[2]); b = h.index(sys.argv[3], a) + len(sys.argv[3])
frag = h[a:b]
ATTR = {'class': 'className', 'viewbox': 'viewBox', 'preserveaspectratio': 'preserveAspectRatio', 'patternunits': 'patternUnits', 'stddeviation': 'stdDeviation', 'tabindex': 'tabIndex'}
def camel(s): return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), s)
def style_obj(css):
    out = []
    for decl in css.split(';'):
        if ':' not in decl: continue
        k, v = decl.split(':', 1); k = k.strip(); v = v.strip()
        key = k if k.startswith('--') else camel(k)
        out.append(f"{json.dumps(key) if key.startswith('--') else key}: {json.dumps(v)}")
    return '{{ ' + ', '.join(out) + ' }}'
def fix_attrs(tag):
    def rep(m):
        name, val = m.group(1), m.group(2)
        if name == 'style': return f'style={style_obj(val)}'
        if name.startswith(('data-', 'aria-')): return f'{name}="{val}"'
        n = ATTR.get(name.lower(), camel(name) if '-' in name else name)
        return f'{n}="{val}"'
    return re.sub(r'([a-zA-Z_:][-a-zA-Z0-9_:]*)="([^"]*)"', rep, tag)
out = re.sub(r'<[a-zA-Z][^>]*>', lambda m: fix_attrs(m.group(0)), frag)
out = re.sub(r'<(image|circle|rect|path|stop|feGaussianBlur)([^>]*?)(?<!/)></\1>', r'<\1\2 />', out)
print(out)
