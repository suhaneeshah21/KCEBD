window.initNavbar = function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".nav-item.dropdown");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("toggle");
      if (!navMenu.classList.contains("active")) {
        dropdowns.forEach(d => d.classList.remove("open"));
      }
    });
  }

  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a.nav-link");
    if (!link) return;

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const wasOpen = dropdown.classList.contains("open");
        dropdowns.forEach(d => d.classList.remove("open"));
        if (!wasOpen) dropdown.classList.add("open");
      }
    });

    dropdown.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) dropdown.classList.add("open");
    });
    dropdown.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) dropdown.classList.remove("open");
    });
  });

  if (navMenu) {
    navMenu.querySelectorAll(".dropdown-menu a").forEach(a => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove("active");
          if (hamburger) hamburger.classList.remove("toggle");
        }
      });
    });
  }
};

function getRequestedComponent() {
  const params   = new URLSearchParams(window.location.search);
  const fromParam = params.get("section");
  const fromHash  = window.location.hash
    ? decodeURIComponent(window.location.hash.substring(1))
    : "";
  return fromParam || fromHash || "";
}

function initDropdownRouting({ pageFile, linkSelector, setActive, loadSection }) {
  if (!window.__dropdownRoutingRegistry) window.__dropdownRoutingRegistry = {};
  window.__dropdownRoutingRegistry[pageFile] = { linkSelector, setActive, loadSection };

  if (!window.__dropdownRoutingInitialized) {
    window.__dropdownRoutingInitialized = true;
    document.addEventListener("click", (e) => {
      const dropdownLink = e.target.closest(".dropdown-menu a");
      if (!dropdownLink) return;

      const href = dropdownLink.getAttribute("href");
      if (!href) return;

      let url;
      try { url = new URL(href, window.location.origin); }
      catch { return; }

      const currentPage = window.location.pathname.split("/").pop();
      const targetPage  = url.pathname.split("/").pop();
      const handler     = window.__dropdownRoutingRegistry[currentPage];

      if (!handler || targetPage !== currentPage) return;

      const section = url.searchParams.get("section") || "";
      if (!section) return;

      const targetLink = document.querySelector(`${handler.linkSelector}[data-component="${section}"]`);
      if (!targetLink) return;

      e.preventDefault();
      handler.setActive(targetLink);
      handler.loadSection(section);
      window.history.pushState({}, "", `${currentPage}?section=${encodeURIComponent(section)}`);
    });
  }
}

function initSidebar({ linkSelector, contentId, pageFile }) {
  const links   = document.querySelectorAll(`${linkSelector}[data-component]`);
  const content = document.getElementById(contentId);
  if (!links.length || !content) return;

  const setActive = (target) => {
    links.forEach(l => l.classList.remove("active-link"));
    target.classList.add("active-link");
  };

  const loadSection = (path) => {
    content.innerHTML = "<p style='padding:20px;color:#555;'>Loading…</p>";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.onload = function () {
      if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
        content.innerHTML = xhr.responseText;
      } else {
        content.innerHTML = "<p style='padding:20px;color:#c00;'>Content could not be loaded (status " + xhr.status + ").</p>";
      }
    };
    xhr.onerror = function () {
      content.innerHTML = "<p style='padding:20px;color:#c00;'>Content could not be loaded. If opening from a file, try using a local web server.</p>";
    };
    xhr.send();
  };

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const component = link.getAttribute("data-component");
      if (!component) return;
      setActive(link);
      loadSection(component);
      if (pageFile) {
        window.history.pushState({}, "", `${pageFile}?section=${encodeURIComponent(component)}`);
      }
    });
  });

  const requested    = getRequestedComponent();
  const requestedLink = requested
    ? document.querySelector(`${linkSelector}[data-component="${requested}"]`)
    : null;
  const initial = requestedLink
    || document.querySelector(`${linkSelector}.active-link[data-component]`)
    || links[0];

  if (initial) {
    setActive(initial);
    loadSection(initial.getAttribute("data-component"));
  }

  if (pageFile) {
    initDropdownRouting({ pageFile, linkSelector, setActive, loadSection });
  }
}

