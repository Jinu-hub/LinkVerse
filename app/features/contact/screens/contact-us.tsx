import { Button } from "~/core/components/ui/button";
import type { Route } from "./+types/contact-us";
import { Link } from "react-router";
import { Mail } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `Contact Us | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

export default function ContactUs() {
 
  return (
    <div className="flex flex-col items-center gap-20">
      <div>
        <h1 className="text-center text-3xl font-semibold tracking-tight md:text-5xl">
          문의하기
        </h1>
        <p className="text-muted-foreground mt-2 text-center font-medium md:text-lg">
          궁금한 점이나 제안사항이 있으시다면 언제든 연락주세요. 빠르게 답변드리겠습니다.
        </p>
        <div className="mt-14 text-center">
          <Button variant="outline" size="lg" asChild className="text-lg px-12 py-6 font-bold">
            <a
                href="mailto:jinu30dev@gmail.com"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                <Mail className="mr-2 h-5 w-5" />
                <span className="text-base font-bold">jinu30dev@gmail.com</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
