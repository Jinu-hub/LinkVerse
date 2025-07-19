import type { Route } from "./+types/faq";
import { Link } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/core/components/ui/accordion";
import { Button } from "~/core/components/ui/button";


export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `FAQ | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};
  
export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto py-0 mt-0 px-4">
      <div className="flex flex-col items-center gap-2 mb-8 mt-2">
        <h2 className="text-3xl font-extrabold text-center tracking-tight">📚 FAQ <span className="text-primary">자주 묻는 질문</span></h2>
      </div>

      <Accordion type="multiple" className="w-full rounded-xl border border-border divide-y divide-border overflow-hidden shadow bg-background/80 backdrop-blur mb-8">
        {/* 💡 기본 정보 */}
        <AccordionItem value="q1">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">💡LinkVerse는 어떤 서비스인가요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            <span className="font-medium text-primary">LinkVerse</span>는 웹에서 찾은 정보를 저장하고, 정리하고, 다시 찾기 쉽게 도와주는 <span className="font-medium">개인 맞춤형 브라우징 도구</span>입니다. <span className="font-medium">북마크, 메모, 태그, 카테고리</span> 기능을 통해 지식과 관심사를 체계적으로 관리할 수 있습니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🪪 회원가입은 꼭 해야 하나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            네, <span className="font-medium">북마크와 메모를 안전하게 저장</span>하고 여러 기기에서 <span className="font-medium">동기화</span>하기 위해 회원가입이 필요합니다.
          </AccordionContent>
        </AccordionItem>

        {/* 🔖 북마크 관련 */}
        <AccordionItem value="q3">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🔖 어떻게 북마크를 추가하나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            로그인 후 홈 화면 혹은 북마크 리스트 화면에서 <span className="font-medium">"북마크 추가"</span> 버튼을 통해 현재 페이지를 <span className="font-medium text-primary">간편하게 저장</span>할 수 있습니다. 제목과 썸네일, 설명 등이 자동으로 추출되며, 원하는 태그나 카테고리를 함께 지정할 수 있습니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🔄 임포트 기능은 지원하나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            기존 브라우저나 다른 북마크 서비스에서 내보낸 <span className="font-medium">HTML 파일 업로드</span>로 LinkVerse로 가져오는 기능을 추후 지원할 예정입니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q5">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🔍 저장된 북마크를 나중에 어떻게 찾을 수 있나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            <span className="font-medium">검색 기능, 태그 필터, 카테고리 분류</span>를 통해 원하는 링크를 빠르게 찾을 수 있습니다.
          </AccordionContent>
        </AccordionItem>

        {/* 🗂️ 카테고리 & 태그 */}
        <AccordionItem value="q6">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🗂️ 태그와 카테고리는 어떤 차이가 있나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            <span className="font-medium">카테고리</span>는 큰 범주로 나눌 때 사용하며, 하나의 북마크는 하나의 카테고리에만 속할 수 있습니다.<br /><br />
            <span className="font-medium">태그</span>는 자유롭게 여러 개를 지정할 수 있어, 보다 <span className="text-primary">유연한 분류와 검색</span>이 가능합니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q7">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🏷️ 자주 쓰는 태그를 추천받을 수 있나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            태그 입력 시 기존에 사용한 태그 목록에서 <span className="font-medium">자동 추천</span>이 제공되어 빠르게 선택할 수 있습니다.
          </AccordionContent>
        </AccordionItem>

        {/* 📝 메모 기능 */}
        <AccordionItem value="q8">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">📝 메모는 어떤 용도로 쓰이나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            각 북마크에 <span className="font-medium">간단한 설명, 요약, 느낀 점</span> 등을 기록할 수 있어, 나중에 해당 링크를 다시 봤을 때 <span className="font-medium text-primary">맥락 파악</span>이 쉽습니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q9">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">✍️ 마크다운을 지원하나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            기본 텍스트 입력을 제공하며, <span className="font-medium">향후 마크다운 및 포맷팅 기능</span>이 추가될 예정입니다.
          </AccordionContent>
        </AccordionItem>

        {/* 📱 사용성 및 플랫폼 */}
        <AccordionItem value="q10">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">📱 모바일에서도 사용할 수 있나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            네, <span className="font-medium text-primary">모바일 웹 환경에 최적화</span>되어 있어 스마트폰에서도 <span className="font-medium">편리하게</span> 사용할 수 있으며, 추후 앱도 지원할 예정입니다.<br />
            <span className="text-xs text-muted-foreground">MVP버전에서는 최적화 작업으로 인해 모바일에서는 일부 기능에 한해서 제한이 있을 수 있습니다.</span>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q11">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🔒 데이터는 안전하게 저장되나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            모든 데이터는 <span className="font-medium">보안이 강화된 서버</span>에 저장되며, 사용자의 정보는 <span className="font-medium text-primary">암호화</span>되어 관리됩니다.
          </AccordionContent>
        </AccordionItem>

        {/* 🧪 기능 제안 및 오류 제보 */}
        <AccordionItem value="q12">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🧪 새로운 기능을 제안하거나 버그를 신고하고 싶어요.</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            서비스 내 <a href="/contact" className="text-primary underline">문의 폼</a>을 통해 언제든지 <span className="font-medium">제안과 문제</span>를 공유해주세요. 빠르게 검토 후 반영하겠습니다.
          </AccordionContent>
        </AccordionItem>

        {/* 🧾 요금제 및 정책 */}
        <AccordionItem value="q13">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">🧾 LinkVerse는 무료인가요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            현재는 <span className="font-medium">모든 기능을 무료</span>로 제공하고 있습니다. 향후 일부 고급 기능에 대해 <span className="font-medium text-primary">유료 플랜</span>이 도입될 수 있으며, 기존 사용자는 사전 안내를 받게 됩니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q14">
          <AccordionTrigger className="px-8 py-5 text-lg font-semibold flex items-center gap-2 hover:bg-muted transition-colors">
            <span className="text-primary">💾 데이터를 백업하거나 내보낼 수 있나요?</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8 pt-2 text-base text-muted-foreground animate-accordion-down bg-muted/40">
            내 북마크 데이터를 <span className="font-medium">HTML이나 CSV로 내보내는 기능</span>을 추후 지원할 예정 입니다.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-14 text-center">
        <div className="text-lg mb-4">추가로 궁금한 점이 있으신가요?</div>
        <Button variant="outline" size="lg" asChild className="text-lg px-12 py-6 font-bold">
          <Link
              to="/contact"
              viewTransition
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
              <span className="text-base font-bold">문의하기</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
  