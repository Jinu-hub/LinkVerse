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

  export const SORT_OPTIONS_UNTAGGED = [
    { value: "title", label: "제목" , width: "25%", isSortable: true },
    { value: "url", label: "URL" , width: "20%", isSortable: true },
    { value: "createdAt", label: "생성일" , width: "10%", isSortable: true },
    { value: "tags", label: "태그입력" , width: "40%", isSortable: false },
    { value: " ", label: " " , width: "5%", isSortable: false },
  ] as const;

export const CONTENT_TYPE_FIELD_MAP: Record<string, { label: string; key: string }[]> = {
  bookmark: [{ label: "도메인", key: "domain" }],
  book: [
    { label: "저자", key: "author" },
    { label: "출판사", key: "publisher" },
  ],
  movie: [
    { label: "감독", key: "director" },
    { label: "연도", key: "year" },
  ],
  travel: [
    { label: "위치", key: "location" },
    { label: "날짜", key: "date" },
  ],
};