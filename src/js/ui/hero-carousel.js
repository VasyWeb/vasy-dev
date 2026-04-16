const AUTOPLAY_DELAY = 7000;
const SWIPE_THRESHOLD = 48;

const CAROUSEL_I18N = {
  en: {
    dotLabel: "Go to hero slide",
    statusPrefix: "Current slide:",
  },
  ro: {
    dotLabel: "Mergi la slide-ul hero",
    statusPrefix: "Slide curent:",
  },
  cs: {
    dotLabel: "Přejít na slide hero sekce",
    statusPrefix: "Aktuální slide:",
  },
};

const clampIndex = (index, length) => {
  if (!length) {
    return 0;
  }

  return (index + length) % length;
};

export const setupHeroCarousel = () => {
  const roots = Array.from(document.querySelectorAll("[data-carousel]"));

  roots.forEach((root) => {
    const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
    const prevButton = root.querySelector("[data-hero-prev]");
    const nextButton = root.querySelector("[data-hero-next]");
    const dotsHost = root.querySelector("[data-hero-dots]");
    const status = root.querySelector("[data-hero-status]");
    const media = root.querySelector(".hero__media");

    if (
      slides.length < 2 ||
      !prevButton ||
      !nextButton ||
      !dotsHost ||
      !status
    ) {
      return;
    }

    const locale =
      CAROUSEL_I18N[document.documentElement.lang] || CAROUSEL_I18N.en;

    const imageSources = slides
      .map((slide) => slide.dataset.heroImage)
      .filter(Boolean);

    imageSources.forEach((source) => {
      const preloadImage = new Image();
      preloadImage.src = source;
    });

    let activeIndex = slides.findIndex((slide) =>
      slide.classList.contains("is-active")
    );
    let autoplayId = null;
    let touchStartX = 0;
    let touchStartY = 0;

    activeIndex = activeIndex >= 0 ? activeIndex : 0;

    const dots = slides.map((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero__dot";
      dot.setAttribute("aria-label", `${locale.dotLabel} ${index + 1}`);
      dot.dataset.heroDot = String(index);
      dotsHost.append(dot);
      return dot;
    });

    const updateStatus = () => {
      const title = slides[activeIndex]
        .querySelector(".hero__title")
        ?.textContent?.trim();

      status.textContent = title
        ? `${locale.statusPrefix} ${title}`
        : `${locale.statusPrefix} ${activeIndex + 1}`;
    };

    const updateMedia = () => {
      if (!media) {
        return;
      }

      const nextSource = slides[activeIndex].dataset.heroImage;

      if (!nextSource || media.getAttribute("src") === nextSource) {
        return;
      }

      media.setAttribute("src", nextSource);
    };

    const render = (nextIndex) => {
      activeIndex = clampIndex(nextIndex, slides.length);

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.setAttribute("aria-current", "true");
          return;
        }

        dot.removeAttribute("aria-current");
      });

      updateStatus();
      updateMedia();
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      if (
        document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      stopAutoplay();
      autoplayId = window.setInterval(() => {
        render(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    };

    const goTo = (nextIndex) => {
      render(nextIndex);
      startAutoplay();
    };

    prevButton.addEventListener("click", () => {
      goTo(activeIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      goTo(activeIndex + 1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goTo(index);
      });
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", (event) => {
      if (!root.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        goTo(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        goTo(activeIndex + 1);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
        return;
      }

      startAutoplay();
    });

    root.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (
          Math.abs(deltaX) < SWIPE_THRESHOLD ||
          Math.abs(deltaX) <= Math.abs(deltaY)
        ) {
          return;
        }

        if (deltaX < 0) {
          goTo(activeIndex + 1);
          return;
        }

        goTo(activeIndex - 1);
      },
      { passive: true }
    );

    render(activeIndex);
    startAutoplay();
  });
};
