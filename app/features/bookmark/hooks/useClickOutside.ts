import { useEffect } from 'react';

/**
 * useClickOutside
 * 
 * 지정한 ref(예: input, div 등) 영역 바깥을 클릭했을 때 특정 handler 함수를 실행하는 커스텀 React 훅입니다.
 * 
 * 주로 자동완성, 드롭다운, 모달 등에서 외부 클릭 시 UI를 닫는 용도로 사용합니다.
 * 
 * @param ref      - 감지할 DOM 요소의 ref (예: useRef<HTMLInputElement | null>(null))
 * @param handler  - ref 영역 밖을 클릭했을 때 실행할 콜백 함수
 * @param enabled  - 감지 활성화 여부 (false면 이벤트 리스너를 등록하지 않음)
 * 
 * 사용 예시:
 * 
 * const inputRef = useRef<HTMLInputElement | null>(null);
 * useClickOutside(inputRef, () => setShowSuggestions(false), showSuggestions);
 * 
 * - showSuggestions가 true일 때만 외부 클릭 감지 활성화
 * - inputRef 영역 밖을 클릭하면 setShowSuggestions(false) 실행
 * 
 * 내부 동작:
 * - enabled가 true일 때만 document에 mousedown 이벤트 리스너를 등록
 * - ref.current가 null이 아니고, 클릭된 타겟이 ref.current 내부가 아니면 handler 실행
 * - 컴포넌트 언마운트 시 이벤트 리스너 자동 해제
 */
export function useClickOutside(ref: React.RefObject<HTMLInputElement | null>, handler: (e: MouseEvent) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, enabled]);
} 