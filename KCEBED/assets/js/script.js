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
    const initial = document.querySelector(".course-link.active-link[data-component]") || courseLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".facility-link.active-link[data-component]") || facilityLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".support-link.active-link[data-component]") || supportLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".about-link.active-link[data-component]") || aboutLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".career-link.active-link[data-component]") || careerLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".activities-link.active-link[data-component]") || activitiesLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
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
    const initial = document.querySelector(".alumni-link.active-link[data-component]") || alumniLinks[0];
    if (initial) loadSection(initial.getAttribute("data-component"));
  }
});