// C2 · Detalle de coberturas (HU-12), exclusiones (HU-13), prima, deducible y copago (HU-14)
// y acceso al clausulado oficial (HU-17).
import { getPolicy, getContent, getEducation, formatMoney, formatDate } from "../data.js";
import { icon } from "../icons.js";
import { eduCard, clausuladoButton, withClausulado, mountClausulado } from "../components.js";

const TABS = [
  ["cubre", "Lo que cubre"],
  ["no-cubre", "Lo que no cubre"],
  ["pagos", "Lo que pagas"],
];

// Segundo nivel: el texto literal, siempre de la misma versión que el resumen.
function literalLayer(unit) {
  return `
    <details class="layer">
      <summary>Ver texto de la póliza</summary>
      <p class="literal">${unit.literalText}</p>
      <p class="meta" style="margin-top:6px">Versión ${unit.version}, la misma del resumen · Aprobado por ${unit.legalApproval.approvedBy} el ${formatDate(unit.legalApproval.date)}</p>
    </details>`;
}

function itemCard({ kind, ico, title, sub, extra = "", unit }) {
  const approved = unit.legalApproval.status === "aprobado";
  const body = approved
    ? `<p>${unit.clearSummary}</p>
       <div class="example"><b>Por ejemplo</b>${unit.example}</div>
       ${extra}
       ${literalLayer(unit)}`
    : `<p class="pending"><b>Explicación en revisión por Legal.</b> Mientras se aprueba, consulta la cláusula en el clausulado oficial o con tu asesor.</p>`;
  return `
    <article class="item item--${kind}">
      <div class="item-head">
        <span class="item-ico">${icon(ico)}</span>
        <div>
          <h3 class="item-title">${title}</h3>
          <p class="item-sub">${sub}</p>
        </div>
      </div>
      ${body}
    </article>`;
}

function coveragesPanel(policy, content) {
  return policy.coverages.map((c) => itemCard({
    kind: "cov",
    ico: c.icon,
    title: c.name,
    sub: `Te pagamos hasta ${formatMoney(c.limit)}${c.limitNote ? `, ${c.limitNote}` : ""}`,
    extra: `<p class="small"><span class="strong">Deducible:</span> ${c.deductible}</p>`,
    unit: content.unit(c.contentId),
  })).join("");
}

function exclusionsPanel(policy, content, tip) {
  const coverageName = (id) => policy.coverages.find((c) => c.id === id).name;
  return eduCard(tip) + policy.exclusions.map((e) => itemCard({
    kind: "exc",
    ico: "ban",
    title: e.name,
    sub: `No cubierto en: ${e.relatedCoverageIds.map(coverageName).join(", ")}`,
    unit: content.unit(e.contentId),
  })).join("");
}

function paymentsPanel(policy, content) {
  const { deductible, copay, illustrativeExample } = policy.costSharing;
  const loss = illustrativeExample.lossAmount;
  const byPercent = (loss * deductible.percentage) / 100;
  const youPay = Math.max(byPercent, deductible.minimum);
  const row = (ico, title, text, amount, note) => `
    <div class="pay-row">
      <span style="color:var(--color-primary)">${icon(ico)}</span>
      <div><h3>${title}</h3><p class="small muted">${text}</p></div>
      <div class="amt">${amount}<div class="xsmall muted" style="font-weight:400">${note}</div></div>
    </div>`;

  return `
    <section class="card">
      ${row("card", "Prima", `La pagas cada mes. Tu próximo cobro es el ${formatDate(policy.nextPaymentDate)}.`, formatMoney(policy.monthlyPremium), policy.paymentFrequency)}
      ${row("scale", "Deducible", content.unit(deductible.contentId).clearSummary, `${deductible.percentage} %`, `mínimo ${formatMoney(deductible.minimum)}`)}
      ${row("tools", "Copago", content.unit(copay.contentId).clearSummary, formatMoney(copay.amountPerService), "por servicio")}
    </section>
    <section class="card stack" aria-labelledby="ejemplo-title">
      <div class="row between">
        <h2 id="ejemplo-title">¿Cómo funciona el deducible?</h2>
        <span class="badge badge--neutral">Ejemplo ilustrativo</span>
      </div>
      <p class="small">Si un daño cubierto cuesta <b>${formatMoney(loss)}</b>:</p>
      <div class="pay-row"><span class="small">El ${deductible.percentage} % sería ${formatMoney(byPercent)}, ${byPercent < deductible.minimum ? "menos que el mínimo, así que pagas" : "y pagas"}</span><span class="amt">${formatMoney(youPay)}</span></div>
      <div class="pay-row"><span class="small strong">El seguro paga</span><span class="amt">${formatMoney(loss - youPay)}</span></div>
      <p class="xsmall muted">Este ejemplo no es una liquidación real. El valor de cada reclamación se define al revisarla.</p>
    </section>`;
}

export async function renderDetail(params) {
  const [{ policy }, content, tip] = await Promise.all([getPolicy(), getContent(), getEducation("detalle")]);
  const active = TABS.some(([key]) => key === params.get("ver")) ? params.get("ver") : "cubre";

  const panels = {
    cubre: coveragesPanel(policy, content),
    "no-cubre": exclusionsPanel(policy, content, tip),
    pagos: paymentsPanel(policy, content),
  };

  const html = `
    <div>
      <p class="small muted">${policy.product} · ${policy.planName} · ${policy.id}</p>
      <h1>Mi póliza</h1>
    </div>
    ${clausuladoButton(content)}
    <div class="segmented" role="tablist" aria-label="Secciones de la póliza">
      ${TABS.map(([key, label]) => `<button type="button" role="tab" id="tab-${key}" aria-controls="panel-${key}" aria-selected="${key === active}" data-tab="${key}">${label}</button>`).join("")}
    </div>
    ${TABS.map(([key]) => `<div class="stack" role="tabpanel" id="panel-${key}" aria-labelledby="tab-${key}" ${key === active ? "" : "hidden"}>${panels[key]}</div>`).join("")}
    <p class="footnote">Resumen y texto de la póliza de la versión ${content.version} del clausulado.</p>
  `;

  function mount(view) {
    mountClausulado(view);
    view.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.tab;
        view.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        view.querySelectorAll('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== `panel-${key}`; });
        history.replaceState(null, "", `#/detalle?ver=${key}`);
      });
    });
  }

  return { html: withClausulado(html, content), mount };
}
