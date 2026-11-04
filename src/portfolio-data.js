// ============================================================
// 포트폴리오 데이터 (영상 추가/수정은 이 파일에서만 하면 됩니다)
//
// - 빌드할 때 이 데이터로 HTML이 만들어지기 때문에,
//   검색엔진(네이버/구글)이 영상 제목과 설명을 그대로 읽을 수 있습니다.
// - 영상마다 description(한 줄 설명)을 적어두면 영상 아래에 표시되고
//   검색 노출에도 도움이 됩니다.
//   예) description: "대구 ○○구청 청소년 행사 현장을 담은 스케치 영상"
//   (발주처/지역/행사명을 넣으면 "대구 행사 스케치" 같은 검색어에 유리합니다)
// ============================================================

export const categories = [
  {
    key: "event",
    label: "행사 스케치",
    heading: "행사 스케치 영상 포트폴리오",
    description: "현장의 분위기와 핵심 장면을 놓치지 않습니다.",
    videos: [
      {
        title: "토트넘 뷰잉파티 스케치",
        id: "MyGk0O7vXTg",
        url: "https://www.youtube.com/watch?v=MyGk0O7vXTg",
      },
      {
        title: "HOKA 팝업스토어 스케치",
        id: "EkAWsKYAiUk",
        url: "https://youtu.be/EkAWsKYAiUk",
      },
      {
        title: "주민총회 스케치",
        id: "DQaSyKsdwAQ",
        url: "https://youtu.be/DQaSyKsdwAQ",
      },
    ],
  },
  {
    key: "documentary",
    label: "다큐멘터리",
    heading: "다큐멘터리 영상 포트폴리오",
    description: "인물과 이야기에 집중해,\n진정성 있게 메세지를 담아냅니다.",
    videos: [
      {
        title: "해외 의료 다큐멘터리",
        id: "DH1nwgWdTjc",
        url: "https://www.youtube.com/watch?v=DH1nwgWdTjc",
      },
      {
        title: "행사 기록 다큐멘터리",
        id: "JQ2P7FVl4sk",
        url: "https://youtu.be/JQ2P7FVl4sk",
      },
      {
        title: "숏 다큐멘터리",
        id: "dHSBa-8si-s",
        url: "https://www.youtube.com/watch?v=dHSBa-8si-s",
      },
    ],
  },
  {
    key: "promotion",
    label: "홍보 영상",
    heading: "기업·제품 홍보영상 포트폴리오",
    description: "홍보하고자 하는 포인트와 메시지를 \n자연스럽게 전달합니다.",
    videos: [
      {
        title: "제품 홍보영상 (화장품)",
        id: "vVzn1MKm5IQ",
        url: "https://youtu.be/vVzn1MKm5IQ",
      },
      {
        title: "행사 홍보영상",
        id: "jgKQGv4cQ4g",
        url: "https://youtu.be/jgKQGv4cQ4g",
      },
      {
        title: "스포츠 행사 홍보 영상",
        id: "wTlDNO2dL-0",
        url: "https://youtube.com/shorts/wTlDNO2dL-0",
        isShort: true,
      },
      {
        title: "동호회 홍보영상",
        id: "-XLCogjkE-8",
        url: "https://youtube.com/shorts/-XLCogjkE-8",
        isShort: true,
      },
    ],
  },
  {
    key: "government",
    label: "지자체 영상",
    heading: "지자체·공공기관 영상 포트폴리오",
    description:
      "지자체의 특성과 행정 목적을 이해하고,\n방향에 맞게 정리합니다.",
    videos: [
      {
        title: "결과 보고서 영상",
        id: "9UaVH8mKXjM",
        url: "https://www.youtube.com/watch?v=9UaVH8mKXjM",
      },
      {
        title: "청소년 행사 스케치",
        id: "ivadLUMhA-Q",
        url: "https://www.youtube.com/watch?v=ivadLUMhA-Q",
      },
      {
        title: "청소년 캠프 스케치",
        id: "T8WYVkdbbIw",
        url: "https://youtu.be/T8WYVkdbbIw",
      },
      {
        title: "사업 설명회",
        id: "0wE6woyyvS4",
        url: "https://www.youtube.com/watch?v=0wE6woyyvS4",
      },
      {
        title: "축사 영상",
        id: "-j5yMrzFJfc",
        url: "https://www.youtube.com/watch?v=-j5yMrzFJfc",
      },
    ],
  },
  {
    key: "interview",
    label: "인터뷰 기반",
    heading: "인터뷰 기반 영상 포트폴리오",
    description:
      "진정성과 신뢰를 담아 클라이언트가 원하는 메시지를 \n인터뷰를 통해 전달합니다.",
    videos: [
      {
        title: "해외 축구선수 토크쇼",
        id: "Z8oH-y2-8f0",
        url: "https://youtu.be/Z8oH-y2-8f0",
      },
      {
        title: "정보전달 예능형",
        id: "mV915iQ6bgU",
        url: "https://youtu.be/mV915iQ6bgU",
      },
      {
        title: "인터뷰 (쇼츠)",
        id: "QqcdJcOrbXA",
        url: "https://youtube.com/shorts/QqcdJcOrbXA",
        isShort: true,
      },
    ],
  },
  {
    key: "shortform",
    label: "SNS & 숏폼",
    heading: "SNS 숏폼 영상 포트폴리오",
    description: "트렌드에 맞춰 노출과 유입에 신경써서 제작합니다.",
    videos: [
      {
        title: "스포츠 행사 스케치 (쇼츠)",
        id: "Bva0orqLZlQ",
        url: "https://www.youtube.com/shorts/Bva0orqLZlQ",
        isShort: true,
      },
      {
        title: "해외 바이럴 광고 (쇼츠)",
        id: "PRwa96EJdCE",
        url: "https://youtube.com/shorts/PRwa96EJdCE",
        isShort: true,
      },
      {
        title: "국내 바이럴 광고 (쇼츠)",
        id: "carih9DFqdk",
        url: "https://youtube.com/shorts/carih9DFqdk",
        isShort: true,
      },
    ],
  },
];
