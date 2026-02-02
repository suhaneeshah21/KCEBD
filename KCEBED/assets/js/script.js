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

      const links = document.querySelectorAll(".nav-links li a");
      links.forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          newHamburger.classList.remove("toggle");
        });
      });
    }

    const navItems = document.querySelectorAll(".nav-item.dropdown > .nav-link");
    navItems.forEach((navLink) => {
      navLink.addEventListener("click", (e) => {
        e.preventDefault();
        const parent = navLink.closest(".nav-item.dropdown");
        if (!parent) return;

        document.querySelectorAll(".nav-item.dropdown.open").forEach((item) => {
          if (item !== parent) item.classList.remove("open");
        });

        parent.classList.add("open");
      });
    });


    const navDropdowns = document.querySelectorAll(".nav-item.dropdown");

navDropdowns.forEach((dropdown) => {
  const navLink = dropdown.querySelector(".nav-link");

  // OPEN on click
  navLink.addEventListener("click", (e) => {
    e.preventDefault();

    // close others
    document.querySelectorAll(".nav-item.dropdown.open").forEach((item) => {
      if (item !== dropdown) item.classList.remove("open");
    });

    dropdown.classList.add("open");
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
});