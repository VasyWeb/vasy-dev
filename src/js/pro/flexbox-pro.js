import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const layouts = {
  navbar: {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    items: ["Logo", "Links", "CTA"],
    html: `<nav class="nav">
  <div>Logo</div>
  <div>Links</div>
  <button>CTA</button>
</nav>`
  },
  hero: {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    items: ["Content", "Illustration"],
    html: `<section class="hero">
  <div>Content</div>
  <div>Illustration</div>
</section>`
  },
  cards: {
    direction: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 20,
    items: ["Card 1", "Card 2", "Card 3"],
    html: `<div class="cards">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
</div>`
  },
  pricing: {
    direction: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 24,
    items: ["Starter", "Growth", "Scale"],
    html: `<section class="pricing">
  <article>Starter</article>
  <article>Growth</article>
  <article>Scale</article>
</section>`
  }
};

const viewportScales = {
  desktop: "min(100%, 720px)",
  tablet: "min(100%, 540px)",
  mobile: "min(100%, 340px)"
};

const setActive = (buttons, value, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

export const setupFlexboxPro = () => {
  const preview = getById("proFlexPreview");
  const code = getById("proFlexCode");
  const copyBtn = getById("copyProFlexBtn");
  const gapInput = getById("flexGap");
  const countInput = getById("proFlexChildren");
  const directionInput = getById("flexDirection");
  const justifyInput = getById("flexJustifyContent");
  const alignInput = getById("flexAlignItems");

  if (
    !preview ||
    !code ||
    !copyBtn ||
    !gapInput ||
    !countInput ||
    !directionInput ||
    !justifyInput ||
    !alignInput
  ) {
    return;
  }

  const layoutButtons = Array.from(document.querySelectorAll("[data-flex-layout]"));
  const viewportButtons = Array.from(document.querySelectorAll("[data-flex-viewport]"));
  const exportButtons = Array.from(document.querySelectorAll("[data-flex-export]"));

  const state = {
    layout: "navbar",
    viewport: "desktop",
    exportFormat: "css"
  };

  const applyLayoutPreset = (layoutKey) => {
    const layout = layouts[layoutKey];
    if (!layout) {
      return;
    }

    directionInput.value = layout.direction;
    justifyInput.value = layout.justifyContent;
    alignInput.value = layout.alignItems;
    gapInput.value = String(layout.gap);
  };

  const renderPreview = () => {
    const layout = layouts[state.layout];
    const childCount = Math.max(2, Math.min(6, Number(countInput.value)));
    const items = Array.from({ length: childCount }, (_, index) =>
      layout.items[index] || `Item ${index + 1}`
    );

    preview.style.width = viewportScales[state.viewport];
    preview.style.display = "flex";
    preview.style.flexDirection = directionInput.value;
    preview.style.justifyContent = justifyInput.value;
    preview.style.alignItems = alignInput.value;
    preview.style.gap = `${Number(gapInput.value)}px`;

    preview.innerHTML = items.map((item) => `<div>${item}</div>`).join("");
  };

  const renderCode = () => {
    const layout = layouts[state.layout];
    const css = `display: flex;
flex-direction: ${directionInput.value};
justify-content: ${justifyInput.value};
align-items: ${alignInput.value};
gap: ${Number(gapInput.value)}px;`;

    code.textContent =
      state.exportFormat === "html" ? `${layout.html}\n\n/* CSS */\n${css}` : css;
  };

  const update = () => {
    renderPreview();
    renderCode();
  };

  setupToolTracking({
    toolName: "flexbox_generator_pro",
    controls: [
      { element: directionInput, controlName: "flex_direction", getValue: () => directionInput.value },
      { element: justifyInput, controlName: "justify_content", getValue: () => justifyInput.value },
      { element: alignInput, controlName: "align_items", getValue: () => alignInput.value },
      { element: gapInput, controlName: "gap", getValue: () => Number(gapInput.value) },
      { element: countInput, controlName: "child_count", getValue: () => Number(countInput.value) }
    ],
    copyButton: copyBtn,
    presetButtons: layoutButtons
  });

  layoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.layout = button.getAttribute("data-flex-layout");
      setActive(layoutButtons, state.layout, "data-flex-layout");
      applyLayoutPreset(state.layout);
      update();
    });
  });

  viewportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.viewport = button.getAttribute("data-flex-viewport");
      setActive(viewportButtons, state.viewport, "data-flex-viewport");
      update();
    });
  });

  exportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.exportFormat = button.getAttribute("data-flex-export");
      setActive(exportButtons, state.exportFormat, "data-flex-export");
      update();
    });
  });

  [directionInput, justifyInput, alignInput, gapInput, countInput].forEach((input) =>
    input.addEventListener("input", update)
  );
  [directionInput, justifyInput, alignInput].forEach((input) =>
    input.addEventListener("change", update)
  );

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActive(layoutButtons, state.layout, "data-flex-layout");
  setActive(viewportButtons, state.viewport, "data-flex-viewport");
  setActive(exportButtons, state.exportFormat, "data-flex-export");
  applyLayoutPreset(state.layout);
  update();
};

setupFlexboxPro();
