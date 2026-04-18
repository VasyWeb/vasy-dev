const toToken = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unknown";

const getPathToken = (pathname = window.location.pathname) => {
  if (pathname === "/") {
    return "home";
  }

  return toToken(
    pathname
      .replace(/^\/|\/$/g, "")
      .replace(/index\.html$/i, "")
      .replace(/\.html$/i, "")
      .replace(/\//g, "_")
  );
};

const getToolNameFromPath = (pathname = window.location.pathname) => {
  const generatorMatch = pathname.match(/^\/tools\/generators\/([^/]+)\/$/i);
  const converterMatch = pathname.match(/^\/tools\/converters\/([^/]+\.html)$/i);
  const proMatch = pathname.match(/^\/tools\/pro\/([^/]+)\/$/i);

  if (generatorMatch) {
    return toToken(generatorMatch[1]);
  }

  if (converterMatch) {
    return toToken(converterMatch[1].replace(/\.html$/i, ""));
  }

  if (proMatch) {
    return toToken(proMatch[1]);
  }

  if (!pathname.includes("/tools/")) {
    return "";
  }

  return "";
};

const getElementValue = (element) => {
  if (!element) {
    return "";
  }

  if (element.type === "checkbox") {
    return element.checked ? "checked" : "unchecked";
  }

  return element.value ?? "";
};

const throttle = (callback, wait = 700) => {
  let timeoutId = null;
  let lastArgs = null;

  return (...args) => {
    lastArgs = args;

    if (timeoutId) {
      return;
    }

    timeoutId = window.setTimeout(() => {
      callback(...lastArgs);
      timeoutId = null;
      lastArgs = null;
    }, wait);
  };
};

const isExternalUrl = (href) => {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const getLinkText = (element) =>
  element?.getAttribute("data-analytics-label") ||
  element?.getAttribute("aria-label") ||
  element?.textContent?.trim() ||
  element?.getAttribute("title") ||
  "unknown";

const shouldTrackCTA = (element) => {
  if (!element) {
    return false;
  }

  if (element.closest(".site-nav")) {
    return false;
  }

  if (
    element.closest(
      ".shadow-generator, .radius-generator, .gradient-generator, .palette-generator, .neumorphism-generator"
    )
  ) {
    return false;
  }

  const id = element.id?.toLowerCase() || "";
  if (id.startsWith("copy") || id.startsWith("reset")) {
    return false;
  }

  if (element.matches("[data-cta]")) {
    return true;
  }

  return element.classList.contains("button");
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    page_name: getPathToken(),
    ...params
  });
};

export const trackToolView = (toolName) =>
  trackEvent("tool_view", {
    tool_name: toToken(toolName)
  });

export const trackToolInteraction = (toolName, controlName, value) =>
  trackEvent("tool_interaction", {
    tool_name: toToken(toolName),
    control_name: toToken(controlName),
    value: typeof value === "number" ? value : String(value)
  });

export const trackCopyCSS = (toolName, buttonName = "copy_css") =>
  trackEvent("copy_css", {
    tool_name: toToken(toolName),
    button_name: toToken(buttonName)
  });

export const trackReset = (toolName) =>
  trackEvent("reset_tool", {
    tool_name: toToken(toolName),
    button_name: "reset"
  });

export const trackPreset = (toolName, presetName) =>
  trackEvent("preset_selected", {
    tool_name: toToken(toolName),
    preset_name: toToken(presetName)
  });

export const trackLanguageSwitch = (language) =>
  trackEvent("language_switch", {
    language: toToken(language)
  });

export const trackNavClick = (label) =>
  trackEvent("nav_click", {
    button_name: toToken(label)
  });

export const trackCTAClick = (label, destinationUrl) =>
  trackEvent("cta_click", {
    button_name: toToken(label),
    destination_url: destinationUrl || ""
  });

