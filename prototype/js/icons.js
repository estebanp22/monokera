// Íconos de trazo (24×24). Decorativos: siempre van acompañados de texto.
const PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  fire: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.6-5.6 3.8-8.8 1.9 1.4 2.4 3.4 2.4 4.6 1-.6 1.8-1.8 2-3.2 2.1 1.9 2.8 4.4 2.8 6.8 0 3.9-2.6 6.8-4.5 6.8z"/>',
  water: '<path d="M12 3.5s6 6.4 6 10.6A6 6 0 0 1 6 14.1C6 9.9 12 3.5 12 3.5z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.6 3 2.4 3 5.2"/>',
  tools: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
  quake: '<path d="M3 12h3l2-5 3 10 3-8 2 3h5"/>',
  paw: '<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 12c-3 0-5 3.2-5 5.2 0 1.6 1.4 2.3 2.8 1.8 1.6-.6 2.8-.6 4.4 0 1.4.5 2.8-.2 2.8-1.8 0-2-2-5.2-5-5.2z"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 19h18"/>',
  ban: '<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.3 2.8 2.7L16 9.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  scale: '<path d="M12 4v16M5 20h14M6 8h12"/><path d="m6 8-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/>',
  building: '<path d="M4 20V6l8-3 8 3v14"/><path d="M9 20v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 12h.01M12 12h.01M16 12h.01"/>',
  phone: '<path d="M6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5.5a2 2 0 0 1 2-2z"/>',
};

export function icon(name, extraClass = "") {
  return `<svg class="i ${extraClass}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PATHS[name] ?? ""}</svg>`;
}
