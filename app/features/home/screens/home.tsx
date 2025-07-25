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

import type { Route } from "./+types/home";

import { useTranslation } from "react-i18next";

import i18next from "~/core/lib/i18next.server";
import HeroSection from "~/features/landing/components/hero";
import FeatureHighlights from "~/features/landing/components/featureHighlights";
import FinalCTASection from "~/features/landing/components/finalCTASection";
import WhoItsForSection from "~/features/landing/components/whoItsForSection";
import HowItWorksSection from "~/features/landing/components/howItWorksSection";
import makeServerClient from "~/core/lib/supa-client.server";
import { Await, useNavigate } from "react-router";
import { Suspense, useEffect } from "react";
import { NavigationBar } from "~/core/components/navigation-bar";
import { Meteors } from "components/magicui/meteors";
import { useTheme } from "remix-themes";
import { Particles } from "components/magicui/particles";
import { SparklesCore } from "components/ui/sparkles";

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

/**
 * Loader function for server-side data fetching
 * 
 * This function is executed on the server before rendering the component.
 * It:
 * 1. Extracts the user's locale from the request (via cookies or Accept-Language header)
 * 2. Creates a translation function for that specific locale
 * 3. Returns translated strings for the page title and subtitle
 * 
 * This approach ensures that even on first load, users see content in their preferred language,
 * which improves both user experience and SEO (search engines see localized content).
 * 
 * @param request - The incoming HTTP request containing locale information
 * @returns Object with translated title and subtitle strings
 */
export async function loader({ request }: Route.LoaderArgs) {
  // Get a translation function for the user's locale from the request
  const t = await i18next.getFixedT(request);
  const [client] = makeServerClient(request);
  const userPromise = client.auth.getUser();
  //const { data: { user } } = await client.auth.getUser();

  //if (user) {
  //  return redirect("/linkverse");
  //}
  
  // Return translated strings for use in both the component and meta function
  return {
    title: t("home.title"),
    subtitle: t("home.subtitle"),
    userPromise,
  };
}

/**
 * Home page component
 * 
 * This is the main landing page component of the application. It displays a simple,
 * centered layout with a headline and subtitle, both internationalized using i18next.
 * 
 * Features:
 * - Uses the useTranslation hook for client-side translation
 * - Implements responsive design with Tailwind CSS
 * - Maintains consistent translations between server and client
 * 
 * The component is intentionally simple to serve as a starting point for customization.
 * It demonstrates the core patterns used throughout the application:
 * - Internationalization
 * - Responsive design
 * - Clean, semantic HTML structure
 * 
 * @returns JSX element representing the home page
 */
export default function Home({loaderData}: Route.ComponentProps) {
  const {userPromise} = loaderData;
  // Get the translation function for the current locale
  const { t } = useTranslation();
  const [theme] = useTheme();
  
  function GuestLanding() {
    return (
      <>
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
        {theme === "dark" && (
          <Meteors 
            className="fixed inset-0 pointer-events-none z-0"
            number={30} 
            startTop="-5%" 
          />
        )}
        {theme === "light" && (
          <Particles
            className="fixed inset-0 pointer-events-none z-0"
            quantity={120}
            staticity={50}
            ease={50}
            size={0.5}
            color={"#000000"}
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 w-full">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            {t("home.title")}
          </h1>
          <h2 className="text-3xl font-semibold tracking-wide text-neutral-600 dark:text-neutral-300 mt-2">
            {t("home.subtitle")}
          </h2>
          <HeroSection />
          <FeatureHighlights />
          <br />
          <WhoItsForSection />
          <br />
          <HowItWorksSection />
          <br />
          <FinalCTASection />
        </div>
      </div>
      </>
    );
  }

  function UserLanding({name}: {name: string}) {
    
    const navigate = useNavigate();
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/space");
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [navigate]);
    

    return (
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Hello {name}
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
    );
  }

  return (
    <Suspense fallback={<NavigationBar loading={true} />}>
      <Await resolve={userPromise}>
        {({data: {user}}) =>
          user === null ? (
            <>
              <GuestLanding />
            </>
          ) : (
            <>
              <UserLanding name={user.user_metadata.name || ""} />
            </>
          )
        }
      </Await>
    </Suspense>
  );
}
