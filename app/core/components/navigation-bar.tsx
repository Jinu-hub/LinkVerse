/**
 * Navigation Bar Component
 *
 * A responsive navigation header that adapts to different screen sizes and user authentication states.
 * This component provides the main navigation interface for the application, including:
 *
 * - Responsive design with desktop and mobile layouts
 * - User authentication state awareness (logged in vs. logged out)
 * - User profile menu with avatar and dropdown options
 * - Theme switching functionality
 * - Language switching functionality
 * - Mobile-friendly navigation drawer
 *
 * The component handles different states:
 * - Loading state with skeleton placeholders
 * - Authenticated state with user profile information
 * - Unauthenticated state with sign in/sign up buttons
 */
import { HomeIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

import LangSwitcher from "./lang-switcher";
import ThemeSwitcher from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import {
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { NavigationDesktop } from "./navigation-desktop";
import { NavigationMobile } from "./navigation-mobile";

/**
 * UserMenu Component
 * 
 * Displays the authenticated user's profile menu with avatar and dropdown options.
 * This component is shown in the navigation bar when a user is logged in and provides
 * quick access to user-specific actions and information.
 * 
 * Features:
 * - Avatar display with image or fallback initials
 * - User name and email display
 * - Quick navigation to dashboard
 * - Logout functionality
 * 
 * @param name - The user's display name
 * @param email - The user's email address (optional)
 * @param avatarUrl - URL to the user's avatar image (optional)
 * @returns A dropdown menu component with user information and actions
 */
export function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email?: string;
  avatarUrl?: string | null;
}) {
  return (
    <DropdownMenu>
      {/* Avatar as the dropdown trigger */}
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer rounded-lg">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      {/* Dropdown content with user info and actions */}
      <DropdownMenuContent className="w-56">
        {/* User information display */}
        <DropdownMenuLabel className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{name}</span>
          <span className="truncate text-xs">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dashboard link */}
        {/*
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/dashboard" viewTransition>
              <HomeIcon className="size-4" />
              Dashboard
            </Link>
          </SheetClose>
        </DropdownMenuItem>
        */}
        
        {/* Account link */}
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/account/edit" viewTransition>
              <UserIcon className="size-4" />
              Account
            </Link>
          </SheetClose>
        </DropdownMenuItem>
        
        {/* Logout link */}
        <DropdownMenuItem asChild>
          <SheetClose asChild>
            <Link to="/logout" viewTransition>
              <LogOutIcon className="size-4" />
              Log out
            </Link>
          </SheetClose>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * AuthButtons Component
 * 
 * Displays authentication buttons (Sign in and Sign up) for unauthenticated users.
 * This component is shown in the navigation bar when no user is logged in and provides
 * quick access to authentication screens.
 * 
 * Features:
 * - Sign in button with ghost styling (less prominent)
 * - Sign up button with default styling (more prominent)
 * - View transitions for smooth navigation to auth screens
 * - Compatible with mobile navigation drawer (SheetClose integration)
 * 
 * @returns Fragment containing sign in and sign up buttons
 */
export function AuthButtons() {
  const location = useLocation();
  const isJoinPage = location.pathname === "/join";
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Sign in button (less prominent) */}
      {!isLoginPage && (
        <Button variant="outline" asChild>
          <SheetClose asChild>
            <Link to="/login" viewTransition>
              Sign in
            </Link>
          </SheetClose>
        </Button>
      )}
      
      {/* Sign up button (more prominent) */}
      {!isJoinPage && (
        <Button variant="default" asChild>
          <SheetClose asChild>
            <Link to="/join" viewTransition>
              Sign up
            </Link>
          </SheetClose>
        </Button>
      )}
    </>
  );
}

/**
 * Actions Component
 * 
 * Displays utility actions and settings in the navigation bar, including:
 * - Debug/settings dropdown menu with links to monitoring tools
 * - Theme switcher for toggling between light and dark mode
 * - Language switcher for changing the application language
 * 
 * This component is shown in the navigation bar for all users regardless of
 * authentication state and provides access to application-wide settings and tools.
 * 
 * @returns Fragment containing settings dropdown, theme switcher, and language switcher
 */
export function Actions() {
  return (
    <>
      {/* Settings/debug dropdown menu */}
      {/*
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button variant="ghost" size="icon">
            <CogIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <SheetClose asChild>
              <Link to="/debug/sentry" viewTransition>
                Sentry
              </Link>
            </SheetClose>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <SheetClose asChild>
              <Link to="/debug/analytics" viewTransition>
                Google Tag
              </Link>
            </SheetClose>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      */}
      
      {/* Theme switcher component (light/dark mode) */}
      <ThemeSwitcher />
      
      {/* Language switcher component */}
      <LangSwitcher />
    </>
  );
}

/**
 * NavigationBar Component
 * 
 * The main navigation header for the application that adapts to different screen sizes
 * and user authentication states. This component serves as the primary navigation
 * interface and combines several sub-components to create a complete navigation experience.
 * 
 * Features:
 * - Responsive design with desktop navigation and mobile drawer
 * - Application branding with localized title
 * - Main navigation links (Blog, Contact, Payments)
 * - User authentication state handling (loading, authenticated, unauthenticated)
 * - User profile menu with avatar for authenticated users
 * - Sign in/sign up buttons for unauthenticated users
 * - Theme and language switching options
 * 
 * @param name - The authenticated user's name (if available)
 * @param email - The authenticated user's email (if available)
 * @param avatarUrl - The authenticated user's avatar URL (if available)
 * @param loading - Boolean indicating if the auth state is still loading
 * @returns The complete navigation bar component
 */
export function NavigationBar({
  name,
  email,
  avatarUrl,
  loading,
}: {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  loading: boolean;
}) {
  // Get translation function for internationalization
  const { t } = useTranslation();
  
  return (
    <nav
      className={
        "mx-auto flex h-16 w-full items-center justify-between border-b px-5 shadow-xs backdrop-blur-lg transition-opacity md:px-10"
      }
    >
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between py-3">
        {/* Application logo/title with link to home */}
        <Link to="/">
          <h1 className="text-lg font-extrabold">{t("home.title")}</h1>
        </Link>
        
        {/* Desktop navigation menu (hidden on mobile) */}
        <NavigationDesktop loading={loading} name={name} email={email} avatarUrl={avatarUrl} />
        
        {/* Mobile menu trigger (hidden on desktop) */}
        <SheetTrigger className="size-6 md:hidden">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <NavigationMobile loading={loading} name={name} email={email} avatarUrl={avatarUrl} />
        </SheetContent>
      </div>
    </nav>
  );
}
