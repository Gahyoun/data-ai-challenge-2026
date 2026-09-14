'use strict';
const {structure, agePlans, plans, news} = window.RESEARCH;
const commonRoutes={plan:'공모 요건과 실행계획',ideas:'아이디어 후보',evidence:'2026년 3분기 보도',methods:'수식·레퍼런스 전체',data:'공공데이터 전체'};
const legacyRoutes={climate:'spaces/accessibility/climate',care:'spaces/accessibility',profile:'ideas','heat-access':'spaces','school-access':'schools','flood-resilience':'disaster','slope-patrol':'ideas','highway-local':'ideas','drt-access':'ideas',reuse:'ideas','spaces/climate':'spaces/accessibility/climate','spaces/child':'spaces/accessibility/child','spaces/youth':'spaces/accessibility/youth','spaces/young-adult':'spaces/accessibility/young-adult','spaces/senior':'spaces/accessibility/senior'};
const bullets=items=>`<ul>${items.map(item=>`<li>${e(item)}</li>`).join('')}</ul>`;
const ideaFor=parent=>ideas.find(i=>i.id===parent.ideaId);
const pageLink=(parent,page)=>`#${parent.id}/${page.id}`;
function sectionHeading(parent,title,summary){return `<div class="page-heading"><div><p class="eyebrow">${e(parent.title)} · 하위 계획</p><h1>${e(title)}</h1><p class="intro">${e(summary)}</p></div></div>`;}
function subnav(parent,current){return `<nav class="subpage-nav" aria-label="${e(parent.title)} 하위 계획"><a href="#${parent.id}"${!current?' aria-current="page"':''}>${parent.number} · 개요</a>${parent.pages.map((page,n)=>`<a href="${pageLink(parent,page)}"${current===page.id?' aria-current="page"':''}>${parent.number}-${n+1} ${e(page.title)}</a>`).join('')}</nav>`;}
function renderNavigation(route,parent){
  $('#idea-navigation').innerHTML=`<a class="nav-root" data-route="plan" href="#plan"><span class="nav-index">0</span> 공모 요건과 실행계획</a><a class="nav-root" data-route="ideas" href="#ideas"><span class="nav-index">1</span> 아이디어 후보</a>${structure.map(group=>`<details class="nav-group"${group.id===parent?.id?' open':''}><summary><span class="nav-index">${group.number}</span><b>${e(group.title)}</b><span class="nav-chevron" aria-hidden="true">⌄</span></summary><div class="nav-children"><a href="#${group.id}" data-route="${group.id}">아이디어 개요</a>${group.pages.map((page,n)=>`<a href="${pageLink(group,page)}" data-route="${group.id}/${page.id}">${group.number}-${n+1} ${e(page.title)}</a>`).join('')}</div></details>`).join('')}`;
  $$('[data-route]').forEach(link=>{const active=link.dataset.route===route;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  $('.sidebar').classList.remove('menu-open');$('#mobile-nav-toggle').setAttribute('aria-expanded','false');
}
function planCards(parent){return `<div class="subplan-grid">${parent.pages.map((page,n)=>`<a class="subplan-card" href="${pageLink(parent,page)}"><span class="meta">${parent.number}-${n+1} · 하위 계획</span><h2>${e(page.title)} <span aria-hidden="true">↗</span></h2><p>${e(page.summary)}</p></a>`).join('')}</div>`;}
function renderParent(parent){
  const idea=ideaFor(parent);
  return `<div class="page-heading"><div><p class="eyebrow">IDEA ${parent.number-1} · ${e(idea.domain)}</p><h1>${e(parent.title)}</h1><p class="intro">${e(idea.summary)}</p></div><span class="badge ${parent.id==='schools'?'success':'neutral'}">${parent.id==='schools'?'우선 검토':'아이디어 후보'}</span></div><div class="space-principle"><h2>${parent.id==='spaces'?'지역의 인구와 지형에 맞는 기존 공간':parent.id==='schools'?'어느 학교의 정원을 언제 보완할 것인가':'위험지역을 넘어, 끊어진 서비스 접근성을 진단'}</h2><p>${e(idea.need)}</p></div>${parent.id==='disaster'?disasterContext():parent.id==='schools'?schoolContext():''}<div class="section-bar"><h2>구체적인 계획</h2><span class="meta">각 계획은 주소가 있는 하위 페이지입니다.</span></div>${planCards(parent)}`;
}
function schoolContext(){
  const horizon=[['어린이집 영아반','0–2세 + 해당 학년도 출생','2026학년도부터 미래 출생 포함'],['유치원·어린이집 유아반','3–5세','2029학년도까지'],['초등학교','6–11세','2032학년도까지'],['중학교','12–14세','2038학년도까지'],['고등학교','15–17세','2041학년도까지']];
  const schedule=[['2024-12-26','용인 국가산단 승인 · 2026년 착공·2030년 첫 팹 가동 목표 · 이동 공공주택지구 첫 입주도 2030년 목표','https://www.korea.kr/news/policyNewsView.do?newsId=148937933','정책브리핑'],['2025-02-21','SK하이닉스 원삼 1기 팹 착공 · 2027년 5월 준공 목표','https://news.skhynix.co.kr/started-construction-of-yongin-cluste/','SK하이닉스 뉴스룸'],['2026-06-25','이동 공공주택지구 2만 호 · 첫 입주 2033년 하반기 목표 보도','https://news.skbroadband.com/news/articleView.html?idxno=230468','B tv 뉴스']];
  return `<aside class="callout"><b>첫 제출: 초등학교 수요와 정원 보완 시점</b><p>교육지원청 1곳의 초등학교 5–10개를 목표 표본으로 유지·한시·상시 정원 보완을 비교합니다. <a href="#schools/competition">공모전용 질문과 결과표 →</a></p><details><summary>2040 확장 · 출생 규모를 관측할 수 있는 코호트</summary><p>완결된 2025년 말 인구를 기준으로 계산합니다. 2026년은 부분 관측이며, 학년도 T의 대상 연령은 T−1년 12월 말 기준입니다. 아래 기간에도 미래 이동과 재학 선택은 불확실합니다.</p><div class="table-wrap"><table><thead><tr><th>시설</th><th>대상 연령</th><th>출생 규모가 관측된 대상 코호트</th></tr></thead><tbody>${horizon.map(row=>`<tr>${row.map(cell=>`<td>${e(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>2033학년도 초등·2039학년도 중등부터 추가 출생 가정이 필요합니다. 2040년 중학교 대상에는 2027년 출생 코호트도 포함됩니다.</p></details><details><summary>산단과 배후 주거의 발표 일정</summary><ul>${schedule.map(([date,text,url,label])=>`<li>${e(date)} · ${e(text)} · ${external(url,label)}</li>`).join('')}</ul><p class="meta">발표 목표이며 실제 입주·전입 관측치가 아닙니다. 첫 입주 목표가 2030년에서 2033년 하반기로 바뀐 폭은 지연 시나리오의 참고값입니다.</p></details></aside>`;
}
function disasterContext(){return `<aside class="callout"><b>기존 공공서비스와의 차별성</b><p>공식 홍수·도시침수지도와 SGIS의 연령별 인구·복지시설 중첩은 이미 제공됩니다. 이번 질문은 재난으로 도로·시설이 작동하지 않을 때 생기는 서비스 미충족과 기존 구간 보강의 효과입니다.</p><p>${external('https://www.floodmap.go.kr/fldara','공식 도시침수지도')} · ${external('https://ndsm.mods.go.kr/ndsm/srv/map/intMap.do?type=flud','SGIS 자연재해 통계지도')}</p><details><summary>공개 제한과 집값 보도의 시점</summary><p>집값 하락 민원에 관한 2020·2023년 보도는 확인됩니다. 2021년 온라인 공개 전환 이후인 현재, 주거지를 집값 때문에 일괄 제외한다는 정책·목록은 확인하지 못했습니다. 지도 제작·갱신 범위와 별도 제공, 통계 비밀보호를 구분합니다.</p><p>${external('https://www.korea.kr/briefing/policyBriefingView.do?newsId=148884630','2021년 온라인 공개 발표')} · ${external('https://news.kbs.co.kr/news/pc/view/view.do?ncd=7744842','KBS 2023년 보도')}</p></details></aside>`;}
function renderPlanSection(parent,page){
  const plan=plans[parent.id]?.[page.id];
  if(!plan)return sectionHeading(parent,page.title,page.summary)+`<p class="meta">원자료 확인 후 범위를 구체화합니다.</p>`;
  return sectionHeading(parent,plan.title||page.title,plan.summary||page.summary)+`<div class="plan-detail-grid">${plan.blocks.map((block,n)=>`<article class="plain-panel"><span class="badge neutral">0${n+1}</span><h2>${e(block.title)}</h2>${block.text?`<p>${e(block.text)}</p>`:''}${block.items?bullets(block.items):''}</article>`).join('')}</div>${plan.note?`<div class="callout"><b>비교와 해석의 범위</b><p>${e(plan.note)}</p></div>`:''}${parent.id==='disaster'&&page.id==='scenarios'?disasterContext():''}${page.id==='competition'?'<p class="document-link"><a href="https://github.com/Gahyoun/data-ai-challenge-2026/blob/main/research/competition-submission-draft.md" target="_blank" rel="noopener noreferrer">신청서 5개 항목 초안과 시연 구성 ↗</a> · <a href="#plan">공식 배점과 실행계획 →</a></p>':''}<p class="document-link"><a href="#${parent.id}/methods">수식·레퍼런스 →</a> · <a href="#${parent.id}/data">관련 공공데이터 후보 →</a></p>`;
}
function renderMethodPage(parent){return sectionHeading(parent,'수식·레퍼런스','기호·적용 가정·논문이 지지하는 범위를 함께 확인합니다.')+parent.methodIds.map(id=>methods.find(m=>m.id===id)).filter(Boolean).map(m=>`<article class="method-note"><header><span class="badge neutral">${e(m.shortTitle)}</span><h2>${e(m.title)}</h2><p>${e(m.summary)}</p></header>${methodBody(m)}</article>`).join('');}
function dataDetails(d){return `<details class="dataset"><summary><div><div class="card-kicker">${e(d.id)} · ${e(d.domain)}</div><h3>${e(d.name)}</h3><p>${e(d.provider)}</p></div><div><span class="badge neutral">${e(d.status)}</span></div><span aria-hidden="true">+</span></summary><div class="detail-body">${[['분석 용도',d.use],['공간 단위',d.spatial],['관측·갱신',d.temporal],['결합 기준',d.joinKey],['접근 조건',d.access],['이용조건',d.license],['해석의 한계',d.caveat]].map(([label,text])=>`<dl><dt>${e(label)}</dt><dd>${e(text)}</dd></dl>`).join('')}<div class="wide">${external(d.url,'공식 데이터 상세')}</div></div></details>`;}
function renderParentData(parent){
  const idea=ideaFor(parent);const sources=news.filter(n=>n.ideaIds.includes(idea.id)||(parent.id==='spaces'&&n.ideaIds.includes('care')));
  return sectionHeading(parent,'관련 공공데이터 후보','상세 메타데이터와 원자료 확보·검증 상태를 구분합니다.')+`<div class="callout"><b>실제 파일·API와 지역별 완결성은 추가 확인이 필요합니다.</b><p>고도·좌표계·도로 레벨·이용 자격·개방시간·수용량의 기준을 맞춘 뒤 분석합니다.</p></div><div class="data-list">${parent.datasetIds.map(id=>datasets.find(d=>d.id===id)).filter(Boolean).map(dataDetails).join('')}</div><h2 class="standalone-heading">2026년 3분기 관련 보도</h2>${sources.map(newsCard).join('')||'<p>직접 관련된 3분기 보도는 추가 확인 중입니다.</p>'}<details class="method-assumptions"><summary>이전 발표·기초자료·선행연구</summary><ul class="source-links">${idea.sources.map(s=>`<li>${external(s.url,s.title)}<p class="meta">발표: ${e(s.published)} · 대상 기간: ${e(s.referencePeriod)}</p></li>`).join('')}</ul></details>`;
}
function ageNav(selected){return `<nav class="subpage-nav age-tabs" aria-label="연령대별 공간 계획"><a href="#spaces/accessibility"${!selected?' aria-current="page"':''}>공통 설계</a>${agePlans.map(age=>`<a href="#spaces/accessibility/${age.id}"${selected===age.id?' aria-current="page"':''}>${e(age.title)}</a>`).join('')}<a href="#spaces/accessibility/climate"${selected==='climate'?' aria-current="page"':''}>기후쉼터</a></nav>`;}
function renderAge(selected){
  const target=$('#age-plan');if(!target)return;
  $('#age-tabs').innerHTML=ageNav(selected);
  const age=agePlans.find(a=>a.id===selected);
  if(!age){target.innerHTML=`<div class="subplan-grid">${agePlans.map(a=>`<a class="subplan-card" href="#spaces/accessibility/${a.id}"><span class="meta">연령대 맞춤</span><h2>${e(a.title)} ↗</h2><p>${e(a.summary)}</p></a>`).join('')}</div>`;return;}
  target.innerHTML=`<h2>${e(age.title)}</h2><p>${e(age.summary)}</p><div class="age-plan-grid">${[['대상 서비스',age.services],['이동·이용 조건',age.mobility],['기존 공간의 개선',age.improvements],['측정할 결과',age.metrics]].map(([title,items])=>`<article class="plain-panel"><h3>${e(title)}</h3>${bullets(items)}</article>`).join('')}</div>${selected==='youth'?'<div id="care-scenario"></div>':''}<div class="callout"><b>작게 시작하는 계획</b><p>${e(age.firstStep)}</p></div><details class="method-assumptions"><summary>시나리오의 가정</summary><p>${e(age.caveat)}</p></details>${news.filter(n=>n.ideaIds.includes(age.id)).map(newsCard).join('')}`;
  if(selected==='youth'){renderCareScenario('youth');const q=methods.find(m=>m.id==='care').equations[0];$('#care-scenario').insertAdjacentHTML('afterbegin',`<div class="equation-display" data-latex="${e(q.latex)}">${e(q.display)}</div>`);}
}
function navigate(){
  let route=location.hash.slice(1)||'ideas';if(legacyRoutes[route]){route=legacyRoutes[route];history.replaceState(null,'',`#${route}`);}
  let [groupId,pageId,ageId,...extra]=route.split('/');let parent=structure.find(p=>p.id===groupId);let page=parent?.pages.find(p=>p.id===pageId);
  const ageAllowed=parent?.id==='spaces'&&pageId==='accessibility'&&(!ageId||ageId==='climate'||agePlans.some(a=>a.id===ageId));
  if((!parent&&!commonRoutes[route])||(parent&&((pageId&&!page)||(ageId&&!ageAllowed)||extra.length))){route='ideas';parent=undefined;page=undefined;ageId=undefined;history.replaceState(null,'','#ideas');}
  const view=parent?(page?.kind==='care'?(ageId==='climate'?'climate':'care'):'idea-page'):route;
  $$('.view').forEach(section=>section.hidden=section.id!==view);
  if(parent&&view==='idea-page'){
    const html=!page?renderParent(parent):page.kind==='methods'?renderMethodPage(parent):page.kind==='data'?renderParentData(parent):renderPlanSection(parent,page);
    $('#idea-page').innerHTML=subnav(parent,page?.id)+html;
    if(parent.id==='disaster'&&page?.id==='percolation'){
      $('#idea-page .page-heading').insertAdjacentHTML('afterend','<div id="percolation-demo"></div>');
      window.renderPercolationDemo?.($('#percolation-demo'));
    }
  }
  $$('.page-subnav').forEach(node=>node.remove());
  if(parent&&['care','climate'].includes(view)){
    $(`#${view}`).insertAdjacentHTML('afterbegin',`<div class="page-subnav">${subnav(parent,'accessibility')}${view==='climate'?ageNav('climate'):''}</div>`);
    if(view==='care')renderAge(ageId);
  }
  const label=parent?(ageId?(ageId==='climate'?'기후쉼터':agePlans.find(a=>a.id===ageId).title):page?.title||parent.title):commonRoutes[route];
  $('#crumb').innerHTML=parent?`<a href="#ideas">아이디어 후보</a> <span>/</span> ${page?`<a href="#${parent.id}">${e(parent.title)}</a> <span>/</span> `:''}${ageId?'<a href="#spaces/accessibility">돌봄·복지 접근성</a> <span>/</span> ':''}<span>${e(label)}</span>`:e(label);
  document.title=`${label}${parent&&page?' · '+parent.title:''} · 2026 DATA + AI`;
  renderNavigation(parent&&page?parent.id+'/'+page.id:route,parent);
  window.renderResearchMath?.($(`#${view}`));window.scrollTo(0,0);$('#main').focus({preventScroll:true});
}
$('#mobile-nav-toggle').addEventListener('click',()=>{const open=$('.sidebar').classList.toggle('menu-open');$('#mobile-nav-toggle').setAttribute('aria-expanded',String(open));});
$('.sidebar').addEventListener('click',event=>{if(event.target.closest('a')){$('.sidebar').classList.remove('menu-open');$('#mobile-nav-toggle').setAttribute('aria-expanded','false');}});
window.addEventListener('hashchange',navigate);
navigate();
