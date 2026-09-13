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
