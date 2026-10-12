// Capa de datos mock. Más adelante se reemplaza por el adaptador real (PolicyProvider).
const MOCK_URL = "../mock-data/policy.json";

let cache;

export async function getPolicy() {
  if (!cache) {
    const res = await fetch(MOCK_URL);
    if (!res.ok) throw new Error(`No se pudo cargar ${MOCK_URL}`);
    cache = await res.json();
  }
  return cache;
}

export function formatMoney(value, currency = "COP") {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}
