"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
import "./canvas.css";

export default function Canvas({
  children,
  controlIcons,
  embedded = false,
}: {
  children: ReactNode;
  embedded?: boolean;
  controlIcons: Record<
    "zoomOut" | "zoomIn" | "fit" | "reset" | "theme",
    ReactNode
  >;
}) {
  const shellRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const actions = useRef({
    fit: () => {},
    reset: () => {},
    zoom: (_factor: number) => {},
  });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const shell = shellRef.current!;
    const world = worldRef.current!;
    let camera = defaultCamera;
    let frame = 0;
    let layoutFrame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let fitted = true;
    let launchGroup = embedded
      ? (world.querySelector("#page-header") ?? undefined)
      : undefined;
    let disposed = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture:
      { camera: Camera; x: number; y: number; distance: number } | undefined;
    const stored = embedded ? undefined : loadCamera(() => localStorage);
    if (stored) {
      camera = stored;
      fitted = false;
    }

    const render = () => {
      frame = 0;
      world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
      setScale(camera.scale);
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
    render();

    const settle = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        if (launchGroup) fit(launchGroup, true);
        else if (fitted) fit();
      });
    };
    const resize = () => {
      world.style.gridTemplateColumns = `repeat(${shell.clientWidth < 800 ? 1 : shell.clientWidth < 1100 ? 2 : 4}, 640px)`;
      settle();
    };
    const observer = new ResizeObserver(settle);
    observer.observe(world);
    resize();
    void document.fonts.ready.then(() => {
      if (!disposed) settle();
    });

    const isEmpty = (target: EventTarget | null) =>
      target instanceof Element &&
      !target.closest("[data-preview], .canvas-controls");
    const wheel = (event: WheelEvent) => {
      if (!isEmpty(event.target)) return;
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
      if (!isEmpty(event.target) || event.button !== 0 || pointers.size >= 2)
        return;
      if (
        event.pointerType === "touch" &&
        !(
          event.target instanceof Element &&
          event.target.classList.contains("canvas-background")
        )
      )
        return;
      event.preventDefault();
      shell.focus({ preventScroll: true });
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      shell.setPointerCapture(event.pointerId);
      rebase();
      shell.dataset.panning = "true";
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId) || !gesture) return;
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
      if (shell.hasPointerCapture(event.pointerId))
        shell.releasePointerCapture(event.pointerId);
      rebase();
      if (!pointers.size) delete shell.dataset.panning;
    };
    const cancel = () => {
      const captured = [...pointers.keys()];
      pointers.clear();
      gesture = undefined;
      for (const pointer of captured)
        if (shell.hasPointerCapture(pointer))
          shell.releasePointerCapture(pointer);
      delete shell.dataset.panning;
    };
    const visibility = () => {
      if (document.hidden) cancel();
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
    shell.addEventListener("pointerdown", pointerDown);
    shell.addEventListener("pointermove", pointerMove);
    shell.addEventListener("pointerup", pointerEnd);
    shell.addEventListener("pointercancel", pointerEnd);
    shell.addEventListener("lostpointercapture", pointerEnd);
    shell.addEventListener("keydown", keyboard);
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
      observer.disconnect();
      shell.removeEventListener("wheel", wheel);
      shell.removeEventListener("pointerdown", pointerDown);
      shell.removeEventListener("pointermove", pointerMove);
      shell.removeEventListener("pointerup", pointerEnd);
      shell.removeEventListener("pointercancel", pointerEnd);
      shell.removeEventListener("lostpointercapture", pointerEnd);
      shell.removeEventListener("keydown", keyboard);
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
      className="studio"
      data-embedded={embedded || undefined}
      tabIndex={0}
      aria-label="Studio"
      title="Pan empty space; Control/Command + wheel to zoom. Focus the canvas for arrows, +/−, F to fit, 0 to reset. Preview links stay in the canvas."
    >
      <div className="canvas-background" aria-hidden="true" />
      <div ref={worldRef} className="canvas-world">
        {children}
      </div>
      <div
        className="canvas-controls"
        role="toolbar"
        aria-label="Canvas controls"
      >
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => actions.current.zoom(1 / 1.2)}
        >
          {controlIcons.zoomOut}
        </button>
        <output aria-label="Zoom level">{Math.round(scale * 100)}%</output>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => actions.current.zoom(1.2)}
        >
          {controlIcons.zoomIn}
        </button>
        <button
          type="button"
          aria-label="Fit all components"
          onClick={() => actions.current.fit()}
        >
          {controlIcons.fit}
        </button>
        <button
          type="button"
          aria-label="Reset camera"
          onClick={() => actions.current.reset()}
        >
          {controlIcons.reset}
        </button>
        <button type="button" aria-label="Toggle color theme" id="theme-toggle">
          {controlIcons.theme}
        </button>
      </div>
    </main>
  );
}
