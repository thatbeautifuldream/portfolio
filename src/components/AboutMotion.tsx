"use client";
import { useEffect } from "react";
export default function AboutMotion() {
  useEffect(() => {
    void import("../scripts/about-motion");
  }, []);
  return null;
}
