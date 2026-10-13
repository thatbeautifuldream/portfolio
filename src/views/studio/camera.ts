export type Camera = { x: number; y: number; scale: number };
export type Bounds = { x: number; y: number; width: number; height: number };
export const storageKey = "portfolio:studio:camera";
export const legacyStorageKey = "portfolio:component-canvas:camera";
export const defaultCamera: Camera = { x: 0, y: 0, scale: 1 };

export function constrain(camera: Camera): Camera {
  const clamp = (
    value: number,
    minimum: number,
    maximum: number,
    fallback: number,
  ) =>
    Number.isFinite(value)
      ? Math.max(minimum, Math.min(maximum, value))
      : fallback;
  return {
    x: clamp(camera.x, -100000, 100000, 0),
    y: clamp(camera.y, -100000, 100000, 0),
    scale: clamp(camera.scale, 0.01, 3, 1),
  };
}

export function zoomAt(
  camera: Camera,
  scale: number,
  anchorX: number,
  anchorY: number,
): Camera {
  const nextScale = constrain({ ...camera, scale }).scale;
  const ratio = nextScale / camera.scale;
  return constrain({
    x: anchorX - (anchorX - camera.x) * ratio,
    y: anchorY - (anchorY - camera.y) * ratio,
    scale: nextScale,
  });
}

export function fitCamera(
  bounds: Bounds,
  width: number,
  height: number,
): Camera {
  const scale = constrain({
    ...defaultCamera,
    scale: Math.min(
      (width - 64) / Math.max(bounds.width, 1),
      (height - 112) / Math.max(bounds.height, 1),
      1,
    ),
  }).scale;
  return constrain({
    x: (width - bounds.width * scale) / 2 - bounds.x * scale,
    y: (height - bounds.height * scale) / 2 - bounds.y * scale + 24,
    scale,
  });
}

export function readCamera(raw: string | null): Camera | undefined {
  if (!raw || raw.length > 1024) return;
  try {
    const data = JSON.parse(raw);
    const camera =
      data.version === 2 ? data.camera : data.version === 1 ? data : undefined;
    if (
      !camera ||
      ![camera.x, camera.y, camera.scale].every(
        (value) => typeof value === "number" && Number.isFinite(value),
      )
    )
      return;
    return constrain(camera);
  } catch {
    return;
  }
}

type CameraStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadCamera(
  getStorage: () => CameraStorage,
): Camera | undefined {
  try {
    const storage = getStorage();
    const raw = storage.getItem(storageKey);
    const camera = readCamera(raw ?? storage.getItem(legacyStorageKey));
    if (!camera) storage.removeItem(storageKey);
    try {
      storage.removeItem(legacyStorageKey);
    } catch {}
    return camera;
  } catch {
    return;
  }
}

export function saveCamera(
  getStorage: () => CameraStorage,
  camera: Camera,
): boolean {
  try {
    getStorage().setItem(
      storageKey,
      JSON.stringify({ version: 2, camera: constrain(camera) }),
    );
    return true;
  } catch {
    return false;
  }
}
