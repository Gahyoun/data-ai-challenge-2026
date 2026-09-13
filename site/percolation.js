/* A finite, synthetic graph: structural separation is not medical isolation. */
(() => {
  'use strict';
  const nodes = [
    { id: 'A', population: 500, x: 80, y: 95, medical: true },
    { id: 'B', population: 300, x: 65, y: 235 },
    { id: 'C', population: 200, x: 205, y: 185 },
    { id: 'D', population: 120, x: 330, y: 110 },
    { id: 'E', population: 80, x: 320, y: 270 },
    { id: 'F', population: 60, x: 430, y: 225 },
    { id: 'G', population: 40, x: 230, y: 45, medical: true }
  ];
  const edges = ['AB', 'BC', 'CA', 'DE', 'EF', 'FD', 'CD', 'CG'];
  const steps = [
    { name: '0 · 정상', removed: [], explanation: '7개 지역, 총 1,300명이 하나의 연결 성분에 속합니다. 모든 지역에서 A 또는 G의 의료시설에 도달할 수 있습니다.' },
    { name: '1 · CG 단절', removed: ['CG'], explanation: 'G의 40명이 최대 클러스터에서 분리됩니다. 그러나 G 안에 의료시설이 있어 의료 미도달 인구는 늘지 않습니다.' },
    { name: '2 · CD 추가 단절', removed: ['CG', 'CD'], explanation: 'D·E·F의 260명이 함께 분리됩니다. 이 클러스터에는 의료시설이 없어 신규 의료 미도달 인구가 260명으로 늘어납니다.' },
    { name: '3 · DE·FD 추가 단절', removed: ['CG', 'CD', 'DE', 'FD'], explanation: 'D와 E·F도 서로 분리되지만, 최대 클러스터 인구와 의료 미도달 인구는 그대로입니다. 연결 성분 수의 증가와 서비스 손실은 서로 다른 지표입니다.' }
  ];
  const byId = new Map(nodes.map(node => [node.id, node]));
  const totalPopulation = nodes.reduce((sum, node) => sum + node.population, 0);
  const number = value => value.toLocaleString('ko-KR');
  let instance = 0;

  function analyze(removed) {
    const unavailable = new Set(removed);
    const neighbors = new Map(nodes.map(node => [node.id, []]));
    edges.filter(edge => !unavailable.has(edge)).forEach(([a, b]) => {
      neighbors.get(a).push(b);
      neighbors.get(b).push(a);
    });
    const visited = new Set();
    const components = [];
    for (const node of nodes) {
      if (visited.has(node.id)) continue;
      const members = [];
      const queue = [node.id];
      visited.add(node.id);
      for (let index = 0; index < queue.length; index += 1) {
        const id = queue[index];
        members.push(id);
        for (const neighbor of neighbors.get(id)) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push({
        members,
        population: members.reduce((sum, id) => sum + byId.get(id).population, 0),
        medical: members.some(id => byId.get(id).medical)
      });
    }
    components.sort((a, b) => b.population - a.population);
    return {
      components,
      largestPopulation: components[0].population,
      largestPopulationShare: components[0].population / totalPopulation,
      separatedComponents: components.length - 1,
      medicalUnreachable: components.filter(component => !component.medical)
        .reduce((sum, component) => sum + component.population, 0),
      removedCount: unavailable.size,
      removedFraction: unavailable.size / edges.length
    };
  }

  const baseline = analyze([]);
  const svgNamespace = 'http://www.w3.org/2000/svg';
  function svgElement(tag, attributes, text) {
    const element = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes || {}).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text !== undefined) element.textContent = text;
    return element;
  }

  window.renderPercolationDemo = function renderPercolationDemo(container) {
    if (!container || typeof container.replaceChildren !== 'function') return null;
    const id = `percolation-demo-${++instance}`;
    const root = document.createElement('section');
    root.className = 'percolation-demo';
    root.setAttribute('aria-labelledby', `${id}-title`);
    // All markup is fixed illustration copy; computed values below use textContent.
    root.innerHTML = `
      <div class="percolation-demo-heading">
        <span class="percolation-demo-tag">가상 네트워크 · 개념 실험</span>
        <h2 id="${id}-title">길이 끊기는 것과 의료에서 고립되는 것</h2>
        <p>도로를 차례로 닫아 최대 클러스터와 의료 접근성이 어떻게 달라지는지 비교합니다.</p>
      </div>
      <div class="percolation-demo-controls" role="group" aria-label="도로 단절 시나리오 선택">
        <div class="percolation-demo-steps"></div>
        <label class="percolation-demo-slider" for="${id}-step">
          <span>단절 단계 <output for="${id}-step">0 / 3</output></span>
          <input id="${id}-step" type="range" min="0" max="3" step="1" value="0" aria-label="도로 단절 단계">
        </label>
        <p class="percolation-demo-q"></p>
      </div>
      <div class="percolation-demo-layout">
        <figure class="percolation-demo-figure">
          <div class="percolation-demo-network"></div>
          <figcaption><span>● 인구가 가장 큰 연결 성분</span><span>⊕ 의료시설</span><span>점선·× 통행 불가</span></figcaption>
        </figure>
        <div class="percolation-demo-metrics" aria-live="polite" aria-atomic="true">
          <dl>
            <div><dt>최대 클러스터 인구 비율 S₁ᴾ</dt><dd><span data-metric="largest"></span><small data-metric="largest-population"></small></dd></div>
            <div><dt>최대 성분 밖 클러스터</dt><dd><span data-metric="separated"></span><small data-metric="component-count"></small></dd></div>
            <div><dt>신규 의료 미도달 인구</dt><dd><span data-metric="unreachable"></span><small>정상 상태 대비 · 경로 존재 여부</small></dd></div>
          </dl>
        </div>
      </div>
      <p class="percolation-demo-explanation" aria-live="polite" aria-atomic="true"></p>
      <p class="percolation-demo-members"></p>
      <p class="percolation-demo-insight">작은 클러스터에도 의료시설이 있으면 의료 고립은 아닙니다.</p>
      <p class="percolation-demo-limit">동일 가중치의 양방향 도로 8개와 가상 인구 1,300명을 사용한 유한 네트워크입니다. q<sub>E</sub>는 제거한 물리적 도로 수의 비율이며, 지도상의 길이는 실제 거리나 도로 가중치가 아닙니다. 시간·교통량·시설 수용량을 고려하지 않으며 실제 지역의 재난 예측, ABM 결과 또는 최적 보강안이 아닙니다.</p>`;
    container.replaceChildren(root);

    const svg = svgElement('svg', {
      viewBox: '0 0 480 330', role: 'img',
      'aria-labelledby': `${id}-svg-title ${id}-svg-description`
    });
    svg.append(svgElement('title', { id: `${id}-svg-title` }, '가상 지역 A부터 G까지의 도로 연결과 의료시설'));
    const description = svgElement('desc', { id: `${id}-svg-description` });
    svg.append(description);
    const edgeElements = new Map();
    for (const edge of edges) {
      const a = byId.get(edge[0]);
      const b = byId.get(edge[1]);
      const group = svgElement('g', { class: 'percolation-demo-edge' });
      group.append(svgElement('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
      const cross = svgElement('text', { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + 7, class: 'percolation-demo-cut', 'text-anchor': 'middle' }, '×');
      group.append(cross);
      svg.append(group);
      edgeElements.set(edge, group);
    }
    const nodeElements = new Map();
    for (const node of nodes) {
      const group = svgElement('g', { class: 'percolation-demo-node', transform: `translate(${node.x},${node.y})` });
      group.append(svgElement('circle', { r: 19 }));
      group.append(svgElement('text', { x: 0, y: 7, 'text-anchor': 'middle', class: 'percolation-demo-node-id' }, node.id));
      group.append(svgElement('text', { x: 0, y: 44, 'text-anchor': 'middle', class: 'percolation-demo-node-population' }, `${number(node.population)}명`));
      if (node.medical) {
        group.append(svgElement('circle', { cx: 25, cy: -24, r: 12, class: 'percolation-demo-medical' }));
        group.append(svgElement('path', { d: 'M 19 -24 H 31 M 25 -30 V -18', class: 'percolation-demo-medical-cross' }));
      }
      svg.append(group);
      nodeElements.set(node.id, group);
    }
    root.querySelector('.percolation-demo-network').append(svg);

    const controls = root.querySelector('.percolation-demo-steps');
    const slider = root.querySelector('input');
    const buttons = steps.map((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = step.name;
      button.addEventListener('click', () => setStep(index));
      controls.append(button);
      return button;
    });
    let currentStep = 0;
    let state;
    function setStep(value) {
      const next = Number(value);
      if (!Number.isInteger(next) || next < 0 || next >= steps.length) return;
      currentStep = next;
      const step = steps[next];
      state = analyze(step.removed);
      const newUnreachable = state.medicalUnreachable - baseline.medicalUnreachable;
      const largestMembers = new Set(state.components[0].members);
      slider.value = String(next);
      slider.setAttribute('aria-valuetext', `${step.name}, 도로 ${state.removedCount}개 단절`);
      root.querySelector('output').textContent = `${next} / 3`;
      buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === next)));
      root.querySelector('.percolation-demo-q').textContent = `q_E = ${state.removedCount} / ${edges.length} = ${(100 * state.removedFraction).toFixed(1)}% · 3단계에서는 도로 2개를 추가 제거합니다.`;
      root.querySelector('[data-metric="largest"]').textContent = `${(100 * state.largestPopulationShare).toFixed(1)}%`;
      root.querySelector('[data-metric="largest-population"]').textContent = `${number(state.largestPopulation)} / ${number(totalPopulation)}명`;
      root.querySelector('[data-metric="separated"]').textContent = `${state.separatedComponents}개`;
      root.querySelector('[data-metric="component-count"]').textContent = `전체 연결 성분 ${state.components.length}개`;
      root.querySelector('[data-metric="unreachable"]').textContent = `${number(newUnreachable)}명`;
      root.querySelector('.percolation-demo-explanation').textContent = step.explanation;
      const componentText = state.components.map(component => `${component.members.join('·')} ${number(component.population)}명${component.medical ? ' (의료시설 있음)' : ' (의료시설 없음)'}`).join(' / ');
      root.querySelector('.percolation-demo-members').textContent = `연결 성분: ${componentText}`;
      description.textContent = `${step.explanation} 연결 성분: ${componentText}. 제거한 도로: ${step.removed.join(', ') || '없음'}.`;
      for (const [edge, element] of edgeElements) element.classList.toggle('is-cut', step.removed.includes(edge));
      for (const [nodeId, element] of nodeElements) element.classList.toggle('is-largest', largestMembers.has(nodeId));
    }
    slider.addEventListener('input', event => setStep(event.target.value));
    setStep(0);
    // A new render replaces this instance's elements and their event listeners.
    return {
      setStep,
      getState: () => ({ step: currentStep, ...JSON.parse(JSON.stringify(state)), newMedicalUnreachable: state.medicalUnreachable - baseline.medicalUnreachable })
    };
  };
})();
