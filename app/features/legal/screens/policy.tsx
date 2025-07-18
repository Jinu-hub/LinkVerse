/**
 * Legal Policy Page Component
 * 
 * This file implements a dynamic legal document page that renders MDX content.
 * It's designed to display various legal documents (privacy policy, terms of service, etc.)
 * from MDX files with consistent styling and navigation.
 * 
 * Key features:
 * - Dynamic MDX content loading based on URL parameters
 * - Frontmatter extraction for metadata (title, description)
 * - Consistent typography and styling for legal documents
 * - SEO-friendly metadata
 * - Proper error handling for missing documents
 */

import type { Route } from "./+types/policy";

import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "node:path";
import { Link, data } from "react-router";

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyList,
  TypographyOrderedList,
  TypographyP,
} from "~/core/components/mdx-typography"; // Typography components for consistent MDX styling
import { Button } from "~/core/components/ui/button";

/**
 * Meta function for setting page metadata
 * 
 * This function generates SEO-friendly metadata for legal policy pages.
 * It handles two scenarios:
 * 1. When data is available (valid policy page):
 *    - Sets page title using the document's frontmatter title
 *    - Sets meta description using the document's frontmatter description
 * 2. When data is not available (404 error):
 *    - Sets a 404 page title
 * 
 * This approach ensures proper SEO for both valid pages and error states.
 * 
 * @param data - Data returned from the loader function containing MDX frontmatter
 * @returns Array of metadata objects for the page
 */
export const meta: Route.MetaFunction = ({ data }) => {
  // Handle case where the policy document doesn't exist (404)
  if (!data) {
    return [
      {
        title: `404 Page Not Found | ${import.meta.env.VITE_APP_NAME}`,
      },
    ];
  }
  
  // For valid policy documents, use frontmatter for metadata
  return [
    {
      title: `${data.frontmatter.title} | ${import.meta.env.VITE_APP_NAME}`,
    },
    {
      name: "description",
      content: data.frontmatter.description,
    },
  ];
};

/**
 * Loader function for fetching and processing MDX content
 * 
 * This function performs several key operations:
 * 1. Constructs the file path to the requested legal document based on URL params
 * 2. Loads and bundles the MDX content using mdx-bundler
 * 3. Extracts frontmatter metadata and compiled code
 * 4. Handles errors with appropriate HTTP status codes
 * 
 * Error handling:
 * - Returns 404 for missing documents (ENOENT errors)
 * - Returns 500 for other processing errors
 * 
 * @param params - URL parameters containing the document slug
 * @returns Object with frontmatter metadata and compiled MDX code
 */
export async function loader({ params }: Route.LoaderArgs) {
  // Construct the file path to the requested legal document
  const filePath = path.join(
    process.cwd(),
    "app",
    "features",
    "legal",
    "docs",
    `${params.slug}.mdx`, // Use the slug from URL params to find the correct document
  );
  
  try {
    // Load and bundle the MDX content
    const { code, frontmatter } = await bundleMDX({
      file: filePath,
    });
    
    // Return the compiled code and frontmatter metadata
    return {
      frontmatter,
      code,
    };
  } catch (error) {
    // Handle file not found errors with 404 status
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw data(null, { status: 404 });
    }
    // Handle all other errors with 500 status
    throw data(null, { status: 500 });
  }
}

/**
 * Policy page component for rendering legal documents
 * 
 * This component renders MDX content with consistent styling for legal documents.
 * It provides:
 * 1. A navigation button to return to the home page
 * 2. The MDX content with styled typography components
 * 3. Responsive layout with appropriate spacing and width constraints
 * 
 * The component uses the getMDXComponent function to transform the compiled MDX code
 * into a React component, then applies custom typography components to ensure
 * consistent styling across all legal documents.
 * 
 * @param loaderData - Data from the loader containing frontmatter and compiled MDX code
 * @returns JSX element representing the policy page
 */
