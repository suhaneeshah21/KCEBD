document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("toggle");
    });

    const links = document.querySelectorAll(".nav-links li a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("toggle");
      });
    });
  }

  // Scroll to top button
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

  // Courses page dynamic loader for components/Courses/*
  const courseLinks = document.querySelectorAll(".course-link[data-component]");
  const coursesContent = document.getElementById("courses-content");

  if (courseLinks.length && coursesContent) {
    const setActive = (target) => {
      courseLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };

    const showLoading = () => {
      coursesContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>";
    };

    const loadSection = (path) => {
      showLoading();
      fetch(path)
        .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
        .then((html) => {
          coursesContent.innerHTML = html;
        })
        .catch((err) => {
          console.error("Failed to load course section", path, err);
          coursesContent.innerHTML =
            "<p style='padding: 20px;'>Content is unavailable right now. Please try again later.</p>";
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

    const initial =
      document.querySelector(".course-link.active-link[data-component]") || courseLinks[0];
    if (initial) {
      loadSection(initial.getAttribute("data-component"));
    }
  }

  // Facilities page dynamic loader for components/Facilities/*
  const facilityLinks = document.querySelectorAll(".facility-link[data-component]");
  const facilitiesContent = document.getElementById("facilities-content");

  if (facilityLinks.length && facilitiesContent) {
    const setActive = (target) => {
      facilityLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };

    const showLoading = () => {
      facilitiesContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>";
    };

    const loadSection = (path) => {
      showLoading();
      fetch(path)
        .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
        .then((html) => {
          facilitiesContent.innerHTML = html;
        })
        .catch((err) => {
          console.error("Failed to load facility section", path, err);
          facilitiesContent.innerHTML =
            "<p style='padding: 20px;'>Content is unavailable right now. Please try again later.</p>";
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

    const initial =
      document.querySelector(".facility-link.active-link[data-component]") || facilityLinks[0];
    if (initial) {
      loadSection(initial.getAttribute("data-component"));
    }
  }

  // Student Support page dynamic loader for components/student_support/*
  const supportLinks = document.querySelectorAll(".support-link[data-component]");
  const supportContent = document.getElementById("student-support-content");

  if (supportLinks.length && supportContent) {
    const setActive = (target) => {
      supportLinks.forEach((lnk) => lnk.classList.remove("active-link"));
      target.classList.add("active-link");
    };

    const showLoading = () => {
      supportContent.innerHTML = "<p style='padding: 20px;'>Loading...</p>";
    };

    const loadSection = (path) => {
      showLoading();
      fetch(path)
        .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
        .then((html) => {
          supportContent.innerHTML = html;
        })
        .catch((err) => {
          console.error("Failed to load student support section", path, err);
          supportContent.innerHTML =
            "<p style='padding: 20px;'>Content is unavailable right now. Please try again later.</p>";
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

    const initial =
      document.querySelector(".support-link.active-link[data-component]") || supportLinks[0];
    if (initial) {
      loadSection(initial.getAttribute("data-component"));
    }
  }

  // About page dynamic loader for components/AboutUs/*
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
        .then((html) => {
          aboutContent.innerHTML = html;
        })
        .catch(() => {
          aboutContent.innerHTML =
            "<p style='padding: 20px;'>Content is unavailable right now. Please try again later.</p>";
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
    if (initial) {
      loadSection(initial.getAttribute("data-component"));
    }
  }
  
});
