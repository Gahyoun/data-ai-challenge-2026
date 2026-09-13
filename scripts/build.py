"""Build the static content bundle using only the Python standard library."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
payload = {}
for key in ('ideas', 'datasets', 'profile'):
    payload[key] = json.loads((ROOT / 'data' / f'{key}.json').read_text(encoding='utf-8'))
assert len({i['id'] for i in payload['ideas']}) == len(payload['ideas'])
assert len({d['id'] for d in payload['datasets']}) == len(payload['datasets'])
for idea in payload['ideas']:
    assert all(1 <= idea[k] <= 5 for k in ('fitScore','feasibilityScore','noveltyScore'))
    assert all(s['url'].startswith('https://') for s in idea['sources'])
serialized = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
(ROOT / 'site' / 'content.js').write_text('window.RESEARCH = ' + serialized + ';\n', encoding='utf-8')
print(f"Built {len(payload['ideas'])} ideas, {len(payload['datasets'])} datasets, {len(payload['profile']['people'])} profiles")

# Keep the dedicated model-design section reproducible.
import re
page = ROOT / "index.html"
html = page.read_text(encoding="utf-8")
for name in ('climate', 'care'):
    section = (ROOT / 'site' / f'{name}-section.html').read_text(encoding='utf-8')
    start, end = f'  <!-- {name}-start -->', f'  <!-- {name}-end -->'
    html, n = re.subn(re.escape(start) + r'.*?' + re.escape(end), lambda _: start + '\n' + section + end, html, flags=re.S)
    assert n == 1, f'Missing or duplicate {name} section markers'
page.write_text(html, encoding="utf-8")
