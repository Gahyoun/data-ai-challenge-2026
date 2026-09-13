"""Build the static content bundle using only the Python standard library."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
payload = {}
for key in ('ideas', 'datasets', 'profile', 'methods'):
    payload[key] = json.loads((ROOT / 'data' / f'{key}.json').read_text(encoding='utf-8'))
payload['youthScenario'] = json.loads((ROOT / 'data' / 'youth-scenario.json').read_text(encoding='utf-8'))
scaling = payload['youthScenario']['scaling']
assert 0.6 <= scaling['initialIllustration'] <= scaling['uiMax'] < scaling['maxExclusive'] == 1
assert len({i['id'] for i in payload['ideas']}) == len(payload['ideas'])
assert len({d['id'] for d in payload['datasets']}) == len(payload['datasets'])
for idea in payload['ideas']:
    assert all(1 <= idea[k] <= 5 for k in ('fitScore','feasibilityScore','noveltyScore'))
    assert all(s['url'].startswith('https://') for s in idea['sources'])
methods = payload['methods']['entries']
assert {m['id'] for m in methods} == {i['id'] for i in payload['ideas']} | {'care'}
assert len(methods) == len(payload['ideas']) + 1
for method in methods:
    assert len(method['equations']) == 2
    assert len(method['references']) >= 2
    assert all(r['url'].startswith('https://') and r['doi'].startswith('10.') for r in method['references'])

# The readable reference note and browser bundle share the same source.
note = ['# 아이디어별 수식과 참고문헌', '',
        f"확인일: {payload['methods']['checkedAt']} · 기존 6개 후보 + 돌봄·복지 확장안", '',
        '각 수식은 연구 설계의 기준선 또는 적용식이다. 논문이 지지하는 범위와 이번 연구가 추가하는 가정을 구분했다. 실제 지역 분석·ABM 결과가 아니며, 최적화식 자체가 통계물리 법칙이라는 뜻도 아니다.', '',
        '**현재 개선 범위:** 기존 시설의 위치를 고정한 수용량·운영시간·인력·이동 연결 개선. 기후쉼터의 연속 시설밀도 2/3 식은 이론 비교용이며 신규 건설 계획이나 추가 정원의 배분 법칙이 아니다. 청소년의 0.6 ≤ α < 1은 사용자 지정 시나리오다.', '',
        '[웹에서 보기](https://gahyoun.github.io/data-ai-challenge-2026/#methods) · [원본 JSON](../data/methods.json)', '']
for number, method in enumerate(methods, 1):
    note += [f"## {number}. {method['title']}", '', f"**{method['approach']}**", '', method['summary'], '']
    for equation in method['equations']:
        note += [f"### {equation['label']}", '', '$$', equation['latex'], '$$', '',
                 equation['meaning'], '', f"**적용 범위:** {equation['scope']}", '']
    note += ['**비교 실험과 해석:** '+method['baseline'], '', '### 참고문헌', '']
    for ref in method['references']:
        note += [f"- {ref['authors']} ({ref['year']}). [{ref['title']}]({ref['url']}). *{ref['venue']}*. DOI: [{ref['doi']}](https://doi.org/{ref['doi']}). {ref['support']}"]
    note += ['']
(ROOT / 'research' / 'formulas-and-references.md').write_text('\n'.join(note), encoding='utf-8')
serialized = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
(ROOT / 'site' / 'content.js').write_text('window.RESEARCH = ' + serialized + ';\n', encoding='utf-8')
print(f"Built {len(payload['ideas'])} ideas, {len(payload['datasets'])} datasets, {len(payload['profile']['people'])} profiles, {len(methods)} method notes")

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
