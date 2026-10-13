import type { ComponentProps } from "../lib/ui";
import { analyticsEnabled } from "../lib/analytics-config";
import AnalyticsClient from "./analytics-client";

export default async function View(_props: ComponentProps) {
  return analyticsEnabled(process.env.PUBLIC_DISABLE_ANALYTICS) ? (
    <AnalyticsClient provider="google" />
  ) : null;
}
