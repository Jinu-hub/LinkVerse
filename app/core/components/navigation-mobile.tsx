import type { DisplayType } from "~/locales/types";
import { Actions, UserMenu, AuthButtons } from "./navigation-bar";
import { SheetHeader, SheetFooter, SheetClose } from "./ui/sheet";
import { Link } from "react-router";

interface NavigationMobileProps {
  loading: boolean;
  displayType?: DisplayType;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export function NavigationMobile({ loading, displayType = "default", name, email, avatarUrl }: NavigationMobileProps) {
  return (
    <>
      <SheetHeader>
        {displayType !== "bookmarks" && (
          <SheetClose asChild>
            <Link to="/bookmarks">Bookmarks</Link>
          </SheetClose>
        )}
        {displayType !== "tags" && (
          <SheetClose asChild>
            <Link to="/tags">Tags</Link>
          </SheetClose>
        )}
        {displayType !== "memos" && (
            <SheetClose asChild>
            <Link to="/memos">Memos</Link>
            </SheetClose>
        )}
        {/*
        <SheetClose asChild>
          <Link to="/blog">Blog</Link>
        </SheetClose>
        */}
        <SheetClose asChild>
          <Link to="/contact">Contact</Link>
        </SheetClose>
        {/*
        <SheetClose asChild>
          <Link to="/payments/checkout">Payments</Link>
        </SheetClose>
        */}
      </SheetHeader>
      {loading ? (
        <div className="flex items-center">
          <div className="bg-muted-foreground h-4 w-24 animate-pulse rounded-full" />
        </div>
      ) : (
        <SheetFooter>
          {name ? (
            <div className="grid grid-cols-3">
              <div className="col-span-2 flex w-full justify-between">
                <Actions />
              </div>
              {displayType === "default" && (
                <div className="flex justify-end">
                  <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between">
                <Actions />
              </div>
              {displayType === "default" && (
                <div className="grid grid-cols-2 gap-2">
                  <AuthButtons />
                </div>
              )}
            </div>
          )}
        </SheetFooter>
      )}
    </>
  );
} 