"""Converts a design fragment (HTML with inline styles) into JSX with Tailwind classes.

Every inline declaration becomes a Tailwind class with the exact value (arbitrary values),
brand colours become token classes (rgba(43,33,24,0.8) -> text-ink/80), style-hover becomes
hover: variants. Anything without a direct utility becomes an arbitrary property [prop:value].
Text and {{ template }} holes are left as they are, to be wired to translations by hand.

Usage: python scripts/design-to-tsx.py <file.dc.html> <start marker> <end marker> [--occurrence N]
"""
import re, sys

TOKENS = {'#D85A30': 'coral', '#854F0B': 'amber', '#FAEEDA': 'cream', '#2B2118': 'ink', '#FFFFFF': 'white',
          '#B8441F': 'coral-deep', '#E8763F': 'coral-light', '#F3E4CC': 'sand', '#FFF6E6': 'paper'}
RGB = {'43,33,24': 'ink', '250,238,218': 'cream', '216,90,48': 'coral', '255,255,255': 'white', '133,79,11': 'amber'}


def arb(v):
    return v.strip().replace(' ', '_')


def color(prefix, v):
    v = v.strip()
    up = v.upper()
    if up in TOKENS:
        return f'{prefix}-{TOKENS[up]}'
    m = re.fullmatch(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)', v.replace(' ', ''))
    if m and f'{m[1]},{m[2]},{m[3]}' in RGB:
        a = round(float(m[4]) * 100, 2)
        a = int(a) if a == int(a) else a
        return f'{prefix}-{RGB[m[1] + "," + m[2] + "," + m[3]]}/{a}'
    if v == 'transparent':
        return f'{prefix}-transparent'
    return f'{prefix}-[{arb(v)}]'


def box(prefix, v):
    parts = v.split()
    if len(parts) == 1:
        return [f'{prefix}-[{parts[0]}]' if parts[0] != '0' else f'{prefix}-0']
    t, r, b, l = (parts * 4)[:4] if len(parts) == 1 else (
        (parts[0], parts[1], parts[0], parts[1]) if len(parts) == 2 else
        (parts[0], parts[1], parts[2], parts[1]) if len(parts) == 3 else parts)
    val = lambda x: '0' if x == '0' else 'auto' if x == 'auto' else f'[{x}]'
    if t == b and l == r:
        return [f'{prefix}y-{val(t)}', f'{prefix}x-{val(l)}']
    return [f'{prefix}t-{val(t)}', f'{prefix}r-{val(r)}', f'{prefix}b-{val(b)}', f'{prefix}l-{val(l)}']


def border(side, v):
    side = {'': '', 'top': '-t', 'bottom': '-b', 'left': '-l', 'right': '-r'}[side]
    v = v.strip()
    if v == '0':
        return [f'border{side}-0']
    m = re.match(r'(\d+(?:\.\d+)?px)\s+(solid|dashed)\s+(.+)', v)
    if not m:
        return [f'[border{"-" + side[1:] if side else ""}:{arb(v)}]'.replace('border-t:', 'border-top:')]
    w, style, c = m.groups()
    out = [f'border{side}' if w == '1px' else f'border{side}-[{w}]']
    if style == 'dashed':
        out.append('border-dashed')
    out.append(color('border', c))
    return out


ALIGN = {'flex-start': 'start', 'flex-end': 'end', 'center': 'center', 'stretch': 'stretch', 'baseline': 'baseline',
         'space-between': 'between', 'space-around': 'around', 'start': 'start', 'end': 'end'}


