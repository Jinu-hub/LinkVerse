import { CardContent } from "~/core/components/ui/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { SunIcon } from "lucide-react";
import { MoonIcon } from "lucide-react";
import { MonitorIcon } from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
export default function SettingTheme() {

  const [theme, setTheme, metadata] = useTheme();

  return (
      <Card className="justify-between w-full max-w-screen-md">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Change your theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            defaultValue={theme ?? "system"}
            className="grid grid-cols-3 gap-4"
          >
            <ToggleGroupItem
              value={Theme.LIGHT}
              onClick={() => setTheme(Theme.LIGHT)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-primary data-[state=on]:text-white
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <SunIcon className="w-7 h-7 mb-1" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem
              value={Theme.DARK}
              onClick={() => setTheme(Theme.DARK)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-zinc-900 data-[state=on]:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <MoonIcon className="w-7 h-7 mb-1" />
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem
              value="system"
              onClick={() => setTheme(null)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-muted data-[state=on]:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <MonitorIcon className="w-7 h-7 mb-1" />
              System
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
  );
}
