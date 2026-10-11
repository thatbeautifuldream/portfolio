import { cp, rm } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await cp("out", "dist", { recursive: true });
