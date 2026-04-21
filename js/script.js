const topNav = document.getElementById("topNav");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));

const setNavOnScroll = () => {
  if (!topNav) {
    return;
  }

  topNav.classList.toggle("scrolled", window.scrollY > 20);
};

setNavOnScroll();
window.addEventListener("scroll", setNavOnScroll, { passive: true });

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navMenu || !menuToggle) {
      return;
    }

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const navMap = new Map(
  navLinks.map((link) => [link.getAttribute("href")?.replace("#", "") || "", link])
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => link.classList.remove("active"));
      const active = navMap.get(entry.target.id);

      if (active) {
        active.classList.add("active");
      }
    });
  },
  {
    root: null,
    threshold: 0.2,
    rootMargin: "-30% 0px -55% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("resize", () => {
  if (!navMenu || !menuToggle) {
    return;
  }

  if (window.innerWidth > 820) {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!email || !message) {
      if (formNote) {
        formNote.textContent = "Please fill in both fields.";
      }
      return;
    }

    const subject = encodeURIComponent("Portfolio Contact");
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);

    window.location.href = `mailto:tamim101rahman@gmail.com?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "Opening your email app...";
    }

    contactForm.reset();
  });
}
