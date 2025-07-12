import { Link } from "react-router"
import { format } from "date-fns"
import { contentIconMap, typeColorMap } from "~/core/lib/constants";
import type { TagContent } from "../lib/tag.types";
import { CONTENT_TYPE_FIELD_MAP } from "../lib/constants";

interface ContentCardProps {
  type: string
  content: TagContent
  selected?: boolean
  onClick?: () => void
}

// extra 필드 매핑 함수
function renderExtraFields(type: string, extra?: Record<string, string>) {
  if (!extra) return null
  return (
    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
      {CONTENT_TYPE_FIELD_MAP[type].map(({ label, key }) =>
        extra[key] ? (
          <li key={key}>
            <strong>{label}:</strong> {extra[key]}
          </li>
        ) : null
      )}
    </ul>
  )
}

export default function ContentCard({ type, content, selected = false, onClick }: ContentCardProps) {
  return (
    <div
      className={
        `border rounded-xl p-4 bg-zinc-100 dark:bg-zinc-900 shadow-sm transition
        hover:shadow-2xl hover:ring-2 hover:ring-primary/40 hover:scale-[1.025] cursor-pointer ` +
        (selected ? 'ring-2 ring-primary border-primary bg-primary/10 dark:bg-primary/20' : '')
      }
      onClick={onClick}
      style={{ userSelect: 'none' }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${typeColorMap[type]}`}>
          {contentIconMap[type]} {type.toUpperCase()}
        </span>
        <span className="text-sm text-muted-foreground">{format(new Date(content.createdAt), "yyyy.MM.dd")}</span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">{content.title}</h3>

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
        {content.useCount && <span>🔁 {content.useCount}회 열람</span>}
        {/*
        <Link to={`/memos/${content.tagId}`} className="underline">
          메모 보기
        </Link>
        */}
        {content.memo && (
          <div className="text-sm text-gray-700 dark:text-zinc-300 mt-1 line-clamp-2">
            <strong>메모 : </strong> {content.memo.length > 50 ? content.memo.slice(0, 50) + '...' : content.memo}
          </div>
        )}
      </div>
    </div>
  )
}
