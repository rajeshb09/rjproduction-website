(() => {
  "use strict";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const root = document.documentElement;
  const body = document.body;
  const themeButton = $("#themeToggle");
  const THEME_KEY = "rjp-theme";

  // Loading cover: always dismiss, even if a media asset is slow or missing.
  const loader = $("#pageLoader");
  const hideLoader = () => loader?.classList.add("done");
  window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 1600);

  // Theme is persistent and controls the actual page palette plus the weather scene.
  const readTheme = () => {
    try { return localStorage.getItem(THEME_KEY) || root.dataset.theme || "dark"; }
    catch (_) { return root.dataset.theme || "dark"; }
  };
  let currentTheme = readTheme() === "light" ? "light" : "dark";
  const paintThemeButton = () => {
    if (!themeButton) return;
    const icon = $(".theme-toggle-icon", themeButton);
    if (icon) icon.textContent = currentTheme === "dark" ? "☀" : "☾";
    themeButton.setAttribute("aria-label", currentTheme === "dark" ? "Switch to day mode" : "Switch to night mode");
    themeButton.setAttribute("aria-pressed", String(currentTheme === "dark"));
    themeButton.title = currentTheme === "dark" ? "Switch to day mode" : "Switch to night mode";
  };
  const applyTheme = (theme) => {
    currentTheme = theme;
    root.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    paintThemeButton();
    updateEnvironment();
  };
  root.dataset.theme = currentTheme;
  paintThemeButton();

  // Full-screen environmental layer: desert + wind-blown sand in day; galaxy + snow at night.
  const environment = document.createElement("div");
  environment.id = "rj-environment";
  environment.setAttribute("aria-hidden", "true");
  environment.innerHTML = `
    <video class="rj-background-video rj-background-video-day" muted loop autoplay playsinline preload="metadata" aria-hidden="true">
      <source src="assets/videos/day.mp4" type="video/mp4">
    </video>
    <video class="rj-background-video rj-background-video-night" muted loop autoplay playsinline preload="metadata" aria-hidden="true">
      <source src="assets/videos/night.mp4" type="video/mp4">
    </video>
    <div class="rj-sky rj-sky-day"></div>
    <div class="rj-sky rj-sky-night"></div>
    <div class="rj-galaxy-glow"></div>
    <div class="rj-dunes"></div>
    <div class="rj-weather-layer"></div>`;
  body.prepend(environment);
  const weatherLayer = $(".rj-weather-layer", environment);
  const random = (min, max) => Math.random() * (max - min) + min;

  // Star field and particles are generated once, then animated by CSS.
  for (let i = 0; i < 125; i++) {
    const star = document.createElement("i");
    star.className = "rj-star";
    star.style.left = `${random(0, 100)}%`;
    star.style.top = `${random(0, 82)}%`;
    star.style.setProperty("--twinkle", `${random(1.6, 5.4)}s`);
    star.style.setProperty("--star-opacity", random(.3, .95).toFixed(2));
    environment.appendChild(star);
  }
  for (let i = 0; i < 64; i++) {
    const snow = document.createElement("i");
    snow.className = "rj-particle snow";
    snow.style.setProperty("--x", `${random(0, 100)}%`);
    snow.style.setProperty("--size", `${random(2, 6)}px`);
    snow.style.setProperty("--duration", `${random(7, 18)}s`);
    snow.style.setProperty("--delay", `${random(-18, 0)}s`);
    snow.style.setProperty("--drift", `${random(-75, 75)}px`);
    snow.style.setProperty("--alpha", random(.35, .9).toFixed(2));
    weatherLayer.appendChild(snow);

    const sand = document.createElement("i");
    sand.className = "rj-particle sand";
    sand.style.setProperty("--x", `${random(-20, 100)}%`);
    sand.style.setProperty("--length", `${random(20, 85)}px`);
    sand.style.setProperty("--duration", `${random(5, 13)}s`);
    sand.style.setProperty("--delay", `${random(-13, 0)}s`);
    sand.style.setProperty("--alpha", random(.18, .62).toFixed(2));
    weatherLayer.appendChild(sand);
  }
  function updateEnvironment() {
    if (!environment.isConnected) return;
    const night = currentTheme === "dark";
    environment.classList.add("is-active");
    environment.classList.toggle("is-night", night);
    environment.classList.toggle("is-day", !night);
    root.classList.add("rj-environment-on");

    const dayVideo = $(".rj-background-video-day", environment);
    const nightVideo = $(".rj-background-video-night", environment);
    const activeVideo = night ? nightVideo : dayVideo;
    const inactiveVideo = night ? dayVideo : nightVideo;

    // Keep the CSS landscape visible until the selected MP4 really starts.
    if (dayVideo && !dayVideo.dataset.rjEventsBound) {
      dayVideo.dataset.rjEventsBound = "1";
      dayVideo.addEventListener("playing", () => environment.classList.add("has-day-video"));
      dayVideo.addEventListener("error", () => environment.classList.remove("has-day-video"));
      dayVideo.addEventListener("waiting", () => environment.classList.remove("has-day-video"));
    }
    if (nightVideo && !nightVideo.dataset.rjEventsBound) {
      nightVideo.dataset.rjEventsBound = "1";
      nightVideo.addEventListener("playing", () => environment.classList.add("has-night-video"));
      nightVideo.addEventListener("error", () => environment.classList.remove("has-night-video"));
      nightVideo.addEventListener("waiting", () => environment.classList.remove("has-night-video"));
    }

    if (inactiveVideo) {
      inactiveVideo.pause();
      try { inactiveVideo.currentTime = 0; } catch (_) {}
      environment.classList.remove(night ? "has-day-video" : "has-night-video");
    }
    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.loop = true;
      activeVideo.playsInline = true;
      const playPromise = activeVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Missing file or autoplay restriction: the CSS day/night scene stays visible.
        });
      }
    }
  }
  updateEnvironment();

  // A sun/moon wipe blooms from the theme control during each change.
  let themeBusy = false;
  themeButton?.addEventListener("click", () => {
    if (themeBusy) return;
    themeBusy = true;
    const next = currentTheme === "dark" ? "light" : "dark";
    const rect = themeButton.getBoundingClientRect();
    const wipe = document.createElement("div");
    wipe.className = `rj-theme-wipe ${next === "dark" ? "to-night" : "to-day"}`;
    wipe.style.setProperty("--x", `${rect.left + rect.width / 2}px`);
    wipe.style.setProperty("--y", `${rect.top + rect.height / 2}px`);
    wipe.innerHTML = `<span>${next === "dark" ? "☾" : "☀"}</span>`;
    body.appendChild(wipe);
    requestAnimationFrame(() => wipe.classList.add("run"));
    window.setTimeout(() => {
      applyTheme(next);
      wipe.classList.add("fade-out");
    }, 520);
    window.setTimeout(() => {
      wipe.remove();
      themeBusy = false;
    }, 1250);
  });

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  const closeMenu = () => {
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };
  menuToggle?.addEventListener("click", () => {
    const open = !mainNav?.classList.contains("open");
    mainNav?.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    body.classList.toggle("menu-open", open);
  });
  $$("#mainNav a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", e => {
    if (mainNav?.classList.contains("open") && !e.target.closest("#mainNav") && !e.target.closest("#menuToggle")) closeMenu();
  });

  // Smooth typewriter text.
  /* Hero typewriter — phrase rotation for the reference hero. */
