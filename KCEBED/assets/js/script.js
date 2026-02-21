document.addEventListener("DOMContentLoaded", () => {

  window.initNavbar = function() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);

      newHamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        newHamburger.classList.toggle("toggle");
      });

      // Only close nav when clicking on submenu items (dropdown-menu a), not on dropdown toggles
      const submenuLinks = document.querySelectorAll(".nav-links .dropdown-menu a");
      submenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          newHamburger.classList.remove("toggle");
        });
      });
    }

    const navDropdowns = document.querySelectorAll(".nav-item.dropdown");

navDropdowns.forEach((dropdown) => {
  const navLink = dropdown.querySelector(".nav-link");

  // OPEN/CLOSE on click (toggle)
  navLink.addEventListener("click", (e) => {
    e.preventDefault();

    // Toggle: if already open, close it; otherwise open it
    if (dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
    } else {
      // close others
      document.querySelectorAll(".nav-item.dropdown.open").forEach((item) => {
        if (item !== dropdown) item.classList.remove("open");
      });
      dropdown.classList.add("open");
    }
  });



  

  // OPEN on hover
  dropdown.addEventListener("mouseenter", () => {
    dropdown.classList.add("open");
  });

  // 🔴 CLOSE as soon as cursor leaves THIS dropdown
  dropdown.addEventListener("mouseleave", () => {
    dropdown.classList.remove("open");
  });
});


    


  //   const navDropdowns = document.querySelectorAll(".nav-item.dropdown");
  //   navDropdowns.forEach((dropdown) => {
  //     dropdown.addEventListener("mouseleave", () => {
  //       dropdown.classList.remove("open");
  //     });
  //   });
  };

  const getRequestedComponent = () => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("section");
    const fromHash = window.location.hash
      ? decodeURIComponent(window.location.hash.substring(1))
      : "";
    return fromParam || fromHash || "";
  };

  const initDropdownRouting = ({
    pageFile,
    linkSelector,
    setActive,
    loadSection
  }) => {
    if (!window.__dropdownRoutingRegistry) {
      window.__dropdownRoutingRegistry = {};
    }

    window.__dropdownRoutingRegistry[pageFile] = {
      linkSelector,
      setActive,
      loadSection
    };

    if (!window.__dropdownRoutingInitialized) {
      window.__dropdownRoutingInitialized = true;
      document.addEventListener("click", (e) => {
        const dropdownLink = e.target.closest(".dropdown-menu a");
        if (!dropdownLink) return;

        const href = dropdownLink.getAttribute("href");
        if (!href) return;

        let url;
        try {
          url = new URL(href, window.location.origin);
        } catch (err) {
          console.error("Dropdown navigation error", err);
          return;
        }

        const currentPage = window.location.pathname.split("/").pop();
        const targetPage = url.pathname.split("/").pop();
        const handler = window.__dropdownRoutingRegistry[currentPage];

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
  };

  initNavbar();

  const mybutton = document.getElementById("scrollToTop");

  if (mybutton) {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    });

    mybutton.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  }

  // --- Visitor counter for homepage footer (client-side using localStorage) ---
  try {
    const visitorEl = document.getElementById('visitor-count');
    if (visitorEl) {
      // read current count (0 if not present)
      const key = 'kcebed_visit_count';
      let count = parseInt(localStorage.getItem(key) || '0', 10) || 0;
      count += 1; // increment on each page load
      localStorage.setItem(key, String(count));
      visitorEl.textContent = count.toLocaleString();
    }
  } catch (err) {
    console.warn('Visitor counter error', err);
  }

  const courseLinks = document.querySelectorAll(".course-link[data-component]");
  const coursesContent = document.getElementById("courses-content");

  if (courseLinks.length && coursesContent) {
    const setActive = (target) => {
      courseLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const showLoading = () => { coursesContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>"; };
    const loadSection = (path) => {
      showLoading();
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { coursesContent.innerHTML = html; })
          .catch((err) => {
            console.error("Failed to load course section", path, err);
            coursesContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    courseLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.course-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".course-link.active-link[data-component]") || courseLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "courses.html",
      linkSelector: ".course-link",
      setActive,
      loadSection
    });
  }

  const facilityLinks = document.querySelectorAll(".facility-link[data-component]");
  const facilitiesContent = document.getElementById("facilities-content");

  if (facilityLinks.length && facilitiesContent) {
    const setActive = (target) => {
      facilityLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const showLoading = () => { facilitiesContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>"; };
    const loadSection = (path) => {
      showLoading();
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { facilitiesContent.innerHTML = html; })
          .catch((err) => {
            console.error("Failed to load facility section", path, err);
            facilitiesContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    facilityLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.facility-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".facility-link.active-link[data-component]") || facilityLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "facilities.html",
      linkSelector: ".facility-link",
      setActive,
      loadSection
    });
  }

  const supportLinks = document.querySelectorAll(".support-link[data-component]");
  const supportContent = document.getElementById("student-support-content");

  if (supportLinks.length && supportContent) {
    const setActive = (target) => {
      supportLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const showLoading = () => { supportContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>"; };
    const loadSection = (path) => {
      showLoading();
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { supportContent.innerHTML = html; })
          .catch((err) => {
            console.error("Failed to load support section", path, err);
            supportContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    supportLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.support-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".support-link.active-link[data-component]") || supportLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "student_support.html",
      linkSelector: ".support-link",
      setActive,
      loadSection
    });
  }

  const aboutLinks = document.querySelectorAll(".about-link[data-component]");
  const aboutContent = document.getElementById("about-content");

  if (aboutLinks.length && aboutContent) {
    const setActive = (target) => {
      aboutLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const loadSection = (path) => {
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { aboutContent.innerHTML = html; })
          .catch(() => {
            aboutContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    aboutLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.about-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".about-link.active-link[data-component]") || aboutLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "about.html",
      linkSelector: ".about-link",
      setActive,
      loadSection
    });
  }

  const careerLinks = document.querySelectorAll(".career-link[data-component]");
  const careerContent = document.getElementById("career-content");

  if (careerLinks.length && careerContent) {
    const setActive = (target) => {
      careerLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const loadSection = (path) => {
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { careerContent.innerHTML = html; })
          .catch(() => {
            careerContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    careerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.career-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".career-link.active-link[data-component]") || careerLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "career.html",
      linkSelector: ".career-link",
      setActive,
      loadSection
    });
  }

  const activitiesLinks = document.querySelectorAll(".activities-link[data-component]");
  const activitiesContent = document.getElementById("activities-content");

  if (activitiesLinks.length && activitiesContent) {
    const setActive = (target) => {
      activitiesLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const loadSection = (path) => {
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { activitiesContent.innerHTML = html; })
          .catch(() => {
            activitiesContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    activitiesLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.activities-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".activities-link.active-link[data-component]") || activitiesLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "activities.html",
      linkSelector: ".activities-link",
      setActive,
      loadSection
    });
  }

  const alumniLinks = document.querySelectorAll(".alumni-link[data-component]");
  const alumniContent = document.getElementById("alumni-content");

  if (alumniLinks.length && alumniContent) {
    const setActive = (target) => {
      alumniLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const loadSection = (path) => {
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { alumniContent.innerHTML = html; })
          .catch(() => {
            alumniContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    alumniLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.alumni-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".alumni-link.active-link[data-component]") || alumniLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "alumini.html",
      linkSelector: ".alumni-link",
      setActive,
      loadSection
    });
  }

  const resultsLinks = document.querySelectorAll(".results-link[data-component]");
  const resultsContent = document.getElementById("results-content");

  if (resultsLinks.length && resultsContent) {
    const setActive = (target) => {
      resultsLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };
    const loadSection = (path) => {
      fetch(path)
          .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
          .then((html) => { resultsContent.innerHTML = html; })
          .catch(() => {
            resultsContent.innerHTML = "<p style='padding: 20px;'>Content is unavailable right now.</p>";
          });
    };
    resultsLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const component = link.getAttribute("data-component");
        if (!component) return;
        setActive(link);
        loadSection(component);
      });
    });
    const requested = getRequestedComponent();
    const requestedLink = requested
      ? document.querySelector(`.results-link[data-component="${requested}"]`)
      : null;
    const initial = requestedLink || document.querySelector(".results-link.active-link[data-component]") || resultsLinks[0];
    if (initial) {
      setActive(initial);
      loadSection(initial.getAttribute("data-component"));
    }

    initDropdownRouting({
      pageFile: "Results.html",
      linkSelector: ".results-link",
      setActive,
      loadSection
    });
  }

  // ---------- Vertical marquee for Upcoming Events ----------
  const marqueeContainers = document.querySelectorAll('.vertical-marquee');
  marqueeContainers.forEach((marqueeContainer) => {
    const track = marqueeContainer.querySelector('.marquee-track');
    if (!track) return;

    if (!track.dataset.duplicated) {
      track.innerHTML = track.innerHTML + track.innerHTML;
      track.dataset.duplicated = 'true';
    }

    const speedPxPerSec = 40; // adjust scroll speed (px per second)
    const setMarqueeDuration = () => {
      const originalHeight = track.scrollHeight / 2 || 0;
      const durationSec = Math.max(6, Math.round(originalHeight / speedPxPerSec));
      track.style.animationDuration = durationSec + 's';
    };

    setTimeout(setMarqueeDuration, 100);
    window.addEventListener('resize', setMarqueeDuration);

    marqueeContainer.addEventListener('touchstart', () => { track.style.animationPlayState = 'paused'; });
    marqueeContainer.addEventListener('touchend', () => { track.style.animationPlayState = 'running'; });
  });

  // ---------- Hero Section Image Slider ----------
  const sliderTrack = document.querySelector('.hero-slider-track');
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  
  if (sliderTrack && slides.length > 0 && prevBtn && nextBtn && dotsContainer) {
    let currentSlide = 0;
    const totalSlides = slides.length - 1; // Subtract 1 because last slide is duplicate
    let autoSlideInterval;
    let isTransitioning = false;
    
    // Create dots (only for original slides, not the duplicate)
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Update slider position
    function updateSliderPosition(smooth = true) {
      const offset = -currentSlide * 100;
      if (smooth) {
        sliderTrack.style.transition = 'transform 0.8s ease-in-out';
      } else {
        sliderTrack.style.transition = 'none';
      }
      sliderTrack.style.transform = `translateX(${offset}%)`;
    }
    
    // Show specific slide
    function goToSlide(n, smooth = true) {
      if (isTransitioning) return;
      
      // Remove active class from current dot
      dots[currentSlide % totalSlides].classList.remove('active');
      
      // Update current slide index
      currentSlide = n;
      
      // Add active class to new dot
      dots[currentSlide % totalSlides].classList.add('active');
      
      // Update slider position
      updateSliderPosition(smooth);
      
      // Reset auto-slide timer
      resetAutoSlide();
    }
    
    // Next slide with infinite loop
    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      
      currentSlide++;
      
      // Remove active from current dot
      dots[(currentSlide - 1) % totalSlides].classList.remove('active');
      
      // Add active to next dot (wrap around if needed)
      dots[currentSlide % totalSlides].classList.add('active');
      
      // Slide to next position
      updateSliderPosition(true);
      
      // If we're at the duplicate slide (last one), reset to first after transition
      if (currentSlide === totalSlides) {
        setTimeout(() => {
          currentSlide = 0;
          updateSliderPosition(false); // Jump instantly without animation
          isTransitioning = false;
        }, 800); // Match transition duration
      } else {
        setTimeout(() => {
          isTransitioning = false;
        }, 800);
      }
      
      resetAutoSlide();
    }
    
    // Previous slide
    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      
      // If at first slide, jump to duplicate without animation, then slide to last real slide
      if (currentSlide === 0) {
        currentSlide = totalSlides;
        updateSliderPosition(false); // Jump to duplicate instantly
        
        setTimeout(() => {
          currentSlide = totalSlides - 1;
          dots[currentSlide].classList.add('active');
          dots[0].classList.remove('active');
          updateSliderPosition(true);
          setTimeout(() => {
            isTransitioning = false;
          }, 800);
        }, 20);
      } else {
        dots[currentSlide].classList.remove('active');
        currentSlide--;
        dots[currentSlide].classList.add('active');
        updateSliderPosition(true);
        setTimeout(() => {
          isTransitioning = false;
        }, 800);
      }
      
      resetAutoSlide();
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }
    
    // Event listeners for arrow buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Pause auto-slide on hover
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoSlide);
      heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Start auto-slide
    startAutoSlide();
  }

});