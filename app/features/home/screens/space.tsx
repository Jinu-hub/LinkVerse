/**
 * Home Page Component
 * 
 * This file implements the main landing page of the application with internationalization support.
 * It demonstrates the use of i18next for multi-language content, React Router's data API for
 * server-side rendering, and responsive design with Tailwind CSS.
 * 
 * Key features:
 * - Server-side translation with i18next
 * - Client-side translation with useTranslation hook
 * - SEO-friendly metadata using React Router's meta export
 * - Responsive typography with Tailwind CSS
 */

import type { Route } from "./+types/space";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import i18next from "~/core/lib/i18next.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { useTheme } from "remix-themes";
import { Particles } from "components/magicui/particles";
import { TopBookmarks } from "../components/TopBookmarks";
import { RecentBookmarks } from "../components/RecentBookmarks";
import { FiPlus } from "react-icons/fi";
import { Button } from "~/core/components/ui/button";
import { getRecentBookmarks, getTopBookmarks } from "~/features/bookmark/db/queries";
import { addBookmark }  from "../lib/homeActions";
import BookmarkAddDialog from "../components/bookmark-add-dialog";
import { toHomeBookmarks } from "../lib/homeUtils";
import type { HomeBookmark } from "../lib/home.types";
import Footer from "~/core/components/footer";
import { redirect } from "react-router";

/**
 * Meta function for setting page metadata
 * 
 * This function generates SEO-friendly metadata for the home page using data from the loader.
 * It sets:
 * - Page title from translated "home.title" key
 * - Meta description from translated "home.subtitle" key
 * 
 * The metadata is language-specific based on the user's locale preference.
 * 
 * @param data - Data returned from the loader function containing translated title and subtitle
 * @returns Array of metadata objects for the page
 */
export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.subtitle },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Get a translation function for the user's locale from the request
  const t = await i18next.getFixedT(request);
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw redirect("/login");
  }
  const topBookmarksRaw = await getTopBookmarks(client, { userId: user!.id, limit: 10 });
  const recentBookmarksRaw = await getRecentBookmarks(client, { userId: user!.id, limit: 10 });

  const initialTopBookmarks = await Promise.all(topBookmarksRaw.map(toHomeBookmarks));
  const initialRecentBookmarks = await Promise.all(recentBookmarksRaw.map(toHomeBookmarks));
  // Return translated strings for use in both the component and meta function
  return {
    title: t("home.title"),
    subtitle: t("home.subtitle"),
    userName: user?.user_metadata.name || "",
    initialTopBookmarks,
    initialRecentBookmarks,
  };
}

export default function HomeSpace({loaderData}: Route.ComponentProps) {
  const {userName, initialTopBookmarks, initialRecentBookmarks} = loaderData;
  
  // Get the translation function for the current locale
  const { t, i18n } = useTranslation();
  const [theme] = useTheme();
  const isDark = theme === "dark";
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [topBookmarks, setTopBookmarks] = useState<HomeBookmark[]>(initialTopBookmarks);
  const [recentBookmarks, setRecentBookmarks] = useState<HomeBookmark[]>(initialRecentBookmarks);

  return (
    <>
      <div className="flex flex-col items-start z-50 px-8 pt-15 -mt-5 md:-mt-20 space-y-4">
        <Particles
          className="fixed inset-0 pointer-events-none z-0"
          quantity={120}
          staticity={50}
          ease={50}
          size={0.5}
          color={isDark ? "#ffffff" : "#000000"}
        />
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`} style={{ pointerEvents: "none" }}>
          {userName}'s Space
        </h1>
        {/* 오른쪽 상단 북마크 추가 버튼 */}
        <div className="fixed top-25 right-15 lg:right-20 xl:right-40 z-50">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow w-12 h-12 flex items-center justify-center text-2xl cursor-pointer"
            onClick={() => setAddDialogOpen(true)}
            aria-label="퀵 북마크 추가"
          >
            <FiPlus />
          </Button>
        </div>
        
        <TopBookmarks bookmarks={topBookmarks} theme={theme ?? "dark"} />
        <RecentBookmarks bookmarks={recentBookmarks} theme={theme ?? "dark"} />
        
        <BookmarkAddDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={ async (url) => {
            setSaving(true);
            const result = await addBookmark(url, setRecentBookmarks);
            setSaving(false);
            if (!result.ok) {
              setFieldErrors(result.fieldErrors ?? {});
              return;
            }
            setFieldErrors({});
            setAddDialogOpen(false);
          }}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          saving={saving}
        />
      </div>
      <div className="flex flex-col justify-between mt-12">
        <Footer />
      </div>
    </>
  );
}
