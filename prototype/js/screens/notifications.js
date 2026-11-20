// C6 · Centro de avisos: historial de notificaciones (HU-26), reclamaciones (HU-23)
// y preferencias de canal. Cada aviso enlaza a la pantalla que resuelve la situación.
import { getNotifications, getClaims, getPolicy, getEducation, formatDate, formatMoney } from "../data.js";
import { icon } from "../icons.js";
import { eduCard, sheet, mountSheet } from "../components.js";

const TABS = [
  ["historial", "Avisos"],
  ["siniestros", "Reclamaciones"],
  ["preferencias", "Preferencias"],
];

const TYPE = {
  siniestro: { ico: "tools", label: "Reclamación", tone: "primary" },
  pago: { ico: "card", label: "Pago", tone: "ok" },
  renovacion: { ico: "calendar", label: "Renovación", tone: "primary" },
  "renovacion-exitosa": { ico: "checkCircle", label: "Renovación exitosa", tone: "ok" },
  "renovacion-fallida": { ico: "alert", label: "Renovación fallida", tone: "danger" },
  vencimiento: { ico: "clock", label: "Vencimiento", tone: "warn" },
  educativo: { ico: "bulb", label: "Consejo", tone: "edu" },
};

const CLAIM_BADGE = { "en-proceso": ["warn", "clock"], pagado: ["ok", "checkCircle"], "no-cubierto": ["neutral", "ban"] };