def decl(prop, v):
    v = v.strip().replace('!important', '').strip()
    p = prop.strip()
    if p == 'font-family':
        return ['font-mono' if 'Mono' in v else 'font-sans']
    if p == 'font-size': return [f'text-[{v}]']
    if p == 'font-weight': return [f'font-[{v}]']
    if p == 'letter-spacing': return [f'tracking-[{v}]']
    if p == 'line-height': return [f'leading-[{v}]']
    if p == 'text-transform' and v == 'uppercase': return ['uppercase']
    if p == 'text-align': return [f'text-{v}']
    if p == 'text-wrap': return [f'text-{v}']
    if p == 'white-space' and v == 'nowrap': return ['whitespace-nowrap']
    if p == 'color': return [color('text', v)]
    if p in ('background', 'background-color'):
        return [color('bg', v)] if not ('gradient' in v or 'url(' in v) else [f'bg-[{arb(v)}]']
    if p == 'border': return border('', v)
    if p.startswith('border-') and p.split('-')[1] in ('top', 'bottom', 'left', 'right') and len(p.split('-')) == 2:
        return border(p.split('-')[1], v)
    if p == 'border-color': return [color('border', v)]
    if p == 'border-radius': return [f'rounded-[{arb(v)}]']
    if p == 'padding': return box('p', v)
    if p == 'margin':
        if v == '0': return ['m-0']
        return box('m', v)
    if p in ('padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right'):
        k = {'padding': 'p', 'margin': 'm'}[p.split('-')[0]] + p.split('-')[1][0]
        return [f'{k}-auto' if v == 'auto' else f'{k}-[{v}]']
    if p == 'gap':
        parts = v.split()
        return [f'gap-[{v}]'] if len(parts) == 1 else [f'gap-y-[{parts[0]}]', f'gap-x-[{parts[1]}]']
    if p == 'display':
        return [{'flex': 'flex', 'grid': 'grid', 'inline-flex': 'inline-flex', 'block': 'block', 'none': 'hidden',
                 'inline-block': 'inline-block', 'inline': 'inline'}.get(v, f'[display:{v}]')]
    if p == 'flex-direction' and v == 'column': return ['flex-col']
    if p == 'flex-wrap' and v == 'wrap': return ['flex-wrap']
    if p == 'align-items': return [f'items-{ALIGN.get(v, v)}']
    if p == 'align-self': return [f'self-{ALIGN.get(v, v)}']
    if p == 'justify-content': return [f'justify-{ALIGN.get(v, v)}']
    if p == 'justify-self': return [f'justify-self-{ALIGN.get(v, v)}']
    if p == 'flex': return ['flex-none'] if v == 'none' else ['flex-1'] if v == '1' else [f'flex-[{arb(v)}]']
    if p in ('width', 'height', 'max-width', 'min-width', 'max-height', 'min-height'):
        k = {'width': 'w', 'height': 'h', 'max-width': 'max-w', 'min-width': 'min-w', 'max-height': 'max-h', 'min-height': 'min-h'}[p]
        return [f'{k}-0'] if v in ('0', '0px') else [f'{k}-full'] if v == '100%' else [f'{k}-[{arb(v)}]']
    if p == 'position': return [v]
    if p in ('top', 'left', 'right', 'bottom'): return [f'{p}-0'] if v == '0' else [f'{p}-[{v}]']
    if p == 'inset': return ['inset-0'] if v == '0' else [f'inset-[{arb(v)}]']
    if p == 'z-index': return [f'z-[{v}]']
    if p == 'overflow': return [f'overflow-{v}']
    if p == 'overflow-y': return [f'overflow-y-{v}']
    if p == 'opacity': return [f'opacity-[{v}]']
    if p == 'cursor': return [f'cursor-{v}']
    if p == 'box-shadow': return [f'shadow-[{arb(v)}]']
    if p == 'grid-template-columns':
        v = re.sub(r'minmax\((\d+(?:\.\d+)?px),', r'minmax(min(\1,100%),', v) if 'auto-fit' in v or 'auto-fill' in v else v
        return [f'grid-cols-[{arb(v.replace(", ", ","))}]']
    if p == 'transition':
        return [f'[transition:{arb(v)}]']
    if p == 'transform': return [f'[transform:{arb(v)}]']
    if p == 'pointer-events' and v == 'none': return ['pointer-events-none']
    if p == 'user-select' and v == 'none': return ['select-none']
    if p == 'scroll-margin-top': return [f'scroll-mt-[{v}]']
    return [f'[{p}:{arb(v)}]']


def classes(style, variant=''):
    out = []
    for d in style.split(';'):
        if ':' not in d or '{{' in d:
            continue
        k, v = d.split(':', 1)
        out += [variant + c for c in decl(k, v)]
    return out


def tag(m):
    t = m.group(0)
    attrs = dict(re.findall(r'([\w:-]+)="([^"]*)"', t))
    cls = attrs.get('class', '').split()
    cls += classes(attrs.get('style', ''))
    cls += classes(attrs.get('style-hover', ''), 'hover:')
    dyn = [d.strip() for d in attrs.get('style', '').split(';') if '{{' in d]
    name = re.match(r'<([\w-]+)', t).group(1)
    keep = []
    for k, v in attrs.items():
        if k in ('style', 'style-hover', 'class'):
            continue
        if k.startswith('on') or '{{' in v:
            keep.append(f'{k}={{/* {v} */}}')
            continue
        keep.append(f'{ {"tabindex": "tabIndex", "for": "htmlFor"}.get(k, k)}="{v}"')
    extra = f' {{/* dynamic: {"; ".join(dyn)} */}}' if dyn else ''
    close = ' /' if t.endswith('/>') else ''
    c = f' className="{" ".join(cls)}"' if cls else ''
    return f'<{name}{c}{(" " + " ".join(keep)) if keep else ""}{extra}{close}>'


def main():
    f, start, end = sys.argv[1], sys.argv[2], sys.argv[3]
    occ = int(sys.argv[sys.argv.index('--occurrence') + 1]) if '--occurrence' in sys.argv else 1
    h = open(f, encoding='utf8').read()
    a = -1
    for _ in range(occ):
        a = h.index(start, a + 1)
    b = h.index(end, a) + len(end)
    frag = h[a:b]
    svgs = []
    frag = re.sub(r'<svg\b.*?</svg>', lambda m: svgs.append(m.group(0)) or f'@@SVG{len(svgs) - 1}@@', frag, flags=re.S)
    frag = re.sub(r'<(?!/)[a-zA-Z][^>]*>', tag, frag)
    camel = lambda n: re.sub(r'-([a-z])', lambda m: m.group(1).upper(), n)
    def svg_attrs(t):
        return re.sub(r'\s([a-zA-Z][-a-zA-Z]*)=', lambda m: ' ' + (m.group(1) if m.group(1).startswith(('data-', 'aria-')) else camel(m.group(1))) + '=', t)
    for i, s in enumerate(svgs):
        s = re.sub(r'<[a-zA-Z][^>]*>', lambda m: svg_attrs(m.group(0)), s)
        s = re.sub(r'<(path|circle|rect|line|polyline|polygon|ellipse)([^>]*?)(?<!/)></>', r'< />', s)
        frag = frag.replace(f'@@SVG{i}@@', s)
    print(frag)


main()
