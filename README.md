# 모이스튜디오 홈페이지 (moystudio.kr)

## 실행 / 배포
```
npm install
npm run dev      # 로컬 확인
npm run build    # dist 폴더 생성 (sitemap.xml, robots.txt, rss.xml 자동 생성)
```
`dist` 폴더를 기존과 같은 방식으로 배포하면 됩니다.

## SEO 관련 수정 위치
- `src/index.html` : title, description, OG 태그, 구조화 데이터(JSON-LD), 본문
- `src/portfolio-data.js` : 포트폴리오 영상 목록. 영상 추가/수정은 여기서만.
  영상마다 `description: "..."` 한 줄 설명을 넣으면 화면과 검색 노출에 반영됩니다.
- 구글 서치콘솔 HTML 태그 인증을 쓸 경우 `src/index.html`의 google-site-verification 안내 주석 참고
- 주소(`https://www.moystudio.kr`)를 바꾸면 `.env`의 `SITE_URL`과 index.html의 canonical/og:url/JSON-LD 주소를 같이 바꿔야 합니다.