(() => {
  const target = document.querySelector(".typed-word");
  if (!target) return;
  const phrases = ["digital experiences", "business growth", "smart solutions", "stronger security"];
  let phraseIndex = 0, charIndex = phrases[0].length, deleting = true;
  const typeLoop = () => {
    const current = phrases[phraseIndex];
    if (deleting) {
      charIndex--;
      target.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 520);
        return;
      }
      setTimeout(typeLoop, 58);
    } else {
      const next = phrases[phraseIndex];
      charIndex++;
      target.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) {
        deleting = true;
        setTimeout(typeLoop, 1850);
        return;
      }
      setTimeout(typeLoop, 88);
    }
  };
  setTimeout(typeLoop, 1500);
})();


  // Old-code effects: scroll reveal with stagger and shimmer accents on headings.
  (() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const candidates = $$(".section-heading, .service-card, .about-copy, .about-art, .work-card, .portfolio-card, .contact-method, .form-heading, .trust-inner > *");
    if (!reduceMotion && "IntersectionObserver" in window) {
      document.documentElement.classList.add("motion-ready");
      candidates.forEach((el, index) => {
        el.classList.add("reveal-on-scroll");
        if (el.matches(".service-card,.work-card,.portfolio-card")) {
          el.style.transitionDelay = `${(index % 4) * 75}ms`;
        }
      });
      const oldRevealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            oldRevealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      candidates.forEach(el => oldRevealObserver.observe(el));
    }
    $$(".section-heading h2, .about-copy h2, .contact-copy h2").forEach(heading => {
      if (heading.querySelector("span")) heading.querySelector("span").classList.add("text-shimmer");
    });
  })();

  // Scroll reveal and active navigation.
  const revealItems = $$(".reveal, .service-card, .work-card, .portfolio-card, .about-copy, .about-art");
  revealItems.forEach(el => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach(el => revealObserver.observe(el));
  } else revealItems.forEach(el => el.classList.add("visible"));

  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$("#mainNav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }

  // Graceful local-video fallback. Add the MP4 at the path noted in README.
  const video = $("#rjHeroVideo");
  const videoFallback = $("#rjVideoFallback");
  if (video && videoFallback) {
    const showFallback = () => { video.hidden = true; videoFallback.style.display = "flex"; };
    const showVideo = () => { video.hidden = false; videoFallback.style.display = "none"; };
    video.addEventListener("error", showFallback);
    video.addEventListener("loadeddata", showVideo);
    video.addEventListener("canplay", showVideo);
    video.load();
    const play = video.play();
    if (play?.catch) play.catch(() => {});
    if (video.readyState === 0) window.setTimeout(() => {
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showFallback();
    }, 900);
  }

  // Broken images are hidden rather than displaying browser broken-image icons.
  $$("img").forEach(img => {
    img.addEventListener("error", () => { img.style.visibility = "hidden"; }, { once: true });
  });

  // Contact information is drawn from the supplied RJ PRODUCTION project details.
  const SITE_CONFIG = {
    whatsappNumber: "918286232467",
    phoneNumber: "+91 8286232467"
  };
  const cleanNumber = value => String(value || "").replace(/\\D/g, "");
  const businessWhatsApp = cleanNumber(SITE_CONFIG.whatsappNumber);
  const businessPhone = cleanNumber(SITE_CONFIG.phoneNumber);
  const waContact = $("#whatsappContact");
  const phoneContact = $("#phoneContact");
  const floatingWA = $("#floatingWhatsapp");
  if (waContact) waContact.href = `https://wa.me/${businessWhatsApp}`;
  if (phoneContact) phoneContact.href = businessPhone ? `tel:+${businessPhone}` : "#contact";
  if (floatingWA) {
    floatingWA.href = `https://wa.me/${businessWhatsApp}`;
    floatingWA.target = "_blank";
    floatingWA.rel = "noopener";
  }

  // Old website interaction: selecting a service card preselects it in the enquiry form.
  $$("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const requested = link.getAttribute("data-service");
      const select = $("#service");
      if (select && [...select.options].some(option => option.value === requested || option.text === requested)) {
        select.value = requested;
      }
    });
  });

  // Enquiry form validates required fields and opens a pre-filled WhatsApp message.
  const form = $("#contactForm");
  const status = $("#formStatus");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#name")?.value.trim() || "";
    const phone = $("#phone")?.value.trim() || "";
    const service = $("#service")?.value || "";
    const message = $("#message")?.value.trim() || "";
    const digits = phone.replace(/\D/g, "");
    if (!name || !phone || !service) {
      if (status) status.textContent = "Please complete your name, phone number and required service.";
      return;
    }
    if (digits.length < 10 || digits.length > 13) {
      if (status) status.textContent = "Please enter a valid mobile number.";
      $("#phone")?.focus();
      return;
    }
    const text = [
      "Hello RJ PRODUCTION, I would like to enquire about your services.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Requirement: ${message || "Please contact me to discuss."}`
    ].join("\n");
    if (status) status.textContent = "Opening WhatsApp so you can review and send your enquiry…";
    window.open(`https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  // Copyright year.
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Custom glowing cursor, only on devices with a real fine pointer.
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "rj-glow-cursor";
    cursor.setAttribute("aria-hidden", "true");
    body.appendChild(cursor);
    let x = -100, y = -100, frame = 0;
    document.addEventListener("pointermove", e => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add("is-visible");
      if (!frame) frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x - 9}px,${y - 9}px,0)`;
        frame = 0;
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
    document.addEventListener("pointerdown", () => cursor.classList.add("is-clicking"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-clicking"));
    document.addEventListener("pointerover", e => {
      if (e.target.closest("a,button,input,textarea,select,label,video")) cursor.classList.add("is-hovering");
    });
    document.addEventListener("pointerout", e => {
      if (e.target.closest("a,button,input,textarea,select,label,video")) cursor.classList.remove("is-hovering");
    });
  }
})();


