import { Button } from "~/core/components/ui/button";
import { CollapsibleTrigger } from "~/core/components/ui/collapsible";
import { FiChevronRight } from "react-icons/fi";
import { cn } from "~/core/lib/utils";
import React from "react";

interface CategoryButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  isMobile: boolean;
  hasChildren: boolean;
  isOpen: boolean;
}

export function CategoryButton({
  children,
  selected,
  onClick,
  isMobile,
  hasChildren,
  isOpen,
}: CategoryButtonProps) {
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          className={cn("flex-1 justify-start h-8 truncate", selected && "bg-accent text-accent-foreground")}
          onClick={onClick}
        >
          {children}
        </Button>
        {hasChildren && (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={e => e.stopPropagation()}
            >
              <FiChevronRight className={cn("transition-transform", isOpen && "rotate-90")} />
            </Button>
          </CollapsibleTrigger>
        )}
      </>
    );
  }
  // 데스크탑
  return (
    <CollapsibleTrigger asChild className="flex-1">
      <Button
        variant="ghost"
        className={cn("w-full justify-start h-8", selected && "bg-accent text-accent-foreground")}
        onClick={onClick}
      >
        {hasChildren && <FiChevronRight className={cn("transition-transform mr-2", isOpen && "rotate-90")} />}
        <span className="truncate flex-1 text-left">{children}</span>
      </Button>
    </CollapsibleTrigger>
  );
} 