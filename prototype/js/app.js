// Router por hash: cada ruta corresponde a una capacidad del MVP (C1–C6).
// Una pantalla devuelve HTML, o { html, mount } cuando necesita registrar interacciones.
import { renderSummary } from "./screens/summary.js";
import { renderDetail } from "./screens/detail.js";
import { renderSimulator } from "./screens/simulator.js";
import { renderRenewal } from "./screens/renewal.js";
import { renderNotifications } from "./screens/notifications.js";
import { renderClaim } from "./screens/claim.js";
import { unreadCount } from "./data.js";

const routes = {
  "/resumen": renderSummary, // C1 · HU-07, HU-08
  "/detalle": renderDetail, // C2 · HU-12, HU-13, HU-14, HU-17
  "/vigencia": renderRenewal, // C3 · HU-15, HU-16
  "/simulador": renderSimulator, // C4 · HU-22, HU-24
  "/avisos": renderNotifications, // C6 · HU-23, HU-26
  "/siniestro": renderClaim, // C6 · HU-23 (segundo nivel de Avisos)
};

// Pantallas de segundo nivel que resaltan la pestaña de su sección.
const TAB_OF = { "/siniestro": "/avisos" };

// Contador de avisos sin leer en la pestaña (texto, no solo color: HU-28).
async function updateBadge() {
  const count = await unreadCount();
  const link = document.querySelector('.tabbar a[href="#/avisos"]');
  link.querySelector(".tab-badge")?.remove();
  link.setAttribute("aria-label", count ? `Avisos, ${count} sin leer` : "Avisos");
  if (count) link.insertAdjacentHTML("beforeend", `<span class="tab-badge" aria-hidden="true">${count}</span>`);
}
window.addEventListener("notifications-changed", updateBadge);

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

  const current = TAB_OF[path] ?? (path || DEFAULT_ROUTE);
  updateBadge();
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
