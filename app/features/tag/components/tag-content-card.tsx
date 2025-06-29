import { Link } from "react-router"
import { format } from "date-fns"
import type { ContentType } from "~/core/lib/types";
import { contentIconMap, typeColorMap } from "~/core/lib/types";
import type { ContentItem } from "../types/tag.types";

interface ContentCardProps {
  type: ContentType
  content: ContentItem
}

// extra 필드 매핑 함수
function renderExtraFields(type: ContentType, extra?: Record<string, string>) {
  if (!extra) return null

  const fieldMap: Record<ContentType, { label: string; key: string }[]> = {
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
  }

  return (
    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
      {fieldMap[type].map(({ label, key }) =>
        extra[key] ? (
          <li key={key}>
            <strong>{label}:</strong> {extra[key]}
          </li>
        ) : null
      )}
    </ul>
  )
}

export default function ContentCard({ type, content }: ContentCardProps) {
  return (
    <div className={
      `border rounded-xl p-4 bg-zinc-100 dark:bg-zinc-900 shadow-sm transition
      hover:shadow-2xl hover:ring-2 hover:ring-primary/40 hover:scale-[1.025] cursor-pointer`
    }>
      <div className="flex justify-between items-center mb-1">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${typeColorMap[type]}`}>
          {contentIconMap[type]} {type.toUpperCase()}
        </span>
        <span className="text-sm text-muted-foreground">{format(new Date(content.createdAt), "yyyy.MM.dd")}</span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">{content.title}</h3>

      {content.memo && (
        <p className="text-sm text-gray-700 dark:text-zinc-300 mt-1 line-clamp-2">{content.memo}</p>
      )}

      {type === "bookmark" && content.url && (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm mt-2 inline-block hover:underline"
        >
          {new URL(content.url).hostname}
        </a>
      )}

      {renderExtraFields(type, content.extra)}

      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        {content.clickCount && <span>🔁 {content.clickCount}회 열람</span>}

        <Link to={`/memos/${content.tagId}`} className="underline">
          메모 보기
        </Link>
        
      </div>
    </div>
  )
}
