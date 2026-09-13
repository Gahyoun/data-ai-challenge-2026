'use strict';
// Scenario descriptions only: no measured mobility parameters or route optimization.
const youthScenario = window.RESEARCH.youthScenario;
let youthAlpha = youthScenario.scaling.initialIllustration;
const careScenarios = {
  child: {
    title:'유소년 · 동행 가능한 시간이 경로를 바꿉니다',
    premise:'짧은 보행과 안전 조건, 동행·픽업 필요성을 검토하는 시나리오입니다. 초등학생과 미취학 아동의 이용 자격은 따로 정의합니다.',
    nodes:['학교 또는 집','허용된 보행·동행','아동 돌봄 서비스','인계 후 귀가'],
    constraints:'아동과 보호자의 출발 위치·가능 시간, 독립 이동 허용 여부, 시설 종료시간과 인계 조건을 함께 확인합니다.',
    options:'횡단 연결 · 운영시간 연장 · 시간창과 정원을 가진 동행/픽업',
    caveat:'보호자가 없는데 모든 아이에게 무료·즉시 픽업을 부여하면 개선 효과가 부풀려집니다.'
  },
  youth: {
    title:'청소년 · 높은 이동 가능성으로 상담·학습·문화에 접근',
    premise:'청소년의 mobility 가능성을 높게 두는 사용자 지정 시나리오입니다. 상대적으로 긴 보행과 독립적인 대중교통 이용을 허용하되, 실제 교통 공급과 귀가 시간은 별도로 확인합니다.',
    nodes:['학교 또는 집','보행·대중교통 연결','상담·열람·문화 서비스','이용 종료 후 귀가'],
    constraints:'보행 시간 예산과 이용 가능한 이동수단, 방과 후 출발시각, 실제 배차·환승·요금, 시설별 이용 조건과 귀가편을 확인합니다.',
    options:'기존 상담 회차·열람 좌석·문화 프로그램 정원 확충 · 운영시간·인력 개선 · 교통 연결',
    services:[
      {name:'상담센터',check:'예약·상담 가능 시간, 이용 자격, 회차별 수용량을 확인'},
      {name:'공공열람실',check:'개방시간, 열람 좌석과 체류시간, 이용 종료 후 귀가편을 확인'},
      {name:'청소년문화체험센터',check:'프로그램 일정, 대상 자격·정원, 체험 종료 후 이동을 확인'}
    ],
    caveat:'높은 이동 가능성은 연구 시나리오이며 실측된 연령 특성이 아닙니다. 세 시설의 수요·정원은 따로 계산하고, 한 시설의 공급으로 다른 서비스의 공백을 채우지 않습니다.'
  },
  senior: {
    title:'노년층 · 정류장까지의 길과 승하차도 접근성입니다',
    premise:'짧은 보행과 안전 조건, 대중교통 이용을 검토하는 시나리오입니다. 집단 안의 이동능력 차이와 이동 지원 수요를 남깁니다.',
    nodes:['집 또는 활동지','보행·승하차·환승','대상 복지 프로그램','이용 후 귀가'],
    constraints:'계단·경사·횡단·휴식, 정류장까지 이동, 승하차 가능 여부, 시간대별 프로그램 정원을 확인합니다.',
    options:'단차·계단 우회 · 휴식 지점 · 승하차·환승 개선 · 필요 집단의 이동 지원',
    caveat:'노년층 전체를 같은 저속으로 설정하거나 버스 노선이 있다는 이유만으로 이용 가능하다고 처리하지 않습니다.'
  }
};
function renderCareScenario(key) {
  const item = careScenarios[key];
  if (!item) return;
  document.querySelectorAll('[data-care]').forEach(button => {
    const selected = button.dataset.care === key;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const services = item.services ? `<div class="care-service-grid" aria-label="청소년 대상 시설">${item.services.map(service => `<article><h4>${service.name}</h4><p>${service.check}</p></article>`).join('')}</div>` : '';
  const expansion = key === 'youth' ? `<section class="youth-expansion"><span class="badge info">기존 시설의 확충 · 가상 계산</span><h4>추가 수용량을 미충족 수요에 따라 배분하면</h4><p>시설 위치와 기존 수용량을 유지합니다. 각 서비스·시간대의 미충족 수요 U에 대해 추가 수용량 ΔC ∝ U<sup>α</sup>를 비교 기준으로 둡니다.</p><label for="youth-alpha">스케일링 지수 α <output id="youth-alpha-value">${youthAlpha.toFixed(2)}</output></label><input id="youth-alpha" type="range" min="${youthScenario.scaling.minInclusive}" max="${youthScenario.scaling.uiMax}" step="${youthScenario.scaling.uiStep}" value="${youthAlpha}" aria-describedby="youth-alpha-help"><p id="youth-alpha-help" class="meta">요청 범위 0.6 ≤ α &lt; 1 · 화면은 0.60–0.99, 0.01 간격 · 0.80은 예시 초기값입니다. 낮은 α일수록 양의 미충족 수요를 가진 시설 사이의 추가 배분 격차가 작아집니다.</p><div id="youth-expansion-results" aria-live="polite"></div><p class="meta">한 서비스·한 시간대의 가상 두 시설입니다. 같은 단가로 40단위를 확충하고 각 시설의 확충 상한은 40입니다. 숫자는 연속 근사이며 실측 인원·예산·최적해가 아닙니다. 실제 좌석·회차는 정수로 배정하고 시간·인력·공간 상한을 적용합니다.</p></section>` : '';
  document.getElementById('care-scenario').innerHTML = `<h3>${item.title}</h3><p>${item.premise}</p>${services}<ol class="care-route">${item.nodes.map((name,index) => `<li><span>0${index+1}</span>${name}</li>`).join('')}</ol><dl class="care-notes"><div><dt>경로를 결정할 입력</dt><dd>${item.constraints}</dd></div><div><dt>비교할 개선안</dt><dd>${item.options}</dd></div></dl><p class="meta">${item.caveat}</p>${expansion}`;
  if (key === 'youth') {
    document.getElementById('youth-alpha').addEventListener('input', event => {
      youthAlpha = Number(event.target.value);
      renderYouthExpansion();
    });
    renderYouthExpansion();
  }
}

function renderYouthExpansion() {
  const example = youthScenario.illustration;
  const gaps = example.facilities.map(f => Math.max(0, f.demand - f.currentCapacity));
  const sum = values => values.reduce((a,b) => a+b,0);
  const weights = gaps.map(gap => gap ** youthAlpha);
  // This fixed demonstration never reaches its unmet-demand or expansion caps.
  const allocations = weights.map(weight => example.additionalCapacity * weight / sum(weights));
  const proportional = gaps.map(gap => example.additionalCapacity * gap / sum(gaps));
  document.getElementById('youth-alpha-value').textContent = youthAlpha.toFixed(2);
  document.getElementById('youth-expansion-results').innerHTML = `<div class="table-wrap"><table><thead><tr><th>한 시간대의 가상 값</th>${example.facilities.map(f=>`<th>${f.name}</th>`).join('')}</tr></thead><tbody><tr><td>배정 수요</td>${example.facilities.map(f=>`<td>${f.demand}</td>`).join('')}</tr><tr><td>기존 수용량</td>${example.facilities.map(f=>`<td>${f.currentCapacity}</td>`).join('')}</tr><tr><td>미충족 수요 U</td>${gaps.map(gap=>`<td>${gap}</td>`).join('')}</tr><tr><td>비교 기준 α=1의 추가량</td>${proportional.map(value=>`<td>+${value.toFixed(2)}</td>`).join('')}</tr><tr><td>선택한 α=${youthAlpha.toFixed(2)}의 추가량</td>${allocations.map(value=>`<td><strong>+${value.toFixed(2)}</strong></td>`).join('')}</tr><tr><td>선택안의 확충 후 수용량</td>${allocations.map((value,i)=>`<td>${(example.facilities[i].currentCapacity+value).toFixed(2)}</td>`).join('')}</tr></tbody></table></div><p>두 배의 미충족 수요 → 추가 배분 비 ${ (2 ** youthAlpha).toFixed(2) }배. 이 예시는 총 미충족 수요가 두 방식에서 같으며, 배분의 차이를 보여줍니다. 지수만으로 개선 효과나 형평성 최적성을 보장하지 않습니다.</p>`;
}
document.querySelectorAll('[data-care]').forEach(button => button.addEventListener('click', () => renderCareScenario(button.dataset.care)));
renderCareScenario('child');
