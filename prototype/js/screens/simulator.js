// C4 · Simulador de ampliación de cobertura (HU-24) con rangos referenciales (HU-22, ADR-03).
// No vende ni modifica la póliza: el resultado termina en una solicitud de contacto con un asesor.
import { getPolicy, getSimulation, getEducation, formatMoney, formatDate } from "../data.js";
import { icon } from "../icons.js";
import { eduCard } from "../components.js";

function result(selected, sim, policy) {
  if (selected.length === 0) {
    return `<p class="small muted">Elige al menos una cobertura para ver qué ganarías y el rango de costo adicional.</p>`;
  }
  const min = selected.reduce((sum, a) => sum + a.monthlyRange.min, 0);
  const max = selected.reduce((sum, a) => sum + a.monthlyRange.max, 0);
  return `
    <p class="small muted">Costo adicional estimado</p>
    <p class="range">entre ${formatMoney(min)} y ${formatMoney(max)}</p>
    <p class="small muted">al mes, además de los ${formatMoney(policy.monthlyPremium)} que pagas hoy</p>
    <p class="banner banner--info small" style="margin-top:10px">${icon("info")}<span><b>${sim.disclaimer}</b> ${sim.confirmation}</span></p>
    <table class="cmp" style="margin-top:12px" aria-label="Comparación de coberturas hoy y con la ampliación">
      <thead><tr><th scope="col">Cobertura</th><th scope="col">Hoy</th><th scope="col">Con ampliación</th></tr></thead>
      <tbody>
        ${selected.map((a) => `<tr><td>${a.name}</td><td>${a.today}</td><td class="gain">${a.withAddOn}</td></tr>`).join("")}
      </tbody>
    </table>`;
}

export async function renderSimulator() {
  const [{ policy }, sim, tip] = await Promise.all([getPolicy(), getSimulation(), getEducation("simulador")]);

  const html = `
    <div>
      <p class="small muted">${policy.product} · Plan actual: ${policy.planName}</p>
      <h1>Simula una ampliación</h1>
    </div>
    <div class="banner banner--info">
      ${icon("info")}
      <p class="small"><b>Esto no es una cotización.</b> Te mostramos rangos de referencia para que compares con calma. No cambia tu póliza.</p>
    </div>

    <fieldset class="stack" style="border:0;padding:0;margin:0">
      <legend class="section-head" style="padding:0;margin-bottom:8px"><h2>¿Qué te gustaría agregar?</h2></legend>
      ${sim.addOns.map((a) => `
        <label class="option">
          <input type="checkbox" name="addon" value="${a.id}">
          <span class="stack" style="gap:2px;flex:1">
            <span class="row strong">${icon(a.icon, "i-sm")} ${a.name}</span>
            <span class="small muted">${a.summary}</span>
            <span class="xsmall muted">Entre ${formatMoney(a.monthlyRange.min)} y ${formatMoney(a.monthlyRange.max)} más al mes</span>
          </span>
        </label>`).join("")}
    </fieldset>

    <section class="card" aria-labelledby="resultado-title">
      <h2 id="resultado-title" style="margin-bottom:8px">Tu estimación</h2>
      <div id="sim-result" aria-live="polite">${result([], sim, policy)}</div>
    </section>

    <div id="sim-cta">
      <button type="button" class="btn btn--primary btn--block" id="sim-contact" disabled>${icon("phone", "i-sm")} Solicitar contacto con un asesor</button>
      <p class="footnote" style="margin-top:8px">La aplicación no contrata ni modifica tu póliza.</p>
    </div>

    ${eduCard(tip)}
    <p class="footnote">Rangos validados por ${sim.validation.validatedBy.toLowerCase()} el ${formatDate(sim.validation.date)}.</p>
  `;

  function mount(view) {
    const boxes = [...view.querySelectorAll('input[name="addon"]')];
    const out = view.querySelector("#sim-result");
    const contact = view.querySelector("#sim-contact");

    const update = () => {
      const selected = sim.addOns.filter((a) => boxes.find((b) => b.value === a.id).checked);
      out.innerHTML = result(selected, sim, policy);
      contact.disabled = selected.length === 0;
    };
    boxes.forEach((b) => b.addEventListener("change", update));

    contact.addEventListener("click", () => {
      view.querySelector("#sim-cta").innerHTML = `
        <div class="banner banner--info" role="status">
          ${icon("checkCircle")}
          <div>
            <h2>Solicitud enviada</h2>
            <p class="small">Un asesor te contactará en los próximos 2 días hábiles para revisar la ampliación contigo. Tu póliza no ha cambiado.</p>
          </div>
        </div>`;
      boxes.forEach((b) => { b.disabled = true; });
    });
  }

  return { html, mount };
}
