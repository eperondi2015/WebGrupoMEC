/* ============================================================
   GRUPO MEC PROPIEDADES — main.js
   JavaScript puro, sin dependencias externas.
   ============================================================ */

const WHATSAPP_NUMBER = "5491126468166"; // +54 9 11 2646-8166
const INSTAGRAM_URL = "https://www.instagram.com/grupomecpropiedades?igsh=em94OXFvNGx0M3hm";

/* Devuelve class + estilo inline para un valor de imagen:
   - Si empieza con "ph-" => placeholder de color (ver .ph en style.css)
   - Si es una ruta real (ej. "images/desarrollos/foto.jpg") => foto de fondo real
   Así conviven placeholders y fotos reales sin tocar el resto del código. */
function mediaFor(value){
  if(typeof value === "string" && value.startsWith("ph-")){
    return { cls: `media-fill ph ${value}`, style: "" };
  }
  return { cls: "media-fill", style: `background-image:url('${value}');background-size:cover;background-position:center;` };
}

function whatsappLink(message){
  const text = encodeURIComponent(message || "Hola, quiero recibir información de Grupo MEC Propiedades.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initRevealAnimations();
  initWhatsappLinks();
  wireInstagramLinks();

  // Estas funciones sólo actúan si encuentran los contenedores correspondientes
  renderDevelopmentCards();
  renderDevelopmentDetail();
  initContactForm();
});

/* ---------- Header: reducción suave al hacer scroll ---------- */
function initHeader(){
  const header = document.querySelector(".header");
  if(!header) return;
  const toggleSolid = () => {
    if(window.scrollY > 40){
      header.classList.add("header--solid");
    }else{
      header.classList.remove("header--solid");
    }
  };
  toggleSolid();
  window.addEventListener("scroll", toggleSolid, { passive: true });
}

