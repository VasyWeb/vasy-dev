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

const setupTextShadowGenerator = () => {
  const inputs = {
    x: getById("textShadowX"),
    y: getById("textShadowY"),
    blur: getById("textShadowBlur"),
    color: getById("textShadowColor"),
    opacity: getById("textShadowOpacity")
  };
  const preview = getById("textShadowPreview");
  const code = getById("textShadowCode");
  const copyBtn = getById("copyTextShadowBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const hexToRgb = (hex) => {
    const normalized = hex.replace("#", "");
    const bigint = Number.parseInt(normalized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  const update = () => {
    const x = Number(inputs.x.value);
    const y = Number(inputs.y.value);
    const blur = Number(inputs.blur.value);
    const opacity = Number(inputs.opacity.value);
    const { r, g, b } = hexToRgb(inputs.color.value);
    const value = `${x}px ${y}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;

    preview.style.textShadow = value;
    code.textContent = `text-shadow: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

const setupTransformGenerator = () => {
  const inputs = {
    rotate: getById("transformRotate"),
    scale: getById("transformScale"),
    translateX: getById("transformTranslateX"),
    translateY: getById("transformTranslateY")
  };
  const preview = getById("transformPreview");
  const code = getById("transformCode");
  const copyBtn = getById("copyTransformBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const rotate = Number(inputs.rotate.value);
    const scale = Number(inputs.scale.value);
    const translateX = Number(inputs.translateX.value);
    const translateY = Number(inputs.translateY.value);
    const value = `rotate(${rotate}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;

    preview.style.transform = value;
    code.textContent = `transform: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

const setupGlassGenerator = () => {
  const inputs = {
    blur: getById("glassBlur"),
    bgOpacity: getById("glassBgOpacity"),
    radius: getById("glassRadius"),
    borderOpacity: getById("glassBorderOpacity")
  };
  const preview = getById("glassPreview");
  const code = getById("glassCode");
  const copyBtn = getById("copyGlassBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const blur = Number(inputs.blur.value);
    const bgOpacity = Number(inputs.bgOpacity.value);
    const radius = Number(inputs.radius.value);
    const borderOpacity = Number(inputs.borderOpacity.value);
    const background = `rgba(255, 255, 255, ${bgOpacity})`;
    const border = `1px solid rgba(255, 255, 255, ${borderOpacity})`;

    preview.style.backdropFilter = `blur(${blur}px)`;
    preview.style.webkitBackdropFilter = `blur(${blur}px)`;
    preview.style.background = background;
    preview.style.border = border;
    preview.style.borderRadius = `${radius}px`;

    code.textContent = `backdrop-filter: blur(${blur}px);
background: ${background};
border: ${border};
border-radius: ${radius}px;`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};

setupNav();
setupShadowGenerator();
setupRadiusGenerator();
setupPaletteGenerator();
setupGradientGenerator();
setupTextShadowGenerator();
setupTransformGenerator();
setupGlassGenerator();
