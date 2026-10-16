// Mockups v0 de todas las vistas. Datos de ejemplo en mock.js.
const M = window.MOCK;
const P = M.policy.policy;
const content = (id) => M.content.units.find((u) => u.id === id);

const TABS = ["Inicio", "Póliza", "Fechas", "Cotizar", "Mensajes"];
const shell = (body, tab) => `<div class="app"><div class="top"><b>MONOKERA</b><span>☰</span></div><main class="view">${body}</main>
  <div class="footer">Monokera S.A.S. Todos los derechos reservados. Información sujeta a las condiciones generales de la póliza.</div>
  <div class="tabs">${TABS.map((t, i) => `<span class="${i === tab ? "on" : ""}">${t}</span>`).join("")}</div></div>`;

function resumen(status, endDate) {
  return shell(`
    <h1>Bienvenido Usuario ASG-001</h1>
    <table>
      <tr><th>Póliza</th><td>${P.id}</td></tr>
      <tr><th>Ramo</th><td>HOGAR - ${P.planId}</td></tr>
      <tr><th>Estado</th><td class="green">${status}</td></tr>
      <tr><th>Fecha inicio</th><td>${P.startDate}</td></tr>
      <tr><th>Fecha fin</th><td>${endDate}</td></tr>
      <tr><th>Prima</th><td>${P.monthlyPremium} ${P.currency}</td></tr>
      <tr><th>Prima anual</th><td>${P.annualPremium}</td></tr>
      <tr><th>Valor asegurado</th><td>${P.insuredProperty.insuredValue}</td></tr>
    </table>
    <h2>Amparos</h2>
    <ul>${P.coverages.map((c) => `<li>${c.name}: ${c.limit}</li>`).join("")}</ul>
    <h2>Siniestros</h2>
    <p>SIN-2026-0007 - EST_03</p>
    <span class="btn-a">VER MÁS</span>
  `, 0);
}

function detalle() {
  return shell(`
    <h1>Condiciones de la póliza</h1>
    ${P.coverages.map((c) => `<div class="box"><b>${c.name}</b><p class="legal">${content(c.contentId).literalText}</p></div>`).join("")}
    <p class="legal"><b>Deducible:</b> ${content("TER-DEDUCIBLE").literalText}</p>
    <p class="legal"><b>Copago:</b> ${content("TER-COPAGO").literalText}</p>
    <p class="tiny">* Aplican exclusiones: ${P.exclusions.map((e) => content(e.contentId).literalText).join(" ")}</p>
    <span class="btn-c">Descargar PDF</span>
  `, 1);
}

function vigencia() {
  return shell(`
    <h1>Fechas</h1>
    <p>Inicio: ${P.startDate}</p>
    <p>Fin: ${P.endDate}</p>
    <p class="light">Para renovar comuníquese con su asesor o con la línea de atención en horario hábil.</p>
  `, 2);
}

function simulador() {
  const plus = M.simulation.plans[1];
  return shell(`
    <h1>Cotizador</h1>
    <p>Seleccione plan:</p>
    <select style="width:100%;padding:6px;font-size:13px"><option>${plus.name}</option></select>
    <h2>Su nuevo precio</h2>
    <p style="font-size:28px;color:#222;margin:4px 0"><b>$73.480</b> /mes</p>
    <ul>${Object.entries(plus.coverages).map(([k, v]) => `<li>${k}: ${v}</li>`).join("")}</ul>
    <span class="btn-b">CONTRATAR AHORA</span>
  `, 3);
}

function avisos() {
  const items = M.notifications.notifications.map((n) => `<div class="box"><b>${n.type.toUpperCase()}</b> ${n.date}<br>${n.body}</div>`).join("");
  const claims = M.claims.claims.map((c) => `<tr><td>${c.id}</td><td>${c.status === "en-revision" ? "EST_03" : c.status === "cerrado" ? "EST_05" : "EST_09"}</td><td>${c.claimedAmount}</td></tr>`).join("");
  return shell(`
    <h1>Mensajes</h1>
    ${items}
    <h2>Siniestros</h2>
    <table><tr><th>No.</th><th>Estado</th><th>Valor</th></tr>${claims}</table>
  `, 4);
}

function preferencias() {
  const topics = ["Vencimiento", "Renovación", "Siniestros", "Pagos", "Publicidad"];
  return shell(`
    <h1>Configuración</h1>
    ${topics.map((t, i) => `<div class="chk"><span>${t}</span><input type="checkbox" ${i < 3 ? "" : "checked"}></div>`).join("")}
    <span class="btn-a">GUARDAR</span>
  `, 4);
}

const SCREENS = {
  "01-inicio": () => resumen("vigente", P.endDate),
  "02-inicio-poliza-vencida": () => resumen("vencida", "2026-10-10"),
  "03-condiciones": detalle,
  "04-fechas": vigencia,
  "05-cotizador": simulador,
  "06-mensajes": avisos,
  "07-configuracion": preferencias,
};
window.SCREENS = Object.keys(SCREENS);
const key = new URLSearchParams(location.search).get("s") || "01-inicio";
document.body.innerHTML = SCREENS[key]();
