// Piezas compartidas entre pantallas.
import { icon } from "./icons.js";
import { formatDate } from "./data.js";

// C5 · Mensaje educativo incrustado en la pantalla.
export function eduCard(message) {
  if (!message) return "";
  return `
    <aside class="edu" aria-label="Consejo">
      ${icon("bulb")}
      <div class="stack" style="gap:2px">
        <span class="k">Aprende</span>
        <h3>${message.title}</h3>
        <p class="small">${message.body}</p>
      </div>
    </aside>`;
}

// HU-17 · Acceso visible al clausulado oficial, con versión y fecha.
export function clausuladoButton(content) {
  const { version, date } = content.clausulado;
  return `
    <button type="button" class="btn btn--secondary btn--block" data-open-clausulado>
      ${icon("doc", "i-sm")} Clausulado oficial · v${version} · ${formatDate(date, { day: "numeric", month: "short", year: "numeric" })}
    </button>`;
}

const SECTIONS = [
  ["cobertura", "Coberturas"],
  ["exclusion", "Exclusiones"],
  ["termino", "Pagos y vigencia"],
];

function clausuladoSheet(content) {
  const { name, version, date } = content.clausulado;
  const clause = (u) =>
    u.legalApproval.status === "aprobado"
      ? `<div class="stack"><h3>${u.title}</h3><p class="literal">${u.literalText}</p></div>`
      : `<div class="stack"><h3>${u.title}</h3><p class="pending">Cláusula en revisión por Legal. Para conocer su alcance, consulta con tu asesor.</p></div>`;

  return `
    <dialog class="sheet" id="clausulado" aria-labelledby="clausulado-title">
      <div class="sheet-head">
        <div>
          <h2 id="clausulado-title">${name}</h2>
          <p class="meta">Versión ${version} · ${formatDate(date)}</p>
        </div>
        <button type="button" class="btn btn--secondary" data-close-clausulado aria-label="Cerrar clausulado">${icon("close")}</button>
      </div>
      <div class="sheet-body">
        <p class="small muted">Este es el texto contractual. Prevalece sobre cualquier explicación de la aplicación.</p>
        ${SECTIONS.map(([type, title]) => `
          <section class="stack">
            <h2>${title}</h2>
            ${content.units.filter((u) => u.type === type).map(clause).join("")}
          </section>`).join("")}
      </div>
    </dialog>`;
}

export function withClausulado(html, content) {
  return html + clausuladoSheet(content);
}

export function mountClausulado(view) {
  const dialog = view.querySelector("#clausulado");
  view.querySelectorAll("[data-open-clausulado]").forEach((btn) => btn.addEventListener("click", () => dialog.showModal()));
  view.querySelector("[data-close-clausulado]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}
