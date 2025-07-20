import type { DisplayType } from "~/core/lib/types";
import { Actions, UserMenu, AuthButtons } from "./navigation-bar";
import { SheetHeader, SheetFooter, SheetClose } from "./ui/sheet";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "./ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

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
        {name && (
          <>
          {displayType !== "bookmarks" && (
            <SheetClose asChild>
              <Link to="/bookmarks" className="font-medium">Bookmarks</Link>
            </SheetClose>
          )}
          
          {displayType !== "tags" && displayType !== "untagged" && (
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left font-medium">
                <SheetClose asChild>
                  <Link to="/tags" className="font-medium">Tags</Link>
                </SheetClose>
                <ChevronDownIcon className="size-4 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-2">
                <SheetClose asChild>
                  <Link to="/tags" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                    All Tags
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/untagged" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                    Untagged Contents
                  </Link>
                </SheetClose>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {displayType === "tags" && (
            <SheetClose asChild>
              <Link to="/untagged" className="font-medium text-foreground">Untagged</Link>
            </SheetClose>
          )}

          {displayType === "untagged" && (
            <SheetClose asChild>
              <Link to="/tags" className="font-medium text-foreground">Tags</Link>
            </SheetClose>
          )}
          
          {displayType !== "memos" && (
            <SheetClose asChild>
              <Link to="/memos" className="font-medium">Memos</Link>
            </SheetClose>
          )}
          </>
        )}
        <Separator orientation="horizontal" />
        <SheetClose asChild>
          <Link to="/faq">FAQ</Link>
        </SheetClose>
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