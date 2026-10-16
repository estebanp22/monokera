// Router por hash: cada ruta corresponde a una capacidad del MVP (C1–C6).
import { renderSummary } from "./screens/summary.js";
import { renderPlaceholder } from "./screens/placeholder.js";

const routes = {
  "/resumen": renderSummary, // C1
  "/detalle": () => renderPlaceholder("Detalle de la póliza", "C2"),
  "/vigencia": () => renderPlaceholder("Vigencia y renovación", "C3"),
  "/simulador": () => renderPlaceholder("Simulador de plan", "C4"),
  "/avisos": () => renderPlaceholder("Notificaciones", "C6"),
};

const DEFAULT_ROUTE = "/resumen";

async function render() {
  const path = location.hash.slice(1) || DEFAULT_ROUTE;
  const screen = routes[path];
  if (!screen) {
    location.hash = DEFAULT_ROUTE;
    return;
  }

  const view = document.getElementById("view");
  view.innerHTML = await screen();
  view.focus();

  document.querySelectorAll(".tabbar a").forEach((link) => {
    if (link.getAttribute("href") === `#${path}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", render);
render();
