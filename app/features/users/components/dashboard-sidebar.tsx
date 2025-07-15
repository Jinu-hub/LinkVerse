import {
  AudioWaveformIcon,
  BookOpenIcon,
  BotIcon,
  BriefcaseIcon,
  BuildingIcon,
  CommandIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MapIcon,
  MegaphoneIcon,
  PieChartIcon,
  RocketIcon,
  Settings2Icon,
  SquareTerminalIcon,
  Target,
  UsersIcon,
  UserIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/core/components/ui/sidebar";

import SidebarMain from "./sidebar-main";
import SidebarProjects from "./sidebar-projects";
import TeamSwitcher from "./sidebar-team-switcher";
import SidebarUser from "./sidebar-user";
import { Button } from "~/core/components/ui/button";
import { Link, useLocation } from "react-router";

const data = {
  teams: [
    {
      name: "SalesForge",
      logo: BuildingIcon,
      plan: "Enterprise",
    },
    {
      name: "TechCo Solutions",
      logo: BriefcaseIcon,
      plan: "Startup",
    },
    {
      name: "GrowthMate",
      logo: RocketIcon,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: UsersIcon,
      items: [
        {
          title: "Contacts",
          url: "#",
        },
        {
          title: "Companies",
          url: "#",
        },
        {
          title: "Deals",
          url: "#",
        },
      ],
    },
    {
      title: "Sales",
      url: "#",
      icon: LineChartIcon,
      items: [
        {
          title: "Pipeline",
          url: "#",
        },
        {
          title: "Opportunities",
          url: "#",
        },
        {
          title: "Quotes",
          url: "#",
        },
        {
          title: "Invoices",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "Workspace",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Integrations",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Sales Team",
      url: "#",
      icon: Target,
    },
    {
      name: "Customer Success",
      url: "#",
      icon: HeartHandshakeIcon,
    },
    {
      name: "Marketing",
      url: "#",
      icon: MegaphoneIcon,
    },
  ],
};

export default function DashboardSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}) {
  const location = useLocation();
  const isAccount = location.pathname === "/account/edit";
  const isSettings = location.pathname === "/settings";

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        {/*
        <TeamSwitcher teams={data.teams} />
        */}
        <Button variant="outline" asChild>
          <Link to="/" viewTransition>
            &larr; Go home
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col gap-2 p-4">
          <Button
            variant={isAccount ? "secondary" : "ghost"}
            asChild
            className={`justify-start px-2 py-3 text-xl font-semibold
              ${isAccount ? "bg-primary text-white dark:bg-zinc-800 dark:text-primary" : ""}
            `}
          >
            <Link to="/account/edit" className="flex items-center gap-2">
              <UserIcon className="w-6 h-6" />
              <span className="text-base">User Account</span>
            </Link>
          </Button>
          <Button
            variant={isSettings ? "secondary" : "ghost"}
            asChild
            className={`justify-start px-2 py-3 text-xl font-semibold
              ${isSettings ? "bg-primary text-white dark:bg-zinc-800 dark:text-primary" : ""}
            `}
          >
            <Link to="/settings" className="flex items-center gap-2">
              <Settings2Icon className="w-6 h-6" />
              <span className="text-base">Settings</span>
            </Link>
          </Button>
        </nav>
        {/*
        <SidebarMain items={data.navMain} />
        */}
        {/*
        <SidebarProjects projects={data.projects} />
        */}
      </SidebarContent>
      <SidebarFooter>
        {/*
        <SidebarUser
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }}
        />
        */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
