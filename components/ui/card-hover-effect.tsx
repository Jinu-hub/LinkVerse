import { cn } from "~/core/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useEffect, useState } from "react";

type DisplayType = "top" | "recent";

export const HoverEffect = ({
  items,
  className,
  theme = "dark",
  displayType = "top",
}: {
  items: {
    title: string;
    description: string;
    url: string;
    created_at?: string;
  }[];
  className?: string;
  theme?: string;
  displayType?: DisplayType;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-2  lg:grid-cols-5  py-0 gap-4 items-stretch",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.url}
          key={item?.url}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card isDark={isDark} className="h-full">
            <div className="flex flex-col h-full">
            <CardTitle>{item.title.length > 20 
              ? `${item.title.substring(0, 20)}...` 
              : item.title}
              </CardTitle>
            {displayType === "top" && (
              <CardDescription>
                {item.description.length > 30 ? item.description.slice(0, 30) + "..." : item.description}
              </CardDescription>
            )}
            <div className="mt-auto">
            {displayType === "recent" && (
              <CardDescription>Added: {formatDate(item.created_at)}</CardDescription>
            )}
            </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  isDark = true,
}: {
  className?: string;
  children: React.ReactNode;
  isDark?: boolean;
}) => {
  return (
    <div
      className={cn(
        `rounded-2xl h-full w-full p-2 overflow-hidden ${isDark ? 'bg-zinc-950' : 'bg-zinc-800'} border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20`,
        className
      )}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="relative z-50 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/*
function CardDescriptionTruncated({ description }: { description: string }) {
  const [maxLength, setMaxLength] = useState(30);

  useEffect(() => {
    function handleResize() {
      setMaxLength(window.innerWidth <= 640 ? 10 : 30); // 640px 이하는 모바일로 간주
    }
    handleResize(); // 최초 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <span>
      {description.length > maxLength
        ? description.slice(0, maxLength) + "..."
        : description}
    </span>
  );
}
*/