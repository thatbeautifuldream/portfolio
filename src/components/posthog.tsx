import type { ComponentProps } from "../lib/ui";
import { posthogEnabled } from "../lib/analytics-config";
import AnalyticsClient from "./analytics-client";

export default async function View(_props: ComponentProps) {
  const token = process.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  return posthogEnabled(process.env.PUBLIC_DISABLE_ANALYTICS, token) ? (
    <AnalyticsClient
      provider="posthog"
      token={token!}
      host={process.env.PUBLIC_POSTHOG_HOST}
    />
  ) : null;
}