export default function Policy({
  loaderData: { frontmatter, code },
}: Route.ComponentProps) {
  // Convert the compiled MDX code into a React component
  const MDXContent = getMDXComponent(code);
  
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-10 px-5 py-10 md:px-10 md:py-20">
      {/* Navigation button to return to home page */}
      <Button variant="outline" asChild>
        <Link to="/" viewTransition>
          &larr; Go home
        </Link>
      </Button>
      {/*
      <article>
        <header>
          <h1>📜 LinkVerse 개인정보 처리방침</h1>
          <p>
            <strong>최종 업데이트일 : 2025년 7월 18일</strong>
          </p>
        </header>
        <p>LinkVerse(이하 ‘회사’ 또는 ‘당사’)는 사용자의 개인정보 보호를 매우 중요하게 생각합니다. 당사는 「개인정보 보호법」 및 관련 법령에 따라 개인정보를 안전하게 처리하고, 그 권리를 보호하기 위해 최선을 다하고 있습니다.</p>
        <p>본 방침은 LinkVerse 웹/모바일 서비스 이용과 관련하여 수집하는 개인정보의 항목, 처리 목적, 보관 기간 및 이용자의 권리 등을 안내합니다.</p>
        <section>
          <h2>1. 수집하는 개인정보 항목</h2>
          <p>서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
          <table>
            <thead>
              <tr>
                <th scope="col">수집 항목</th>
                <th scope="col">수집 시점</th>
                <th scope="col">수집 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>이메일 주소</td>
                <td>회원가입 또는 로그인 시</td>
                <td>계정 생성, 로그인 및 알림 전송</td>
              </tr>
              <tr>
                <td>닉네임</td>
                <td>프로필 설정 시</td>
                <td>개인화된 서비스 제공</td>
              </tr>
              <tr>
                <td>비밀번호 (암호화 저장)</td>
                <td>회원가입 시</td>
                <td>계정 보호 및 인증</td>
              </tr>
              <tr>
                <td>북마크 및 메모 데이터</td>
                <td>서비스 이용 중</td>
                <td>콘텐츠 저장, 동기화 및 개인 맞춤 기능 제공</td>
              </tr>
              <tr>
                <td>태그 및 카테고리 사용 기록</td>
                <td>서비스 이용 중</td>
                <td>UX 개선 및 정리 기능 제공</td>
              </tr>
              <tr>
                <td>접속 정보 (IP, 브라우저 등)</td>
                <td>서비스 이용 시</td>
                <td>보안, 로그 분석, 운영 개선</td>
              </tr>
            </tbody>
          </table>
          <p>※ 이메일 인증을 통한 본인 확인이 필요할 수 있으며, 선택 항목은 거부하더라도 기본 서비스 이용에는 제한이 없습니다.</p>
        </section>

        <section>
          <h2>2. 개인정보 수집 및 이용 목적</h2>
          <ul>
            <li>계정 생성 및 로그인</li>
            <li>개인화된 북마크, 메모 및 태그 데이터 저장/동기화</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>고객 문의 및 기술 지원</li>
            <li>보안 및 부정 이용 방지</li>
            <li>마케팅/공지사항 등 전달 (선택 동의 시)</li>
          </ul>
        </section>

        <section>
          <h2>3. 개인정보 보유 및 이용 기간</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">보관 항목</th>
                <th scope="col">보유 기간</th>
                <th scope="col">관련 법령</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>계약 및 서비스 이용 기록</td>
                <td>5년</td>
                <td>전자상거래법</td>
              </tr>
              <tr>
                <td>전자금융 거래기록</td>
                <td>5년</td>
                <td>전자금융거래법</td>
              </tr>
              <tr>
                <td>고객 문의 및 분쟁 처리 기록</td>
                <td>3년</td>
                <td>전자상거래법</td>
              </tr>
              <tr>
                <td>접속 로그</td>
                <td>3개월</td>
                <td>통신비밀보호법</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>4. 제3자 제공 및 외부 위탁</h2>
          <p>회사는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 아래의 경우는 예외입니다.</p>
          <ul>
            <li>이용자의 사전 동의가 있는 경우</li>
            <li>법령에 의거하거나 수사기관의 요청이 있는 경우</li>
          </ul>
          <p>또한 서비스 제공을 위해 일부 업무를 외부 업체에 위탁할 수 있으며, 이 경우 필요한 사항을 고지하고 동의를 받습니다.</p>

          <table>
            <thead>
              <tr>
                <th scope="col">수탁사</th>
                <th scope="col">위탁 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amazon Web Services (AWS)</td>
                <td>데이터 보관 및 서버 운영</td>
              </tr>
              <tr>
                <td>Supabase</td>
                <td>사용자 계정 및 데이터 저장 관리</td>
              </tr>
              <tr>
                <td>이메일 발송 서비스 (선택)</td>
                <td>알림, 마케팅 이메일 전송</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>5. 쿠키(Cookie) 및 추적 기술</h2>
          <p>당사는 사용자 경험 개선 및 트래픽 분석을 위해 쿠키를 사용할 수 있습니다. 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.</p>
        </section>

        <section>
          <h2>6. 이용자의 권리와 행사 방법</h2>
          <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul>
            <li>개인정보 열람, 수정, 삭제 요청</li>
            <li>수집 및 이용 동의 철회</li>
            <li>계정 탈퇴 및 데이터 완전 삭제 요청</li>
          </ul>
          <p>관련 문의는 support@linkverse.app 으로 이메일을 보내주시기 바랍니다.</p>
        </section>

        <section>
          <h2>7. 개인정보의 파기</h2>
          <p>보유 기간이 경과하거나 목적이 달성된 경우, 수집된 개인정보는 지체 없이 다음과 같은 방법으로 파기됩니다.</p>
          <ul>
            <li>전자적 파일: 복구 불가능한 방식으로 삭제</li>
            <li>종이 문서: 분쇄 또는 소각 처리</li>
          </ul>
        </section>

        <section>
          <h2>8. 개인정보 보호 조치</h2>
          <ul>
            <li>비밀번호 및 주요 정보 암호화 저장</li>
            <li>접근 통제 및 권한 최소화</li>
            <li>WAF 등 보안 시스템 운영</li>
            <li>정기적인 보안 점검 및 취약점 분석</li>
          </ul>
        </section>

        <section>
          <h2>9. 개인정보 보호 책임자</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>책임자</td>
                <td>이지은 (예시)</td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>
                  <a href="mailto:support@linkverse.app">support@linkverse.app</a>
                </td>
              </tr>
              <tr>
                <td>업무</td>
                <td>개인정보 보호 및 문의 대응</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>10. 정책 변경 고지</h2>
          <p>개인정보처리방침이 변경되는 경우에는 변경 내용을 웹사이트 또는 이메일을 통해 사전 고지합니다.</p>
        </section>

        <section>
          <h2>📬 문의</h2>
          <p>
            개인정보 보호 관련 문의는 언제든지
            <a href="mailto:support@linkverse.app">support@linkverse.app</a>
            으로 연락주시기 바랍니다.
          </p>
        </section>
      </article>
      */}
      {/* MDX content container */}
      <div>
        <MDXContent
          components={{
            // Map MDX elements to custom typography components
            // This ensures consistent styling across all legal documents
            h1: TypographyH1,
            h2: TypographyH2,
            h3: TypographyH3,
            h4: TypographyH4,
            p: TypographyP,
            blockquote: TypographyBlockquote,
            ul: TypographyList,
            ol: TypographyOrderedList,
            code: TypographyInlineCode,
          }}
        />
      </div>
    </div>
  );
}
