function setUpScrolling() {
  const header = document.querySelector("#header");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      header.classList.add("scrolled-header");
    } else {
      header.classList.remove("scrolled-header");
    }
  });
}

function addClassWhenHovering() {
  document.querySelectorAll(".section-header").forEach((header) => {
    header.addEventListener("mouseenter", () => {
      document.querySelectorAll(".section.active").forEach((expanded) => {
        expanded.classList.remove("active");
      });
      const section = header.parentElement;
      section.classList.add("active");
    });
  });
}

function toggleContactForm() {
  const contactForm = document.querySelector("#contact form");
  const showContactBtn = document.getElementById("showContact");
  const hideContactBtn = document.getElementById("hideContact");
  const contactTextContent = document.getElementById("contactTextContent");
  const contactFormContainer = document.getElementById("contactFormContainer");

  function showForm() {
    contactTextContent.classList.add("slide-out");
    contactFormContainer.classList.add("slide-in");

    setTimeout(() => {
      const firstInput = document.querySelector('input[name="First Name"]');
      if (firstInput) firstInput.focus();
    }, 600);
  }

  function hideForm() {
    contactTextContent.classList.remove("slide-out");
    contactFormContainer.classList.remove("slide-in");

    // Reset form after animation (optional)
    setTimeout(() => {
      if (contactForm && contactForm.reset) {
        contactForm.reset();
      }
    }, 600);
  }

  if (showContactBtn) {
    showContactBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showForm();
    });
  }

  if (hideContactBtn) {
    hideContactBtn.addEventListener("click", function (e) {
      e.preventDefault();
      hideForm();
    });
  }

  document.getElementById("showContact").addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      contactForm.style.transform = "translateX(0)";
    } else {
      contactForm.style.transform = "translate3d(0px, 0px, 0px)";
    }
    contactForm.style.opacity = "1";
  });
  document.getElementById("hideContact").addEventListener("click", () => {
    contactForm.style.transform = "translate3d(-120%, 0px, 0px);";
    contactForm.style.opacity = "0";
  });
}

function setUpMenu() {
  const burgerMenu = document.getElementById("burger-menu");
  const navMenu = document.getElementById("nav-menu");

  function toggleMobileMenu() {
    burgerMenu.classList.toggle("active");
    if (window.innerWidth <= 768) {
      if (burgerMenu.classList.contains("active")) {
        navMenu.style.visibility = "";
        navMenu.style.transform = "translateX(0)";
      } else {
        navMenu.style.visibility = "visible";
        navMenu.style.transform = "translateX(-249vw)";
      }
    } else {
      navMenu.style.transform = "";
    }
  }

  function closeMobileMenu() {
    burgerMenu.classList.remove("active");
    navMenu.classList.remove("active");
    if (window.innerWidth <= 768) {
      navMenu.style.visibility = "";
      navMenu.style.transform = "translateX(-249vw)";
    } else {
      navMenu.style.transform = "";
    }
  }

  burgerMenu.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      toggleMobileMenu();
    }
  });

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

function init() {
  setUpScrolling();
  setUpMenu();
  addClassWhenHovering();
  toggleContactForm();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("load", init);
}
