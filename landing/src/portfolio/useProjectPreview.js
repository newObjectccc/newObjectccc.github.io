import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const CACHE_LIMIT = 2;
const CACHE_IDLE_MS = 120_000;
const FIRST_HOVER_MS = 420;
const CACHED_HOVER_MS = 140;

// Keep cached frames mounted in place: moving them through KeepAlive or a
// detached container would navigate their documents again. Only one is visible.
export function useProjectPreview() {
  const previewProject = ref(null);
  const previewEntries = ref([]);
  const previewKeyboard = ref(false);
  const previewReady = ref(false);
  let openTimer, closeTimer, expiryTimer, trigger, dismissedId, pendingId;
  let openViewport, viewport;

  const previewTheme = computed(() => {
    const theme = previewReady.value && previewProject.value?.preview.theme;
    return theme
      ? { "--paper": theme.paper, "--ink": theme.ink, "--accent": theme.accent }
      : {};
  });

  const canHover = () =>
    window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 900px)",
    ).matches;

  const cancelClose = () => clearTimeout(closeTimer);

  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    const idle = previewEntries.value.filter(
      (entry) => entry.idleSince !== null,
    );
    if (!idle.length) return;
    const expiresAt = Math.min(
      ...idle.map((entry) => entry.idleSince + CACHE_IDLE_MS),
    );
    expiryTimer = setTimeout(
      () => {
        const now = Date.now();
        previewEntries.value = previewEntries.value.filter(
          (entry) =>
            entry.idleSince === null || now - entry.idleSince < CACHE_IDLE_MS,
        );
        scheduleExpiry();
      },
      Math.max(0, expiresAt - Date.now()),
    );
  }

  function retireActive() {
    const active = previewEntries.value.find(
      (entry) => entry.project.id === previewProject.value?.id,
    );
    if (active) active.idleSince = Date.now();
  }

  function markPreviewReady(id) {
    const entry = previewEntries.value.find((entry) => entry.project.id === id);
    if (!entry) return;
    entry.ready = true;
    if (previewProject.value?.id === id) previewReady.value = true;
  }

  function keepPreview() {
    cancelClose();
    clearTimeout(openTimer);
    pendingId = null;
  }

  function show(project, element, keyboard = false) {
    if (!element.isConnected) return;
    cancelClose();
    clearTimeout(openTimer);
    pendingId = null;
    const card = element.closest(".work-card");
    const rect = card.querySelector(".cover-button").getBoundingClientRect();
    trigger = element.matches("button")
      ? element
      : card.querySelector(".preview-trigger");
    retireActive();
    const anchor = { left: rect.left, right: rect.right, top: rect.top };
    let entry = previewEntries.value.find(
      (entry) => entry.project.id === project.id,
    );
    if (!entry) {
      // Evict by last use without reordering retained DOM nodes.
      if (previewEntries.value.length >= CACHE_LIMIT) {
        const oldest = previewEntries.value.reduce((a, b) =>
          a.lastUsed <= b.lastUsed ? a : b,
        );
        previewEntries.value = previewEntries.value.filter(
          (item) => item !== oldest,
        );
      }
      entry = {
        project,
        anchor,
        ready: false,
        lastUsed: Date.now(),
        idleSince: null,
      };
      previewEntries.value.push(entry);
    } else {
      entry.anchor = anchor;
      entry.lastUsed = Date.now();
      entry.idleSince = null;
    }
    openViewport = {
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    previewKeyboard.value = keyboard;
    previewReady.value = entry.ready;
    previewProject.value = project;
    scheduleExpiry();
  }

  function queuePreview(project, event) {
    if (
      event.pointerType !== "mouse" ||
      !canHover() ||
      dismissedId === project.id
    )
      return;
    cancelClose();
    if (previewProject.value?.id === project.id) {
      clearTimeout(openTimer);
      pendingId = null;
      return;
    }
    if (pendingId === project.id) return;
    clearTimeout(openTimer);
    pendingId = project.id;
    const element = event.currentTarget;
    const warm = previewEntries.value.some(
      (entry) => entry.project.id === project.id && entry.ready,
    );
    openTimer = setTimeout(
      () => show(project, element),
      warm ? CACHED_HOVER_MS : FIRST_HOVER_MS,
    );
  }

  function openPreview(project, event) {
    if (!canHover()) return;
    dismissedId = null;
    // Finish any focus-induced smooth scroll before positioning the window.
    event.currentTarget.scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
    show(project, event.currentTarget, event.detail === 0);
  }

  function dismissPreview(restoreFocus = true, suppressHover = true) {
    clearTimeout(openTimer);
    pendingId = null;
    clearTimeout(closeTimer);
    if (suppressHover) dismissedId = previewProject.value?.id ?? dismissedId;
    const focusWasInside = document.activeElement?.closest(".project-preview");
    retireActive();
    previewProject.value = null;
    previewReady.value = false;
    if (restoreFocus && focusWasInside && trigger?.isConnected)
      trigger.focus({ preventScroll: true });
    previewKeyboard.value = false;
    scheduleExpiry();
  }

  function clearPreviewCache() {
    dismissPreview(false);
    clearTimeout(expiryTimer);
    previewEntries.value = [];
  }

  function leavePreview() {
    cancelClose();
    if (!previewKeyboard.value)
      closeTimer = setTimeout(() => dismissPreview(false, false), 260);
  }

  function leaveProject(project, event) {
    clearTimeout(openTimer);
    pendingId = null;
    if (!event.relatedTarget?.closest?.(".project-preview")) dismissedId = null;
    leavePreview();
  }

  const onKeydown = (event) => {
    if (event.key === "Escape" && previewProject.value) {
      event.preventDefault();
      dismissPreview();
    }
  };
  const onOutside = (event) => {
    if (
      !event.target.closest(".project-preview, .cover-button, .preview-trigger")
    ) {
      dismissedId = null;
      dismissPreview(false, false);
    }
  };
  const onViewportChange = (event) => {
    if (event.type === "resize") {
      if (
        viewport?.width === window.innerWidth &&
        viewport?.height === window.innerHeight
      )
        return;
      viewport = { width: window.innerWidth, height: window.innerHeight };
      clearPreviewCache();
      return;
    }
    if (previewProject.value && openViewport) {
      if (event.type === "scroll" && window.scrollY === openViewport.y) return;
    }
    dismissPreview(false);
  };
  const onVisibility = () => {
    if (document.hidden) clearPreviewCache();
  };

  onMounted(() => {
    viewport = { width: window.innerWidth, height: window.innerHeight };
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("pointerdown", onOutside);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    document.addEventListener("visibilitychange", onVisibility);
  });
  onBeforeUnmount(() => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    clearTimeout(expiryTimer);
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("pointerdown", onOutside);
    window.removeEventListener("scroll", onViewportChange);
    window.removeEventListener("resize", onViewportChange);
    document.removeEventListener("visibilitychange", onVisibility);
  });

  return {
    previewProject,
    previewEntries,
    previewKeyboard,
    previewReady,
    previewTheme,
    markPreviewReady,
    clearPreviewCache,
    queuePreview,
    openPreview,
    leaveProject,
    keepPreview,
    leavePreview,
    dismissPreview,
  };
}
