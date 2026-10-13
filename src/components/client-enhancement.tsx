"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createEnhancementScope } from "../lib/enhancement-scope";
import {
  initializeEnhancement,
  type EnhancementProps,
} from "../scripts/enhancements";

const scopes = new Map<string, { users: number; dispose: () => void }>();

export default function ClientEnhancement(props: EnhancementProps) {
  const pathname = usePathname();
  const serialized = JSON.stringify(props);
  useEffect(() => {
    const key = `${pathname}:${serialized}`;
    let shared = scopes.get(key);
    if (!shared) {
      const scope = createEnhancementScope();
      initializeEnhancement(JSON.parse(serialized) as EnhancementProps, scope);
      shared = { users: 0, dispose: () => scope.dispose() };
      scopes.set(key, shared);
    }
    shared.users++;
    return () => {
      if (--shared.users === 0) {
        shared.dispose();
        scopes.delete(key);
      }
    };
  }, [pathname, serialized]);
  return null;
}
