import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function isKebabCaseFilename(file: string): boolean {
  const filename = path.basename(file);
  return (
    filename === "AGENTS.md" ||
    /^\.?[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
      filename,
    )
  );
}

export function lintFilenames(files: string[]): string[] {
  return files.filter((file) => !isKebabCaseFilename(file)).sort();
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const suppliedFiles = process.argv.slice(2);
  const files = suppliedFiles.length
    ? suppliedFiles
    : execFileSync(
        "git",
        ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        { encoding: "utf8" },
      )
        .split("\0")
        .filter(Boolean);
  const invalid = lintFilenames(
    [...new Set(files)]
      .filter((file) => existsSync(file))
      .flatMap((file) => {
        const directory = path.dirname(file);
        const filename = path.basename(file);
        const entries = readdirSync(directory);
        const actual = entries.includes(filename)
          ? filename
          : entries.find(
              (entry) => entry.toLowerCase() === filename.toLowerCase(),
            );
        return [...new Set([file, path.join(directory, actual ?? filename)])];
      }),
  );
  if (invalid.length) {
    console.error(
      "Filenames must use kebab-case (AGENTS.md is reserved for agent instructions):\n" +
        invalid.map((file) => `  ${file}`).join("\n"),
    );
    process.exitCode = 1;
  } else {
    console.log("All filenames use kebab-case.");
  }
}
