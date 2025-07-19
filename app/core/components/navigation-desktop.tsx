import { Link } from "react-router";
import { Actions } from "./navigation-bar";
import { UserMenu } from "./navigation-bar";
import { AuthButtons } from "./navigation-bar";
import { Separator } from "./ui/separator";
import type { DisplayType } from "~/core/lib/types";

interface NavigationDesktopProps {
  loading: boolean;
  displayType?: DisplayType;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export function NavigationDesktop({ loading, displayType = "default", name, email, avatarUrl }: NavigationDesktopProps) {
  return (
    <div className="hidden h-full items-center gap-5 md:flex">
      {/* Main navigation links */}
      {name && (
        <>
          {displayType !== "bookmarks" && (
            <Link
              to="/bookmarks"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Bookmarks
            </Link>
          )}
          {displayType !== "tags" && (
            <Link
              to="/tags"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Tags
            </Link>
          )}
          {displayType !== "memos" && (
            <Link
              to="/memos"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Memos
            </Link>
          )}
          {displayType !== "untagged" && (
            <Link
              to="/untagged"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Untagged
            </Link>
          )}
        </>
      )}
      <Separator orientation="vertical" />
      <Link
        to="/faq"
        viewTransition
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        FAQ
      </Link>
      <Link
        to="/contact"
        viewTransition
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        Contact
      </Link>
      {/*
      <Link
        to="/blog"
        viewTransition
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        Blog
      </Link>
      */}
      {/*
      <Link
        to="/payments/checkout"
        viewTransition
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        Payments
      </Link>
      */}
      <Separator orientation="vertical" />
      {/* Settings, theme switcher, and language switcher */}
      <Actions />
      <Separator orientation="vertical" />
      {/* Conditional rendering based on authentication state */}
      {loading ? (
        // Loading state with skeleton placeholder
        <div className="flex items-center">
          <div className="bg-muted-foreground/20 size-8 animate-pulse rounded-lg" />
        </div>
      ) : (
        <>
          {name ? (
            // Authenticated state with user menu
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            // Unauthenticated state with auth buttons
            <AuthButtons />
          )}
        </>
      )}
    </div>
  );
} 