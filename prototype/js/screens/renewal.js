// C3 · Vigencia (HU-15) y alertas previas al vencimiento (HU-16).
// La renovación termina en una solicitud: la app no cobra ni emite la nueva vigencia.
import { getPolicy, getContent, getEducation, getNotifications, formatDate, formatMoney, parseIso, toIso, DAY, today } from "../data.js";
import { icon } from "../icons.js";
import { eduCard, clausuladoButton, withClausulado, mountClausulado, demoSwitch, sheet, mountSheet } from "../components.js";

const addDays = (iso, n) => toIso(new Date(parseIso(iso).getTime() + n * DAY));

function statusBanner(policy) {
  if (policy.status === "vencida") {
    return `
      <div class="banner banner--danger" role="alert">
        ${icon("alert")}
        <div>
          <h2>Tu póliza venció el ${formatDate(policy.endDate)}</h2>
          <p class="small">Desde el ${formatDate(addDays(policy.endDate, 1))} no tienes cobertura. Si pides una nueva vigencia, te protege desde que se emita; lo ocurrido antes no queda cubierto.</p>
        </div>
      </div>`;
  }
  if (policy.status === "por-vencer") {
    return `
      <div class="banner banner--warn" role="status">
        ${icon("clock")}
        <div>
          <h2>Vence el ${formatDate(policy.endDate)}</h2>
          <p class="small">Te quedan ${policy.daysLeft} ${policy.daysLeft === 1 ? "día" : "días"} de cobertura. Para no perder ni un día, pide la renovación antes de esa fecha.</p>
        </div>
      </div>`;
  }
  return "";
}

function periodCard(policy) {
  const total = Math.round((parseIso(policy.endDate) - parseIso(policy.startDate)) / DAY) + 1;
  const used = Math.min(total, Math.max(0, total - Math.max(policy.daysLeft, 0)));
  const pct = Math.round((used / total) * 100);
  const left = policy.daysLeft < 0 ? `Venció hace ${-policy.daysLeft} ${policy.daysLeft === -1 ? "día" : "días"}` : `Quedan ${policy.daysLeft} ${policy.daysLeft === 1 ? "día" : "días"} de cobertura`;
  return `
    <section class="card stack" aria-labelledby="periodo-title">
      <div class="row between">
        <h2 id="periodo-title">Tu periodo de cobertura</h2>
        <span class="badge badge--${policy.status}">${icon({ vigente: "checkCircle", "por-vencer": "clock", vencida: "alert" }[policy.status], "i-sm")}${policy.statusLabel}</span>
      </div>
      <div class="dates">
        <div><span class="label">Empieza</span><span class="value">${formatDate(policy.startDate)}</span><span class="xsmall muted">desde las 00:00</span></div>
        <span class="muted" aria-hidden="true">${icon("chev")}</span>
        <div><span class="label">Termina</span><span class="value">${formatDate(policy.endDate)}</span><span class="xsmall muted">hasta las 24:00</span></div>
      </div>
      <div class="progress progress--${policy.status}" role="img" aria-label="Has usado ${pct} % de tu vigencia">
        <span style="width:${pct}%"></span>
      </div>
      <p class="strong">${left}</p>
    </section>`;
}

function autoRenewCard(policy) {
  return policy.autoRenew
    ? `
    <section class="card stack">
      <div class="row between"><h2>Renovación automática</h2><span class="badge badge--ok">${icon("check", "i-sm")}Activada</span></div>
      <p class="small">Tu póliza se renueva sola el ${formatDate(addDays(policy.endDate, 1))}, con las mismas coberturas. Antes te avisamos el valor de la nueva prima y puedes cancelarla.</p>
    </section>`
    : `
    <section class="card stack">
      <div class="row between"><h2>Renovación automática</h2><span class="badge badge--neutral">${icon("ban", "i-sm")}No activada</span></div>
      <p class="small">Tu póliza <b>no se renueva sola</b>. Si no pides la renovación antes del ${formatDate(policy.endDate)}, la cobertura termina ese día.</p>
    </section>`;
}

// HU-16 · Tres avisos (30, 15 y 3 días) con fecha exacta y acción concreta.
function alertsCard(policy, alertDays) {
  const now = toIso(today());
  return `
    <section class="card stack" aria-labelledby="avisos-title">
      <h2 id="avisos-title">Te avisaremos antes de que venza</h2>
      <ol class="timeline">
        ${alertDays.map((d) => {
          const date = addDays(policy.endDate, -d);
          const sent = date <= now;
          return `
          <li class="tl tl--${sent ? "hecho" : "pendiente"}">
            <span class="tl-dot">${icon(sent ? "check" : "bell", "i-sm")}</span>
            <div>
              <p class="strong">${d} días antes · ${formatDate(date, { day: "numeric", month: "short", year: "numeric" })}</p>
              <p class="small muted">${sent ? "Enviado" : "Programado"} · «Tu póliza vence el ${formatDate(policy.endDate)}. Pide la renovación para seguir protegido.»</p>
            </div>
          </li>`;
        }).join("")}
      </ol>
      <a class="link-btn small" href="#/avisos?ver=preferencias">Elegir por dónde te avisamos</a>
    </section>`;
}

