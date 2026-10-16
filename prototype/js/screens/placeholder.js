// Pantalla temporal para capacidades aún no diseñadas.
export function renderPlaceholder(title, capability) {
  return `
    <h1>${title}</h1>
    <section class="card">
      <p class="muted">Capacidad ${capability} · pantalla pendiente de diseño.</p>
    </section>
  `;
}
