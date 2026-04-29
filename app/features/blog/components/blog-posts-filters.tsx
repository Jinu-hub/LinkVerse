import { useState, type ReactNode } from "react";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "~/core/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/core/components/ui/collapsible";
import { cn } from "~/core/lib/utils";

function BlogFilterRow(props: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-x-2 gap-y-2 [&_a]:tabular-nums",
        props.className,
      )}
    >
      <span className="text-muted-foreground w-[min(5.5rem,28vw)] shrink-0 pt-[0.4375rem] text-xs font-medium leading-none">
        {props.label}
      </span>
      {props.children}
    </div>
  );
}

function blogListHref(opts: {
  category?: string;
  q?: string;
  year?: string;
  month?: string;
  sort?: "latest" | "oldest";
}) {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.q) params.set("q", opts.q);
  if (opts.year) params.set("year", opts.year);
  if (opts.month) params.set("month", opts.month);
  if (opts.sort) params.set("sort", opts.sort);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export type BlogPostsFiltersProps = {
  categories: string[];
  years: string[];
  months: string[];
  activeCategory: string;
  activeYear: string;
  activeMonth: string;
  searchQuery: string;
  sort: "latest" | "oldest";
};

/** Collapsible blog list filters: category, year, month, sort */
export function BlogPostsFilters(props: BlogPostsFiltersProps) {
  const {
    categories,
    years,
    months,
    activeCategory,
    activeYear,
    activeMonth,
    searchQuery,
    sort,
  } = props;
  const { t } = useTranslation();
  const qParam = searchQuery.trim();
  const activeSort: "latest" | "oldest" = sort === "oldest" ? "oldest" : "latest";
  const [filtersOpen, setFiltersOpen] = useState(true);

  const yearChipsInner = (
    <div className="flex flex-wrap gap-2">
      <Badge
        asChild
        variant={!activeYear ? "default" : "outline"}
        className={cn("h-8 rounded-full px-3 text-sm", !activeYear ? "" : "hover:bg-accent")}
      >
        <Link
          to={blogListHref({
            category: activeCategory || undefined,
            q: qParam,
            sort: activeSort,
          })}
          viewTransition
        >
          {t("blog.posts.allPeriod")}
        </Link>
      </Badge>
      {years.map((year) => {
        const isActive = activeYear === year;
        return (
          <Badge
            key={year}
            asChild
            variant={isActive ? "default" : "outline"}
            className={cn("h-8 rounded-full px-3 text-sm", isActive ? "" : "hover:bg-accent")}
          >
            <Link
              to={blogListHref({
                category: activeCategory || undefined,
                q: qParam,
                year,
                sort: activeSort,
              })}
              viewTransition
            >
              {year}
            </Link>
          </Badge>
        );
      })}
    </div>
  );

  const monthChipsInner = (
    <div className="flex flex-wrap gap-2">
      <Badge
        asChild
        variant={!activeMonth ? "default" : "outline"}
        className={cn("h-8 rounded-full px-3 text-sm", !activeMonth ? "" : "hover:bg-accent")}
      >
        <Link
          to={blogListHref({
            category: activeCategory || undefined,
            q: qParam,
            year: activeYear || undefined,
            sort: activeSort,
          })}
          viewTransition
        >
          {t("blog.posts.allPeriod")}
        </Link>
      </Badge>
      {months.map((month) => {
        const isActive = activeMonth === month;
        return (
          <Badge
            key={month}
            asChild
            variant={isActive ? "default" : "outline"}
            className={cn("h-8 rounded-full px-3 text-sm", isActive ? "" : "hover:bg-accent")}
          >
            <Link
              to={blogListHref({
                category: activeCategory || undefined,
                q: qParam,
                year: activeYear || undefined,
                month,
                sort: activeSort,
              })}
              viewTransition
            >
              {month}
            </Link>
          </Badge>
        );
      })}
    </div>
  );

  return (
    <section
      aria-labelledby="blog-posts-filters-heading"
      className="mx-auto w-full max-w-screen-lg px-4 sm:px-0"
    >
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <div className="border-border/80 bg-muted/35 supports-[backdrop-filter]:bg-muted/40 dark:bg-muted/15 cursor-pointer overflow-hidden rounded-2xl border shadow-sm backdrop-blur-[6px]">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "focus-visible:ring-ring hover:bg-muted/70 focus-visible:bg-muted/65 flex w-full gap-4 px-4 py-3 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-offset-2 sm:px-5 sm:py-4",
                filtersOpen && "border-border/70 border-b",
              )}
              aria-expanded={filtersOpen}
              aria-controls="blog-posts-filters-panel"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  id="blog-posts-filters-heading"
                  className="text-foreground inline-flex cursor-pointer items-center gap-2.5 text-[0.9375rem] font-semibold leading-tight tracking-tight sm:text-base"
                >
                  <SlidersHorizontal
                    className="text-muted-foreground size-[1.0625rem] shrink-0"
                    aria-hidden
                  />
                  {t("blog.posts.filtersSectionTitle")}
                </span>
                {/*
                <span className="text-muted-foreground text-xs leading-snug sm:text-[13px]">
                  {t("blog.posts.filtersSectionSubtitle")}
                </span>
                */}
              </div>
              <ChevronDown
                aria-hidden
                className={cn(
                  "text-muted-foreground size-5 shrink-0 self-center transition-transform duration-200",
                  filtersOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent id="blog-posts-filters-panel">
            <nav
              aria-label={t("blog.posts.filtersToolbarAriaLabel")}
              className="flex flex-col gap-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2"
            >
              {categories.length > 0 ? (
                <BlogFilterRow
                  label={t("blog.posts.categoryFilter")}
                  className="w-full min-w-0"
                >
                  <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                    <Badge
                      asChild
                      variant={!activeCategory ? "default" : "outline"}
                      className={cn(
                        "h-8 rounded-full px-3 text-sm",
                        !activeCategory ? "" : "hover:bg-accent",
                      )}
                    >
                      <Link
                        to={blogListHref({
                          q: qParam,
                          year: activeYear || undefined,
                          month: activeMonth || undefined,
                          sort: activeSort,
                        })}
                        viewTransition
                        aria-current={!activeCategory ? "page" : undefined}
                      >
                        {t("blog.posts.allCategories")}
                      </Link>
                    </Badge>
                    {categories.map((category) => {
                      const isActive =
                        activeCategory.toLowerCase() === category.toLowerCase();
                      return (
                        <Badge
                          key={category}
                          asChild
                          variant={isActive ? "default" : "outline"}
                          className={cn(
                            "h-8 rounded-full px-3 text-sm capitalize",
                            isActive ? "" : "hover:bg-accent",
                          )}
                        >
                          <Link
                            to={blogListHref({
                              category,
                              q: qParam,
                              year: activeYear || undefined,
                              month: activeMonth || undefined,
                              sort: activeSort,
                            })}
                            viewTransition
                            aria-current={isActive ? "page" : undefined}
                          >
                            {category.replace(/-/g, " ")}
                          </Link>
                        </Badge>
                      );
                    })}
                  </div>
                </BlogFilterRow>
              ) : null}

              {years.length > 0 && months.length > 0 ? (
                <div className="flex w-full flex-col gap-3">
                  <BlogFilterRow label={t("blog.posts.yearFilter")}>
                    {yearChipsInner}
                  </BlogFilterRow>
                  <BlogFilterRow label={t("blog.posts.monthFilter")}>
                    {monthChipsInner}
                  </BlogFilterRow>
                </div>
              ) : years.length > 0 ? (
                <BlogFilterRow label={t("blog.posts.yearFilter")}>{yearChipsInner}</BlogFilterRow>
              ) : months.length > 0 ? (
                <BlogFilterRow label={t("blog.posts.monthFilter")}>
                  {monthChipsInner}
                </BlogFilterRow>
              ) : null}

              <BlogFilterRow label={t("blog.posts.sortFilter")}>
                <div className="flex flex-wrap gap-2">
                  {(["latest", "oldest"] as const).map((sortValue) => {
                    const isActive = sort === sortValue;
                    return (
                      <Badge
                        key={sortValue}
                        asChild
                        variant={isActive ? "default" : "outline"}
                        className={cn(
                          "h-8 rounded-full px-3 text-sm",
                          isActive ? "" : "hover:bg-accent",
                        )}
                      >
                        <Link
                          to={blogListHref({
                            category: activeCategory || undefined,
                            q: qParam,
                            year: activeYear || undefined,
                            month: activeMonth || undefined,
                            sort: sortValue,
                          })}
                          viewTransition
                        >
                          {sortValue === "latest"
                            ? t("blog.posts.sortLatest")
                            : t("blog.posts.sortOldest")}
                        </Link>
                      </Badge>
                    );
                  })}
                </div>
              </BlogFilterRow>
            </nav>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
}
