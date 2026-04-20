/**
 * Orbit Landing (`/orbit`)
 *
 * 명함 QR 코드의 랜딩 페이지.
 *
 * 목적:
 * - 내가 누구이고 (Jinu), 어떤 주체(LinkVerse)를 운영하며,
 *   그 아래 어떤 서비스들이 궤도를 돌고 있는지 한눈에 보여준다.
 * - 단순 나열이 아니라 "정체성 → 운영 주체 → 서비스들" 의 계층을
 *   시각적 흐름으로 전달한다.
 *
 * 구성:
 * 1. Hero          : Jinu → LinkVerse 의 아이덴티티 체인
 * 2. Manifesto     : 방향성 / 무엇을 만들고 있는가
 * 3. Services      : 운영 중/예정 서비스 카드 (클릭 가능)
 * 4. CTA           : 연락 / 더 알아보기
 */
import type { Route } from "./+types/home-orbit";

import { ArrowUpRight, Bookmark, Mail, Sparkles, Plus } from "lucide-react";
import { motion } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";
import { useTheme } from "remix-themes";

import { Meteors } from "components/magicui/meteors";
import { Particles } from "components/magicui/particles";
import { cn } from "~/core/lib/utils";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Jinu · LinkVerse" },
    {
      name: "description",
      content:
        "Jinu operates LinkVerse — a platform that builds tools for people who live online. Bookmarks today, more to come.",
    },
    { property: "og:title", content: "Jinu · LinkVerse" },
    {
      property: "og:description",
      content:
        "The home of services operated by LinkVerse — LinkVerse, NexLetter, Market Memory and what's next.",
    },
  ];
};

type ServiceStatus = "live" | "beta" | "soon";

type Service = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  status: ServiceStatus;
  icon: React.ReactNode;
  accent: string;
};

const SERVICES: Service[] = [
  {
    name: "LinkVerse",
    tagline: "A universe for your links.",
    description:
      "북마크에 태그와 메모를 더해, 흩어진 링크를 나만의 지식으로 재구성합니다.",
    href: "https://linkverse.app",
    status: "live",
    icon: <Bookmark className="size-5" />,
    accent: "from-sky-500/20 via-indigo-500/10 to-transparent",
  },
  {
    name: "NexLetter",
    tagline: "Newsletters, re-imagined.",
    description:
      "정보를 구조적으로 정리해 전달하는 AI 기반 리포팅 서비스입니다.",
    href: "https://nexone.ink",
    status: "beta",
    icon: <Mail className="size-5" />,
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    name: "Market Memory",
    tagline: "Your market, remembered.",
    description:
      "시장을 분석하고, 시간 속에 판단을 기록, 리포팅하는 서비스입니다.",
    href: "#",
    status: "soon",
    icon: <Sparkles className="size-5" />,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    name: "더 많은 서비스가 합류합니다",
    tagline: "More orbits, coming.",
    description:
      "LinkVerse는 계속해서 새로운 서비스를 궤도에 올립니다. 다음은 무엇일까요?",
    href: "#",
    status: "soon",
    icon: <Plus className="size-5" />,
    accent: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
  },
];

const STATUS_LABEL: Record<ServiceStatus, string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

const STATUS_STYLE: Record<ServiceStatus, string> = {
  live:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300",
  beta:
    "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/30 dark:text-sky-300",
  soon:
    "bg-muted text-muted-foreground ring-1 ring-border",
};