/* ---------- Menú móvil ---------- */
function initMobileMenu(){
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-mobile");
  if(!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    document.body.style.overflow = nav.classList.contains("is-open") ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Animaciones de aparición al hacer scroll ---------- */
function initRevealAnimations(){
  const items = document.querySelectorAll(".reveal");
  if(!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15, rootMargin: "0px 0px -60px 0px" });
  items.forEach(item => observer.observe(item));
}

/* ---------- Enlaces de WhatsApp dinámicos ---------- */
function initWhatsappLinks(){
  document.querySelectorAll("[data-wsp]").forEach(el => {
    const msg = el.getAttribute("data-wsp") || undefined;
    el.setAttribute("href", whatsappLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function wireInstagramLinks(){
  document.querySelectorAll("[data-instagram]").forEach(el => {
    el.setAttribute("href", INSTAGRAM_URL);
    el.setAttribute("target", "_blank");
    el.setAttribname ? null : el.setAttribute("rel", "noopener");
  });
}

/* ---------- Render de tarjetas de emprendimientos (home) ---------- */
function renderDevelopmentCards(){
  const grid = document.querySelector("[data-dev-grid]");
  if(!grid || typeof DEVELOPMENTS === "undefined") return;

  grid.innerHTML = DEVELOPMENTS.map((dev, i) => {
    const media = mediaFor(dev.image);
    return `
    <article class="dev-card reveal" style="transition-delay:${i * 90}ms">
      <div class="dev-card__media">
        <div class="${media.cls}" style="${media.style}" role="img" aria-label="Vista del emprendimiento ${dev.name}, ${dev.location}"></div>
      </div>
      <div class="dev-card__body">
        <span class="dev-card__loc">${dev.location}</span>
        <h3>${dev.name}</h3>
        <p>${dev.shortDescription}</p>
        <a class="dev-card__link" href="emprendimiento.html?id=${dev.id}">
          Conocer más
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </article>
  `;
  }).join("");

  applyPlaceholderBackgrounds(grid);
  initRevealAnimations();
}

/* ---------- Render de la página de detalle ---------- */
function renderDevelopmentDetail(){
  const root = document.querySelector("[data-dev-detail]");
  if(!root || typeof DEVELOPMENTS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || DEVELOPMENTS[0].id;
  const dev = getDevelopmentById(id) || DEVELOPMENTS[0];

  document.title = `${dev.name} — Grupo MEC Propiedades`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc) metaDesc.setAttribute("content", dev.shortDescription);

  const facts = dev.quickFacts || [dev.lots, dev.surface, dev.location];
  const heroMedia = mediaFor(dev.image);

  root.innerHTML = `
    <section class="dev-hero">
      <div class="dev-hero__bg ${heroMedia.cls}" style="${heroMedia.style}"></div>
      <div class="container dev-hero__content">
        <a href="index.html#barrios" class="back-link">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Volver a barrios y productos
        </a>
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="index.html">Inicio</a>
          <span>/</span>
          <span aria-current="page">${dev.name}</span>
        </nav>
        <h1>${dev.name}</h1>
        <div class="dev-hero__loc">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
          ${dev.location}
        </div>
      </div>
    </section>

    <div class="quickfacts">
      <div class="container quickfacts__row">
        ${facts.map(f => `<div class="quickfacts__item">${f}</div>`).join("")}
      </div>
    </div>

    <section class="section">
      <div class="container dev-body">
        <div class="dev-body__main">
          <h2>Descripción</h2>
          <p>${dev.description}</p>

          <h2>Características</h2>
          <ul class="feature-list">
            ${dev.features.map(f => `
              <li>
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${f}
              </li>`).join("")}
          </ul>

          <h2>Servicios</h2>
          <ul class="feature-list">
            ${dev.services.map(s => `
              <li>
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${s}
              </li>`).join("")}
          </ul>

          <h2>Galería</h2>
          <div class="gallery">
            ${dev.images.map(img => {
              const m = mediaFor(img);
              return `<div class="${m.cls}" style="${m.style}" role="img" aria-label="Fotografía de ${dev.name}"></div>`;
            }).join("")}
          </div>

          <h2>Masterplan</h2>
          <button class="masterplan-box" type="button" data-open-masterplan aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/></svg>
            <p>Ver plano general del barrio<br><span style="font-size:.82rem">Click para ampliar</span></p>
          </button>

          <h2>Ubicación</h2>
          <div class="map-embed">
            <iframe
              title="Ubicación de ${dev.name}"
              src="https://maps.google.com/maps?q=${encodeURIComponent(dev.mapQuery || dev.location)}&z=13&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen>
            </iframe>
          </div>
        </div>

        <aside class="dev-sidebar">
          <h3>${dev.name}</h3>
          <a class="btn btn--wsp" data-wsp="Hola, quiero más información sobre ${dev.name}." href="#">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.6z"/></svg>
            Consultar por WhatsApp
          </a>
          <ul class="dev-sidebar__list">
            <li><span>Lotes</span><strong>${dev.lots}</strong></li>
            <li><span>Superficie</span><strong>${dev.surface}</strong></li>
          </ul>
        </aside>
      </div>
    </section>

    <div class="lightbox" data-masterplan-lightbox aria-hidden="true">
      <button class="lightbox__close" type="button" data-close-masterplan aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="lightbox__content ph ${dev.image}" role="img" aria-label="Masterplan de ${dev.name}"></div>
    </div>
  `;

  applyPlaceholderBackgrounds(root);
  initWhatsappLinks();
  initRevealAnimations();
  initMasterplanLightbox(root);
  renderRelated(dev.id);
}

/* ---------- Lightbox del masterplan ---------- */
function initMasterplanLightbox(scope){
  const openBtn = scope.querySelector("[data-open-masterplan]");
  const lightbox = document.querySelector("[data-masterplan-lightbox]");
  const closeBtn = document.querySelector("[data-close-masterplan]");
  if(!openBtn || !lightbox) return;

  const open = () => { lightbox.classList.add("is-open"); lightbox.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; };
  const close = () => { lightbox.classList.remove("is-open"); lightbox.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if(e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") close(); });
}

function renderRelated(currentId){
  const relatedRoot = document.querySelector("[data-dev-related]");
  if(!relatedRoot) return;
  const others = DEVELOPMENTS.filter(d => d.id !== currentId).slice(0, 3);
  relatedRoot.innerHTML = `
    <div class="section-head related__head reveal">
      <div>
        <div class="eyebrow">Otros desarrollos</div>
        <h2>Otros barrios y productos</h2>
      </div>
      <a class="btn btn--outline" href="index.html#barrios">Ver todos</a>
    </div>
    <div class="dev-grid" data-dev-grid></div>
  `;
  const grid = relatedRoot.querySelector("[data-dev-grid]");
  grid.innerHTML = others.map(dev => {
    const media = mediaFor(dev.image);
    return `
    <article class="dev-card reveal">
      <div class="dev-card__media">
        <div class="${media.cls}" style="${media.style}"></div>
      </div>
      <div class="dev-card__body">
        <span class="dev-card__loc">${dev.location}</span>
        <h3>${dev.name}</h3>
        <p>${dev.shortDescription}</p>
        <a class="dev-card__link" href="emprendimiento.html?id=${dev.id}">Conocer más</a>
      </div>
    </article>
  `;
  }).join("");
  applyPlaceholderBackgrounds(grid);
  initRevealAnimations();
}

/* Los elementos con clase "ph ph-n" ya se pintan sólo con CSS (ver style.css).
   Punto único de extensión: al sumar fotos reales alcanza con reemplazar el
   div.ph por <img src="..." loading="lazy"> en las plantillas de arriba. */
function applyPlaceholderBackgrounds(scope){
  /* no-op: reservado para lógica futura de imágenes reales */
}

/* ---------- Formulario de contacto ---------- */
function initContactForm(){
  const form = document.querySelector("[data-contact-form]");
  if(!form) return;
  const msg = form.querySelector(".form-msg");

  populateProductSelect(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = data.get("nombre") || "";
    const apellido = data.get("apellido") || "";
    const producto = data.get("producto") || "sin especificar";
    const mensaje = data.get("mensaje") || "";

    const text = `Hola, soy ${nombre} ${apellido}.%0AMe interesa: ${producto}.%0AMensaje: ${mensaje}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");

    if(msg){
      msg.textContent = "¡Gracias! Te vamos a contactar por WhatsApp a la brevedad.";
      msg.classList.add("ok");
    }
    form.reset();
  });
}

/* Completa el <select> de "Producto de interés" con cada barrio/producto
   cargado en js/data.js, para que se actualice solo al sumar nuevos. */
function populateProductSelect(form){
  const select = form.querySelector("[data-product-select]");
  if(!select || typeof DEVELOPMENTS === "undefined") return;

  const options = DEVELOPMENTS.map(dev => `<option value="${dev.name}">${dev.name}</option>`).join("");
  select.innerHTML = options + `<option value="Aún no lo sé">Aún no lo sé</option>`;
}