function renewSection(policy) {
  const expired = policy.status === "vencida";
  return `
    <section class="card stack" aria-labelledby="renovar-title" id="renew-box">
      <h2 id="renovar-title">${expired ? "Cómo volver a estar protegido" : "Cómo renovar"}</h2>
      <ol class="steps">
        <li><b>Pide la renovación aquí.</b> No tiene costo adicional ni te compromete todavía.</li>
        <li><b>Te confirmamos el valor.</b> Seguros Andinos te envía la prima de la nueva vigencia antes de cobrar.</li>
        <li><b>Aceptas y listo.</b> ${expired ? "La nueva vigencia empieza el día que se emita." : `Tu nueva vigencia empieza el ${formatDate(addDays(policy.endDate, 1))}, sin días sin cobertura.`}</li>
      </ol>
      <button type="button" class="btn ${expired ? "btn--danger" : "btn--primary"} btn--block" data-open="renovar">${icon("calendar", "i-sm")} ${expired ? "Pedir una nueva vigencia" : "Pedir la renovación"}</button>
      <p class="xsmall muted center">¿Prefieres hablar con alguien? Línea 601 555 0100, lunes a sábado de 7 a. m. a 7 p. m.</p>
    </section>`;
}

function renewSheet(policy) {
  const expired = policy.status === "vencida";
  const start = expired ? null : addDays(policy.endDate, 1);
  return sheet("renovar", expired ? "Pedir una nueva vigencia" : "Pedir la renovación", `
    <p class="small">Revisa lo que pides. Nada se cobra hasta que aceptes el valor que te confirmemos.</p>
    <dl class="kv">
      <div><dt>Plan</dt><dd>${policy.planName}, las mismas coberturas</dd></div>
      <div><dt>Nueva vigencia</dt><dd>${start ? `${formatDate(start)} al ${formatDate(addDays(start, 364))}` : "Un año desde el día en que se emita"}</dd></div>
      <div><dt>Prima de referencia</dt><dd>${formatMoney(policy.monthlyPremium)} al mes, lo que pagas hoy</dd></div>
    </dl>
    <p class="banner banner--info small">${icon("info")}<span>La prima de la nueva vigencia puede ajustarse. Te la confirmamos por escrito antes de cobrar.</span></p>
    <button type="button" class="btn btn--primary btn--block" id="renew-confirm">Enviar solicitud</button>
    <button type="button" class="btn btn--secondary btn--block" data-close="renovar">Ahora no</button>`);
}

export async function renderRenewal(params) {
  const scenario = params.get("estado") ?? "";
  const [{ policy }, content, tip, notif] = await Promise.all([getPolicy(scenario), getContent(), getEducation("vigencia"), getNotifications()]);
  const vigencia = content.unit("TER-VIGENCIA");

  const html = `
    <div>
      <p class="small muted">${policy.product} · ${policy.planName} · ${policy.id}</p>
      <h1>Vigencia y renovación</h1>
    </div>
    ${statusBanner(policy)}
    ${periodCard(policy)}
    ${renewSection(policy)}
    ${policy.status === "vencida" ? "" : autoRenewCard(policy) + alertsCard(policy, notif.expiryAlertDays)}
    <section class="card stack">
      <h2>¿Qué significa vigencia?</h2>
      <p class="small">Es el periodo en que tu seguro te protege. Lo que pase fuera de esas fechas no está cubierto.</p>
      <details class="layer">
        <summary>Ver texto de la póliza</summary>
        <p class="literal">${vigencia.literalText}</p>
        <p class="meta" style="margin-top:6px">Versión ${vigencia.version} · Aprobado por ${vigencia.legalApproval.approvedBy} el ${formatDate(vigencia.legalApproval.date)}</p>
      </details>
    </section>
    ${clausuladoButton(content)}
    ${eduCard(tip)}
    ${demoSwitch("/vigencia", scenario)}
    ${renewSheet(policy)}
  `;

  function mount(view) {
    mountClausulado(view);
    const dialog = mountSheet(view, "renovar");
    view.querySelector("#renew-confirm").addEventListener("click", () => {
      dialog.close();
      notif.notifications.unshift({
        id: `NOT-${Date.now()}`,
        type: "renovacion",
        date: new Date().toISOString().slice(0, 19),
        title: "Recibimos tu solicitud de renovación",
        body: "En los próximos 2 días hábiles te enviaremos el valor de la nueva vigencia para que lo aceptes.",
        link: "#/vigencia",
        action: "Ver tu vigencia",
        read: false,
      });
      window.dispatchEvent(new Event("notifications-changed"));
      view.querySelector("#renew-box").innerHTML = `
        <div class="banner banner--info" role="status" style="border:0;padding:0;background:none">
          ${icon("checkCircle")}
          <div>
            <h2>Solicitud enviada</h2>
            <p class="small">En los próximos 2 días hábiles te enviamos el valor de la nueva vigencia. Tu póliza actual no ha cambiado. Te dejamos un aviso en <a href="#/avisos">Avisos</a>.</p>
          </div>
        </div>`;
    });
  }

  return { html: withClausulado(html, content), mount };
}
