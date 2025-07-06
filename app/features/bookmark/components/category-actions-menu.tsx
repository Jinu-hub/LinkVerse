import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/core/components/ui/dropdown-menu";
import { Button } from "~/core/components/ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import type { Category } from "./category-tree";
import { useCategoryTreeContext } from "./category-tree-context";

export function CategoryActionsMenu({ category }: { category: Category }) {
  const { dispatch } = useCategoryTreeContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
          <FiMoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => dispatch({ type: "ADD", parentId: category.id })}>
          하위 카테고리 추가
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch({ type: "RENAME", id: category.id })}>
          이름 변경
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onSelect={() => {
            setTimeout(() => {
              dispatch({ type: "DELETE_CANDIDATE_SET", category });
            }, 100);
          }}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 