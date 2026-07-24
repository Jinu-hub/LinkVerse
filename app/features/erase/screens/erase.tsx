/**
 * 우주에서 지워드립니다 (`/erase`)
 *
 * 지우고 싶은 문장 → 지우개로 문지르기 → 블랙홀 흡수 → 랜덤 위로 문구.
 * 로그인·DB 없이 입력과 애니메이션만으로 끝나는 장난스러운 사이드 페이지.
 *
 * 언어는 당분간 한글로 고정 (다국어는 나중에).
 */
import type { Route } from "./+types/erase";

import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Particles } from "components/magicui/particles";
import { cn } from "~/core/lib/utils";

export const meta: Route.MetaFunction = ({ data }) => [
  { title: data?.metaTitle ?? "우주에서 지워드립니다" },
  { name: "description", content: data?.metaDescription ?? "" },
  { name: "robots", content: "noindex" },
  { property: "og:title", content: data?.metaTitle ?? "우주에서 지워드립니다" },
  { property: "og:description", content: data?.metaDescription ?? "" },
];

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Caveat:wght@500;700&display=swap",
  },
];

/** 당분간 한글 고정 카피 */
const COPY = {
  metaTitle: "우주에서 지워드립니다",
  metaDescription:
    "지우고 싶은 문장을 적으면, 지우개와 블랙홀이 우주에서 지워드립니다.",
  kicker: "쓸데없이 귀여운 감정 처리소",
  brandTitle: "우주에서 지워드립니다",
  subtitle: "한 문장만 적어 주세요. 나머지는 우주가 처리합니다.",
  inputLabel: "지우고 싶은 문장",
  inputPlaceholder: "예: 오늘 회의에서 했던 바보 같은 말",
  startButton: "지우기 시작",
  disclaimer:
    "마음에 걸리는 그 어떤 문장이라도 좋아요.\n우주는 이유를 묻지 않습니다.",
  eraseHint: "지우개를 드래그하거나 여러 번 눌러 문장을 문질러 주세요",
  absorbingHint: "블랙홀이 나머지를 처리하는 중…",
  progressLabel: (percent: number) => `${percent}% 지워지는 중`,
  resultKicker: "처리 완료",
  againButton: "다른것도 지우기",
  footNote: "우주에는 비밀이 없습니다. 다만 찾기가 심하게 어려울 뿐입니다 ^ ^",
} as const;

const RESULTS = [
  "우주에서도 찾을 수 없게 지워두었습니다.",
  "완전히 지우지는 못해서 토성 고리에 숨겨두었습니다.",
  "화성인이 주워 갔습니다. 이제 당신 일이 아닙니다.",
  "블랙홀도 읽어보더니 별일 아니라고 했습니다.",
  "성운 사이로 흘려보냈습니다. 다시는 안 보일 거예요. 아마도.",
  "달 뒷면에 붙여두고 왔습니다. 누가 거길 가겠어요.",
  "화성 탐사선에게 맡겨두었습니다. 돌아오는 데 오래 걸릴 거예요.",
  "블랙홀에 넣었더니 흔적도 없이 사라졌습니다. 영수증은 없습니다.",
  "토성 고리 사이에 끼워두었습니다. 찾으려면 29년쯤 걸립니다.",
  "외계인이 가져갔습니다. 이제 지구의 문제가 아닙니다.",
  "우주 먼지로 만들어 뿌려두었습니다. 다시 조립하기는 어려울 거예요.",
  "국제우주정거장 냉장고 뒤에 넣어두었습니다. 아무도 안 열어볼 거예요.",
  "혜성 꼬리에 묶어 보냈습니다. 다음 방문은 76년 뒤입니다.",
  "별똥별이 되어 떨어졌습니다. 소원으로 쓰기엔 좀 아쉽네요.",
  "목성 대적점에 던져 넣었습니다. 폭풍이 알아서 처리합니다.",
  "위성 신호에 섞어 보냈습니다. 노이즈로 처리될 예정입니다.",
  "달 토끼가 떡으로 만들어 먹었습니다. 맛은 평범했대요.",
  "UFO가 샘플로 채취해 갔습니다. 보고서 제목은 '특이사항 없음'.",
  "우주 쓰레기 청소부가 수거해 갔습니다. 재활용은 거절당했대요.",
  "화성 일기예보에 올렸습니다. 오늘 날씨: 약간의 후회, 그 후 맑음.",
  "명왕성이 행성에서 밀려날 때 같이 넣어 뒀습니다. 아직 안 나왔어요.",
  "우주 고양이가 상자 속으로 가져가 버렸습니다. 상자는 사라졌습니다.",
  "오로라에 물감처럼 풀어 두었습니다. 오늘 밤 하늘이 조금 부끄러워합니다.",
  "지구 궤도를 돌다 어지러워서 스스로 증발했습니다.",
  "나사 분실물 센터에 맡겼습니다. 찾아가실 분은… 없으시겠죠.",
] as const;

