export function analyticsEnabled(value: string | undefined) {
  return value !== "true";
}

export function posthogEnabled(
  disabled: string | undefined,
  token: string | undefined,
) {
  return analyticsEnabled(disabled) && Boolean(token?.trim());
}
