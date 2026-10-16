(() => {
  'use strict';
  const root = document.documentElement;
  const base = root.dataset.base || '';
  const path = location.pathname;
  // Only the English home is eligible. Explicit internal URLs keep their language.
  if (path === `${base}/` || path === `${base}/index.html`) {
    let preference;
    try { preference = localStorage.getItem('dumaskald-language'); } catch (_) {}
    const primary = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (preference === 'uk' || (!preference && /^uk(?:-|$)/.test(primary))) {
      location.replace(`${base}/ua/${location.search}${location.hash}`);
      return;
    }
  }
  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      try { localStorage.setItem('dumaskald-language', link.dataset.language); } catch (_) {}
    });
  });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('is-open', expanded);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.focus();
    }
  });
  const share = document.querySelector('[data-share]');
  share?.addEventListener('click', async () => {
    const status = document.querySelector('[role="status"]');
    const url = location.href.split('#')[0];
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = root.lang === 'uk' ? 'Посилання скопійовано.' : 'Link copied.';
    } catch (_) {
      const field = document.querySelector('#share-url');
      field.hidden = false;
      field.value = url;
      field.focus(); field.select();
      status.textContent = root.lang === 'uk' ? 'Скопіюйте вибране посилання.' : 'Copy the selected link.';
    }
  });
})();