/* One-click global text color theme: palette choice harmonizes all website text. */
(() => {
  const trigger = document.getElementById("rjColorsTrigger");
  const panel = document.getElementById("rjColorsPanel");
  const backdrop = document.getElementById("rjColorsBackdrop");
  const close = document.getElementById("rjColorsClose");
  const swatches = document.getElementById("rjColorsSwatches");
  const reset = document.getElementById("rjColorsReset");
  const rows = document.getElementById("rjColorsRows");
  if (!trigger || !panel || !swatches) return;

  const KEY = "rjp-global-text-palette-v2";
  const palettes = [
    {name:"Ocean Blue", main:"#0878bb", accent:"#12b9bb", soft:"#8fd8ef"},
    {name:"Aqua", main:"#10aeb4", accent:"#25c9b7", soft:"#a2ece5"},
    {name:"Mint", main:"#12ae8d", accent:"#20c997", soft:"#a7ead9"},
    {name:"Fresh Green", main:"#13ad4b", accent:"#8bcf38", soft:"#c7edaa"},
    {name:"Lime", main:"#88bf2d", accent:"#c1d83b", soft:"#e5edaa"},
    {name:"Golden", main:"#d6ad22", accent:"#efa82d", soft:"#f5df9a"},
    {name:"Amber", main:"#e69b2c", accent:"#f0b14d", soft:"#f8dfb1"},
    {name:"Orange", main:"#d97728", accent:"#ef9b42", soft:"#f6d0a8"},
    {name:"Coral", main:"#e54a27", accent:"#ff7142", soft:"#ffc1a8"},
    {name:"Red", main:"#df2028", accent:"#f04455", soft:"#ffb4b9"},
    {name:"Rose", main:"#ed2456", accent:"#f16d91", soft:"#ffc2d1"},
    {name:"Pink", main:"#ce1688", accent:"#e34ca9", soft:"#f4b8dc"},
    {name:"Purple", main:"#a33c9c", accent:"#c36ab9", soft:"#e6c0e2"},
    {name:"Violet", main:"#5344a8", accent:"#8173d2", soft:"#c8c2ef"},
    {name:"Purple Glow", main:"#4b078c", accent:"#dc35ec", soft:"#f7b8fa"},
    {name:"Sky Blue", main:"#65c7e8", accent:"#a5e5f5", soft:"#e9faff"},
    {name:"Silver", main:"#bdbdbd", accent:"#dedede", soft:"#f7f7f7"},
    {name:"Charcoal", main:"#343434", accent:"#777777", soft:"#bdbdbd"},
    {name:"Black", main:"#111111", accent:"#444444", soft:"#888888"},
    {name:"Grey", main:"#777777", accent:"#aaaaaa", soft:"#dddddd"},
    {name:"White", main:"#ffffff", accent:"#eeeeee", soft:"#cccccc"}
  ];
  let selected = "";
  let autoCycleTimer = null;
  let autoCycleOn = false;
  try { selected = localStorage.getItem(KEY) || ""; } catch (_) {}

  const validPalette = value => palettes.some(p => p.main === value);
  function applyPalette(palette) {
    const root = document.documentElement;
    if (!palette) {
      root.removeAttribute("data-rj-global-palette");
      ["main","accent","soft"].forEach(k => root.style.removeProperty("--rj-global-" + k));
      try { localStorage.removeItem(KEY); } catch (_) {}
      return;
    }
    root.setAttribute("data-rj-global-palette", "");
    root.style.setProperty("--rj-global-main", palette.main);
    root.style.setProperty("--rj-global-accent", palette.accent);
    root.style.setProperty("--rj-global-soft", palette.soft);
    try { localStorage.setItem(KEY, palette.main); } catch (_) {}
  }
  function renderSwatches() {
    swatches.replaceChildren();
    palettes.forEach(palette => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rj-colors-swatch";
      button.dataset.color = palette.main;
      button.style.setProperty("--swatch", palette.main);
      button.style.setProperty("--swatch-accent", palette.accent);
      button.style.setProperty("--swatch-soft", palette.soft);
      button.setAttribute("aria-label", "Apply " + palette.name + " text colors to the whole website");
      button.title = palette.name;
      button.setAttribute("aria-pressed", String(selected === palette.main));
      if (selected === palette.main) button.classList.add("is-current");
      button.addEventListener("click", () => {
        stopAutoCycle();
        selected = palette.main;
        applyPalette(palette);
        renderSwatches();
      });
      swatches.appendChild(button);
    });
  }
  const autoButton = document.getElementById("rjColorsAuto");
  function stopAutoCycle() {
    if (autoCycleTimer) window.clearInterval(autoCycleTimer);
    autoCycleTimer = null;
    autoCycleOn = false;
    if (autoButton) {
      autoButton.classList.remove("is-active");
      autoButton.setAttribute("aria-pressed", "false");
      autoButton.textContent = "▶ Auto change colors";
    }
  }
  function startAutoCycle() {
    if (autoCycleTimer) window.clearInterval(autoCycleTimer);
    autoCycleOn = true;
    if (autoButton) {
      autoButton.classList.add("is-active");
      autoButton.setAttribute("aria-pressed", "true");
      autoButton.textContent = "Ⅱ Stop auto change";
    }
    let index = Math.max(0, palettes.findIndex(p => p.main === selected));
    autoCycleTimer = window.setInterval(() => {
      index = (index + 1) % palettes.length;
      selected = palettes[index].main;
      applyPalette(palettes[index]);
      renderSwatches();
    }, 2600);
  }
  autoButton?.addEventListener("click", () => {
    if (autoCycleOn) stopAutoCycle();
    else startAutoCycle();
  });

  function openPanel() {
    backdrop.hidden = false;
    panel.inert = false;
    panel.setAttribute("aria-hidden","false");
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded","true");
    close?.focus();
  }
  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    panel.inert = true;
    backdrop.hidden = true;
    trigger.setAttribute("aria-expanded","false");
    trigger.focus();
  }
  trigger.addEventListener("click", () => panel.classList.contains("is-open") ? closePanel() : openPanel());
  close?.addEventListener("click",closePanel);
  backdrop?.addEventListener("click",closePanel);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
  });
  reset?.addEventListener("click", () => {
    stopAutoCycle();
    selected = "";
    applyPalette(null);
    renderSwatches();
  });

  const initial = palettes.find(p => p.main === selected);
  if (initial) applyPalette(initial);
  else { selected = ""; applyPalette(null); }
  renderSwatches();
})();
