// 랜덤 색상 팔레트 (태그별로 색상 다양화)
const TAG_COLORS = [
    "from-pink-400 to-pink-600",
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-indigo-400 to-indigo-600",
    "from-emerald-400 to-emerald-600",
    "from-orange-400 to-orange-600",
    "from-cyan-400 to-cyan-600",
    "from-fuchsia-400 to-fuchsia-600",
  ];
  
  export const SORT_OPTIONS = [
    { value: "usage_count", label: "사용 횟수" },
    { value: "name", label: "이름" },
    { value: "created_at", label: "생성일" },
  ] as const;

  export const SORT_OPTIONS_CONTENTS = [
    { value: "createdAt", label: "생성일" },
    { value: "title", label: "콘텐츠명" },
    { value: "type", label: "콘텐츠 종류" },
  ] as const;