function pickResult(used: Set<string>, last: string | null): string {
  let pool = RESULTS.filter((r) => !used.has(r));
  if (pool.length === 0) {
    // 한 바퀴 돌면 리셋하되, 직전 문구만은 연속 중복 방지
    pool = RESULTS.filter((r) => r !== last);
    used.clear();
    if (pool.length === 0) pool = [...RESULTS];
  }
  const next = pool[Math.floor(Math.random() * pool.length)]!;
  used.add(next);
  return next;
}

export async function loader(_args: Route.LoaderArgs) {
  return {
    metaTitle: COPY.metaTitle,
    metaDescription: COPY.metaDescription,
  };
}

type Stage = "input" | "erasing" | "absorbing" | "result";

const CLICK_PROGRESS = 11;
const DRAG_PROGRESS_SCALE = 0.045;
const ABSORB_MS = 2800;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function EraserSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      aria-hidden
      fill="none"
    >
      {/* crude cute eraser body */}
      <path
        d="M8 28 L28 6 L52 18 L32 40 Z"
        fill="#f4f0e8"
        stroke="#d4cfc4"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 28 L32 40 L28 44 L4 32 Z"
        fill="#e8a0a8"
        stroke="#c87880"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M28 6 L32 10 L52 18 L48 14 Z"
        fill="#ebe6dc"
        stroke="#d4cfc4"
        strokeWidth="1"
      />
      {/* doodle face */}
      <circle cx="34" cy="20" r="1.4" fill="#3a3540" />
      <circle cx="42" cy="24" r="1.4" fill="#3a3540" />
      <path
        d="M35 28 Q38 31 43 27"
        stroke="#3a3540"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function BlackHole({ active }: { active: boolean }) {
  const debris = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        angle: (i / 18) * Math.PI * 2,
        radius: 52 + seededRandom(i + 11) * 48,
        size: 1.5 + seededRandom(i + 33) * 2.5,
        duration: 1.4 + seededRandom(i + 55) * 1.8,
        delay: seededRandom(i + 77) * 1.2,
        warm: seededRandom(i + 99) > 0.55,
      })),
    [],
  );

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ perspective: 600 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* outer gravitational haze */}
      <motion.div
        className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full md:size-72"
        animate={
          active
            ? { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(90,60,160,0.35) 0%, rgba(40,20,80,0.15) 45%, transparent 70%)",
        }}
      />

      {/* lensing ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full md:size-52"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 20deg, transparent 0%, rgba(255,210,160,0.15) 18%, transparent 32%, rgba(180,160,255,0.2) 55%, transparent 70%, rgba(255,180,140,0.12) 88%, transparent 100%)",
          maskImage:
            "radial-gradient(circle, transparent 58%, black 62%, black 72%, transparent 76%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 58%, black 62%, black 72%, transparent 76%)",
        }}
      />

      {/* accretion disk — tilted ellipse */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-10 w-44 md:h-12 md:w-56"
        style={{
          x: "-50%",
          y: "-50%",
          rotateX: 72,
          transformStyle: "preserve-3d",
        }}
        animate={active ? { rotateZ: 360 } : { rotateZ: 0 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="h-full w-full rounded-[50%]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, #ffb07a 12%, #ffe6c0 22%, #c9a0ff 38%, transparent 48%, #ff9a6a 62%, #fff0d0 72%, transparent 88%)",
            boxShadow:
              "0 0 18px 2px rgba(255,170,110,0.45), inset 0 0 12px rgba(255,220,180,0.35)",
            maskImage:
              "radial-gradient(ellipse, transparent 28%, black 42%, black 62%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse, transparent 28%, black 42%, black 62%, transparent 72%)",
          }}
        />
      </motion.div>

      {/* second disk layer, counter-spin for depth */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-7 w-36 opacity-70 md:h-8 md:w-44"
        style={{
          x: "-50%",
          y: "-50%",
          rotateX: 68,
          transformStyle: "preserve-3d",
        }}
        animate={active ? { rotateZ: -360 } : { rotateZ: 0 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="h-full w-full rounded-[50%]"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, rgba(255,200,150,0.8) 20%, transparent 40%, rgba(200,170,255,0.7) 65%, transparent)",
            maskImage:
              "radial-gradient(ellipse, transparent 35%, black 48%, black 58%, transparent 68%)",
            WebkitMaskImage:
              "radial-gradient(ellipse, transparent 35%, black 48%, black 58%, transparent 68%)",
          }}
        />
      </motion.div>

      {/* debris spiraling inward */}
      {debris.map((d) => (
        <motion.span
          key={d.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: d.size,
            height: d.size,
            marginLeft: -d.size / 2,
            marginTop: -d.size / 2,
            background: d.warm ? "#ffd2a8" : "#e8dcff",
            boxShadow: d.warm
              ? "0 0 6px 1px rgba(255,180,120,0.8)"
              : "0 0 6px 1px rgba(180,160,255,0.7)",
          }}
          animate={
            active
              ? {
                  x: [
                    Math.cos(d.angle) * d.radius,
                    Math.cos(d.angle + 2.2) * d.radius * 0.45,
                    Math.cos(d.angle + 4.5) * 4,
                  ],
                  y: [
                    Math.sin(d.angle) * d.radius * 0.38,
                    Math.sin(d.angle + 2.2) * d.radius * 0.18,
                    Math.sin(d.angle + 4.5) * 2,
                  ],
                  scale: [1, 0.7, 0],
                  opacity: [0.9, 0.75, 0],
                }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* event horizon core */}
      <motion.div
        className="relative z-20 size-24 rounded-full md:size-28"
        animate={
          active
            ? { scale: [1, 1.04, 0.98, 1], rotate: 360 }
            : { scale: 1, rotate: 0 }
        }
        transition={{
          scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 18, repeat: Infinity, ease: "linear" },
        }}
        style={{
          background:
            "radial-gradient(circle at 42% 38%, #1a1228 0%, #0a0610 42%, #000 72%)",
          boxShadow:
            "0 0 0 2px rgba(255,200,160,0.35), 0 0 24px 6px rgba(255,150,90,0.25), 0 0 60px 16px rgba(80,40,140,0.35), inset 0 0 30px 8px #000",
        }}
      >
        {/* photon ring highlight */}
        <div
          className="absolute inset-[-3px] rounded-full"
          style={{
            background:
              "conic-gradient(from 200deg, transparent 0%, rgba(255,220,180,0.55) 8%, transparent 18%, transparent 55%, rgba(200,180,255,0.35) 70%, transparent 82%)",
            maskImage:
              "radial-gradient(circle, transparent 72%, black 78%, black 88%, transparent 94%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 72%, black 78%, black 88%, transparent 94%)",
          }}
        />
        <div className="absolute inset-[32%] rounded-full bg-black" />
      </motion.div>
    </motion.div>
  );
}

