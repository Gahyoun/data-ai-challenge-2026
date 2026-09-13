'use strict';
// Illustrative two-region continuous-density baseline, not a geographic ABM.
function updateScalingComparison() {
  const rho = Number(document.getElementById('density-ratio').value);
  const burden = Number(document.getElementById('burden-ratio').value);
  const qRatio = rho * burden;
  const facilityRatio = qRatio ** (2 / 3);
  const populationShare = rho / (1 + rho) * 100;
  const theoryShare = facilityRatio / (1 + facilityRatio) * 100;
  document.getElementById('density-value').textContent = `${rho.toFixed(1)}배`;
  document.getElementById('burden-value').textContent = `${burden.toFixed(2)}배`;
  const row = (label, value, kind) => `<div class="allocation-row"><div><b>${label}</b><span>A ${value.toFixed(1)}% · B ${(100-value).toFixed(1)}%</span></div><div class="allocation-track ${kind}" role="img" aria-label="${label}: A ${value.toFixed(1)}%, B ${(100-value).toFixed(1)}%"><span style="width:${value}%"></span></div></div>`;
  document.getElementById('scaling-results').innerHTML = row('인구 비례',populationShare,'population') + row('이동 부담을 반영한 2/3 기준선',theoryShare,'theory') + `<p class="scaling-number">이동 부담 밀도 비 <b>${qRatio.toFixed(2)}</b> → 연속 시설 밀도 비 <b>${facilityRatio.toFixed(2)}</b></p>`;
}
document.querySelectorAll('#climate input[type=range]').forEach(input => input.addEventListener('input',updateScalingComparison));
updateScalingComparison();
