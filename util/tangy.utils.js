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

function generateChoice(element, locale) {
  const options = Array.from(element.querySelectorAll('option'));
  return options.map(option => ({
    id: option.value,
    description: { [locale]: option.textContent.trim() }
  }));
}

export function generateXapiStatement({
  element,
  interactionType,
}) {
  const locale = document.documentElement.lang || navigator.language;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = element.label || element.name;
  const label = tempDiv.textContent || tempDiv.innerText || '';
  const objectId = _generateObjectId(element);
  const definition = {
    name: { [locale]: element.name || element.id },
    description: { [locale]: label },
    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
    interactionType,
    // this check if interactionType is 'choice' before adding choices other wise it remove choices
    ...(interactionType === 'choice' && {
      choices: generateChoice(element, locale)
    })
  };

  
  return {
    verb: {
      id: 'http://adlnet.gov/xapi/verbs/attempted',
    },
    object: {
      id: objectId,
      objectType: 'Activity',
      definition,
    }
  };
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