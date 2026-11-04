import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import {
  renderPortfolioPanels,
  renderPortfolioTabs,
} from "./src/portfolio-render.js";

// index.html 안의 자리표시자를 포트폴리오 HTML로 바꿔줍니다.
// → 영상 제목/설명이 자바스크립트 없이도 HTML에 들어가므로 검색엔진이 읽을 수 있습니다.
function portfolioHtmlPlugin() {
  return {
    name: "moy-portfolio-html",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html
          .replace("<!-- @portfolio-tabs -->", renderPortfolioTabs())
          .replace("<!-- @portfolio-panels -->", renderPortfolioPanels());
      },
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), portfolioHtmlPlugin()],
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
