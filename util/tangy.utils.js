export function _generateObjectId(element) {
  const formEl = element.closest('tangy-form');
  const itemEl = element.closest('tangy-form-item');
  const formId = formEl ? formEl.id : 'unknown-form';
  const itemId = itemEl ? itemEl.id : 'unknown-item';
  const inputId = element.name || element.id;
  let path = window.location.pathname;
  if (path.endsWith("/")) {
      path = path.slice(0, -1);
  }
  const baseUrl = window.location.origin + path;
  return `${baseUrl}/${formId}/${itemId}/${inputId}`;
}

export function shouldIncludeXapi(el) {
  if (!el) return false;
  if (el.hasAttribute('skipped') || el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return false;

  let ancestor = el.parentElement;
  while (ancestor) {
    if (ancestor.hasAttribute && (ancestor.hasAttribute('skipped') || ancestor.hasAttribute('hidden') || ancestor.getAttribute('aria-hidden') === 'true')) {
      return false;
    }
    ancestor = ancestor.parentElement;
  }

  try {
    const cs = window.getComputedStyle(el);
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return false;
  } catch (e) {
    console.warn('Could not compute style for element', el, e);
  }

  return true;
}