export const trackExternalLinkClick = (label, destinationUrl) =>
  trackEvent("external_link_click", {
    button_name: toToken(label),
    destination_url: destinationUrl || ""
  });

export const trackScrollDepth = (percentage) =>
  trackEvent("scroll_depth", {
    value: percentage
  });

export const trackTimeOnPage = (seconds, pageName) =>
  trackEvent("time_on_page", {
    page_name: toToken(pageName),
    value: seconds
  });

export const setupToolTracking = ({
  toolName,
  controls = [],
  copyButton = null,
  copyButtonName = "copy_css",
  resetButton = null,
  presetButtons = []
}) => {
  if (!toolName) {
    return;
  }

  controls.forEach(
    ({
      element,
      controlName,
      getValue,
      events = ["input", "change"],
      throttleMs = 700
    }) => {
      if (!element) {
        return;
      }

      const handler = throttle(() => {
        const nextValue =
          typeof getValue === "function" ? getValue() : getElementValue(element);
        trackToolInteraction(toolName, controlName, nextValue);
      }, throttleMs);

      [...new Set(events)].forEach((eventName) =>
        element.addEventListener(eventName, handler)
      );
    }
  );

  if (copyButton) {
    copyButton.addEventListener("click", () =>
      trackCopyCSS(toolName, copyButtonName)
    );
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => trackReset(toolName));
  }

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName =
        button.getAttribute("data-analytics-preset") ||
        button.getAttribute("data-neuro-preset") ||
        getLinkText(button);
      trackPreset(toolName, presetName);
    });
  });
};

const setupToolViewTracking = () => {
  const toolName = getToolNameFromPath();
  if (toolName) {
    trackToolView(toolName);
  }
};

const setupLinkTracking = () => {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    const button = event.target.closest("button");

    if (link) {
      const href = link.href;
      const label = getLinkText(link);

      if (link.classList.contains("site-nav__lang-link")) {
        const language =
          link.getAttribute("lang") ||
          link.getAttribute("hreflang") ||
          link.getAttribute("title") ||
          label;
        trackLanguageSwitch(language);
        return;
      }

      if (link.classList.contains("site-nav__link")) {
        trackNavClick(label);
      }

      if (isExternalUrl(href)) {
        trackExternalLinkClick(label, href);
        return;
      }

      if (shouldTrackCTA(link)) {
        trackCTAClick(label, href);
      }

      return;
    }

    if (button && shouldTrackCTA(button)) {
      trackCTAClick(getLinkText(button), button.dataset.destinationUrl || "");
    }
  });
};

const setupScrollDepthTracking = () => {
  const sentDepths = new Set();
  const checkpoints = [25, 50, 75, 100];
  let hasScrolled = false;

  const onScroll = throttle(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      return;
    }

    if (scrollTop > 0) {
      hasScrolled = true;
    }

    if (!hasScrolled) {
      return;
    }

    const percentage = Math.min(
      100,
      Math.round((scrollTop / scrollableHeight) * 100)
    );

    checkpoints.forEach((checkpoint) => {
      if (percentage >= checkpoint && !sentDepths.has(checkpoint)) {
        sentDepths.add(checkpoint);
        trackScrollDepth(checkpoint);
      }
    });
  }, 300);

  window.addEventListener("scroll", onScroll, { passive: true });
};

const setupTimeOnPageTracking = () => {
  const sentMarks = new Set();
  const checkpoints = [15, 30, 60];
  const pageName = getPathToken();
  const timeouts = checkpoints.map((seconds) =>
    window.setTimeout(() => {
      if (sentMarks.has(seconds)) {
        return;
      }

      sentMarks.add(seconds);
      trackTimeOnPage(seconds, pageName);
    }, seconds * 1000)
  );

  window.addEventListener(
    "pagehide",
    () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    { once: true }
  );
};

export const setupAnalytics = () => {
  setupToolViewTracking();
  setupLinkTracking();
  setupScrollDepthTracking();
  setupTimeOnPageTracking();
};
