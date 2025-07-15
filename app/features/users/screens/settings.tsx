import type { Route } from "./+types/account";

import makeServerClient from "~/core/lib/supa-client.server";
import SettingTheme from "../components/settings/setting-theme";
import SettingLang from "../components/settings/setting-lang";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Settings | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  return {
    user,
  };
}

export default function Settings() {
  return (
    <div className="flex w-full flex-col items-center gap-10 pt-0 pb-8">
      <SettingTheme />
      <SettingLang />
    </div>
  );
}