function CrumblingText({
  text,
  progress,
  absorbing,
}: {
  text: string;
  progress: number;
  absorbing: boolean;
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const p = Math.min(1, progress / 100);

  return (
    <p
      className="relative z-10 mx-auto max-w-[min(90vw,36rem)] text-center text-3xl leading-relaxed tracking-wide text-[#f2efe8] md:text-4xl"
      style={{ fontFamily: "'Gaegu', 'Caveat', cursive" }}
      aria-live="polite"
    >
      {chars.map((char, i) => {
        const r1 = seededRandom(i + 1);
        const r2 = seededRandom(i + 77);
        const r3 = seededRandom(i + 333);
        const angle = r1 * Math.PI * 2;
        const scatter = p * (40 + r2 * 90);
        const rot = p * (r3 - 0.5) * 120;
        const opacity = absorbing
          ? 0
          : Math.max(0, 1 - p * 1.15 - r2 * 0.15);
        const scale = absorbing ? 0 : 1 - p * 0.35;
        // spiral toward center when absorbed
        const spiralTurns = 1.2 + r1 * 1.6;
        const startRadius = 30 + r2 * 90;

        return (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block whitespace-pre"
            initial={false}
            animate={
              absorbing
                ? {
                    x: [
                      Math.cos(angle) * startRadius * 0.35,
                      Math.cos(angle + spiralTurns) * startRadius * 0.12,
                      0,
                    ],
                    y: [
                      Math.sin(angle) * startRadius * 0.2,
                      Math.sin(angle + spiralTurns) * startRadius * 0.08,
                      0,
                    ],
                    scale: [1 - p * 0.2, 0.45, 0],
                    opacity: [Math.max(0.4, opacity), 0.7, 0],
                    rotate: [rot, rot + 180 + r3 * 220, rot + 420],
                    filter: ["blur(0px)", "blur(2px)", "blur(8px)"],
                  }
                : {
                    x: Math.cos(angle) * scatter,
                    y: Math.sin(angle) * scatter - p * 12,
                    rotate: rot,
                    opacity,
                    scale,
                    filter: `blur(${p * 1.2}px)`,
                  }
            }
            transition={
              absorbing
                ? {
                    duration: 1.15 + r1 * 0.7,
                    ease: [0.4, 0, 1, 1],
                    delay: r2 * 0.35,
                  }
                : { type: "spring", stiffness: 120, damping: 18 }
            }
          >
            {char}
          </motion.span>
        );
      })}
    </p>
  );
}

export default function ErasePage() {
  const [stage, setStage] = useState<Stage>("input");
  const [sentence, setSentence] = useState("");
  const [draft, setDraft] = useState("");
  const [progress, setProgress] = useState(0);
  const [resultMessage, setResultMessage] = useState<string>(RESULTS[0]);
  const [hintPulse, setHintPulse] = useState(0);

  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const absorbTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const absorbingLock = useRef(false);
  const usedResults = useRef<Set<string>>(new Set());
  const lastResult = useRef<string | null>(null);

  const eraserX = useMotionValue(0);
  const eraserY = useMotionValue(0);
  const springX = useSpring(eraserX, { stiffness: 280, damping: 28 });
  const springY = useSpring(eraserY, { stiffness: 280, damping: 28 });

  const centerEraser = useCallback(() => {
    const area = areaRef.current;
    if (!area) {
      eraserX.set(120);
      eraserY.set(100);
      return;
    }
    const { width, height } = area.getBoundingClientRect();
    eraserX.set(width * 0.55);
    eraserY.set(height * 0.55);
  }, [eraserX, eraserY]);

  useEffect(() => {
    return () => {
      if (absorbTimer.current) clearTimeout(absorbTimer.current);
    };
  }, []);

  useEffect(() => {
    if (stage === "erasing") {
      absorbingLock.current = false;
      // wait one frame so the erase area is mounted
      const id = requestAnimationFrame(() => centerEraser());
      return () => cancelAnimationFrame(id);
    }
  }, [stage, centerEraser]);

  const startAbsorb = useCallback(() => {
    if (absorbingLock.current) return;
    absorbingLock.current = true;
    setStage("absorbing");
    if (absorbTimer.current) clearTimeout(absorbTimer.current);
    absorbTimer.current = setTimeout(() => {
      const message = pickResult(usedResults.current, lastResult.current);
      lastResult.current = message;
      setResultMessage(message);
      setStage("result");
    }, ABSORB_MS);
  }, []);

  const bumpProgress = useCallback(
    (amount: number) => {
      if (absorbingLock.current) return;
      setProgress((prev) => {
        const next = Math.min(100, prev + amount);
        if (next >= 100 && prev < 100) {
          queueMicrotask(() => startAbsorb());
        }
        return next;
      });
    },
    [startAbsorb],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (stage !== "erasing") return;
    const area = areaRef.current;
    if (!area) return;
    area.setPointerCapture(e.pointerId);
    dragging.current = true;
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left - 28;
    const y = e.clientY - rect.top - 22;
    eraserX.set(x);
    eraserY.set(y);
    lastPos.current = { x: e.clientX, y: e.clientY };
    bumpProgress(CLICK_PROGRESS);
    setHintPulse((n) => n + 1);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || stage !== "erasing") return;
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    eraserX.set(e.clientX - rect.left - 28);
    eraserY.set(e.clientY - rect.top - 22);

    if (lastPos.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 2) bumpProgress(dist * DRAG_PROGRESS_SCALE);
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    lastPos.current = null;
    try {
      areaRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const beginErase = () => {
    const text = draft.trim();
    if (!text) return;
    absorbingLock.current = false;
    setSentence(text);
    setProgress(0);
    setStage("erasing");
  };

  const startOver = () => {
    if (absorbTimer.current) clearTimeout(absorbTimer.current);
    absorbingLock.current = false;
    setStage("input");
    setDraft("");
    setSentence("");
    setProgress(0);
  };

  const progressLabel = Math.round(progress);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-16">
      <Particles
        className="pointer-events-none fixed inset-0 z-0"
        quantity={90}
        ease={70}
        color="#c8c4d8"
        size={0.55}
        staticity={40}
      />

      {/* soft nebula wash */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(60,40,100,0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(40,60,90,0.2), transparent)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "input" && (
            <motion.div
              key="input"
              className="flex w-full flex-col items-center gap-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center">
                <p
                  className="mb-3 text-base tracking-[0.2em] text-white/40 uppercase md:text-lg"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {COPY.kicker}
                </p>
                <h1
                  className="whitespace-nowrap text-[clamp(1.85rem,7.2vw,3.75rem)] leading-tight text-[#f2efe8]"
                  style={{ fontFamily: "'Gaegu', 'Caveat', cursive" }}
                >
                  {COPY.brandTitle}
                </h1>
                <p
                  className="mt-4 text-lg text-white/55 md:text-xl"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {COPY.subtitle}
                </p>
              </div>

              <div className="w-full space-y-4">
                <label className="sr-only" htmlFor="erase-sentence">
                  {COPY.inputLabel}
                </label>
                <textarea
                  id="erase-sentence"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 120))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      beginErase();
                    }
                  }}
                  rows={3}
                  placeholder={COPY.inputPlaceholder}
                  className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-5 py-5 text-xl text-[#f2efe8] placeholder:text-white/30 outline-none backdrop-blur-sm transition focus:border-white/35 focus:bg-white/8 md:text-2xl"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                />
                <button
                  type="button"
                  onClick={beginErase}
                  disabled={!draft.trim()}
                  aria-label={COPY.startButton}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-2xl px-6 py-5 text-xl font-bold transition md:text-2xl",
                    draft.trim()
                      ? "cursor-pointer bg-[#f2efe8] text-[#12101a] hover:bg-white"
                      : "cursor-not-allowed bg-white/10 text-white/30",
                  )}
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    <EraserSvg className="size-8 shrink-0 md:size-9" />
                    <span>{COPY.startButton}</span>
                  </span>
                </button>
              </div>

              <p
                className="max-w-sm whitespace-pre-line text-center text-base text-white/30 md:text-lg"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {COPY.disclaimer}
              </p>
            </motion.div>
          )}

          {(stage === "erasing" || stage === "absorbing") && (
            <motion.div
              key="erasing"
              className="flex w-full flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-base text-white/40 md:text-lg"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {stage === "absorbing"
                  ? COPY.absorbingHint
                  : COPY.eraseHint}
              </p>

              <div
                ref={areaRef}
                className="relative flex min-h-[280px] w-full cursor-none touch-none select-none items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-6 py-16"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <BlackHole active={stage === "absorbing"} />

                <CrumblingText
                  text={sentence}
                  progress={progress}
                  absorbing={stage === "absorbing"}
                />

                {stage === "erasing" && (
                  <motion.div
                    className="pointer-events-none absolute z-30 size-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:size-16"
                    style={{ x: springX, y: springY, left: 0, top: 0 }}
                    animate={{
                      rotate: [ -8, 8, -8 ],
                      scale: hintPulse % 2 === 0 ? 1 : 1.08,
                    }}
                    transition={{
                      rotate: {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      scale: { duration: 0.15 },
                    }}
                  >
                    <EraserSvg className="size-full" />
                  </motion.div>
                )}

                {/* scrub progress crumbs */}
                {stage === "erasing" &&
                  progress > 15 &&
                  Array.from({ length: Math.min(12, Math.floor(progress / 8)) }).map(
                    (_, i) => {
                      const r = seededRandom(i + progress);
                      return (
                        <span
                          key={i}
                          className="pointer-events-none absolute size-1.5 rounded-full bg-white/40"
                          style={{
                            left: `${20 + r * 60}%`,
                            top: `${30 + seededRandom(i + 50) * 40}%`,
                            opacity: 0.3 + seededRandom(i + 3) * 0.5,
                          }}
                        />
                      );
                    },
                  )}
              </div>

              {stage === "erasing" && (
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[#f2efe8]/80"
                      animate={{ width: `${progressLabel}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                  <p
                    className="text-sm text-white/35 md:text-base"
                    style={{ fontFamily: "'Gaegu', cursive" }}
                  >
                    {COPY.progressLabel(progressLabel)}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              className="flex w-full flex-col items-center gap-8 text-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                className="relative"
              >
                <div
                  className="size-20 rounded-full md:size-24"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, #1a1028 0%, #000 70%)",
                    boxShadow: "0 0 40px 8px rgba(120,80,200,0.3)",
                  }}
                />
                <motion.span
                  className="absolute -right-2 -top-1 text-2xl"
                  animate={{ y: [0, -6, 0], rotate: [0, 12, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  ✦
                </motion.span>
              </motion.div>

              <div>
                <p
                  className="mb-3 text-base tracking-widest text-white/35 uppercase md:text-lg"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {COPY.resultKicker}
                </p>
                <h2
                  className="text-3xl leading-snug text-[#f2efe8] md:text-4xl"
                  style={{ fontFamily: "'Gaegu', 'Caveat', cursive" }}
                >
                  {resultMessage}
                </h2>
              </div>

              <button
                type="button"
                onClick={startOver}
                className="cursor-pointer rounded-2xl bg-[#f2efe8] px-7 py-4 text-lg font-bold text-[#12101a] transition hover:bg-white md:text-xl"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {COPY.againButton}
              </button>

              <p
                className="text-sm text-white/25 md:text-base"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {COPY.footNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
