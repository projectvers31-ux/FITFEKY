from pathlib import Path
import re
root = Path(r'c:\Users\IT\Downloads\Fitcore')
html_files = sorted(root.rglob('*.html'))
print(f'Checking {len(html_files)} HTML files...')

id_map = {}
for path in html_files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    ids = re.findall(r'id\s*=\s*"([^"]+)"', text)
    ids += re.findall(r"id\s*=\s*'([^']+)'", text)
    id_map[path] = set(ids)

for path in html_files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    anchors = re.findall(r'href\s*=\s*"#([^"]+)"', text)
    anchors += re.findall(r"href\s*=\s*'([^']+)'", text)
    anchors = [a for a in anchors if a and not a.startswith('/')]
    missing = [a for a in anchors if a not in id_map[path]]
    if missing:
        print(f'{path}: internal anchors without matching id: {missing}')

print('\nCommon issue findings:')
issues = []
for path in html_files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    if 'href="#"' in text or "href='#'" in text:
        issues.append(f'{path}: empty anchor href="#" found')
    if '<script' in text and '</script>' not in text:
        issues.append(f'{path}: <script> without closing tag?')
    if '<style' in text and '</style>' not in text:
        issues.append(f'{path}: <style> without closing tag?')
    if '<!--' in text and '-->' not in text:
        issues.append(f'{path}: comment opened without close')
    imgs = re.findall(r'<img[^>]*>', text)
    for img in imgs:
        if 'alt=' not in img and 'role="presentation"' not in img and 'role=presentation' not in img:
            issues.append(f'{path}: img missing alt attribute: {img[:80]}')

for issue in issues:
    print(issue)

voids = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','command','keygen'}
for path in html_files:
    text = re.sub(r'<!--.*?-->', '', path.read_text(encoding='utf-8', errors='ignore'), flags=re.S)
    tags = re.findall(r'<(/?)([a-zA-Z0-9]+)([^>]*)>', text)
    stack = []
    for slash, tag, rest in tags:
        tag = tag.lower()
        if tag in voids:
            continue
        if slash == '':
            if rest.strip().endswith('/'):
                continue
            stack.append(tag)
        else:
            if stack and stack[-1] == tag:
                stack.pop()
    if stack:
        print(f'{path}: likely unclosed tags at end: {stack[:5]}')
