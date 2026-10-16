// C1 · Resumen de la póliza activa y estado de cobertura.
import { getPolicy, formatMoney, formatDate } from "../data.js";

export async function renderSummary() {
  const { insured, policy } = await getPolicy();

  return `
    <h1>Hola, ${insured.name.split(" ")[0]}</h1>
    <section class="card">
      <p class="muted">${policy.product} · ${policy.id}</p>
      <span class="badge badge--${policy.status}">${policy.status}</span>
      <p>Vigente hasta el <strong>${formatDate(policy.endDate)}</strong></p>
      <p>Prima mensual: <strong>${formatMoney(policy.monthlyPremium, policy.currency)}</strong></p>
    </section>
    <section class="card">
      <h2>Tus coberturas</h2>
      <ul>
        ${policy.coverages.map((c) => `<li>${c.name}</li>`).join("")}
      </ul>
    </section>
  `;
}
