import { Resend } from "resend";
import WelcomeUser from "transactional-emails/emails/welcome-user";

import type { Route } from "./+types/welcome";

const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async ({ params }: Route.LoaderArgs) => {
    // TODO: 파라메터로 유저ID를 받아서 유저 정보 조회 후 이메일 발송
  const { username } = params;
  const { data, error } = await client.emails.send({
    from: "LinkVerse <hello@mail.linkverse.app>",
    to: ["takefree2020withu@gmail.com"],
    subject: "Welcome to LinkVerse",
    react: <WelcomeUser username={username} />,
  });
  return Response.json({ data, error });
};