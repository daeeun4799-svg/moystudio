import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "../src/portfolio-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const indexFile = path.join(projectRoot, "src", "index.html");
const portfolioDataFile = path.join(projectRoot, "src", "portfolio-data.js");

const ENV_FILES = [
  ".env.production.local",
  ".env.production",
  ".env.local",
  ".env",
];

const DEFAULT_SITE_URL = "https://www.moystudio.kr";
const FALLBACK_SITE_TITLE =
  "모이스튜디오 | 대구·경북·경남·창녕 영상제작, 기업·지자체 홍보영상";
const FALLBACK_SITE_DESCRIPTION =
  "대구·경북·경남·부산·창원 영상제작 전문 모이스튜디오. 기업·지자체 홍보영상, 행사 스케치, 인터뷰·다큐멘터리 영상을 기획부터 촬영, 편집까지 합리적인 예산으로 제작합니다.";

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvFile(content) {
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    entries[key] = stripQuotes(rawValue.trim());
  }

  return entries;
}

async function loadEnv() {
  const loaded = {};

  for (const envFile of ENV_FILES) {
    try {
      const content = await readFile(path.join(projectRoot, envFile), "utf8");
      Object.assign(loaded, parseEnvFile(content));
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return {
    ...loaded,
    ...process.env,
  };
}

function normalizeSiteUrl(siteUrl) {
  const parsed = new URL(siteUrl);

  return parsed.toString().replace(/\/$/, "");
}

function normalizeText(value) {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  return value.replaceAll(
    /&(#x[\da-f]+|#\d+|[a-z]+);/gi,
    (match, entity) => {
      const normalizedEntity = entity.toLowerCase();

      if (normalizedEntity.startsWith("#x")) {
        return String.fromCodePoint(
          Number.parseInt(normalizedEntity.slice(2), 16),
        );
      }

      if (normalizedEntity.startsWith("#")) {
        return String.fromCodePoint(
          Number.parseInt(normalizedEntity.slice(1), 10),
        );
      }

      return namedEntities[normalizedEntity] || match;
    },
  );
}

function parseAttributes(tag) {
  const attributes = {};
  const attributePattern =
    /([^\s"'=<>`]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of tag.matchAll(attributePattern)) {
    const [, key, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
    attributes[key.toLowerCase()] =
      doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? "";
  }

  return attributes;
}

function findTagAttributes(html, tagName, predicate) {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");

  for (const match of html.matchAll(tagPattern)) {
    const attributes = parseAttributes(match[0]);

    if (predicate(attributes)) {
      return attributes;
    }
  }

  return undefined;
}

function getTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);

  return match ? normalizeText(match[1]) : "";
}

function getMetaContent(html, key, value) {
  const attributes = findTagAttributes(
    html,
    "meta",
    (tagAttributes) => tagAttributes[key] === value,
  );

  return attributes?.content ? normalizeText(attributes.content) : "";
}

function getCanonicalUrl(html) {
  const attributes = findTagAttributes(html, "link", (tagAttributes) => {
    const relValues = (tagAttributes.rel || "").toLowerCase().split(/\s+/);

    return relValues.includes("canonical");
  });

  return attributes?.href || "";
}

async function loadSiteMetadata() {
  const html = await readFile(indexFile, "utf8");
  const title = getTitle(html) || FALLBACK_SITE_TITLE;
  const description =
    getMetaContent(html, "name", "description") || FALLBACK_SITE_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(html);

  return {
    title,
    description,
    canonicalUrl,
  };
}

function getSiteUrlFromCanonical(canonicalUrl) {
  if (!canonicalUrl) {
    return "";
  }

  try {
    return new URL(canonicalUrl).origin;
  } catch {
    return "";
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildVideoEntries() {
  const entries = [];

  for (const category of categories) {
    for (const video of category.videos) {
      const description =
        video.description ||
        `${video.title} - 모이스튜디오 ${category.label} 영상 포트폴리오`;

      entries.push(`    <video:video>
      <video:thumbnail_loc>https://i.ytimg.com/vi/${escapeXml(video.id)}/hqdefault.jpg</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(description)}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${escapeXml(video.id)}</video:player_loc>
    </video:video>`);
    }
  }

  return entries.join("\n");
}

function buildSitemapXml(siteUrl, lastmod) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${buildVideoEntries()}
  </url>
</urlset>
`;
}

function buildRobotsTxt(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function buildRssXml(siteUrl, metadata, lastBuildDate) {
  const homeUrl = `${siteUrl}/`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(metadata.title)}</title>
  <link>${escapeXml(homeUrl)}</link>
  <atom:link
    href="${escapeXml(siteUrl)}/rss.xml"
    rel="self"
    type="application/rss+xml"
  />
  <description>${escapeXml(metadata.description)}</description>
  <language>ko-KR</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <ttl>1440</ttl>
  <item>
    <title>${escapeXml(metadata.title)}</title>
    <link>${escapeXml(homeUrl)}</link>
    <guid isPermaLink="true">${escapeXml(homeUrl)}</guid>
    <description>${escapeXml(metadata.description)}</description>
    <pubDate>${lastBuildDate}</pubDate>
  </item>
</channel>
</rss>
`;
}

const env = await loadEnv();
const metadata = await loadSiteMetadata();
const canonicalSiteUrl = getSiteUrlFromCanonical(metadata.canonicalUrl);
const configuredSiteUrl =
  env.SITE_URL || env.VITE_SITE_URL || canonicalSiteUrl || DEFAULT_SITE_URL;

let siteUrl;

try {
  siteUrl = normalizeSiteUrl(configuredSiteUrl);
} catch {
  siteUrl = DEFAULT_SITE_URL;
  console.warn(
    `[seo] Invalid SITE_URL/VITE_SITE_URL value "${configuredSiteUrl}". Falling back to ${DEFAULT_SITE_URL}.`,
  );
}

const indexStats = await stat(indexFile);
const portfolioStats = await stat(portfolioDataFile);
const latestModified =
  portfolioStats.mtime > indexStats.mtime
    ? portfolioStats.mtime
    : indexStats.mtime;
const lastmod = latestModified.toISOString().slice(0, 10);
const lastBuildDate = latestModified.toUTCString();

await mkdir(publicDir, { recursive: true });
await writeFile(
  path.join(publicDir, "sitemap.xml"),
  buildSitemapXml(siteUrl, lastmod),
  "utf8",
);
await writeFile(
  path.join(publicDir, "robots.txt"),
  buildRobotsTxt(siteUrl),
  "utf8",
);
await writeFile(
  path.join(publicDir, "rss.xml"),
  buildRssXml(siteUrl, metadata, lastBuildDate),
  "utf8",
);

console.log(
  `[seo] Generated sitemap.xml, robots.txt, and rss.xml for ${siteUrl}`,
);
