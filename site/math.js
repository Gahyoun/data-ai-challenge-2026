(() => {
  'use strict';

  const completed = new WeakMap();
  const options = Object.freeze({
    displayMode: true,
    throwOnError: false,
    trust: false,
    strict: 'warn',
    output: 'htmlAndMathml'
  });

  function showSource(element, latex, state, message) {
    const source = document.createElement('code');
    source.className = 'research-math-source';
    source.textContent = latex;
    const status = document.createElement('span');
    status.className = 'research-math-status';
    status.textContent = message;
    element.replaceChildren(source, status);
    element.dataset.mathState = state;
  }

  window.renderResearchMath = function renderResearchMath(root = document) {
    const elements = [];
    if (root?.matches?.('[data-latex]')) elements.push(root);
    if (root?.querySelectorAll) elements.push(...root.querySelectorAll('[data-latex]'));
    const result = { rendered: 0, skipped: 0, errors: 0, unavailable: 0 };

    for (const element of elements) {
      const latex = element.getAttribute('data-latex') ?? '';
      const previous = completed.get(element);
      const engine = window.katex;
      element.classList.add('research-math');
      // Focus enables keyboard scrolling for an equation wider than its panel.
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;

      if (previous?.latex === latex && previous.version === engine?.version &&
          element.dataset.mathState === 'rendered' && element.querySelector('.katex')) {
        result.skipped += 1;
        continue;
      }

      delete element.dataset.mathError;
      delete element.dataset.mathEngine;
      if (!engine?.render || !engine?.renderToString) {
        showSource(element, latex, 'unavailable', '수식 렌더러를 불러오지 못해 LaTeX 원문을 표시합니다.');
        result.unavailable += 1;
        continue;
      }
      if (!latex.trim()) {
        showSource(element, latex, 'error', '수식 원문이 비어 있습니다.');
        element.dataset.mathError = 'empty-latex';
        result.errors += 1;
        continue;
      }

      try {
        engine.render(latex, element, options);
        // With throwOnError:false, an unknown command can appear as coloured
        // text without a .katex-error node. Validate it before marking success.
        engine.renderToString(latex, { ...options, throwOnError: true });
        if (element.querySelector('.katex-error') || !element.querySelector('.katex')) {
          throw new Error('KaTeX could not render this expression.');
        }
        element.dataset.mathState = 'rendered';
        element.dataset.mathEngine = `katex-${engine.version}`;
        completed.set(element, { latex, version: engine.version });
        result.rendered += 1;
      } catch (error) {
        showSource(element, latex, 'error', '수식을 변환하지 못해 LaTeX 원문을 표시합니다.');
        element.dataset.mathError = error instanceof Error ? error.message : String(error);
        result.errors += 1;
      }
    }
    return result;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.renderResearchMath(), { once: true });
  } else {
    window.renderResearchMath();
  }
})();
