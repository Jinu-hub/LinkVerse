import { ChevronsRightIcon } from "lucide-react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { NavigationDesktop } from "~/core/components/navigation-desktop";
import { NavigationMobile } from "~/core/components/navigation-mobile";
import { SheetContent, SheetTrigger } from "~/core/components/ui/sheet";
import { MenuIcon } from "lucide-react";

type MemoNavProps = {
  title?: string;
};

const MemoNav = ({ title }: MemoNavProps) => {
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
            to="/space"
            className="text-muted-foreground text-lg font-extrabold"
            viewTransition
          >
            {import.meta.env.VITE_APP_NAME}
          </Link>
          <ChevronsRightIcon className="text-muted-foreground size-4" />
          <Link to="/memos" className="font-semibold" viewTransition>
            Memos
          </Link>
          {title && (
            <>
              <ChevronsRightIcon className="text-muted-foreground size-4" />
              <span className="font-semibold text-primary">{title.length > 16 
                ? `${title.substring(0, 16)}...` 
                : title}</span>
            </>
          )}
        </h1>
        {!isLoggedIn ? (
          <NavigationDesktop loading={false} displayType="memos"/>
        ) : (
          <NavigationDesktop loading={false} displayType="memos" 
                              name={name || "Anonymous"} 
                              email={email} 
                              avatarUrl={avatar} />
        )}
        <SheetTrigger className="size-6 md:hidden">
          <MenuIcon />  
        </SheetTrigger>
        <SheetContent>
          {!isLoggedIn ? (
            <NavigationMobile loading={false} displayType="memos"/>
          ) : (
            <NavigationMobile loading={false} displayType="memos" 
                              name={name || "Anonymous"} 
                              email={email} 
                              avatarUrl={avatar} />
          )}
        </SheetContent>
      </div>
    </nav>
  );
}

export default function MemoLayout() {
  const location = useLocation();
  const title = location.state?.title;
  return (
    <>
      <MemoNav title={title} />
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-16 md:px-10">
        <Outlet />
      </div>
    </>
  );
}
