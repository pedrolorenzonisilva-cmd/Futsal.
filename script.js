/* =========================================================
   FUTSAL+ — SCRIPT.JS
   JavaScript completo para o site de futsal
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÕES GERAIS
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     2. ELEMENTOS PRINCIPAIS
     ======================================================= */

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section[id]");

  const yearElement = document.getElementById("year");

  /* =======================================================
     3. ANO AUTOMÁTICO DO FOOTER
     ======================================================= */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =======================================================
     4. MENU MOBILE
     ======================================================= */

  function openMenu() {
    if (!nav || !menuBtn) return;

    nav.classList.add("open");

    menuBtn.textContent = "✕";

    menuBtn.setAttribute(
      "aria-label",
      "Fechar menu"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!nav || !menuBtn) return;

    nav.classList.remove("open");

    menuBtn.textContent = "☰";

    menuBtn.setAttribute(
      "aria-label",
      "Abrir menu"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!nav) return;

    const isOpen = nav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuBtn) {

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.addEventListener(
      "click",
      toggleMenu
    );
  }


  /* =======================================================
     5. FECHAR MENU AO CLICAR EM LINK
     ======================================================= */

  navLinks.forEach(link => {

    link.addEventListener("click", () => {
      closeMenu();
    });

  });


  /* =======================================================
     6. FECHAR MENU COM ESC
     ======================================================= */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeMenu();
    }

  });


  /* =======================================================
     7. FECHAR MENU AO CLICAR FORA
     ======================================================= */

  document.addEventListener("click", event => {

    if (!nav || !menuBtn) return;

    const clickedInsideNav =
      nav.contains(event.target);

    const clickedMenuButton =
      menuBtn.contains(event.target);

    if (
      nav.classList.contains("open") &&
      !clickedInsideNav &&
      !clickedMenuButton
    ) {
      closeMenu();
    }

  });


  /* =======================================================
     8. NAVEGAÇÃO ATIVA
     ======================================================= */

  function setActiveLink(id) {

    navLinks.forEach(link => {

      link.classList.remove("active");

      const target =
        link.getAttribute("href");

      if (target === `#${id}`) {
        link.classList.add("active");
      }

    });

  }

  if ("IntersectionObserver" in window) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              setActiveLink(
                entry.target.id
              );

            }

          });

        },
        {
          rootMargin:
            "-30% 0px -55% 0px",

          threshold: 0
        }
      );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

  }


  /* =======================================================
     9. SCROLL SUAVE
     ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const href =
            link.getAttribute("href");

          if (
            !href ||
            href === "#" ||
            href.length <= 1
          ) {
            return;
          }

          const target =
            document.querySelector(href);

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* =======================================================
     10. ANIMAÇÃO REVEAL
     ======================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    revealElements.length > 0
  ) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     11. EFEITO STAGGER NOS CARDS
     ======================================================= */

  const cardGroups = [
    ".positions-grid",
    ".rules-grid",
    ".benefits-grid",
    ".facts"
  ];

  cardGroups.forEach(selector => {

    const cards =
      document.querySelectorAll(
        `${selector} .reveal`
      );

    cards.forEach((card, index) => {

      card.style.transitionDelay =
        `${index * 70}ms`;

    });

  });


  /* =======================================================
     12. CONTADORES DAS ESTATÍSTICAS
     ======================================================= */

  const statNumbers =
    document.querySelectorAll(
      ".stat strong"
    );

  function animateCounter(
    element,
    target,
    suffix = ""
  ) {

    const duration = 1200;

    const startTime =
      performance.now();

    function update(currentTime) {

      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      /*
       * Ease-out:
       * começa rápido e termina devagar.
       */
      const eased =
        1 - Math.pow(
          1 - progress,
          3
        );

      const value =
        Math.floor(
          eased * target
        );

      element.textContent =
        value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }

    }

    requestAnimationFrame(update);
  }


  if (
    "IntersectionObserver" in window &&
    statNumbers.length > 0
  ) {

    const counterObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }

            const element =
              entry.target;

            const original =
              element.textContent.trim();

            /*
             * Identifica valores como:
             * 5
             * 40'
             * 4
             * 1
             */

            const match =
              original.match(/\d+/);

            if (!match) return;

            const target =
              Number(match[0]);

            const suffix =
              original.replace(
                /\d+/,
                ""
              );

            animateCounter(
              element,
              target,
              suffix
            );

            counterObserver.unobserve(
              element
            );

          });

        },
        {
          threshold: 0.8
        }
      );

    statNumbers.forEach(element => {
      counterObserver.observe(element);
    });

  }


  /* =======================================================
     13. BOTÃO VOLTAR AO TOPO
     ======================================================= */

  const backToTop =
    document.createElement("button");

  backToTop.type = "button";

  backToTop.className =
    "back-to-top";

  backToTop.setAttribute(
    "aria-label",
    "Voltar ao topo"
  );

  backToTop.innerHTML = "↑";

  document.body.appendChild(
    backToTop
  );


  /*
   * Estilos do botão criados pelo JS.
   * Dessa maneira o index.html continua limpo.
   */

  Object.assign(
    backToTop.style,
    {
      position: "fixed",
      right: "22px",
      bottom: "22px",

      width: "45px",
      height: "45px",

      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "13px",

      color: "#ffffff",

      background:
        "rgba(8, 25, 40, .9)",

      backdropFilter:
        "blur(12px)",

      WebkitBackdropFilter:
        "blur(12px)",

      fontSize: "1.25rem",
      fontWeight: "900",

      display: "grid",
      placeItems: "center",

      cursor: "pointer",

      zIndex: "999",

      opacity: "0",
      visibility: "hidden",

      transform:
        "translateY(15px)",

      transition:
        "opacity .3s ease, " +
        "visibility .3s ease, " +
        "transform .3s ease, " +
        "background .3s ease"
    }
  );


  function updateBackToTop() {

    if (
      window.scrollY > 500
    ) {

      backToTop.style.opacity = "1";

      backToTop.style.visibility =
        "visible";

      backToTop.style.transform =
        "translateY(0)";

    } else {

      backToTop.style.opacity = "0";

      backToTop.style.visibility =
        "hidden";

      backToTop.style.transform =
        "translateY(15px)";
    }

  }

  window.addEventListener(
    "scroll",
    updateBackToTop,
    {
      passive: true
    }
  );

  backToTop.addEventListener(
    "mouseenter",
    () => {

      backToTop.style.background =
        "rgba(0, 200, 255, .18)";

      backToTop.style.borderColor =
        "rgba(0, 200, 255, .35)";

      backToTop.style.transform =
        "translateY(-4px)";
    }
  );

  backToTop.addEventListener(
    "mouseleave",
    () => {

      backToTop.style.background =
        "rgba(8, 25, 40, .9)";

      backToTop.style.borderColor =
        "rgba(255,255,255,.12)";

      backToTop.style.transform =
        "translateY(0)";
    }
  );

  backToTop.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     14. EFEITO NO HEADER AO ROLAR
     ======================================================= */

  const header =
    document.querySelector("header");

  function updateHeader() {

    if (!header) return;

    if (window.scrollY > 40) {

      header.style.background =
        "rgba(4, 13, 21, .94)";

      header.style.boxShadow =
        "0 10px 35px rgba(0,0,0,.18)";

    } else {

      header.style.background =
        "rgba(4, 13, 21, .78)";

      header.style.boxShadow =
        "none";
    }

  }

  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );


  /* =======================================================
     15. EFEITO PARALLAX DA QUADRA
     ======================================================= */

  const court =
    document.querySelector(".court");

  if (court) {

    court.addEventListener(
      "mousemove",
      event => {

        /*
         * Não aplica efeito em telas pequenas.
         */
        if (window.innerWidth < 800) {
          return;
        }

        const rect =
          court.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const rotateY =
          ((x - centerX) / centerX) * 3;

        const rotateX =
          ((centerY - y) / centerY) * 3;

        court.style.transform =
          `perspective(900px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-5px)`;

      }
    );

    court.addEventListener(
      "mouseleave",
      () => {

        court.style.transform =
          "perspective(900px) " +
          "rotateX(0deg) " +
          "rotateY(0deg) " +
          "translateY(0)";

      }
    );

  }


  /* =======================================================
     16. EFEITO DE DIGITAÇÃO NO HERO
     ======================================================= */

  const heroTitle =
    document.querySelector(
      ".hero h1 span"
    );

  /*
   * Mantemos o texto original.
   * O efeito só acontece uma vez.
   */

  if (
    heroTitle &&
    window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    ).matches
  ) {

    const text =
      heroTitle.textContent.trim();

    /*
     * Evita o efeito em celulares
     * muito pequenos.
     */

    if (window.innerWidth > 500) {

      heroTitle.textContent = "";

      let index = 0;

      function typeText() {

        if (index < text.length) {

          heroTitle.textContent +=
            text.charAt(index);

          index++;

          setTimeout(
            typeText,
            65
          );

        }

      }

      setTimeout(
        typeText,
        450
      );

    }

  }


  /* =======================================================
     17. HOVER DOS CARDS
     ======================================================= */

  const cards =
    document.querySelectorAll(
      ".position-card, .rule, .benefit, .fact"
    );

  cards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.style.setProperty(
          "--mouse-x",
          "50%"
        );

        card.style.setProperty(
          "--mouse-y",
          "50%"
        );

      }
    );

  });


  /* =======================================================
     18. RESPONSIVIDADE DO MENU
     ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {
        closeMenu();
      }

    }
  );


  /* =======================================================
     19. DETECTAR LINK ATUAL AO CARREGAR
     ======================================================= */

  const currentHash =
    window.location.hash;

  if (currentHash) {

    const currentLink =
      document.querySelector(
        `nav a[href="${currentHash}"]`
      );

    if (currentLink) {

      navLinks.forEach(link => {
        link.classList.remove(
          "active"
        );
      });

      currentLink.classList.add(
        "active"
      );

    }

  }


  /* =======================================================
     20. PREVENIR CLIQUE EM LINKS #
     ======================================================= */

  document
    .querySelectorAll('a[href="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {
          event.preventDefault();
        }
      );

    });


  /* =======================================================
     21. DETECÇÃO DE REDUÇÃO DE MOVIMENTO
     ======================================================= */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  if (reduceMotion.matches) {

    document
      .querySelectorAll(".reveal")
      .forEach(element => {

        element.classList.add(
          "visible"
        );

      });

  }


  /* =======================================================
     22. INICIALIZAÇÃO
     ======================================================= */

  updateBackToTop();
  updateHeader();

  console.log(
    "%c⚽ FUTSAL+ carregado com sucesso!",
    `
      color: #00c8ff;
      font-size: 16px;
      font-weight: bold;
    `
  );

});
