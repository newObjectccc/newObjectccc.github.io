import assert from "node:assert/strict";
import test from "node:test";
import { createRenderer } from "vue";
import { useProjectPreview } from "../src/portfolio/useProjectPreview.js";

// Exercise the composable with Vue's real lifecycle and a clock-controlled host.
// No browser, network request, or new test dependency is needed.
function fixture(t) {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 1000 });
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const win = Object.assign(new EventTarget(), {
    innerWidth: 1440,
    innerHeight: 1000,
    scrollY: 0,
    matchMedia: () => ({ matches: true }),
    closest: () => null,
  });
  const doc = Object.assign(new EventTarget(), {
    hidden: false,
    activeElement: null,
  });
  globalThis.window = win;
  globalThis.document = doc;
  const renderer = createRenderer({
    createComment: () => ({}),
    insert() {},
    remove() {},
    parentNode: () => null,
    nextSibling: () => null,
  });
  let api;
  const app = renderer.createApp({
    setup() {
      api = useProjectPreview();
      return () => null;
    },
  });
  app.mount({});
  t.after(() => {
    app.unmount();
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  });
  const cover = {
    isConnected: true,
    matches: () => true,
    closest: () => ({ querySelector: () => cover }),
    getBoundingClientRect: () => ({ left: 50, right: 700, top: 150 }),
    scrollIntoView() {},
    focus() {},
  };
  const event = {
    currentTarget: cover,
    pointerType: "mouse",
    detail: 1,
    relatedTarget: null,
  };
  const project = (id) => ({
    id,
    preview: { theme: { paper: "#fff", ink: "#000", accent: "#c43" } },
  });
  return {
    api,
    event,
    project,
    win,
    doc,
    tick: (ms) => t.mock.timers.tick(ms),
  };
}

test("a brief pass cancels; a loaded preview reopens quickly with the same entry", (t) => {
  const { api, event, project, tick, win } = fixture(t);
  const a = project("a");
  api.queuePreview(a, event);
  tick(419);
  assert.equal(api.previewProject.value, null);
  api.leaveProject(a, event);
  tick(1000);
  assert.equal(api.previewEntries.value.length, 0);

  api.queuePreview(a, event);
  tick(420);
  api.markPreviewReady("a");
  const entry = api.previewEntries.value[0];
  api.leaveProject(a, event);
  tick(100);
  api.keepPreview();
  tick(400);
  assert.equal(api.previewProject.value.id, "a");
  api.leavePreview();
  tick(260);
  assert.equal(api.previewProject.value, null);
  api.queuePreview(a, event);
  tick(139);
  assert.equal(api.previewProject.value, null);
  tick(1);
  assert.equal(api.previewProject.value.id, "a");
  assert.equal(api.previewReady.value, true);
  assert.equal(api.previewEntries.value[0], entry);
  win.dispatchEvent(new Event("pointerdown"));
  assert.equal(api.previewProject.value, null);
  api.queuePreview(a, event);
  tick(140);
  assert.equal(api.previewProject.value.id, "a");
});

test("LRU eviction retains entry order and ignores a late load from an evicted preview", (t) => {
  const { api, event, project, tick } = fixture(t);
  const a = project("a"),
    b = project("b"),
    c = project("c");
  api.openPreview(a, event);
  api.markPreviewReady("a");
  const retained = api.previewEntries.value[0];
  tick(1);
  api.openPreview(b, event);
  tick(1);
  api.openPreview(a, event);
  assert.deepEqual(
    api.previewEntries.value.map((entry) => entry.project.id),
    ["a", "b"],
  );
  tick(1);
  api.openPreview(c, event);
  assert.deepEqual(
    api.previewEntries.value.map((entry) => entry.project.id),
    ["a", "c"],
  );
  assert.equal(api.previewEntries.value[0], retained);
  api.markPreviewReady("b");
  assert.equal(api.previewReady.value, false);
});

test("idle previews expire after two minutes while the visible preview survives", (t) => {
  const { api, event, project, tick } = fixture(t);
  api.openPreview(project("a"), event);
  api.dismissPreview(false, false);
  tick(60000);
  api.openPreview(project("b"), event);
  tick(60000);
  assert.deepEqual(
    api.previewEntries.value.map((entry) => entry.project.id),
    ["b"],
  );
  tick(180000);
  assert.equal(api.previewProject.value.id, "b");
  api.dismissPreview(false, false);
  tick(119999);
  assert.equal(api.previewEntries.value.length, 1);
  tick(1);
  assert.equal(api.previewEntries.value.length, 0);
});

test("viewport changes and backgrounding release frames and pending hover work", (t) => {
  const { api, event, project, tick, win, doc } = fixture(t);
  api.queuePreview(project("a"), event);
  win.innerWidth = 390;
  win.dispatchEvent(new Event("resize"));
  tick(1000);
  assert.equal(api.previewEntries.value.length, 0);
  win.innerWidth = 1440;
  win.dispatchEvent(new Event("resize"));
  api.openPreview(project("b"), event);
  win.dispatchEvent(new Event("resize"));
  assert.equal(api.previewEntries.value.length, 1);
  doc.hidden = true;
  doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(api.previewEntries.value.length, 0);
  assert.equal(api.previewProject.value, null);
});
