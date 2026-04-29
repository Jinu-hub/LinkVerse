/**
 * Blog Posts Screen
 *
 * This component displays a list of blog posts from MDX files in the docs directory.
 * It uses mdx-bundler to extract frontmatter from MDX files and renders a grid of
 * blog post cards with images, titles, descriptions, and metadata.
 *
 * The blog implementation demonstrates:
 * 1. MDX content handling with frontmatter extraction
 * 2. File system operations for reading blog content
 * 3. Responsive grid layout for different screen sizes
 * 4. View transitions for smooth navigation between pages
 */
import type { Route } from "./+types/posts";

import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "~/core/components/ui/badge";
import i18next from "~/core/lib/i18next.server";
import { BlogPostsFilters } from "~/features/blog/components/blog-posts-filters";
import {
  getBlogCategories,
  getBlogList,
  getBlogMonths,
  getBlogYears,
} from "~/features/blog/lib/blog-index.server";


/**
 * Meta function for the blog posts page
 *
 * Sets the page title using the application name from environment variables
 * and adds a meta description for SEO purposes
 */
export const meta: Route.MetaFunction = () => {
  return [
    { title: `Supablog | ${import.meta.env.VITE_APP_NAME}` },
    { name: "description", content: "Follow our development journey!" },
  ];
};

/**
 * Interface defining the structure of MDX frontmatter
 *
 * Each MDX blog post file must include these metadata fields in its frontmatter:
 * - title: The title of the blog post
 * - description: A brief summary of the post content
 * - date: Publication date (used for sorting)
 * - category: The post category for filtering/grouping
 * - author: The name of the post author
 * - slug: URL-friendly identifier for the post
 */
/**
 * Loader function for the blog posts page
 *
 * This function reads all MDX files from the docs directory and extracts their frontmatter:
 * 1. Determines the path to the docs directory containing MDX blog posts
 * 2. Reads all files in the directory and filters for .mdx files
 * 3. Processes each MDX file to extract its frontmatter metadata
 * 4. Sorts the posts by date (newest first)
 * 5. Returns the frontmatter data to be used by the component
 *
 * @returns Object containing an array of blog post frontmatter data
 */
export async function loader({ request }: Route.LoaderArgs) {
  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const sortParam = url.searchParams.get("sort");
  const sort = sortParam === "oldest" ? "oldest" : "latest";

  const entries = await getBlogList({
    lang: locale,
    category,
    q,
    year,
    month,
    sort,
  });

  const allEntriesInLang = await getBlogList({ lang: locale });
  const categories = getBlogCategories(allEntriesInLang);
  const years = getBlogYears(allEntriesInLang);
  const months = getBlogMonths(
    allEntriesInLang,
    year && /^\d{4}$/.test(year) ? year : undefined,
  );

  const sortedCategories = [...categories].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  return {
    frontmatters: entries,
    categories: sortedCategories,
    years,
    months,
    activeCategory: category ?? "",
    searchQuery: q ?? "",
    activeYear: year ?? "",
    activeMonth: month ?? "",
    sort,
  };
}

/**
 * Blog Posts Component
 *
 * This component renders the blog posts page with a header and a grid of blog post cards.
 * Each card displays:
 * - Featured image (matching the post slug)
 * - Category badge
 * - Post title
 * - Post description
 * - Author and date information
 *
 * The component uses responsive design with different layouts for mobile and desktop:
 * - Single column on mobile devices
 * - Three-column grid on desktop devices
 *
 * It also implements view transitions for smooth navigation between the posts list
 * and individual post pages.
 *
 * @param loaderData - Data from the loader containing blog post frontmatter
 */
export default function Posts({
  loaderData: {
    frontmatters,
    categories,
    years,
    months,
    activeCategory,
    searchQuery,
    activeYear,
    activeMonth,
    sort,
  },
}: Route.ComponentProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Page header with title and subtitle */}
      <header className="flex flex-col items-center">
        <h1 className="text-center text-3xl font-semibold tracking-tight md:text-5xl">
          Jinu's Blog
        </h1>
        <p className="text-muted-foreground mt-1.5 text-center font-medium md:text-lg">
          {t("blog.posts.subtitle")}
        </p>
      </header>

      {/* 필터와 그리드를 같은 폭 블록에 두고 좌측 정렬 */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8 px-4 sm:px-6">
        <BlogPostsFilters
          categories={categories}
          years={years}
          months={months}
          activeCategory={activeCategory}
          activeYear={activeYear}
          activeMonth={activeMonth}
          searchQuery={searchQuery}
          sort={sort === "oldest" ? "oldest" : "latest"}
        />

        {/* 1열: 모바일 · md~: 태블릿/데스크톱 3열 · xl+: 4열 */}
        <div className="grid w-full grid-cols-1 gap-10 sm:gap-8 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-6">
        {frontmatters.map((frontmatter) => (
          <Link
            to={`/blog/${frontmatter.slug}`}
            key={frontmatter.slug}
            className="flex flex-col gap-3 md:gap-4"
            viewTransition // Enable smooth transitions between pages
          >
            {/* Post featured image */}
            <img
              src={`/blog/${frontmatter.slug}.jpg`}
              alt={frontmatter.title}
              className="aspect-[4/3] w-full rounded-xl object-cover object-center"
            />
            {/* Category badge */}
            <Badge variant="secondary" className="text-sm">
              {frontmatter.category}
            </Badge>
            <div>
              {/* Post title */}
              <h2 className="text-lg font-bold md:text-xl">
                {frontmatter.title}
              </h2>
              {/* Post description */}
              <p className="text-muted-foreground text-pretty text-base md:text-[1.05rem]">
                {frontmatter.description}
              </p>
              {/* Author and date information */}
              <span className="text-muted-foreground mt-2 block text-sm">
                {t("blog.posts.metaLine", {
                  author: frontmatter.author,
                  date: new Date(frontmatter.date).toLocaleDateString(i18n.language),
                })}
              </span>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
