import { ChevronsRightIcon } from "lucide-react";
import { Link, Outlet, useOutletContext, useParams } from "react-router";
import { mockMemoContents } from "~/features/mock-data";
import { NavigationDesktop } from "~/core/components/navigation-desktop";
import { NavigationMobile } from "~/core/components/navigation-mobile";
import { SheetContent, SheetTrigger } from "~/core/components/ui/sheet";
import { MenuIcon } from "lucide-react";

function MemoNav() {
  const { isLoggedIn, username, email, avatar, name } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
    email: string;
    avatar: string;
    name: string;
  }>();
  const { id } = useParams<{ id?: string }>();
  const memo = id ? mockMemoContents.find(m => String(m.memoId) === id) : null;

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
          <Link to="/memos" className="font-semibold" viewTransition>
            Memos
          </Link>
          {memo && (
            <>
              <ChevronsRightIcon className="text-muted-foreground size-4" />
              <span className="font-semibold text-primary">{memo.title}</span>
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
  return (
    <>
      <MemoNav />
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-16 md:px-10">
        <Outlet />
      </div>
    </>
  );
}
