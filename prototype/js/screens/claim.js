// C6 · Estado de un siniestro reportado (HU-23): línea de tiempo por etapas, documento faltante
// y acceso al clausulado (HU-17). La pantalla no anticipa ni sugiere el resultado.
import { getClaim, getPolicy, getContent, getNotifications, formatDate, formatMoney } from "../data.js";
import { icon } from "../icons.js";
import { clausuladoButton, withClausulado, mountClausulado, backLink } from "../components.js";

const STAGE_ICON = { hecho: "check", "en-curso": "clock", pendiente: "" };
const BADGE = { "en-proceso": ["warn", "clock"], pagado: ["ok", "checkCircle"], "no-cubierto": ["neutral", "ban"] };

function timeline(stages, labels) {
  return `
    <ol class="timeline">
      ${stages.map((s) => `
        <li class="tl tl--${s.state}" ${s.state === "en-curso" ? 'aria-current="step"' : ""}>
          <span class="tl-dot">${STAGE_ICON[s.state] ? icon(STAGE_ICON[s.state], "i-sm") : ""}</span>
          <div>
            <p class="strong">${s.name}</p>
            <p class="xsmall muted">${labels[s.state]}${s.date ? ` · ${formatDate(s.date, { day: "numeric", month: "short", year: "numeric" })}` : ""}</p>
            <p class="small">${s.note}</p>
          </div>
        </li>`).join("")}
    </ol>`;
}

function missingDoc(doc) {
  return `
    <section class="banner banner--warn" id="doc-box" aria-labelledby="doc-title">
      ${icon("doc")}
      <div class="grow">
        <h2 id="doc-title">Falta un documento</h2>
        <p class="small"><b>${doc.name}.</b> ${doc.detail}</p>
        <p class="small" style="margin-top:4px">Envíalo antes del ${formatDate(doc.dueDate)}.</p>
        <div class="actions">
          <label class="btn btn--primary">${icon("doc", "i-sm")} Subir documento<input type="file" id="doc-file" accept="image/*,.pdf" class="sr-only"></label>
        </div>
      </div>
    </section>`;
}

function resolution(claim, policy) {
  if (claim.status === "pagado") {
    return `
      <section class="banner banner--info">${icon("checkCircle")}<div>
        <h2>Reclamación cerrada · pagamos ${formatMoney(claim.paidAmount)}</h2>
        <p class="small">${claim.resolution}</p>
      </div></section>`;
  }
  if (claim.status === "no-cubierto") {
    const exc = policy.exclusions.find((e) => e.id === claim.exclusionId);
    return `
      <section class="banner banner--neutral">${icon("info")}<div>
        <h2>Este daño no está cubierto</h2>
        <p class="small">${claim.resolution}</p>
        <div class="actions"><a class="btn btn--secondary" href="#/detalle?ver=no-cubre">Ver la exclusión «${exc.name}»</a></div>
        <p class="xsmall" style="margin-top:8px">Si no estás de acuerdo, puedes pedir una nueva revisión o acudir al Defensor del Consumidor Financiero.</p>
      </div></section>`;
  }
  return "";
}

export async function renderClaim(params) {
  const [{ claim, stageLabels, statusLabels }, { policy }, content, notif] = await Promise.all([
    getClaim(params.get("id")), getPolicy(), getContent(), getNotifications(),
  ]);
  if (!claim) {
    return `${backLink("#/avisos?ver=siniestros", "Reclamaciones")}<h1>No encontramos esa reclamación</h1>`;
  }
  const coverage = policy.coverages.find((c) => c.id === claim.coverageId);
  const [tone, ico] = BADGE[claim.status];

  const html = `
    ${backLink("#/avisos?ver=siniestros", "Reclamaciones")}
    <div>
      <p class="small muted">Reclamación ${claim.id}</p>
      <h1>${claim.title}</h1>
    </div>
    <div class="row"><span class="badge badge--${tone}">${icon(ico, "i-sm")}${statusLabels[claim.status]}</span></div>
    ${claim.missingDocument ? missingDoc(claim.missingDocument) : ""}
    ${resolution(claim, policy)}

    <section class="card stack" aria-labelledby="etapas-title">
      <h2 id="etapas-title">¿En qué va?</h2>
      ${timeline(claim.stages, stageLabels)}
      ${claim.status === "en-proceso" ? '<p class="xsmall muted">La decisión se toma al final de la evaluación. Te avisaremos en cada etapa.</p>' : ""}
    </section>

    <section class="card">
      <h2>Lo que reportaste</h2>
      <p class="small" style="margin-top:6px">${claim.description}</p>
      <dl class="kv" style="margin-top:10px">
        <div><dt>Cobertura</dt><dd><a href="#/detalle">${coverage.name}</a></dd></div>
        <div><dt>Fecha del daño</dt><dd>${formatDate(claim.eventDate)}</dd></div>
        <div><dt>Reportado</dt><dd>${formatDate(claim.reportedDate)}</dd></div>
        <div><dt>Valor reclamado</dt><dd>${formatMoney(claim.claimedAmount)}</dd></div>
      </dl>
    </section>
    ${clausuladoButton(content)}
    <p class="footnote">¿Dudas sobre tu reclamación? Línea 601 555 0100.</p>
  `;

  function mount(view) {
    mountClausulado(view);
    view.querySelector("#doc-file")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      view.querySelector("#doc-box").outerHTML = `
        <section class="banner banner--info" role="status">${icon("checkCircle")}<div>
          <h2>Documento recibido</h2>
          <p class="small">Recibimos «${file.name}». Lo revisamos en los próximos 2 días hábiles y te avisaremos cuando la reclamación avance.</p>
        </div></section>`;
      claim.missingDocument = null;
      const current = claim.stages.find((s) => s.state === "en-curso");
      if (current) current.note = `Recibimos «${file.name}» y lo estamos revisando.`;
      notif.notifications.filter((n) => n.link.includes(claim.id)).forEach((n) => { n.read = true; });
      window.dispatchEvent(new Event("notifications-changed"));
    });
  }

  return { html: withClausulado(html, content), mount };
}
