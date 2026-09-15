import { computed, onBeforeUnmount, onMounted, ref } from "vue";

// A single preview owns the frame. Crossing from its card to the floating
// window gets a short grace period; scrolling always dismisses it.
export function useProjectPreview() {
  const previewProject = ref(null);
  const previewAnchor = ref(null);
  const previewKeyboard = ref(false);
  const previewReady = ref(false);
  let openTimer, closeTimer, trigger, dismissedId, pendingId;
  let openViewport;

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
    previewAnchor.value = { left: rect.left, right: rect.right, top: rect.top };
    openViewport = {
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    previewKeyboard.value = keyboard;
    if (previewProject.value?.id !== project.id) previewReady.value = false;
    previewProject.value = project;
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
    openTimer = setTimeout(() => show(project, element), 420);
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

  function dismissPreview(restoreFocus = true) {
    clearTimeout(openTimer);
    pendingId = null;
    clearTimeout(closeTimer);
    dismissedId = previewProject.value?.id ?? dismissedId;
    const focusWasInside = document.activeElement?.closest(".project-preview");
    previewProject.value = null;
    previewReady.value = false;
    if (restoreFocus && focusWasInside && trigger?.isConnected)
      trigger.focus({ preventScroll: true });
    previewKeyboard.value = false;
  }

  function leavePreview() {
    if (!previewKeyboard.value)
      closeTimer = setTimeout(() => dismissPreview(false), 260);
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
    if (!event.target.closest(".project-preview, .work-card"))
      dismissPreview(false);
  };
  const onViewportChange = (event) => {
    if (previewProject.value && openViewport) {
      if (event.type === "scroll" && window.scrollY === openViewport.y) return;
      if (
        event.type === "resize" &&
        window.innerWidth === openViewport.width &&
        window.innerHeight === openViewport.height
      )
        return;
    }
    dismissPreview(false);
  };
  const onVisibility = () => {
    if (document.hidden) dismissPreview(false);
  };

  onMounted(() => {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("pointerdown", onOutside);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);
    document.addEventListener("visibilitychange", onVisibility);
  });
  onBeforeUnmount(() => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("pointerdown", onOutside);
    window.removeEventListener("scroll", onViewportChange);
    window.removeEventListener("resize", onViewportChange);
    document.removeEventListener("visibilitychange", onVisibility);
  });

  return {
    previewProject,
    previewAnchor,
    previewKeyboard,
    previewReady,
    previewTheme,
    queuePreview,
    openPreview,
    leaveProject,
    keepPreview,
    leavePreview,
    dismissPreview,
  };
}