function Background() {
  const [theme] = useTheme();
  const isDark = theme === "dark";
  return (
    <>
      <Meteors
        className="fixed inset-0 pointer-events-none z-0"
        number={28}
        startTop="-5%"
      />
      <Particles
        className="fixed inset-0 pointer-events-none z-0"
        quantity={isDark ? 80 : 120}
        staticity={50}
        ease={50}
        size={0.5}
        color={isDark ? "#ffffff" : "#000000"}
      />
      {/* Soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.18), transparent 60%)",
        }}
      />
    </>
  );
}

/**
 * 궤도 다이어그램 (SVG 기반)
 *
 * 왜 SVG 인가:
 * - 각도/반지름 계산이 그대로 좌표에 반영되어 위치가 정확함
 * - viewBox 로 반응형 스케일이 자연스러움
 * - textAnchor 로 각도별 라벨 정렬이 쉬움
 */
function OrbitDiagram() {
  // 각 위성의 궤도 각도(도)와 브랜드 색상.
  // 각도는 12시(위)를 기준으로 오른쪽이 0°, 시계방향 증가처럼 보이도록 배치.
  // LinkVerse 는 중심에 이미 존재하므로 위성에는 포함하지 않는다.
  // 그 자리에는 "앞으로 합류할 서비스" 슬롯을 점선 플레이스홀더로 암시한다.
  const satellites: {
    label: string;
    angle: number;
    color?: string;
    placeholder?: boolean;
  }[] = [
    { label: "More to come", angle: -35, placeholder: true },
    { label: "NexLetter", angle: 80, color: "#10b981" }, // emerald-500
    { label: "Market Memory", angle: 200, color: "#f59e0b" }, // amber-500
  ];
  const orbitRadius = 130;

  return (
    <div className="relative mx-auto mt-10 w-full max-w-xl">
      <svg
        viewBox="-260 -200 520 400"
        className="h-auto w-full text-muted-foreground"
        role="img"
        aria-label="LinkVerse orbit diagram"
      >
        <defs>
          <linearGradient id="lv-center" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <radialGradient id="lv-glow">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 중앙 글로우 */}
        <circle r="130" fill="url(#lv-glow)" />

        {/* 정적 궤도 링 (안쪽) */}
        <circle
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
        <circle
          r={orbitRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.22"
        />

        {/* 바깥 점선 링 — 천천히 회전 (SMIL) */}
        <circle
          r="175"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.22"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="80s"
            repeatCount="indefinite"
          />
        </circle>

        {/* 중심: LinkVerse */}
        <g>
          <circle r="48" fill="url(#lv-center)" />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1.2"
          >
            LINKVERSE
          </text>
        </g>

        {/* 위성들 */}
        {satellites.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const x = orbitRadius * Math.cos(rad);
          const y = orbitRadius * Math.sin(rad);

          // 라벨이 중심 쪽으로 파고들지 않도록 각도별 정렬 계산
          const isLeft = x < -15;
          const isRight = x > 15;
          const textAnchor = isLeft ? "end" : isRight ? "start" : "middle";
          const labelDx = isLeft ? -16 : isRight ? 16 : 0;
          const labelDy = !isLeft && !isRight ? (y < 0 ? -18 : 22) : 4;

          return (
            <g key={s.label} transform={`translate(${x} ${y})`}>
              {/* 점 + 후광 — 자기 위치에서 팝 인 */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.4 + i * 0.12,
                  ease: "easeOut",
                }}
              >
                {s.placeholder ? (
                  <>
                    {/* 점선 원 + "+" 로 "앞으로 채워질 슬롯" 을 암시 */}
                    <circle
                      r="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeDasharray="3 3"
                      opacity="0.7"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="currentColor"
                      fontSize="12"
                      fontWeight="700"
                      opacity="0.8"
                    >
                      +
                    </text>
                  </>
                ) : (
                  <>
                    <circle r="12" fill={s.color} opacity="0.2" />
                    <circle r="6" fill={s.color} />
                  </>
                )}
              </motion.g>
              {/* 라벨 — 조금 뒤에 페이드 인 */}
              <motion.text
                x={labelDx}
                y={labelDy}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className={cn(
                  s.placeholder ? "fill-muted-foreground" : "fill-foreground",
                )}
                fontSize="12"
                fontWeight={s.placeholder ? 500 : 600}
                fontStyle={s.placeholder ? "italic" : "normal"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.12 }}
              >
                {s.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HomeOrbit() {
  return (
    <div className="relative isolate">
      <Background />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pt-24 pb-20 md:pt-32">
        {/* ---------- HERO ---------- */}
        <section className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              INDEPENDENT BUILDER · LinkVerse OPERATOR
            </span>
            <a
              href="https://github.com/Jinu-hub"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <FaGithub className="size-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="size-3 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl font-extrabold tracking-tight md:text-7xl"
          >
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Jinu
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            저는
            <Link
              to="#linkverse"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              LinkVerse
            </Link>
            {"를 "}를 운영하며, 그 위에서 여러 서비스를 만들고 있습니다.
            <br />
            각 서비스는 독립적으로 동작하면서도, 장기적으로는 하나의 흐름 안에서 연결되도록 하는것이 목표입니다
          </motion.p>

          {/* identity chain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-muted-foreground md:text-sm"
          >
            <span className="rounded-full bg-foreground px-3 py-1 text-background">
              Jinu
            </span>
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-foreground backdrop-blur">
              LinkVerse
            </span>
            <span className="rounded-full border border-dashed border-border px-3 py-1 text-foreground/70">
              connected services
            </span>
          </motion.div>

          <OrbitDiagram />
        </section>

        {/* ---------- MANIFESTO ---------- */}
        <section className="mx-auto mt-24 max-w-3xl text-center md:mt-32">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          HOW I BUILD
          </h2>
          <p className="mt-5 text-2xl font-semibold leading-snug md:text-3xl">
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                지식, 정보, 데이터, 맥락
            </span>을 더 잘 정리하고 연결하는 서비스를 만듭니다.{" "}
            <br />
            LinkVerse를 기반으로, {"각 서비스는 독립적으로 동작하면서도 장기적으로는"}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
               하나의 생태계로
            </span>확장됩니다 .{" "}
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {[
              {
                title: "정보를 구조로 바꿉니다",
                body:
                  "흩어진 정보와 아이디어, 데이터를 더 잘 읽히고 활용할 수 있는 형태로 정리합니다.",
              },
              {
                title: "서비스는 연결되며 확장됩니다",
                body:
                  "각 서비스는 개별적으로 동작하지만, 장기적으로는 서로 연결되는 하나의 흐름 안에서 확장되도록 설계합니다.",
              },
              {
                title: "작게 시작해 오래 갑니다",
                body:
                  "처음은 작더라도, 정체성과 구조가 분명한 서비스로 오래 운영할 수 있게 만드는 것을 중요하게 생각합니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/60 bg-background/40 p-5 backdrop-blur-sm"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- SERVICES ---------- */}
        <section id="services" className="mt-24 md:mt-32">
          <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                SERVICES IN ORBIT
              </h2>
              <p className="mt-2 text-2xl font-semibold md:text-3xl">
                LinkVerse의 궤도 위에 있는 서비스들.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const disabled = s.href === "#";
              const Card = (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-sm transition-all",
                    "hover:border-foreground/30 hover:shadow-lg hover:shadow-foreground/5",
                    disabled && "opacity-80 hover:opacity-90",
                  )}
                >
                  {/* accent gradient */}
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br blur-3xl transition-opacity",
                      s.accent,
                      "opacity-60 group-hover:opacity-100",
                    )}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-foreground/80">
                        {s.icon}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {s.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {s.tagline}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                        STATUS_STYLE[s.status],
                      )}
                    >
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>

                  <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>

                  <div className="relative mt-6 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {disabled ? "Stay tuned" : "Open service"}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 text-foreground/50 transition-transform",
                        !disabled && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground",
                      )}
                    />
                  </div>
                </motion.div>
              );

              if (disabled) {
                return (
                  <div key={s.name} aria-disabled>
                    {Card}
                  </div>
                );
              }

              return (
                <Link
                  key={s.name}
                  to={s.href}
                  target="_blank"
                  viewTransition
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-2xl"
                >
                  {Card}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="mt-24 md:mt-32">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/50 p-8 text-center backdrop-blur-sm md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10"
            />
            <h3 className="relative text-2xl font-bold md:text-3xl">
              Thanks for scanning.
            </h3>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              봐 주셔서 감사합니다. 
              LinkVerse와 그 궤도 위의 서비스들을
              잠시나마 소개할 수 있어 기쁩니다. 
              좋은 하루 보내시고, 언젠가 다시 반갑게 연결되길 바랍니다.
            </p>
            {/*
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/linkverse"
                viewTransition
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Try LinkVerse
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                viewTransition
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/70 px-5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-background"
              >
                Get in touch
              </Link>
            </div>
            */}
          </div>
        </section>
      </div>
    </div>
  );
}
