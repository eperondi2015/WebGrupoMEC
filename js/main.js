/* ============================================================
   GRUPO MEC PROPIEDADES — main.js
   JavaScript puro, sin dependencias externas.
   ============================================================ */

const WHATSAPP_NUMBER = "5491126468166"; // María — +54 9 11 2646-8166
const WHATSAPP_PAULA = "5491125501841"; // Paula — +54 9 11 2550-1841
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

function whatsappLink(message, number){
  const text = encodeURIComponent(message || "Hola, quiero recibir información de Grupo MEC Propiedades.");
  return `https://wa.me/${number || WHATSAPP_NUMBER}?text=${text}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initRevealAnimations();
  initWhatsappLinks();
  initWhatsappPicker();
  wireInstagramLinks();

  // Estas funciones sólo actúan si encuentran los contenedores correspondientes
  renderDevelopmentCards();
  renderDevelopmentDetail();
  initContactForm();
});

/* ---------- Selector de agente (María / Paula) para los botones de WhatsApp ---------- */
function initWhatsappPicker(){
  document.querySelectorAll("[data-wsp-toggle]").forEach(toggle => {
    if(toggle.dataset.wspBound) return;
    toggle.dataset.wspBound = "1";
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrap = toggle.closest(".wsp-picker-wrap");
      if(!wrap) return;
      const wasOpen = wrap.classList.contains("is-open");
      document.querySelectorAll(".wsp-picker-wrap.is-open").forEach(w => w.classList.remove("is-open"));
      if(!wasOpen) wrap.classList.add("is-open");
    });
  });
  if(!document.body.dataset.wspOutsideBound){
    document.body.dataset.wspOutsideBound = "1";
    document.addEventListener("click", (e) => {
      if(!e.target.closest(".wsp-picker-wrap")){
        document.querySelectorAll(".wsp-picker-wrap.is-open").forEach(w => w.classList.remove("is-open"));
      }
    });
  }
}

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

  const lockBody = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };
  const unlockBody = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open");
    willOpen ? lockBody() : unlockBody();
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      unlockBody();
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
    const agent = el.getAttribute("data-wsp-agent");
    const number = agent === "paula" ? WHATSAPP_PAULA : WHATSAPP_NUMBER;
    el.setAttribute("href", whatsappLink(msg, number));
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

  root.innerHTML = `
    <section class="dev-hero">
      <div class="container dev-hero__content">
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

          ${dev.hasGallery !== false ? `
          <h2>Galería</h2>
          <div class="gallery">
            ${dev.images.map(img => {
              const m = mediaFor(img);
              return `<div class="${m.cls}" style="${m.style}" role="img" aria-label="Fotografía de ${dev.name}"></div>`;
            }).join("")}
          </div>
          ` : ""}

          ${dev.hasMasterplan !== false ? `
          <h2>Masterplan</h2>
          <button class="masterplan-box" type="button" data-open-masterplan aria-haspopup="dialog" style="background-image:url('${dev.masterplanImage || dev.image}');">
            <span class="masterplan-box__overlay">
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/></svg>
              <p>Ver plano general del barrio<br><span style="font-size:.82rem">Click para ampliar</span></p>
            </span>
          </button>
          ` : ""}

          ${(dev.virtualTourUrl || dev.interactiveMapUrl) ? `
          <div class="dev-extra-links">
            ${dev.virtualTourUrl ? `
            <a class="dev-extra-link" href="${dev.virtualTourUrl}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="10" ry="5" stroke="currentColor" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>
              Recorrido Virtual
            </a>
            ` : ""}
            ${dev.interactiveMapUrl ? `
            <a class="dev-extra-link" href="${dev.interactiveMapUrl}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>
              Mapa Interactivo
            </a>
            ` : ""}
          </div>
          ` : ""}

          ${dev.landBankPoints ? `
          <h2>Ubicaciones del banco de tierras</h2>
          <div class="landbank">
            <div id="landbank-map" class="landbank__map" role="application" aria-label="Mapa interactivo de ubicaciones"></div>
            <div class="landbank__list">
              ${dev.landBankPoints.map((p, i) => `
              <button class="landbank__item" type="button" data-lat="${p.lat}" data-lng="${p.lng}" data-idx="${i}">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>
                <span><strong>${p.name}</strong><small>${p.detail}</small></span>
              </button>
              `).join("")}
            </div>
          </div>
          ` : `
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
          `}
        </div>

        <aside class="dev-sidebar">
          <h3>${dev.name}</h3>
          ${dev.whatsappOverride === "paula" ? `
          <a class="btn btn--wsp" data-wsp="Hola, quiero más información sobre ${dev.name}." data-wsp-agent="paula" href="#">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.6z"/></svg>
            Consultar por WhatsApp
          </a>
          ` : `
          <div class="wsp-picker-wrap wsp-picker-wrap--sidebar">
            <button class="btn btn--wsp" type="button" data-wsp-toggle>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.6z"/></svg>
              Consultar por WhatsApp
            </button>
            <div class="wsp-picker">
              <a href="#" data-wsp="Hola, quiero más información sobre ${dev.name}." data-wsp-agent="maria">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.6z"/></svg>
                María Elena Canali
              </a>
              <a href="#" data-wsp="Hola, quiero más información sobre ${dev.name}." data-wsp-agent="paula">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.6z"/></svg>
                Paula
              </a>
            </div>
          </div>
          `}
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
      <img class="lightbox__content" src="${dev.masterplanImage || dev.image}" alt="Masterplan de ${dev.name}">
    </div>
  `;

  applyPlaceholderBackgrounds(root);
  initWhatsappLinks();
  initWhatsappPicker();
  initRevealAnimations();
  initMasterplanLightbox(root);
  initLandBankMap(dev);
  renderRelated(dev.id);
}

/* ---------- Mapa interactivo del banco de tierras (Macrolotes) ---------- */
function initLandBankMap(dev){
  const mapEl = document.getElementById("landbank-map");
  if(!mapEl || !dev.landBankPoints || typeof L === "undefined") return;

  const map = L.map("landbank-map", { scrollWheelZoom: false });

  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, attribution: "Tiles &copy; Esri" }
  ).addTo(map);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, attribution: "" }
  ).addTo(map);

  const bordoIcon = L.divIcon({
    className: "landbank-pin",
    html: `<svg viewBox="0 0 24 24" width="34" height="34" fill="#7C2D42" stroke="#fff" stroke-width="1"><path d="M12 2C7 2 3 6 3 11c0 6.5 9 11 9 11s9-4.5 9-11c0-5-4-9-9-9z"/><circle cx="12" cy="11" r="3.2" fill="#fff"/></svg>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
  });

  const markers = dev.landBankPoints.map(p => {
    const m = L.marker([p.lat, p.lng], { icon: bordoIcon }).addTo(map);
    m.bindPopup(`<strong>${p.name}</strong><br>${p.detail}`);
    return m;
  });

  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.25));

  document.querySelectorAll(".landbank__item").forEach(btn => {
    btn.addEventListener("click", () => {
      const lat = parseFloat(btn.dataset.lat);
      const lng = parseFloat(btn.dataset.lng);
      const idx = parseInt(btn.dataset.idx, 10);
      map.flyTo([lat, lng], 15, { duration: 1.1 });
      markers[idx].openPopup();
      document.querySelectorAll(".landbank__item").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  // Habilita zoom con rueda del mouse sólo cuando el usuario interactúa con el mapa
  mapEl.addEventListener("mouseenter", () => map.scrollWheelZoom.enable());
  mapEl.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());
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
    const paulaProducts = ["Inversiones - Pool de Rentas", "Macrolotes"];
    const number = paulaProducts.includes(producto) ? WHATSAPP_PAULA : WHATSAPP_NUMBER;
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");

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
