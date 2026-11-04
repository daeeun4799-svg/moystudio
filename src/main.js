// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ========== NAVBAR ==========
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Active nav link based on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Mobile menu
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu on link click
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// ========== PORTFOLIO TABS ==========
// 영상 목록은 빌드 시 HTML에 이미 들어 있습니다(검색엔진이 읽을 수 있도록).
// 여기서는 탭을 눌렀을 때 보여줄 패널만 바꿉니다.
const tabButtons = document.querySelectorAll(".tab-btn");
const videoGrid = document.getElementById("video-grid");
const panels = videoGrid.querySelectorAll("[data-panel]");

// 영상 재생 중인 iframe을 썸네일로 되돌립니다(탭 이동 시 소리가 계속 나지 않도록).
function resetPlayers(panel) {
  panel.querySelectorAll("iframe").forEach((frame) => {
    if (frame._facade) frame.replaceWith(frame._facade);
  });
}

function switchCategory(category) {
  const next = videoGrid.querySelector(`[data-panel="${category}"]`);
  if (!next || !next.hidden) return;

  videoGrid.style.opacity = "0";
  videoGrid.style.transform = "translateY(10px)";

  setTimeout(() => {
    panels.forEach((panel) => {
      if (panel !== next) {
        resetPlayers(panel);
        panel.hidden = true;
      }
    });
    next.hidden = false;
    videoGrid.style.opacity = "1";
    videoGrid.style.transform = "translateY(0)";
  }, 200);

  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });
}

videoGrid.style.transition = "opacity 0.3s ease, transform 0.3s ease";

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchCategory(btn.dataset.category);
  });
});

// 썸네일을 누르면 그때 유튜브 영상을 불러옵니다(페이지 속도 개선).
// JS가 꺼져 있어도 썸네일 링크는 유튜브로 연결됩니다.
videoGrid.addEventListener("click", (event) => {
  const facade = event.target.closest(".video-facade");
  if (!facade) return;
  event.preventDefault();

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${facade.dataset.videoId}?autoplay=1&rel=0`;
  iframe.title = facade.dataset.title;
  iframe.className = "absolute inset-0 w-full h-full";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  );
  iframe.setAttribute("allowfullscreen", "");
  iframe._facade = facade;
  facade.replaceWith(iframe);
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById("theme-toggle");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const iconSun = document.getElementById("icon-sun");
const iconMoon = document.getElementById("icon-moon");
const iconSunMobile = document.getElementById("icon-sun-mobile");
const iconMoonMobile = document.getElementById("icon-moon-mobile");
const html = document.documentElement;

function applyTheme(theme) {
  if (theme === "light") {
    html.setAttribute("data-theme", "light");
    iconSun.classList.add("hidden");
    iconMoon.classList.remove("hidden");
    iconSunMobile.classList.add("hidden");
    iconMoonMobile.classList.remove("hidden");
  } else {
    html.removeAttribute("data-theme");
    iconSun.classList.remove("hidden");
    iconMoon.classList.add("hidden");
    iconSunMobile.classList.remove("hidden");
    iconMoonMobile.classList.add("hidden");
  }
}

function toggleTheme() {
  const current =
    html.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("moy-theme", next);
}

// Load saved theme
const savedTheme = localStorage.getItem("moy-theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", toggleTheme);
themeToggleMobile.addEventListener("click", toggleTheme);
