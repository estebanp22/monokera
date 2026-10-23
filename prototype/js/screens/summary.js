// C1 · Resumen de la póliza activa (HU-07) y estado de la cobertura (HU-08).
import { getPolicy, getContent, getEducation, formatDate } from "../data.js";
import { icon } from "../icons.js";
import { eduCard, clausuladoButton, withClausulado, mountClausulado } from "../components.js";

const STATUS_ICON = { vigente: "checkCircle", "por-vencer": "clock", vencida: "alert" };
const SCENARIOS = [
  ["", "Activa"],
  ["por-vencer", "Por vencer"],
  ["vencida", "Vencida"],
];

function statusBlock(policy) {
  if (policy.status === "por-vencer") {
    return `
      <div class="banner banner--warn" role="status">
        ${icon("clock")}
        <div>
          <h2>Tu póliza vence en ${policy.daysLeft} ${policy.daysLeft === 1 ? "día" : "días"}</h2>
          <p class="small">Si no la renuevas antes del ${formatDate(policy.endDate)}, dejarás de estar protegido desde el día siguiente.</p>
          <div class="actions"><a class="btn btn--primary" href="#/vigencia">Ver cómo renovar</a></div>
        </div>
      </div>`;
  }
  if (policy.status === "vencida") {
    return `
      <div class="banner banner--danger" role="alert">
        ${icon("alert")}
        <div>
          <h2>No tienes cobertura vigente</h2>
          <p class="small">Tu póliza venció el ${formatDate(policy.endDate)}. Lo que le pase a tu vivienda desde esa fecha no está cubierto.</p>
          <div class="actions"><a class="btn btn--danger" href="#/vigencia">Renovar mi póliza</a></div>
        </div>
      </div>`;
  }
  return "";
}

function fact(href, ico, label, value) {
  return `
    <li>
      <a href="${href}">
        <span class="muted">${icon(ico)}</span>
        <span class="grow"><span class="label">${label}</span><br><span class="value">${value}</span></span>
        <span class="muted">${icon("chev", "i-sm")}</span>
      </a>
    </li>`;
}

export async function renderSummary(params) {
  const scenario = params.get("estado") ?? "";
  const [{ insured, policy }, content, tip] = await Promise.all([getPolicy(scenario), getContent(), getEducation("resumen")]);
  const expired = policy.status === "vencida";
  const daysText = expired ? `Venció hace ${-policy.daysLeft} días` : `Quedan ${policy.daysLeft} días`;

  const html = `
    <h1>Hola, ${insured.name.split(" ")[0]}</h1>
    ${statusBlock(policy)}

    <section class="card" aria-labelledby="poliza-title">
      <div class="row between">
        <h2 id="poliza-title">Tu póliza</h2>
        <span class="badge badge--${policy.status}">${icon(STATUS_ICON[policy.status], "i-sm")}${policy.statusLabel}</span>
      </div>
      <p class="small muted" style="margin-top:4px">${daysText}</p>
      <ul class="facts" style="margin-top:6px">
        ${fact("#/detalle", "home", "Producto", `${policy.product} · ${policy.planName}`)}
        ${fact("#/detalle", "doc", "Número de póliza", policy.id)}
        ${fact("#/detalle", "building", "Aseguradora", policy.insurer)}
        ${fact("#/vigencia", "calendar", expired ? "Venció el" : "Te protege hasta el", formatDate(policy.endDate))}
      </ul>
    </section>

    <a class="btn btn--primary btn--block" href="#/detalle">${icon("shield", "i-sm")} ${expired ? "Ver lo que cubría" : "Ver qué cubre y qué no"}</a>
    ${clausuladoButton(content)}

    ${eduCard(tip)}

    <nav class="demo" aria-label="Escenario de demostración">
      <p class="k">Solo prototipo · estado de la póliza</p>
      <div class="segmented">
        ${SCENARIOS.map(([key, label]) => `<a href="#/resumen${key ? `?estado=${key}` : ""}" ${key === scenario ? 'aria-current="true"' : ""}>${label}</a>`).join("")}
      </div>
    </nav>
  `;

  return { html: withClausulado(html, content), mount: mountClausulado };
}
