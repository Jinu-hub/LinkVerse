import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import i18n, { type SupportedLng } from "~/i18n";

const BLOG_DOCS_ROOT = path.join(
  process.cwd(),
  "app",
  "features",
  "blog",
  "docs",
);

const FILE_NAME_PATTERN = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/;

type FrontmatterValue = string | string[] | boolean | undefined;

export interface BlogEntry {
  lang: SupportedLng;
  year: string;
  category: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  draft: boolean;
  filePath: string;
  fileDate: string;
  fileSlug: string;
  bodyText: string;
  image?: string;
  imageAlt?: string;
}

export interface BlogListOptions {
  lang: string;
  category?: string | null;
  q?: string | null;
  includeDraft?: boolean;
}

export interface BlogBySlugOptions {
  lang: string;
  slug: string;
  includeDraft?: boolean;
}

interface BlogIndex {
  entries: BlogEntry[];
}

let cachedIndex: BlogIndex | null = null;

function isSupportedLang(input: string): input is SupportedLng {
  return (i18n.supportedLngs as readonly string[]).includes(input);
}

function parseBoolean(value: FrontmatterValue, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return fallback;
}

function parseString(value: FrontmatterValue, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseStringArray(value: FrontmatterValue): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeScalar(input: string): string | boolean {
  const trimmed = input.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed;
}

function parseFrontmatter(source: string): {
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
} {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: source };
  }

  const [, rawFrontmatter, body] = match;
  const frontmatter: Record<string, FrontmatterValue> = {};
  let currentArrayKey: string | null = null;

  for (const line of rawFrontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("- ") && currentArrayKey) {
      const item = normalizeScalar(trimmed.slice(2));
      const arr = (frontmatter[currentArrayKey] ?? []) as string[];
      frontmatter[currentArrayKey] = [...arr, String(item)];
      continue;
    }

    currentArrayKey = null;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!rawValue) {
      frontmatter[key] = [];
      currentArrayKey = key;
      continue;
    }

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      const values = rawValue
        .slice(1, -1)
        .split(",")
        .map((item) => normalizeScalar(item))
        .map((item) => String(item).trim())
        .filter(Boolean);
      frontmatter[key] = values;
      continue;
    }

    frontmatter[key] = normalizeScalar(rawValue);
  }

  return { frontmatter, body };
}

async function scanMdxFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return scanMdxFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function createEntryFromFile(
  filePath: string,
  source: string,
): BlogEntry | null {
  const relativePath = path.relative(BLOG_DOCS_ROOT, filePath);
  const segments = relativePath.split(path.sep);

  if (segments.length !== 4) {
    return null;
  }

  const [langSegment, year, category, fileName] = segments;
  if (!isSupportedLang(langSegment)) {
    return null;
  }

  const fileNameMatch = fileName.match(FILE_NAME_PATTERN);
  if (!fileNameMatch) {
    return null;
  }

  const [, fileDate, fileSlug] = fileNameMatch;
  const { frontmatter, body } = parseFrontmatter(source);

  const title = parseString(frontmatter.title);
  const description = parseString(frontmatter.description);
  const author = parseString(frontmatter.author);

  if (!title || !description || !author) {
    return null;
  }

  const draft = parseBoolean(frontmatter.draft, false);
  const date = parseString(frontmatter.date, fileDate);
  const slug = parseString(frontmatter.slug, fileSlug);

  return {
    lang: langSegment,
    year,
    category,
    slug,
    date,
    title,
    description,
    author,
    tags: parseStringArray(frontmatter.tags),
    draft,
    filePath,
    fileDate,
    fileSlug,
    bodyText: body,
    image: parseString(frontmatter.image) || undefined,
    imageAlt: parseString(frontmatter.imageAlt) || undefined,
  };
}

export async function buildBlogIndex(): Promise<BlogIndex> {
  const filePaths = await scanMdxFiles(BLOG_DOCS_ROOT);
  const entries = await Promise.all(
    filePaths.map(async (filePath) => {
      const source = await readFile(filePath, "utf-8");
      return createEntryFromFile(filePath, source);
    }),
  );

  const validEntries = entries
    .filter((entry): entry is BlogEntry => entry !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return { entries: validEntries };
}

export async function getBlogIndex() {
  if (process.env.NODE_ENV === "production" && cachedIndex) {
    return cachedIndex;
  }

  const index = await buildBlogIndex();
  if (process.env.NODE_ENV === "production") {
    cachedIndex = index;
  }

  return index;
}

function hasSearchMatch(entry: BlogEntry, query: string): boolean {
  const haystack = [
    entry.title,
    entry.description,
    entry.category,
    entry.slug,
    entry.tags.join(" "),
    entry.bodyText,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export async function getBlogList({
  lang,
  category,
  q,
  includeDraft = false,
}: BlogListOptions): Promise<BlogEntry[]> {
  const { entries } = await getBlogIndex();
  const normalizedLang = isSupportedLang(lang) ? lang : i18n.fallbackLng;
  const normalizedCategory = category?.trim().toLowerCase();
  const normalizedQuery = q?.trim();

  return entries.filter((entry) => {
    if (entry.lang !== normalizedLang) return false;
    if (!includeDraft && entry.draft) return false;
    if (normalizedCategory && entry.category.toLowerCase() !== normalizedCategory) {
      return false;
    }
    if (normalizedQuery && !hasSearchMatch(entry, normalizedQuery)) {
      return false;
    }
    return true;
  });
}

export async function getBlogBySlug({
  lang,
  slug,
  includeDraft = false,
}: BlogBySlugOptions): Promise<BlogEntry | null> {
  const { entries } = await getBlogIndex();
  const normalizedLang = isSupportedLang(lang) ? lang : i18n.fallbackLng;
  const matched = entries.find((entry) => {
    return entry.lang === normalizedLang && entry.slug === slug;
  });

  if (!matched) return null;
  if (!includeDraft && matched.draft) return null;
  return matched;
}

export function getBlogCategories(entries: BlogEntry[]): string[] {
  return [...new Set(entries.map((entry) => entry.category))];
}
