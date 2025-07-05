import { ChevronsRightIcon, MenuIcon } from "lucide-react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { NavigationDesktop } from "~/core/components/navigation-desktop";
import { SheetTrigger } from "~/core/components/ui/sheet";
import { SheetContent } from "~/core/components/ui/sheet";
import { NavigationMobile } from "~/core/components/navigation-mobile";

type TagNavProps = {
  tagName?: string;
};

const TagNav = ({ tagName }: TagNavProps) => {
  const { isLoggedIn, username, email, avatar, name } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
    email: string;
    avatar: string;
    name: string;
  }>();

  return (
    <nav className="mx-auto flex h-16 items-center justify-between border-b px-5 shadow-xs backdrop-blur-lg transition-opacity md:px-10">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between py-3">
        <h1 className="flex items-center gap-2 text-lg">
          <Link
            to="/"
            className="text-muted-foreground text-lg font-extrabold"
            viewTransition
          >
            {import.meta.env.VITE_APP_NAME}
          </Link>
          <ChevronsRightIcon className="text-muted-foreground size-4" />
          <Link to="/tags" className="font-semibold" viewTransition>
            Tags
          </Link>
          {tagName && (
            <>
              <ChevronsRightIcon className="text-muted-foreground size-4" />
              <span className="font-semibold text-primary">#{tagName}</span>
            </>
          )}
        </h1>
        {!isLoggedIn ? (
          <NavigationDesktop loading={false} displayType="tags"/>
        ) : (
          <NavigationDesktop loading={false} displayType="tags" 
                              name={name || "Anonymous"} 
                              email={email} 
                              avatarUrl={avatar} />
        )}
        <SheetTrigger className="size-6 md:hidden">
          <MenuIcon />  
        </SheetTrigger>
        <SheetContent>
          {!isLoggedIn ? (
            <NavigationMobile loading={false} displayType="tags"/>
          ) : (
            <NavigationMobile loading={false} displayType="tags" 
                              name={name || "Anonymous"} 
                              email={email} 
                              avatarUrl={avatar} />
          )}
        </SheetContent>
      </div>
    </nav>
  );
}

export default function TagLayout() {
  const location = useLocation();
  const tagName = location.state?.tagName;
  return (
    <>
      <TagNav tagName={tagName} />
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-16 md:px-10">
        <Outlet />
      </div>
    </>
  );
}
