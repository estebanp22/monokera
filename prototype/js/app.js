// Router por hash: cada ruta corresponde a una capacidad del MVP (C1–C6).
// Una pantalla devuelve HTML, o { html, mount } cuando necesita registrar interacciones.
import { renderSummary } from "./screens/summary.js";
import { renderDetail } from "./screens/detail.js";
import { renderSimulator } from "./screens/simulator.js";
import { renderPlaceholder } from "./screens/placeholder.js";

const routes = {
  "/resumen": renderSummary, // C1 · HU-07, HU-08
  "/detalle": renderDetail, // C2 · HU-12, HU-13, HU-14, HU-17
  "/vigencia": () => renderPlaceholder("Vigencia y renovación", "C3"),
  "/simulador": renderSimulator, // C4 · HU-22, HU-24
  "/avisos": () => renderPlaceholder("Notificaciones", "C6"),
};

const DEFAULT_ROUTE = "/resumen";

async function render() {
  const [path, query = ""] = location.hash.slice(1).split("?");
  const screen = routes[path || DEFAULT_ROUTE];
  if (!screen) {
    location.hash = DEFAULT_ROUTE;
    return;
  }

  const view = document.getElementById("view");
  const result = await screen(new URLSearchParams(query));
  const { html, mount } = typeof result === "string" ? { html: result } : result;
  view.innerHTML = html;
  mount?.(view);
  view.focus();
  window.scrollTo(0, 0);

  const current = path || DEFAULT_ROUTE;
  document.querySelectorAll(".tabbar a").forEach((link) => {
    if (link.getAttribute("href") === `#${current}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", render);
render();
