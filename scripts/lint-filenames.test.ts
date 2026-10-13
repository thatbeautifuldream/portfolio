import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { isKebabCaseFilename, lintFilenames } from "./lint-filenames.ts";

test("accepts kebab-case, dotfiles, compound extensions, and AGENTS.md", () => {
  for (const file of [
    "src/components/git-hub-chart.tsx",
    "scripts/lint-filenames.test.ts",
    "next-env.d.ts",
    ".env.example",
    ".gitignore",
    ".prettierrc.mjs",
    "readme.md",
    "1936aba715ddbe98.woff2",
    "src/app/(en)/blog/[slug]/page.tsx",
    "AGENTS.md",
    "src/AGENTS.md",
  ]) {
    assert.equal(isKebabCaseFilename(file), true, file);
  }
});

test("rejects uppercase, underscores, spaces, and malformed separators", () => {
  const files = [
    "AboutHeadline.tsx",
    "README.md",
    "some_file.ts",
    "some file.ts",
    "gist-.mdx",
    "-gist.mdx",
    "some--file.ts",
    "some..file.ts",
    "icon.PNG",
    "[slug].tsx",
  ];
  assert.deepEqual(lintFilenames(files), files.toSorted());
});

test("CLI checks tracked and untracked files but ignores generated output", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "filename-lint-"));
  const script = fileURLToPath(new URL("./lint-filenames.ts", import.meta.url));
  try {
    execFileSync("git", ["init", "--quiet", directory]);
    writeFileSync(path.join(directory, ".gitignore"), "IgnoredOutput.ts\n");
    writeFileSync(path.join(directory, "valid-file.ts"), "");
    execFileSync("git", ["-C", directory, "add", "."]);
    writeFileSync(path.join(directory, "BadFile.ts"), "");
    writeFileSync(path.join(directory, "IgnoredOutput.ts"), "");
    const run = (...files: string[]) =>
      spawnSync(
        process.execPath,
        ["--experimental-strip-types", script, ...files],
        {
          cwd: directory,
          encoding: "utf8",
        },
      );
    const invalid = run();
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /BadFile\.ts/);
    assert.doesNotMatch(invalid.stderr, /IgnoredOutput\.ts/);
    assert.equal(run("valid-file.ts").status, 0);
    assert.equal(run("BadFile.ts").status, 1);
    execFileSync("git", ["-C", directory, "add", "BadFile.ts"]);
    assert.equal(run().status, 1);
    rmSync(path.join(directory, "BadFile.ts"));
    assert.equal(run().status, 0);
    renameSync(
      path.join(directory, "valid-file.ts"),
      path.join(directory, "Valid-File.ts"),
    );
    const caseOnlyRename = run();
    assert.equal(caseOnlyRename.status, 1);
    assert.match(caseOnlyRename.stderr, /Valid-File\.ts/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
