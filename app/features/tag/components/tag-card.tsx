// app/features/tag/components/TagCard.tsx
import { Card, CardContent } from "~/core/components/ui/card"
import { Button } from "~/core/components/ui/button"
import { Badge } from "~/core/components/ui/badge"
import { useNavigate } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "~/core/components/ui/popover";

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

function getTagColor(id: number) {
  // id를 기반으로 색상 고정
  const idx = id % TAG_COLORS.length;
  return TAG_COLORS[idx];
}

type TagCardProps = {
  id: number
  name: string
  usageCount: number
  createdAt: string
  goToDetail?: boolean // 기본 true
  onClick?: () => void // 별도 사용자 정의 동작
  onEdit?: () => void
  onDelete?: () => void
}

export function TagCard({ id, name, usageCount, createdAt, goToDetail = true, onClick, onEdit, onDelete }: TagCardProps) {
  const navigate = useNavigate();
  const color = getTagColor(id);
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
    if (goToDetail) {
      console.log("goToDetail", id);
      navigate(`/tags/${id}`);
    }
  };
  return (
    <Card
      className={`w-full cursor-pointer border-0 bg-zinc-100 dark:bg-zinc-900 transition-all duration-200
        hover:shadow-2xl hover:ring-2 hover:ring-primary/40 hover:scale-[1.025]`}
      onClick={handleCardClick}
    >
      <CardContent className="px-3 py-3 flex flex-col gap-2 group relative">
        <h4 className="text-xl font-extrabold text-primary dark:text-primary-300 mb-2 tracking-tight">#{name}</h4>
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-col flex-1 gap-0.5">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">{usageCount} items</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">생성일: {createdAt.slice(0, 10)}</span>
          </div>
          {/* PC: hover 시 노출, 테블릿 이하: ... 버튼 → 팝오버 */}
          <div className="hidden md:flex flex-row gap-2 items-center justify-end ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
            <Button size="sm" variant="outline" className="backdrop-blur bg-white/60 dark:bg-zinc-800/60 border-white/40 dark:border-zinc-700/40 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 hover:border-zinc-300 dark:hover:bg-zinc-700/80" onClick={e => { e.stopPropagation(); onEdit?.(); }}>
              편집
            </Button>
            <Button size="sm" variant="destructive" className="backdrop-blur bg-white/60 dark:bg-zinc-800/60 border-white/40 dark:border-zinc-700/40 text-red-700 dark:text-red-300 hover:bg-red-100 hover:border-red-300 dark:hover:bg-zinc-700/80" onClick={e => { e.stopPropagation(); onDelete?.(); }}>
              삭제
            </Button>
          </div>
          <div className="flex md:hidden absolute top-2 right-2 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="w-8 h-8 p-0" onClick={e => e.stopPropagation()}>
                  <span className="text-2xl">⋯</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-2 w-32">
                <Button size="sm" variant="outline" className="w-full mb-1" onClick={e => { e.stopPropagation(); onEdit?.(); }}>
                  편집
                </Button>
                <Button size="sm" variant="destructive" className="w-full" onClick={e => { e.stopPropagation(); onDelete?.(); }}>
                  삭제
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
