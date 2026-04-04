"use client";

import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";

type StreamdownWrapperProps = {
  content: string;
};

export function StreamdownWrapper({ content }: StreamdownWrapperProps) {
  return <Streamdown plugins={{ code, mermaid }}>{content}</Streamdown>;
}
