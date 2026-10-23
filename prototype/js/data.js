// Capa de datos mock. Más adelante se reemplaza por los adaptadores reales
// (PolicyProvider, ContentProvider, SimulationProvider).
const SOURCES = {
  policy: "../mock-data/policy.json",
  simulation: "../mock-data/simulation.json",
  content: "../content/policy-content.json",
  education: "../content/education.json",
};

const cache = {};

async function load(name) {
  if (!cache[name]) {
    const res = await fetch(SOURCES[name]);
    if (!res.ok) throw new Error(`No se pudo cargar ${SOURCES[name]}`);
    cache[name] = await res.json();
  }
  return cache[name];
}

const DAY = 86400000;
const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const toIso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseIso = (iso) => new Date(`${iso}T00:00:00`);

// Devuelve la póliza con su estado calculado. `scenario` solo existe en el prototipo
// para mostrar los tres estados de HU-08 sin cambiar los datos.
export async function getPolicy(scenario) {
  const data = structuredClone(await load("policy"));
  const { policy, statusRules, demoScenarios } = data;

  const demo = demoScenarios[scenario];
  if (demo) {
    const end = new Date(today().getTime() + demo.daysToEnd * DAY);
    policy.endDate = toIso(end);
    policy.startDate = toIso(new Date(end.getFullYear() - 1, end.getMonth(), end.getDate() + 1));
  }

  const daysLeft = Math.round((parseIso(policy.endDate) - today()) / DAY);
  policy.daysLeft = daysLeft;
  policy.status = daysLeft < 0 ? "vencida" : daysLeft <= statusRules.porVencerDays ? "por-vencer" : "vigente";
  policy.statusLabel = statusRules.labels[policy.status];
  return data;
}

export async function getContent() {
  const content = await load("content");
  return { ...content, unit: (id) => content.units.find((u) => u.id === id) };
}

export async function getSimulation() {
  return load("simulation");
}

export async function getEducation(placement) {
  const { messages } = await load("education");
  return messages.find((m) => m.placement === placement);
}

export function formatMoney(value, currency = "COP") {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDate(iso, options = { day: "numeric", month: "long", year: "numeric" }) {
  return parseIso(iso).toLocaleDateString("es-CO", options);
}