function runPageInit() {
  if (window.__pageInited) return;
  window.__pageInited = true;

  const mybutton = document.getElementById("scrollToTop");
  if (mybutton) {
    window.addEventListener("scroll", () => {
      mybutton.style.display =
        (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
          ? "block" : "none";
    });
    mybutton.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  }

  try {
    const visitorEl = document.getElementById("visitor-count");
    if (visitorEl) {
      const key = "kcebed_visit_count";
      let count = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      count += 1;
      localStorage.setItem(key, String(count));
      visitorEl.textContent = count.toLocaleString();
    }
  } catch (e) { /* private browsing */ }

  initSidebar({ linkSelector: ".course-link",    contentId: "courses-content",         pageFile: "courses.html"       });
  initSidebar({ linkSelector: ".facility-link",  contentId: "facilities-content",      pageFile: "facilities.html"    });
  initSidebar({ linkSelector: ".support-link",   contentId: "student-support-content", pageFile: "student_support.html" });
  initSidebar({ linkSelector: ".about-link",     contentId: "about-content",           pageFile: "about.html"         });
  initSidebar({ linkSelector: ".career-link",    contentId: "career-content",          pageFile: "career.html"        });
  initSidebar({ linkSelector: ".activities-link",contentId: "activities-content",      pageFile: "activities.html"    });
  initSidebar({ linkSelector: ".alumni-link",    contentId: "alumni-content",          pageFile: "alumini.html"       });
  initSidebar({ linkSelector: ".results-link",   contentId: "results-content",         pageFile: "Results.html"       });

  document.querySelectorAll(".vertical-marquee").forEach((container) => {
    const track = container.querySelector(".marquee-track");
    if (!track) return;

    if (!track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "true";
    }

    const speedPxPerSec = 40;
    const setDuration = () => {
      const h   = track.scrollHeight / 2 || 0;
      const dur = Math.max(6, Math.round(h / speedPxPerSec));
      track.style.animationDuration = dur + "s";
    };
    setTimeout(setDuration, 100);
    window.addEventListener("resize", setDuration);

    container.addEventListener("touchstart", () => { track.style.animationPlayState = "paused";  }, { passive: true });
    container.addEventListener("touchend",   () => { track.style.animationPlayState = "running"; }, { passive: true });
  });

  const sliderTrack   = document.querySelector(".hero-slider-track");
  const slides        = document.querySelectorAll(".hero-slide");
  const prevBtn       = document.getElementById("sliderPrev");
  const nextBtn       = document.getElementById("sliderNext");
  const dotsContainer = document.getElementById("sliderDots");

  if (sliderTrack && slides.length > 0 && prevBtn && nextBtn && dotsContainer) {
    let currentSlide   = 0;
    const totalSlides  = slides.length - 1; // last slide is a duplicate of first
    let autoInterval;
    let isTransitioning = false;

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    const dots = () => document.querySelectorAll(".slider-dot");

    const updatePos = (smooth = true) => {
      sliderTrack.style.transition = smooth ? "transform 0.8s ease-in-out" : "none";
      sliderTrack.style.transform  = `translateX(${-currentSlide * 100}%)`;
    };

    function goToSlide(n) {
      if (isTransitioning) return;
      dots()[currentSlide % totalSlides].classList.remove("active");
      currentSlide = n;
      dots()[currentSlide % totalSlides].classList.add("active");
      updatePos(true);
      resetAuto();
    }

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      dots()[(currentSlide) % totalSlides].classList.remove("active");
      currentSlide++;
      dots()[currentSlide % totalSlides].classList.add("active");
      updatePos(true);
      if (currentSlide === totalSlides) {
        setTimeout(() => { currentSlide = 0; updatePos(false); isTransitioning = false; }, 800);
      } else {
        setTimeout(() => { isTransitioning = false; }, 800);
      }
      resetAuto();
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      if (currentSlide === 0) {
        currentSlide = totalSlides;
        updatePos(false);
        setTimeout(() => {
          currentSlide = totalSlides - 1;
          dots()[0].classList.remove("active");
          dots()[currentSlide].classList.add("active");
          updatePos(true);
          setTimeout(() => { isTransitioning = false; }, 800);
        }, 20);
      } else {
        dots()[currentSlide].classList.remove("active");
        currentSlide--;
        dots()[currentSlide].classList.add("active");
        updatePos(true);
        setTimeout(() => { isTransitioning = false; }, 800);
      }
      resetAuto();
    }

    const startAuto = () => { autoInterval = setInterval(nextSlide, 5000); };
    const stopAuto  = () => { clearInterval(autoInterval); };
    const resetAuto = () => { stopAuto(); startAuto(); };

    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    const hero = document.getElementById("heroSection");
    if (hero) {
      hero.addEventListener("mouseenter", stopAuto);
      hero.addEventListener("mouseleave", startAuto);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    });

    startAuto();
  }
}

window.initPage = runPageInit;

document.addEventListener("DOMContentLoaded", runPageInit);
