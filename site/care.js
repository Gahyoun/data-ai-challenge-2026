'use strict';
// Scenario descriptions only: no measured mobility parameters or route optimization.
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
    title:'청소년 · 걸을 수 있어도 귀가 교통편이 필요합니다',
    premise:'상대적으로 긴 보행과 독립적인 대중교통 이용을 검토하는 시나리오입니다. 이 조건을 모든 청소년에게 적용하지 않습니다.',
    nodes:['학교 또는 집','보행·대기·환승','청소년 대상 서비스','종료 후 귀가'],
    constraints:'방과 후 출발시각, 실제 배차·환승·요금, 프로그램 종료 후 귀가편과 이용 자격을 확인합니다.',
    options:'프로그램 시간과 교통편 연계 · 정류장 보행 연결 · 운영시간 조정',
    caveat:'대중교통을 이용할 수 있다는 능력과 동네에 이용 가능한 교통편이 있다는 공급 조건은 다릅니다.'
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
  document.getElementById('care-scenario').innerHTML = `<h3>${item.title}</h3><p>${item.premise}</p><ol class="care-route">${item.nodes.map((name,index) => `<li><span>0${index+1}</span>${name}</li>`).join('')}</ol><dl class="care-notes"><div><dt>경로를 결정할 입력</dt><dd>${item.constraints}</dd></div><div><dt>비교할 개선안</dt><dd>${item.options}</dd></div></dl><p class="meta">${item.caveat}</p>`;
}
document.querySelectorAll('[data-care]').forEach(button => button.addEventListener('click', () => renderCareScenario(button.dataset.care)));
renderCareScenario('child');
