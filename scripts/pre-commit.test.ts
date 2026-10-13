import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("../", import.meta.url));

async function runHook(context: TestContext, failedCommand = "") {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-pre-commit-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const log = path.join(directory, "commands.txt");
  await writeFile(
    path.join(directory, "pnpm"),
    '#!/bin/sh\nprintf "%s\\n" "$*" >> "$PNPM_LOG"\nif [ "$*" = "$PNPM_FAIL_COMMAND" ]; then exit 1; fi\n',
    { mode: 0o755 },
  );
  const result = spawnSync("sh", [path.join(root, ".husky/pre-commit")], {
    cwd: directory,
    env: {
      ...process.env,
      PATH: `${directory}${path.delimiter}${process.env.PATH ?? ""}`,
      PNPM_LOG: log,
      PNPM_FAIL_COMMAND: failedCommand,
    },
    encoding: "utf8",
  });
  assert.ifError(result.error);
  return {
    status: result.status,
    commands: (await readFile(log, "utf8")).trim().split("\n"),
  };
}

test("pre-commit formats staged files before running the full CI gate", async (context) => {
  const result = await runHook(context);
  assert.equal(result.status, 0);
  assert.deepEqual(result.commands, ["lint-staged", "verify:ci"]);
});

test("pre-commit blocks commits on either staged-file or full CI failure", async (context) => {
  const staged = await runHook(context, "lint-staged");
  assert.equal(staged.status, 1);
  assert.deepEqual(staged.commands, ["lint-staged"]);
  const verification = await runHook(context, "verify:ci");
  assert.equal(verification.status, 1);
  assert.deepEqual(verification.commands, ["lint-staged", "verify:ci"]);
});

test("Husky and GitHub Actions use the same complete verification command", async () => {
  const manifest = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  );
  const workflow = parse(
    await readFile(path.join(root, ".github/workflows/verify.yml"), "utf8"),
  );
  const commands = workflow.jobs.verify.steps
    .filter((step: { run?: string }) => step.run)
    .map((step: { run: string }) => step.run);
  assert.deepEqual(commands, [
    "pnpm install --frozen-lockfile",
    "pnpm verify:ci",
  ]);
  assert.deepEqual(manifest.scripts["verify:ci"].split(" && "), [
    "pnpm audit",
    "pnpm verify",
    "pnpm test:filenames",
    "pnpm test:hooks",
    "pnpm test:libraries",
    "pnpm test:content",
    "pnpm test:i18n",
    "pnpm test:migration",
    "pnpm test:pwa",
  ]);
});
