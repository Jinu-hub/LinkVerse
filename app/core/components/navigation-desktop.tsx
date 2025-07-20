import { Link } from "react-router";
import { Actions } from "./navigation-bar";
import { UserMenu } from "./navigation-bar";
import { AuthButtons } from "./navigation-bar";
import { Separator } from "./ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { DisplayType } from "~/core/lib/types";

interface NavigationDesktopProps {
  loading: boolean;
  displayType?: DisplayType;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export function NavigationDesktop({ loading, displayType = "default", name, email, avatarUrl }: NavigationDesktopProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          
          {displayType !== "tags" && displayType !== "untagged" && (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link
                    to="/tags"
                    viewTransition
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Tags
                  </Link>
                  <ChevronDownIcon className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/tags"
                    viewTransition
                    className="w-full cursor-pointer"
                  >
                    All Tags
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/untagged"
                    viewTransition
                    className="w-full cursor-pointer"
                  >
                    Untagged Contents
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {displayType === "untagged" && (
            <div className="flex items-center gap-1 text-foreground text-sm font-medium">
              <Link
                to="/tags"
                viewTransition
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Tags
              </Link>
            </div>
          )}
          
          {displayType === "tags" && (
            <div className="flex items-center gap-1 text-foreground text-sm font-medium">
              <Link
                to="/untagged"
                viewTransition
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Untagged
              </Link>
            </div>
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