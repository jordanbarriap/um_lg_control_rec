function ordinal_en(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function ordinal_es(n) {
    return n + "°";
}

function t(key, params = {}, defaultLang = "en") {
  // key: "group_select.help_control.intro"
  const keys = key.split(".");
  const language = qs["lang"] || defaultLang
  let translation = locales[language];

  for (const k of keys) {
    if (translation && typeof translation === "object") {
      translation = translation[k];
    } else {
      translation = undefined;
      break;
    }
  }

  // Inject ordinal helpers if needed
  if (params && params.rank !== undefined) {
    params.ordinal_rank = (language === "es" ? ordinal_es : ordinal_en)(params.rank);
  }

  if (typeof translation === "string") {
    return interpolate(translation, params);
  } else {
    console.error(`Translation not found for key: ${key}`);
    return key; // fallback: return key itself
  }
}

function interpolate(str, params) {
  if (!params) return str;
  // Supports both ${key} and {key}
  return str.replace(/\$\{([^}]+)\}|\{([^}]+)\}/g, (match, p1, p2) => {
    const key = p1 || p2;
    return params[key] !== undefined ? params[key] : match;
  });
}

function translatePage() {
  // For inner text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  // For value attributes (e.g., buttons)
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    el.value = t(el.getAttribute('data-i18n-value'));
  });
  // For title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
}

function findKeyByValue(obj, target, path = '') {
    return findNestedKeyByValue(obj, target, path) || target;
}

function findNestedKeyByValue(obj, target, path = '') {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const val = obj[key];
    const newPath = path ? `${path}.${key}` : key;
    if (typeof val === 'string' && val === target) {
      return newPath;
    } else if (typeof val === 'object' && val !== null) {
      const result = findNestedKeyByValue(val, target, newPath);
      if (result) return result;
    }
  }
  return undefined;
}