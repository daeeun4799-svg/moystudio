// 포트폴리오 데이터(portfolio-data.js)를 빌드 시점에 HTML로 만들어 주는 함수들입니다.
// vite.config.js의 플러그인이 index.html의 자리표시자를 이 결과로 바꿔줍니다.
// (Tailwind가 이 파일 안의 클래스명도 읽어서 CSS를 만들어주기 때문에 src 폴더 안에 두어야 합니다.)

import { categories } from "./portfolio-data.js";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function renderVideoCard(video, category) {
  const title = escapeHtml(video.title);
  const alt = escapeHtml(`${video.title} - 모이스튜디오 ${category.label}`);
  const ratio = video.isShort ? "aspect-9/16" : "aspect-video";
  const sizeClass = video.isShort ? " max-w-[260px] mx-auto w-full" : "";
  const thumb = `https://i.ytimg.com/vi/${video.id}`;
  const description = video.description
    ? `<p class="text-xs text-text-secondary mt-1.5 leading-relaxed">${escapeHtml(video.description)}</p>`
    : "";

  return `
          <article class="video-card break-inside-avoid mb-6 rounded-xl overflow-hidden bg-bg-card border border-border${sizeClass}">
            <div class="video-frame relative bg-black ${ratio}">
              <a
                href="${escapeHtml(video.url)}"
                class="video-facade group absolute inset-0 block"
                data-video-id="${escapeHtml(video.id)}"
                data-title="${title}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${title} 영상 재생"
              >
                <img
                  src="${thumb}/maxresdefault.jpg"
                  alt="${alt}"
                  width="1280"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  class="absolute inset-0 w-full h-full object-cover"
                  onerror="this.onerror=null;this.src='${thumb}/hqdefault.jpg'"
                />
                <span class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors"></span>
                <span class="absolute inset-0 flex items-center justify-center">
                  <span class="flex items-center justify-center w-14 h-14 rounded-full bg-black/65 text-white group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="8,5 19,12 8,19" /></svg>
                  </span>
                </span>
              </a>
            </div>
            <div class="p-4">
              <h4 class="text-sm font-medium text-text-primary">${title}</h4>
              ${description}
            </div>
          </article>`;
}

export function renderPortfolioTabs() {
  return categories
    .map(
      (category, index) => `
          <button
            type="button"
            role="tab"
            id="tab-${category.key}"
            aria-controls="panel-${category.key}"
            aria-selected="${index === 0}"
            class="tab-btn${index === 0 ? " active" : ""} px-4 py-2 text-sm border-b-2 border-transparent text-text-secondary hover:text-accent"
            data-category="${category.key}"
          >
            ${escapeHtml(category.label)}
          </button>`,
    )
    .join("");
}

export function renderPortfolioPanels() {
  return categories
    .map(
      (category, index) => `
        <div
          id="panel-${category.key}"
          role="tabpanel"
          aria-labelledby="tab-${category.key}"
          data-panel="${category.key}"${index === 0 ? "" : " hidden"}
        >
          <h3 class="sr-only">${escapeHtml(category.heading)}</h3>
          <p class="category-desc text-center text-text-secondary mb-8">${escapeHtml(category.description)}</p>
          <div class="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
${category.videos.map((video) => renderVideoCard(video, category)).join("\n")}
          </div>
        </div>`,
    )
    .join("");
}
