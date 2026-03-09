const getById = (id) => document.getElementById(id);

const withCopyFeedback = async (button, text, idleLabel) => {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
  } catch {
    button.textContent = "Copy failed";
  } finally {
    setTimeout(() => {
      button.textContent = idleLabel;
    }, 1200);
  }
};

const setupNav = () => {
  const toggleButton = getById("siteNavToggle");
  const navList = getById("siteNavList");
  const openClass = "site-nav__list--open";

  if (!toggleButton || !navList) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle(openClass);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navList.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !navList.classList.contains(openClass)) {
      return;
    }

    navList.classList.remove(openClass);
    toggleButton.setAttribute("aria-expanded", "false");
  });
};

const setupShadowGenerator = () => {
  const inputs = {
    x: getById("shadowX"),
    y: getById("shadowY"),
    blur: getById("shadowBlur"),
    spread: getById("shadowSpread"),
    opacity: getById("shadowOpacity")
  };
  const preview = getById("shadowPreview");
  const code = getById("shadowCode");
  const copyBtn = getById("copyShadowBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const x = Number(inputs.x.value);
    const y = Number(inputs.y.value);
    const blur = Number(inputs.blur.value);
    const spread = Number(inputs.spread.value);
    const opacity = Number(inputs.opacity.value);
    const value = `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

    preview.style.boxShadow = value;
    code.textContent = `box-shadow: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

const setupRadiusGenerator = () => {
  const inputs = {
    tl: getById("radiusTl"),
    tr: getById("radiusTr"),
    br: getById("radiusBr"),
    bl: getById("radiusBl")
  };
  const preview = getById("radiusPreview");
  const code = getById("radiusCode");
  const copyBtn = getById("copyRadiusBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const tl = Number(inputs.tl.value);
    const tr = Number(inputs.tr.value);
    const br = Number(inputs.br.value);
    const bl = Number(inputs.bl.value);
    const value = `${tl}px ${tr}px ${br}px ${bl}px`;

    preview.style.borderRadius = value;
    code.textContent = `border-radius: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

const setupPaletteGenerator = () => {
  const swatchesRoot = getById("paletteSwatches");
  const randomBtn = getById("paletteRandomBtn");
  const exportBtn = getById("paletteExportBtn");
  const code = getById("paletteCode");

  if (!swatchesRoot || !randomBtn || !exportBtn || !code) {
    return;
  }

  const swatches = Array.from(swatchesRoot.querySelectorAll(".swatch"));
  const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;

  const updateCode = () => {
    const vars = swatches
      .map((swatch, index) => {
        const hex = swatch.querySelector(".swatch__hex").textContent;
        return `--color-${index + 1}: ${hex};`;
      })
      .join(" ");

    code.textContent = `:root { ${vars} }`;
  };

  swatchesRoot.addEventListener("click", (event) => {
    const lockBtn = event.target.closest(".swatch__lock");
    if (!lockBtn) {
      return;
    }

    const nextState = lockBtn.getAttribute("aria-pressed") !== "true";
    lockBtn.setAttribute("aria-pressed", String(nextState));
    lockBtn.textContent = nextState ? "Locked" : "Lock";
  });

  randomBtn.addEventListener("click", () => {
    swatches.forEach((swatch) => {
      const lockBtn = swatch.querySelector(".swatch__lock");
      const isLocked = lockBtn.getAttribute("aria-pressed") === "true";
      if (isLocked) {
        return;
      }

      const color = randomHex();
      swatch.querySelector(".swatch__color").style.background = color;
      swatch.querySelector(".swatch__hex").textContent = color;
    });
    updateCode();
  });

  exportBtn.addEventListener("click", () =>
    withCopyFeedback(exportBtn, code.textContent, "Export CSS Variables")
  );

  updateCode();
};

const setupGradientGenerator = () => {
  const angle = getById("gradientAngle");
  const color1 = getById("gradientColor1");
  const color2 = getById("gradientColor2");
  const preview = getById("gradientPreview");
  const code = getById("gradientCode");
  const copyBtn = getById("copyGradientBtn");

  if (!angle || !color1 || !color2 || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const value = `linear-gradient(${Number(angle.value)}deg, ${color1.value}, ${color2.value})`;
    preview.style.background = value;
    code.textContent = `background: ${value};`;
  };

  [angle, color1, color2].forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

setupNav();
setupShadowGenerator();
setupRadiusGenerator();
setupPaletteGenerator();
setupGradientGenerator();
