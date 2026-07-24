/**
 * Erase Layout — 우주에서 지워드립니다
 *
 * 장난스러운 사이드 페이지 전용. 네비게이션·푸터·테마 스위처 없이
 * 전체 화면만 보여준다.
 */
import { Outlet } from "react-router";

export default function EraseLayout() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#07080f] text-white">
      <Outlet />
    </div>
  );
}
