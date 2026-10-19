/*
  RJ PRODUCTION website configuration
  1. Add your WhatsApp number below with country code, digits only.
     Example for India: 919876543210 (no +, spaces or dashes)
  2. Add your public business phone number below.
*/
const SITE_CONFIG = {
  whatsappNumber: "918286232467",
  phoneNumber: "+91 8286232467"
};

const cleanNumber = (value) => (value || "").replace(/\D/g, "");
const configuredWhatsApp = () => {
  const number = cleanNumber(SITE_CONFIG.whatsappNumber);
  return number && !number.includes("XXXXXXXXXX") && number.length >= 10 ? number : "";
};
const configuredPhone = () => {
  const number = cleanNumber(SITE_CONFIG.phoneNumber);
  return number && !number.includes("XXXXXXXXXX") && number.length >= 10 ? number : "";
};

function openWhatsApp(message = "Hello RJ PRODUCTION, I would like to enquire about your services.") {
  const number = configuredWhatsApp();
  if (!number) {
    alert("Please add your WhatsApp number in script.js first. Find SITE_CONFIG at the top of the file.");
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function setContactLinks() {
  const whatsapp = configuredWhatsApp();
  const phone = configuredPhone();
  const whatsappMessage = "Hello RJ PRODUCTION, I would like to know more about your services.";
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}` : "#contact";
  const waLink = document.querySelector("#whatsappContact");
  const floating = document.querySelector("#floatingWhatsapp");
  if (waLink) waLink.href = waHref;
  if (floating) floating.href = waHref;
  const phoneLink = document.querySelector("#phoneContact");
  if (phoneLink) phoneLink.href = phone ? `tel:+${phone}` : "#contact";
  [waLink, floating].filter(Boolean).forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!configuredWhatsApp()) {
        event.preventDefault();
        openWhatsApp();
      }
    });
  });
  if (phoneLink && !phone) {
    phoneLink.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Please add your phone number in script.js first. Find SITE_CONFIG at the top of the file.");
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    });
  }
}

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const serviceSelect = document.querySelector("#service");
    const requested = link.getAttribute("data-service");
    if (serviceSelect && [...serviceSelect.options].some((option) => option.value === requested || option.text === requested)) {
      serviceSelect.value = requested;
    }
  });
});

document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();
  const whatsappMessage = [
    "Hello RJ PRODUCTION!",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service required: ${service}`,
    message ? `Requirement: ${message}` : ""
  ].filter(Boolean).join("\n");
  if (!configuredWhatsApp()) {
    const status = document.querySelector("#formStatus");
    if (status) status.textContent = "Please configure your WhatsApp number in script.js before using the enquiry form.";
    alert("The enquiry form is ready, but the WhatsApp number is not configured. Add it in script.js and try again.");
    return;
  }
  openWhatsApp(whatsappMessage);
});

document.querySelector("#year").textContent = new Date().getFullYear();
setContactLinks();
