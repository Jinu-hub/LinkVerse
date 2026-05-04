/**
 * Blog Post Screen Component
 * 
 * This component handles the rendering of individual blog posts using MDX.
 * It demonstrates:
 * - MDX bundling and rendering with custom components
 * - Frontmatter extraction for metadata
 * - Dynamic routing with React Router
 * - SEO optimization with meta tags
 * - Error handling for missing or invalid posts
 */
import type { Route } from "./+types/post";

import { useTranslation } from "react-i18next";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { data } from "react-router";
import remarkGfm from "remark-gfm";

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyList,
  TypographyOrderedList,
  TypographyP,
  TypographyPre,
  TypographyLink,
} from "~/core/components/mdx-typography";
import CounterExample from "~/features/blog/components/counter-example";
import { Badge } from "~/core/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/core/components/ui/table";
import i18next from "~/core/lib/i18next.server";
import { toBlogLocaleDateString } from "~/features/blog/lib/blog-date-locale";
import { getBlogBySlug } from "~/features/blog/lib/blog-index.server";

interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  slug: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Meta function for the blog post page
 * 
 * This function generates meta tags for SEO optimization and social sharing.
 * It handles two scenarios:
 * 1. When the post is found: Sets title, description, and Open Graph tags
 * 2. When the post is not found: Sets a 404 title
 * 
 * The Open Graph tags enable rich previews when the post is shared on
 * social media platforms like Twitter, Facebook, and LinkedIn.
 * 
 * @param data - The data returned from the loader function
 * @returns An array of meta tag objects for the page
 */
export const meta: Route.MetaFunction = ({ data }) => {
  // Handle case where post is not found
  if (!data) {
    return [
      {
        title: `404 Page Not Found | ${import.meta.env.VITE_APP_NAME}`,
      },
    ];
  }
  
  // Generate meta tags for found posts
  return [
    // Page title with post title and app name
    {
      title: `${data.frontmatter.title} | ${import.meta.env.VITE_APP_NAME}`,
    },
    // Meta description for search engines
    {
      name: "description",
      content: data.frontmatter.description,
    },
    // Open Graph image for social media previews
    {
      name: "og:image",
      content: `http://localhost:5173/api/blog/og?slug=${data.frontmatter.slug}&lang=${data.lang}`,
    },
    // Open Graph title for social media previews
    {
      name: "og:title",
      content: data.frontmatter.title,
    },
    // Open Graph description for social media previews
    {
      name: "og:description",
      content: data.frontmatter.description,
    },
  ];
};

/**
 * Server loader function for fetching and processing blog post content
 * 
 * This function is responsible for:
 * 1. Finding the MDX file based on the URL slug parameter
 * 2. Bundling and processing the MDX content
 * 3. Extracting frontmatter metadata
 * 4. Handling errors for missing or invalid posts
 * 
 * The MDX bundler compiles the markdown content into executable React components
 * while extracting the frontmatter metadata (title, date, author, etc.)
 * 
 * @param params - Route parameters containing the post slug
 * @returns The processed MDX code and frontmatter metadata
 * @throws 404 error if the post is not found, 500 error for other issues
 */
export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const slug = params.slug;
    if (!slug) {
      throw data(null, { status: 404 });
    }

    const locale = await i18next.getLocale(request);
    const entry = await getBlogBySlug({
      lang: locale,
      slug,
    });

    if (!entry) {
      throw data(null, { status: 404 });
    }

    // Process the MDX file to extract code and frontmatter
    const { code, frontmatter } = await bundleMDX({
      file: entry.filePath,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        return options;
      },
    });

    // Return both the compiled MDX code and the frontmatter metadata
    const mergedFrontmatter = {
      ...(frontmatter as PostFrontmatter),
      category: entry.category,
      slug: entry.slug,
      date: entry.date,
      author: entry.author,
      title: (frontmatter as PostFrontmatter).title ?? entry.title,
      description: (frontmatter as PostFrontmatter).description ?? entry.description,
      image: (frontmatter as PostFrontmatter).image ?? entry.image,
      imageAlt: (frontmatter as PostFrontmatter).imageAlt ?? entry.imageAlt,
    };

    return {
      frontmatter: mergedFrontmatter,
      code,
      lang: locale,
    };
  } catch (error) {
    // Handle file not found errors with a 404 response
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw data(null, { status: 404 });
    }
    // Handle all other errors with a 500 response
    throw data(null, { status: 500 });
  }
}

/**
 * Blog Post Component
 * 
 * This component renders a complete blog post with:
 * - Header with title, category, author, and date
 * - Featured image
 * - MDX content with custom styled typography components
 * 
 * The MDX content is rendered using custom components for consistent styling
 * across all blog posts. This approach allows writing content in Markdown
 * while maintaining the design system's typography and styling.
 * 
 * @param loaderData - Data from the loader containing frontmatter and compiled MDX code
 */
export default function Post({
  loaderData: { frontmatter, code, lang },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  // Convert the compiled MDX code into a React component
  const MDXContent = getMDXComponent(code);

  return (
    <div className="mx-auto w-full space-y-10">
      {/* Post header with category, title, author and date */}
      <header className="space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary">{frontmatter.category}</Badge>
          <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl">
            {frontmatter.title}
          </h1>
        </div>
        <span className="text-muted-foreground">
          {t("blog.posts.metaLine", {
            author: frontmatter.author,
            date: toBlogLocaleDateString(frontmatter.date, lang),
            interpolation: { escapeValue: false },
          })}
        </span>
      </header>
      
      {/* Featured image — full column width inside blog layout (no narrow hero cap) */}
      <figure className="not-prose group isolate w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/40 shadow-[0_12px_40px_-24px_rgb(0,0,0,0.25)] ring-1 ring-black/[0.04] md:rounded-3xl dark:shadow-none dark:ring-white/10">
        <img
          src={frontmatter.image ?? `/blog/${frontmatter.slug}.jpg`}
          alt={frontmatter.imageAlt ?? frontmatter.title}
          sizes="(min-width: 1536px) 1408px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
          className="aspect-video w-full object-cover object-center transition-transform duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.012] md:aspect-[21/9]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </figure>
      
      {/* Render the MDX content with custom typography components */}
      <MDXContent
        components={{
          // Map HTML elements to custom styled components
          h1: TypographyH1,
          h2: TypographyH2,
          h3: TypographyH3,
          h4: TypographyH4,
          p: TypographyP,
          blockquote: TypographyBlockquote,
          ul: TypographyList,
          ol: TypographyOrderedList,
          pre: TypographyPre,
          code: TypographyInlineCode,
          a: TypographyLink,
          // Table components for MDX table support
          table: Table,
          thead: TableHeader,
          tbody: TableBody,
          tfoot: TableFooter,
          tr: TableRow,
          th: TableHead,
          td: TableCell,
          caption: TableCaption,
          CounterExample,
        }}
      />
    </div>
  );
}