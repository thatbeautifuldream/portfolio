"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  constrain,
  defaultCamera,
  fitCamera,
  loadCamera,
  saveCamera,
  zoomAt,
  type Bounds,
  type Camera,
} from "./camera";
import TooltipShell from "../../components/tooltip-shell";
import "./canvas.css";

export type CanvasControlTips = Record<
  "zoomOut" | "zoomIn" | "zoomLevel" | "fit" | "reset" | "theme",
  string
>;

export default function Canvas({
  children,
  controlIcons,
  controlTips,
  embedded = false,
}: {
  children: ReactNode;
  embedded?: boolean;
  controlIcons: Record<
    "zoomOut" | "zoomIn" | "fit" | "reset" | "theme",
    ReactNode
  >;
  controlTips: CanvasControlTips;
}) {
  const shellRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLOutputElement>(null);
  const actions = useRef({
    fit: () => {},
    reset: () => {},
    zoom: (_factor: number) => {},
  });

  useEffect(() => {
    const shell = shellRef.current!;
    const world = worldRef.current!;
    let camera = defaultCamera;
    let frame = 0;
    let layoutFrame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let stabilizeTimer: ReturnType<typeof setTimeout> | undefined;
    let fitted = false;
    let initialized = false;
    let launchGroup = embedded
      ? (world.querySelector("#page-header") ?? undefined)
      : undefined;
    let disposed = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture:
      { camera: Camera; x: number; y: number; distance: number } | undefined;
    let spaceHeld = false;
    let windowPointers = false;
    const stored = embedded ? undefined : loadCamera(() => localStorage);
    if (stored) camera = stored;

    const render = () => {
      frame = 0;
      world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
      const label = `${Math.round(camera.scale * 100)}%`;
      const output = scaleRef.current;
      if (output && output.textContent !== label) output.textContent = label;
      clearTimeout(saveTimer);
      if (!embedded) {
        saveTimer = setTimeout(() => {
          saveCamera(() => localStorage, camera);
        }, 150);
      }
    };
    const update = (next: Camera, automatic = false) => {
      camera = constrain(next);
      if (!automatic) {
        fitted = false;
        launchGroup = undefined;
      }
      if (!frame) frame = requestAnimationFrame(render);
    };
    const bounds = (element?: Element): Bounds => {
      const applied = new DOMMatrixReadOnly(world.style.transform);
      const rects = (
        element
          ? [element, ...element.querySelectorAll(".canvas-group-title")]
          : [...world.querySelectorAll(".canvas-group, .canvas-group-title")]
      )
        .map((node) => node.getBoundingClientRect())
        .filter((rect) => rect.width && rect.height);
      const left = Math.min(...rects.map((rect) => rect.left));
      const top = Math.min(...rects.map((rect) => rect.top));
      return {
        x: (left - applied.e) / applied.a,
        y: (top - applied.f) / applied.a,
        width:
          (Math.max(...rects.map((rect) => rect.right)) - left) / applied.a,
        height:
          (Math.max(...rects.map((rect) => rect.bottom)) - top) / applied.a,
      };
    };
    const fit = (element?: Element, automatic = false) => {
      update(
        fitCamera(bounds(element), shell.clientWidth, shell.clientHeight),
        true,
      );
      fitted = !element;
      if (!automatic) launchGroup = undefined;
    };
    actions.current = {
      fit: () => fit(),
      reset: () => {
        if (embedded) {
          launchGroup = world.querySelector("#page-header") ?? undefined;
          fit(launchGroup, true);
        } else update(defaultCamera);
      },
      zoom: (factor) =>
        update(
          zoomAt(
            camera,
            camera.scale * factor,
            shell.clientWidth / 2,
            shell.clientHeight / 2,
          ),
        ),
    };
    const hasLayout = () => {
      if (!world.querySelector(".canvas-group")) return false;
      const layout = bounds();
      return layout.width > 0 && layout.height > 0;
    };
    const showWorld = () => {
      shell.dataset.cameraReady = "";
    };
    const applyGrid = () => {
      world.style.gridTemplateColumns = `repeat(${shell.clientWidth < 800 ? 1 : shell.clientWidth < 1100 ? 2 : 4}, 640px)`;
    };
    const initialize = () => {
      if (initialized || disposed) return;
      applyGrid();
      if (!hasLayout()) return;
      if (embedded && launchGroup) {
        update(
          fitCamera(bounds(launchGroup), shell.clientWidth, shell.clientHeight),
          true,
        );
        launchGroup = undefined;
      } else if (!stored) {
        update(
          fitCamera(bounds(), shell.clientWidth, shell.clientHeight),
          true,
        );
      } else render();
      initialized = true;
      fitted = false;
      showWorld();
    };
    const scheduleInitialize = () => {
      if (initialized || disposed) return;
      clearTimeout(stabilizeTimer);
      stabilizeTimer = setTimeout(() => {
        void document.fonts.ready.then(() => {
          if (initialized || disposed) return;
          requestAnimationFrame(() => {
            if (initialized || disposed) return;
            requestAnimationFrame(() => initialize());
          });
        });
      }, 48);
    };
    if (stored) render();
    scheduleInitialize();
    const initFallback = window.setTimeout(() => {
      if (!initialized && !disposed) void document.fonts.ready.then(initialize);
    }, 2500);

    const settle = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        if (!initialized) {
          initialize();
          return;
        }
        if (fitted) fit();
      });
    };
    const resize = () => {
      applyGrid();
      if (!initialized) scheduleInitialize();
      else if (fitted) settle();
    };
    const observer = new ResizeObserver(() => {
      if (!initialized) scheduleInitialize();
      else if (fitted) settle();
    });
    observer.observe(world);

    const blocksChrome = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".canvas-controls"));
    const blocksPreview = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest("[data-preview]"));
    const allowsPan = (event: PointerEvent) => {
      if (blocksChrome(event.target)) return false;
      if (event.button === 1) return true;
      if (event.button !== 0) return false;
      if (spaceHeld) return true;
      if (blocksPreview(event.target)) return false;
      if (event.pointerType === "touch") {
        return (
          event.target instanceof Element &&
          event.target.classList.contains("canvas-background")
        );
      }
      return true;
    };
    const syncWindowPointers = (active: boolean) => {
      if (active === windowPointers) return;
      windowPointers = active;
      if (active) {
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerEnd);
        window.addEventListener("pointercancel", pointerEnd);
      } else {
        window.removeEventListener("pointermove", pointerMove);
        window.removeEventListener("pointerup", pointerEnd);
        window.removeEventListener("pointercancel", pointerEnd);
      }
    };
    const wheel = (event: WheelEvent) => {
      if (blocksChrome(event.target) || blocksPreview(event.target)) return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? shell.clientHeight
            : 1;
      if (event.ctrlKey || event.metaKey)
        update(
          zoomAt(
            camera,
            camera.scale * Math.exp(-event.deltaY * unit * 0.01),
            event.clientX,
            event.clientY,
          ),
        );
      else
        update({
          ...camera,
          x: camera.x - event.deltaX * unit,
          y: camera.y - event.deltaY * unit,
        });
    };
    const rebase = () => {
      const points = [...pointers.values()];
      const first = points[0];
      const second = points[1];
      gesture = first
        ? {
            camera,
            x: second ? (first.x + second.x) / 2 : first.x,
            y: second ? (first.y + second.y) / 2 : first.y,
            distance: second
              ? Math.hypot(second.x - first.x, second.y - first.y)
              : 0,
          }
        : undefined;
    };
    const pointerDown = (event: PointerEvent) => {
      if (pointers.size >= 2) return;
      if (pointers.size === 0) {
        if (!allowsPan(event)) return;
      } else if (event.pointerType !== "touch") return;
      event.preventDefault();
      if (event.button === 1) event.stopPropagation();
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      try {
        shell.setPointerCapture(event.pointerId);
      } catch {}
      rebase();
      syncWindowPointers(true);
      shell.dataset.panning = "true";
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      event.preventDefault();
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...pointers.values()];
      const first = points[0]!;
      const second = points[1];
      const center = {
        x: second ? (first.x + second.x) / 2 : first.x,
        y: second ? (first.y + second.y) / 2 : first.y,
      };
      const distance = second
        ? Math.hypot(second.x - first.x, second.y - first.y)
        : 0;
      const next =
        gesture.distance > 0
          ? zoomAt(
              gesture.camera,
              (gesture.camera.scale * distance) / gesture.distance,
              gesture.x,
              gesture.y,
            )
          : gesture.camera;
      update({
        ...next,
        x: next.x + center.x - gesture.x,
        y: next.y + center.y - gesture.y,
      });
    };
    const pointerEnd = (event: PointerEvent) => {
      if (!pointers.delete(event.pointerId)) return;
      try {
        if (shell.hasPointerCapture(event.pointerId))
          shell.releasePointerCapture(event.pointerId);
      } catch {}
      rebase();
      if (!pointers.size) {
        delete shell.dataset.panning;
        syncWindowPointers(false);
      }
    };
    const cancel = () => {
      const captured = [...pointers.keys()];
      pointers.clear();
      gesture = undefined;
      for (const pointer of captured) {
        try {
          if (shell.hasPointerCapture(pointer))
            shell.releasePointerCapture(pointer);
        } catch {}
      }
      delete shell.dataset.panning;
      syncWindowPointers(false);
    };
    const visibility = () => {
      if (document.hidden) cancel();
    };
    const spaceDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']"))
      )
        return;
      spaceHeld = true;
      shell.dataset.spacePan = "true";
      if (target !== shell) event.preventDefault();
    };
    const spaceUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      spaceHeld = false;
      delete shell.dataset.spacePan;
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.target !== shell) return;
      const step = event.shiftKey ? 160 : 64;
      const movements: Record<string, [number, number]> = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      if (movements[event.key]) {
        event.preventDefault();
        const [horizontal, vertical] = movements[event.key]!;
        update({ ...camera, x: camera.x + horizontal, y: camera.y + vertical });
      } else if (["+", "=", "-", "0", "f", "Escape"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "f") fit();
        else if (event.key === "0") actions.current.reset();
        else if (event.key === "Escape") cancel();
        else actions.current.zoom(event.key === "-" ? 1 / 1.2 : 1.2);
      }
    };
    const navigation = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      const href = link.getAttribute("href")!;
      if (href.startsWith("#")) {
        const group = [...world.querySelectorAll("[id]")].find(
          (node) => `#${node.id}` === href,
        );
        if (group) fit(group);
      }
    };
    const groupNavigation = (event: Event) => {
      const group = [...world.querySelectorAll(".canvas-group")].find(
        (node) => node.id === (event as CustomEvent).detail,
      );
      if (group) fit(group);
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element) || !world.contains(event.target))
        return;
      const rect = event.target.getBoundingClientRect();
      const horizontal =
        rect.left < 24
          ? 24 - rect.left
          : rect.right > shell.clientWidth - 24
            ? shell.clientWidth - 24 - rect.right
            : 0;
      const vertical =
        rect.top < 72
          ? 72 - rect.top
          : rect.bottom > shell.clientHeight - 24
            ? shell.clientHeight - 24 - rect.bottom
            : 0;
      if (horizontal || vertical)
        update({ ...camera, x: camera.x + horizontal, y: camera.y + vertical });
      shell.scrollTop = 0;
      shell.scrollLeft = 0;
    };
    shell.addEventListener("wheel", wheel, { passive: false });
    const blockMiddleClick = (event: MouseEvent) => {
      if (event.button === 1) event.preventDefault();
    };
    shell.addEventListener("pointerdown", pointerDown);
    shell.addEventListener("pointermove", pointerMove);
    shell.addEventListener("pointerup", pointerEnd);
    shell.addEventListener("pointercancel", pointerEnd);
    shell.addEventListener("auxclick", blockMiddleClick);
    shell.addEventListener("keydown", keyboard);
    window.addEventListener("keydown", spaceDown);
    window.addEventListener("keyup", spaceUp);
    document.addEventListener("click", navigation, true);
    document.addEventListener("auxclick", navigation, true);
    window.addEventListener("canvas-group-navigation", groupNavigation);
    shell.addEventListener("focusin", focus);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancel();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(layoutFrame);
      clearTimeout(saveTimer);
      clearTimeout(stabilizeTimer);
      clearTimeout(initFallback);
      observer.disconnect();
      shell.removeEventListener("wheel", wheel);
      shell.removeEventListener("pointerdown", pointerDown);
      shell.removeEventListener("pointermove", pointerMove);
      shell.removeEventListener("pointerup", pointerEnd);
      shell.removeEventListener("pointercancel", pointerEnd);
      shell.removeEventListener("auxclick", blockMiddleClick);
      shell.removeEventListener("keydown", keyboard);
      window.removeEventListener("keydown", spaceDown);
      window.removeEventListener("keyup", spaceUp);
      syncWindowPointers(false);
      shell.removeEventListener("focusin", focus);
      document.removeEventListener("click", navigation, true);
      document.removeEventListener("auxclick", navigation, true);
      window.removeEventListener("canvas-group-navigation", groupNavigation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [embedded]);

  return (
    <main
      ref={shellRef}
      className="canvas-shell"
      data-embedded={embedded || undefined}
      tabIndex={0}
      aria-label="Canvas"
    >
      <div className="canvas-background" aria-hidden="true" />
      <div ref={worldRef} className="canvas-world">
        {children}
      </div>
      <TooltipShell
        className="canvas-controls"
        data-tip-placement="below"
        data-tip-fit="content"
        role="toolbar"
        aria-label="Canvas controls"
      >
        <button
          type="button"
          aria-label={controlTips.zoomOut}
          data-tip={controlTips.zoomOut}
          onClick={() => actions.current.zoom(1 / 1.2)}
        >
          {controlIcons.zoomOut}
        </button>
        <output
          ref={scaleRef}
          aria-label={controlTips.zoomLevel}
          data-tip={controlTips.zoomLevel}
        >
          100%
        </output>
        <button
          type="button"
          aria-label={controlTips.zoomIn}
          data-tip={controlTips.zoomIn}
          onClick={() => actions.current.zoom(1.2)}
        >
          {controlIcons.zoomIn}
        </button>
        <button
          type="button"
          aria-label={controlTips.fit}
          data-tip={controlTips.fit}
          onClick={() => actions.current.fit()}
        >
          {controlIcons.fit}
        </button>
        <button
          type="button"
          aria-label={controlTips.reset}
          data-tip={controlTips.reset}
          onClick={() => actions.current.reset()}
        >
          {controlIcons.reset}
        </button>
        <button
          type="button"
          aria-label={controlTips.theme}
          data-tip={controlTips.theme}
          id="theme-toggle"
        >
          {controlIcons.theme}
        </button>
      </TooltipShell>
    </main>
  );
}
