'use strict';
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escapeHTML;
const safeURL = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? e(u.href) : '#'; } catch { return '#'; } };
const external = (url, title) => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${e(title)} ↗</a>`;
const ideas = window.RESEARCH.ideas;
const datasets = window.RESEARCH.datasets;
const methods = window.RESEARCH.methods.entries;
const categories = ['전체','교육','환경','교통','모빌리티'];
const tags = {
  'slope-patrol':['다층 네트워크','에너지 제약','공정 배치'],
  'heat-access':['연령대 맞춤','기존 시설 확충','이동 연결'],
  'flood-resilience':['퍼콜레이션','도로 회복력','공간 널모형'],
  'school-access':['이분 네트워크','공급 용량','접근성 형평성'],
  'drt-access':['시간표 네트워크','환승·대기','DRT 시나리오'],
  'highway-local':['혼잡 군집','시계열 검증','충격 회복']
};
const bundle = {
  'slope-patrol':['D01','D02','D03','D04','D05','D11','D16'],
  'heat-access':['D01','D02','D13','D15','D16','D17','D18'],
  'flood-resilience':['D01','D03','D06','D14','D15','D16'],
  'school-access':['D01','D06','D07','D08','D09','D16'],
  'drt-access':['D01','D08','D09','D10','D16'],
  'highway-local':['D01','D03','D11','D12','D15']
};
const gate = {'slope-patrol':'참가자격 확인','flood-resilience':'통제·시설 이력 확인','highway-local':'시계열 확보 필요'};
let category = '전체';
function methodBody(m){
  return `<p class="method-approach">${e(m.approach)}</p><div class="equation-list">${m.equations.map((q,n)=>`<section class="equation-note"><p class="equation-label"><b>${String(n+1).padStart(2,'0')} · ${e(q.label)}</b></p><div class="equation-display" data-latex="${e(q.latex)}">${e(q.display)}</div><p class="equation-meaning">${e(q.meaning)}</p></section>`).join('')}</div><details class="method-assumptions"><summary>적용 가정과 비교 실험</summary>${m.equations.map(q=>`<p><b>${e(q.label)}</b><br>${e(q.scope)}</p>`).join('')}<p><b>비교 실험과 해석</b><br>${e(m.baseline)}</p></details><div class="method-refs"><h3>관련 레퍼런스</h3><ol>${m.references.map(r=>`<li>${external(r.url,r.title)}<p class="meta">${e(r.authors)} (${e(r.year)}) · ${e(r.venue)}</p><p>${e(r.support)}</p><span class="meta">${external(`https://doi.org/${r.doi}`,`DOI ${r.doi}`)}</span></li>`).join('')}</ol></div>`;
}
function renderMethods(selected='all'){
  $('#method-filters').innerHTML=[{id:'all',shortTitle:`전체 ${methods.length}개`},...methods].map(m=>`<button type="button" class="filter${m.id===selected?' active':''}" data-method-filter="${e(m.id)}" aria-pressed="${m.id===selected}">${e(m.shortTitle)}</button>`).join('');
  $('#method-list').innerHTML=methods.filter(m=>selected==='all'||m.id===selected).map(m=>`<article class="method-note"><header><span class="badge neutral">${e(m.shortTitle)}</span><h2>${e(m.title)}</h2><p>${e(m.summary)}</p></header>${methodBody(m)}</article>`).join('');
  window.renderResearchMath?.($('#method-list'));
  $$('[data-method-filter]').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.methodFilter;
    renderMethods(id);
    $(`[data-method-filter="${id}"]`).focus({preventScroll:true});
  }));
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
  if($('#nav-count')) $('#nav-count').textContent = ideas.length;
  $('#idea-list').innerHTML=rank.map(i=>`<a class="idea-card${i.id==='flood-resilience'?' featured':''}" data-idea="${e(i.id)}" href="#${({'heat-access':'spaces','school-access':'schools','flood-resilience':'disaster'})[i.id]}"><div><div class="card-kicker"><span>${String(i.index+1).padStart(2,'0')} / ${e(i.domain)}</span>${i.id==='flood-resilience'?'<span class="badge success">우선 검토</span>':''}${gate[i.id]?`<span class="badge warning">${e(gate[i.id])}</span>`:''}</div><h3>${e(i.title)}</h3><p>${e(i.summary)}</p><div class="card-method">${tags[i.id].map(t=>`<span>${e(t)}</span>`).join('')}</div></div><div class="card-score"><b>${i.score.toFixed(1)}</b><small>/ 5.0</small><span class="arrow" aria-hidden="true">↗</span></div></a>`).join('');
}
function newsCard(s){
  return `<article class="evidence-card"><div class="evidence-date">${e(s.published)}<span>2026년 3분기 보도</span></div><div><h2>${e(s.title)}</h2><p>${e(s.claim)}</p><p class="meta">관측·대상 기간: ${e(s.referencePeriod)}</p>${external(s.url,'공식 보도 원문')}<details class="news-verification"><summary>확인 상태</summary><p class="meta">${e(s.verificationStatus)}</p></details></div></article>`;
}
function renderEvidence(){
  const {news,newsGaps}=window.RESEARCH;
  $('#evidence-list').innerHTML=[...news].sort((a,b)=>b.published.localeCompare(a.published)).map(newsCard).join('')+`<details class="method-assumptions"><summary>분야별 보도 확보 상태</summary><ul>${newsGaps.gaps.map(g=>`<li>${e(g)}</li>`).join('')}</ul></details><aside class="callout"><b>자료 제공 공지 · 보도자료와 구분</b><p>${e(newsGaps.dataNotice.note)}</p><p>${external(newsGaps.dataNotice.url,newsGaps.dataNotice.title)} · ${e(newsGaps.dataNotice.published)}</p></aside>`;
}
function renderData(){
  const search=$('#data-search').value.trim().toLocaleLowerCase();
  const list=datasets.filter(d=>Object.values(d).join(' ').toLocaleLowerCase().includes(search));
  $('#data-count').textContent=`${list.length}개 / 전체 ${datasets.length}개`;
  $('#data-list').innerHTML=list.length?list.map(d=>`<details class="dataset"><summary><div><div class="card-kicker">${e(d.id)} · ${e(d.domain)}</div><h3>${e(d.name)}</h3><p>${e(d.provider)}</p></div><div><span class="badge ${d.status.includes('보류')?'warning':'neutral'}">${d.status.includes('보류')?'이용조건 확인 전 보류':d.status.includes('웹 표본')?'웹 표본 확인':'메타데이터 확인'}</span><p>${e(d.format)}</p></div><span aria-hidden="true">+</span></summary><div class="detail-body">${[['분석에 쓸 곳',d.use],['공간 단위',d.spatial],['관측·갱신 기간',d.temporal],['결합 기준',d.joinKey],['접근 조건',d.access],['라이선스',d.license],['확인 상태',d.status],['주의할 해석',d.caveat]].map(([k,v])=>`<dl><dt>${e(k)}</dt><dd>${e(v)}</dd></dl>`).join('')}<div class="wide">${external(d.url,'공식 데이터 상세 페이지 열기')}</div></div></details>`).join(''):'<div class="empty-state">검색 결과가 없습니다. 데이터명이나 분야를 짧게 입력해 보세요.</div>';
}
$('#idea-filters').innerHTML=categories.map((c,i)=>`<button class="filter${i===0?' active':''}" type="button" aria-pressed="${i===0}" data-category="${e(c)}">${e(c)}</button>`).join('');
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;$$('[data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderIdeas();}));
$$('#ideas input[type=range]').forEach(i=>i.addEventListener('input',renderIdeas));
$('#reset-weights').addEventListener('click',()=>{['fit','feasibility','novelty'].forEach((n,i)=>$(`#weight-${n}`).value=[40,40,20][i]);renderIdeas();});
$('#data-search').addEventListener('input',renderData);
$('#rubric').innerHTML=[['기획성',20],['구체성',20],['실효성',20],['정확성',20],['분석도구 활용',10],['종합 완성도',10]].map(([label,v])=>`<div class="rubric-row"><span>${label}</span><div class="rubric-track"><span style="width:${v*5}%"></span></div><b>${v}점</b></div>`).join('');
renderIdeas();renderEvidence();renderData();renderMethods();
$('#care-methods').innerHTML=methodBody(methods.find(m=>m.id==='care'));