function when(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

function historyPanel(notifications) {
  const unread = notifications.filter((n) => !n.read).length;
  return `
    <div class="row between">
      <p class="small muted" id="unread-text">${unread ? `Tienes ${unread} ${unread === 1 ? "aviso nuevo" : "avisos nuevos"}` : "Estás al día"}</p>
      <button type="button" class="link-btn small" id="mark-all" ${unread ? "" : "hidden"}>Marcar todo como leído</button>
    </div>
    <ul class="notif-list">
      ${notifications.map((n) => {
        const t = TYPE[n.type] ?? TYPE.educativo;
        return `
        <li>
          <a class="notif ${n.read ? "" : "notif--unread"}" href="${n.link}" data-notif="${n.id}">
            <span class="notif-ico tone--${t.tone}">${icon(t.ico)}</span>
            <span class="grow stack" style="gap:2px">
              <span class="row between xsmall muted"><span>${t.label}</span><span>${when(n.date)}</span></span>
              <span class="strong">${n.read ? "" : '<span class="new-tag">Nuevo</span> '}${n.title}</span>
              <span class="small">${n.body}</span>
              <span class="small strong" style="color:var(--color-primary)">${n.action} →</span>
            </span>
          </a>
        </li>`;
      }).join("")}
    </ul>`;
}

function claimsPanel(claims, labels, policy, tip) {
  const cov = (id) => policy.coverages.find((c) => c.id === id)?.name ?? "";
  return `
    <button type="button" class="btn btn--primary btn--block" data-open="reportar">${icon("alert", "i-sm")} Reportar un daño</button>
    ${claims.map((c) => {
      const [tone, ico] = CLAIM_BADGE[c.status];
      return `
      <a class="card card--link" href="#/siniestro?id=${c.id}">
        <span class="grow stack" style="gap:4px">
          <span class="row between"><span class="xsmall muted">${c.id}</span><span class="badge badge--${tone}">${icon(ico, "i-sm")}${labels[c.status]}</span></span>
          <span class="strong">${c.title}</span>
          <span class="small muted">${cov(c.coverageId)} · reportado el ${formatDate(c.reportedDate, { day: "numeric", month: "short", year: "numeric" })} · ${formatMoney(c.claimedAmount)}</span>
          ${c.missingDocument ? `<span class="small" style="color:var(--color-warn)">${icon("alert", "i-sm inline")} Falta un documento</span>` : ""}
        </span>
        <span class="muted">${icon("chev", "i-sm")}</span>
      </a>`;
    }).join("")}
    ${eduCard(tip)}`;
}
function toggle(group, item) {
  return `
    <li class="pref">
      <span class="grow"><span class="strong">${item.label}</span><br><span class="small muted">${item.detail}${item.locked ? " · Obligatorio: es un aviso sobre tu cobertura" : ""}</span></span>
      <label class="switch">
        <input type="checkbox" role="switch" data-pref="${group}:${item.id}" ${item.enabled ? "checked" : ""} ${item.locked ? "disabled" : ""} aria-label="${item.label}">
        <span aria-hidden="true"></span>
      </label>
    </li>`;
}

function prefsPanel(prefs) {
  return `
    <section class="card">
      <h2>¿Por dónde te avisamos?</h2>
      <ul class="pref-list">${prefs.channels.map((c) => toggle("channels", c)).join("")}</ul>
    </section>
    <section class="card">
      <h2>¿Sobre qué te avisamos?</h2>
      <ul class="pref-list">${prefs.topics.map((t) => toggle("topics", t)).join("")}</ul>
    </section>
    <button type="button" class="btn btn--primary btn--block" id="save-prefs" disabled>Guardar cambios</button>
    <p id="prefs-status" class="footnote" role="status"></p>`;
}

function reportSheet() {
  return sheet("reportar", "Reportar un daño", `
    <p class="small">Mientras se habilita el reporte desde la app, hazlo por teléfono. Ten a mano:</p>
    <ol class="steps">
      <li>Tu número de póliza <b>POL-2026-0042</b>.</li>
      <li>Fotos del daño, tomadas antes de reparar.</li>
      <li>Qué pasó y cuándo. Repórtalo en las primeras 72 horas.</li>
    </ol>
    <a class="btn btn--primary btn--block" href="tel:6015550100">${icon("phone", "i-sm")} Llamar a la línea 601 555 0100</a>
    <p class="xsmall muted center">Atención 24 horas para emergencias.</p>`);
}

export async function renderNotifications(params) {
  const [notif, claimsData, { policy }, tip] = await Promise.all([getNotifications(), getClaims(), getPolicy(), getEducation("avisos")]);
  const active = TABS.some(([k]) => k === params.get("ver")) ? params.get("ver") : "historial";

  const panels = {
    historial: historyPanel(notif.notifications),
    siniestros: claimsPanel(claimsData.claims, claimsData.statusLabels, policy, tip),
    preferencias: prefsPanel(notif.preferences),
  };

  const html = `
    <h1>Avisos</h1>
    <div class="segmented" role="tablist" aria-label="Secciones de avisos">
      ${TABS.map(([key, label]) => `<button type="button" role="tab" id="tab-${key}" aria-controls="panel-${key}" aria-selected="${key === active}" data-tab="${key}">${label}</button>`).join("")}
    </div>
    ${TABS.map(([key]) => `<div class="stack" role="tabpanel" id="panel-${key}" aria-labelledby="tab-${key}" ${key === active ? "" : "hidden"}>${panels[key]}</div>`).join("")}
    ${reportSheet()}
  `;

  function mount(view) {
    mountSheet(view, "reportar");

    view.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.tab;
        view.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        view.querySelectorAll('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== `panel-${key}`; });
        history.replaceState(null, "", `#/avisos?ver=${key}`);
      });
    });

    // Abrir un aviso lo marca como leído y lleva a la pantalla que lo resuelve.
    view.querySelectorAll("[data-notif]").forEach((a) => {
      a.addEventListener("click", () => {
        notif.notifications.find((n) => n.id === a.dataset.notif).read = true;
        window.dispatchEvent(new Event("notifications-changed"));
      });
    });
    view.querySelector("#mark-all")?.addEventListener("click", () => {
      notif.notifications.forEach((n) => { n.read = true; });
      view.querySelector("#panel-historial").innerHTML = historyPanel(notif.notifications);
      window.dispatchEvent(new Event("notifications-changed"));
    });

    const save = view.querySelector("#save-prefs");
    const status = view.querySelector("#prefs-status");
    view.querySelectorAll("[data-pref]").forEach((box) => box.addEventListener("change", () => {
      save.disabled = false;
      status.textContent = "";
    }));
    save.addEventListener("click", () => {
      view.querySelectorAll("[data-pref]").forEach((box) => {
        const [group, id] = box.dataset.pref.split(":");
        notif.preferences[group].find((i) => i.id === id).enabled = box.checked;
      });
      save.disabled = true;
      status.textContent = "Preferencias guardadas.";
    });
  }

  return { html, mount };
}
