#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RestEndpointMethodTypes } from "@octokit/rest";
import { fetchGistContent, getGists } from "../service/github.service.js";

// Load environment variables from .env.local using ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

// Type definitions
type GistFile = {
  filename: string;
  language: string | null;
  content: string;
  size: number;
  raw_url: string;
  type: string;
};

type GistListItem =
  RestEndpointMethodTypes["gists"]["listForUser"]["response"]["data"][0];
type GistDetails = RestEndpointMethodTypes["gists"]["get"]["response"]["data"];

// Configuration
const GITHUB_USERNAME = "thatbeautifuldream";
const CONTENT_DIR = path.join(process.cwd(), "content", "gist");

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function sanitizeContent(content: string): string {
  return content.replace(/```/g, "\\`\\`\\`");
}

function getPrimaryLanguage(files: Record<string, GistFile>): string {
  const languages: string[] = [];
  for (const file of Object.values(files)) {
    if (file.language) languages.push(file.language);
  }
  return languages[0] || "text";
}

function generateTags(gist: GistDetails): string {
  const tags: string[] = [];
  const primaryLanguage = getPrimaryLanguage(
    gist.files as Record<string, GistFile>
  );
  if (primaryLanguage && primaryLanguage !== "text") {
    tags.push(primaryLanguage.toLowerCase());
  }
  tags.push("gist");

  const description = gist.description?.toLowerCase() || "";
  const keywords = ["tutorial", "example", "snippet", "script", "utility", "helper"];
  for (const keyword of keywords) {
    if (description.includes(keyword)) tags.push(keyword);
  }

  return tags.join(", ");
}

function createFrontmatter(gist: GistDetails): string {
  const files = gist.files;
  if (!files) throw new Error("Gist has no files");

  const title = gist.description || `Gist: ${Object.keys(files)[0]}`;
  const slug = createSlug(title);
  const datePublished = new Date(gist.created_at || "").toISOString();
  const tags = generateTags(gist);

  return `---
title: "${title}"
description: "${gist.description || "A GitHub gist"}"
datePublished: ${datePublished}
date: ${datePublished}
slug: ${slug}
tags: ${tags}
gistId: ${gist.id}
gistUrl: ${gist.html_url}
isPublic: ${gist.public}
---

`;
}

function createContent(gist: GistDetails): string {
  let content = "";
  if (!gist.files) return content;

  const files = Object.values(gist.files).filter(Boolean) as GistFile[];
  for (const file of files) {
    if (file.language) {
      content += `\`\`\`${file.language.toLowerCase()} title="${file.filename}"\n${sanitizeContent(file.content)}\n\`\`\`\n\n`;
    } else {
      content += `\`\`\`\n${sanitizeContent(file.content)}\n\`\`\`\n\n`;
    }
  }
  return content;
}

function ensureContentDirectory(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

async function writeGistMDX(gist: GistDetails): Promise<string | null> {
  try {
    const title = gist.description || `gist-${gist.id}`;
    const slug = createSlug(title);
    const fileName = `${slug}.mdx`;
    const filePath = path.join(CONTENT_DIR, fileName);

    const frontmatter = createFrontmatter(gist);
    const body = createContent(gist);
    fs.writeFileSync(filePath, frontmatter + body, "utf8");

    return fileName;
  } catch (error) {
    console.error(`Error writing gist ${gist.id}:`, error);
    return null;
  }
}

// ── Single gist flow ──────────────────────────────────────────

async function processSingleGist(gistId: string): Promise<void> {
  console.log(`Fetching gist: ${gistId}`);
  const fullGist = await fetchGistContent(gistId);

  if (!fullGist) {
    console.error(`Failed to fetch gist: ${gistId}`);
    process.exit(1);
  }

  ensureContentDirectory();
  const result = await writeGistMDX(fullGist);

  if (result) {
    console.log(`Created: ${result}`);
  } else {
    console.error(`Failed to write gist: ${gistId}`);
    process.exit(1);
  }
}

// ── Bulk gist flow ────────────────────────────────────────────

async function processGistListItem(gist: GistListItem): Promise<string | null> {
  console.log(`\nProcessing gist: ${gist.id}`);
  const fullGist = await fetchGistContent(gist.id);
  if (!fullGist) {
    console.log(`Failed to fetch full gist content for: ${gist.id}`);
    return null;
  }
  return writeGistMDX(fullGist);
}

async function fetchAllGists(): Promise<void> {
  console.log(`Fetching gists for ${GITHUB_USERNAME}...`);
  const gists = await getGists(GITHUB_USERNAME);
  console.log(`Found ${gists.length} gists`);

  if (gists.length === 0) return;

  ensureContentDirectory();

  const BATCH_SIZE = 5;
  const processedFiles: string[] = [];

  for (let i = 0; i < gists.length; i += BATCH_SIZE) {
    const batch = gists.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(gists.length / BATCH_SIZE);

    console.log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} gists)`);
    const results = await Promise.all(batch.map((g) => processGistListItem(g)));

    for (const result of results) {
      if (result) processedFiles.push(result);
    }

    if (i + BATCH_SIZE < gists.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\nDone. Processed ${processedFiles.length}/${gists.length} gists.`);
}

// ── Entry point ───────────────────────────────────────────────

async function main(): Promise<void> {
  const gistId = process.argv[2];

  if (gistId) {
    await processSingleGist(gistId);
  } else {
    await fetchAllGists();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { fetchAllGists, processSingleGist };
