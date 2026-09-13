'use strict';
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escapeHTML;
const safeURL = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? e(u.href) : '#'; } catch { return '#'; } };
const external = (url, title) => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${e(title)} ↗</a>`;
const ideas = window.RESEARCH.ideas;
const datasets = window.RESEARCH.datasets;
const people = window.RESEARCH.profile.people;
const routes = {ideas:'아이디어 탐색',profile:'연구자와 관심사',evidence:'현안과 근거',data:'공공데이터 후보',reuse:'치안 프로젝트 확장',plan:'공모 요건과 실행계획'};
const categories = ['전체','교육','환경','교통','모빌리티','치안'];
const tags = {
  'slope-patrol':['다층 네트워크','에너지 제약','공정 배치'],
  'heat-access':['시간 의존 접근성','다목적 경로','운영시간'],
  'flood-resilience':['퍼콜레이션','도로 회복력','공간 널모형'],
  'school-access':['이분 네트워크','공급 용량','접근성 형평성'],
  'drt-access':['시간표 네트워크','환승·대기','DRT 시나리오'],
  'highway-local':['혼잡 군집','시계열 검증','충격 회복']
};
const bundle = {
  'slope-patrol':['D01','D02','D03','D04','D05','D11','D16'],
  'heat-access':['D01','D02','D13','D15','D16'],
  'flood-resilience':['D01','D03','D06','D14','D15','D16'],
  'school-access':['D01','D06','D07','D08','D09','D16'],
  'drt-access':['D01','D08','D09','D10','D16'],
  'highway-local':['D01','D03','D11','D12','D15']
};
const gate = {'slope-patrol':'참가자격 확인','flood-resilience':'데이터 권리 확인','highway-local':'시계열 확보 필요'};
let category = '전체';
let activeCard = null;
function navigate(){
  const key = Object.hasOwn(routes, location.hash.slice(1)) ? location.hash.slice(1) : 'ideas';
  $$('.view').forEach(s => { s.hidden = s.id !== key; });
  $$('[data-route]').forEach(a => { const active = a.dataset.route === key; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  $('#crumb').textContent = routes[key];
  document.title = `${routes[key]} · 2026 DATA + AI`;
  window.scrollTo(0,0);
}
function weights(){
  const names=['fit','feasibility','novelty'];
  let values=names.map(n=>Number($(`#weight-${n}`).value));
  let total=values.reduce((a,b)=>a+b,0);
  if(total === 0){ values=[1,1,1];total=3; }
  const percents=values.map(v=>Math.round(v/total*100));
  percents[2]=100-percents[0]-percents[1];
  names.forEach((n,i)=>$(`#value-${n}`).textContent=`${percents[i]}%`);
  return values.map(v=>v/total);
}
function renderIdeas(){
  const w=weights();
  const rank=ideas.map((i,index)=>({...i,index,score:i.fitScore*w[0]+i.feasibilityScore*w[1]+i.noveltyScore*w[2]})).filter(i=>category==='전체'||i.domain.includes(category)).sort((a,b)=>b.score-a.score||a.index-b.index);
  $('#idea-count').textContent = rank.length;
  $('#nav-count').textContent = ideas.length;
  $('#idea-list').innerHTML=rank.map(i=>`<button class="idea-card" data-idea="${e(i.id)}" aria-haspopup="dialog" aria-label="${e(i.title)} 상세 보기"><div><div class="card-kicker"><span>${String(i.index+1).padStart(2,'0')} / ${e(i.domain)}</span>${gate[i.id]?`<span class="badge warning">${e(gate[i.id])}</span>`:''}</div><h3>${e(i.title)}</h3><p>${e(i.summary)}</p><div class="card-method">${tags[i.id].map(t=>`<span>${e(t)}</span>`).join('')}</div></div><div class="card-score"><b>${i.score.toFixed(1)}</b><small>/ 5.0</small><span class="arrow" aria-hidden="true">↗</span></div></button>`).join('');
  $$('[data-idea]').forEach(b=>b.addEventListener('click',()=>showIdea(b.dataset.idea,b)));
}
function showIdea(id,button){
  const i=ideas.find(x=>x.id===id); if(!i) return;
  activeCard=button;
  const fields=[['문제와 필요',i.need],['방법론',i.method],['무엇을 측정하나',i.observable],['비교 기준 · 널모형',i.nullModel],['검증 방법',i.validation],['작게 시작하는 MVP',i.mvp],['제약과 위험',i.risk],['점수의 근거',i.scoreRationale||'공개 연구 적합성·데이터 확보 조건·질문 차별성을 기준으로 한 정성 판단입니다.']];
  $('#idea-detail').innerHTML=`<span class="badge info">${e(i.domain)}</span> ${gate[id]?`<span class="badge warning">${e(gate[id])}</span>`:''}<h2 id="dialog-title">${e(i.title)}</h2><p>${e(i.summary)}</p><div class="detail-grid">${fields.map(([label,value])=>`<section class="detail-item"><h3>${e(label)}</h3><p>${e(value)}</p></section>`).join('')}<section class="detail-item"><h3>연결할 데이터 후보</h3><ul class="source-links">${bundle[id].map(d=>datasets.find(x=>x.id===d)).filter(Boolean).map(d=>`<li>${external(d.url,d.name)} <span class="meta">${e(d.id)}</span></li>`).join('')}</ul><p class="meta" style="margin-top:12px">지역별 보행망·운영시간·통학구역·돌봄시설·의료/대피 시설은 선택 주제에 따라 추가 확보가 필요합니다. 목록의 모든 데이터가 확보된 것은 아닙니다.</p></section><section class="detail-item"><h3>공식 근거와 방법론 선례</h3><ul class="source-links">${i.sources.map(s=>`<li>${external(s.url,s.title)}<p class="meta">${e(s.published)} · 관측: ${e(s.referencePeriod)}</p></li>`).join('')}</ul></section></div>`;
  $('#idea-dialog').showModal();$('#idea-dialog').scrollTop=0;$('#close-dialog').focus();
}
function renderProfiles(){
  $('#profile-list').innerHTML=people.map(p=>`<article class="profile-card"><h2>${e(p.name)}</h2><div class="label">공개 활동에서 관찰</div><p>${e(p.observed)}</p><div class="label">이번 연구로 연결 · 추론</div><p>${e(p.fit)}</p><div class="label">해석의 범위</div><p>${e(p.inference)}</p>${external(p.url,'프로필 원문')}${p.sources?.length?`<details style="margin-top:14px"><summary class="meta">관련 공개 연구</summary><ul class="source-links">${p.sources.map((s,i)=>`<li>${external(s,`연구 근거 ${i+1}`)}</li>`).join('')}</ul></details>`:''}</article>`).join('');
}
function renderEvidence(){
  const map=new Map();
  ideas.forEach(i=>i.sources.forEach(s=>{if(!map.has(s.url))map.set(s.url,{...s,ideas:[]});map.get(s.url).ideas.push(i.title);}));
  const sources=[...map.values()].sort((a,b)=>Number(/nature.com/.test(a.url))-Number(/nature.com/.test(b.url))||String(b.published).localeCompare(a.published));
  $('#evidence-list').innerHTML=sources.map(s=>`<article class="evidence-card"><div class="evidence-date">${e(s.published)}<span>${/nature.com/.test(s.url)?'방법론 선례':'공식·공공기관 자료'}</span></div><div><h2>${e(s.title)}</h2><p>${e(s.claim)}</p><p class="meta">관측·기준 기간: ${e(s.referencePeriod)}</p><p class="meta">연결 질문: ${e([...new Set(s.ideas)].join(' / '))}</p>${external(s.url,'근거 원문 열기')}</div></article>`).join('');
}
function renderData(){
  const search=$('#data-search').value.trim().toLocaleLowerCase();
  const list=datasets.filter(d=>Object.values(d).join(' ').toLocaleLowerCase().includes(search));
  $('#data-count').textContent=`${list.length}개 / 전체 ${datasets.length}개`;
  $('#data-list').innerHTML=list.length?list.map(d=>`<details class="dataset"><summary><div><div class="card-kicker">${e(d.id)} · ${e(d.domain)}</div><h3>${e(d.name)}</h3><p>${e(d.provider)}</p></div><div><span class="badge ${d.status.includes('보류')?'warning':'neutral'}">${d.status.includes('보류')?'이용조건 확인 전 보류':d.status.includes('웹 표본')?'웹 표본 확인':'메타데이터 확인'}</span><p>${e(d.format)}</p></div><span aria-hidden="true">+</span></summary><div class="detail-body">${[['분석에 쓸 곳',d.use],['공간 단위',d.spatial],['관측·갱신 기간',d.temporal],['결합 기준',d.joinKey],['접근 조건',d.access],['라이선스',d.license],['확인 상태',d.status],['주의할 해석',d.caveat]].map(([k,v])=>`<dl><dt>${e(k)}</dt><dd>${e(v)}</dd></dl>`).join('')}<div class="wide">${external(d.url,'공식 데이터 상세 페이지 열기')}</div></div></details>`).join(''):'<div class="empty-state">검색 결과가 없습니다. 데이터명이나 분야를 짧게 입력해 보세요.</div>';
}
$('#idea-filters').innerHTML=categories.map((c,i)=>`<button class="filter${i===0?' active':''}" type="button" aria-pressed="${i===0}" data-category="${e(c)}">${e(c)}</button>`).join('');
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;$$('[data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderIdeas();}));
$$('input[type=range]').forEach(i=>i.addEventListener('input',renderIdeas));
$('#reset-weights').addEventListener('click',()=>{['fit','feasibility','novelty'].forEach((n,i)=>$(`#weight-${n}`).value=[40,40,20][i]);renderIdeas();});
$('#data-search').addEventListener('input',renderData);
$('#close-dialog').addEventListener('click',()=>$('#idea-dialog').close());
$('#idea-dialog').addEventListener('close',()=>activeCard?.focus());
window.addEventListener('hashchange',navigate);
$('#rubric').innerHTML=[['기획성',20],['구체성',20],['실효성',20],['정확성',20],['분석도구 활용',10],['종합 완성도',10]].map(([label,v])=>`<div class="rubric-row"><span>${label}</span><div class="rubric-track"><span style="width:${v*5}%"></span></div><b>${v}점</b></div>`).join('');
renderIdeas();renderProfiles();renderEvidence();renderData();navigate();
