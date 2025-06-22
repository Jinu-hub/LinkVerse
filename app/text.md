📘 설계 문서: 지식 보조 메모리 툴 "BrainDock" (v1.0)
1. 🎯 서비스 개요
항목	내용
이름	BrainDock (가칭)
목적	사용자의 아이디어, 기억, 정보 흐름을 장기적으로 축적, 연결, 회상, 실행으로 이어주는 개인 지식 보조 메모리
대상	지식 노동자, 연구자, 개발자, 창작자, 자기계발 사용자
플랫폼	웹앱 (PWA) / 데스크탑 앱 (Electron 고려 가능)

2. 🧩 핵심 기능 설계
2.1 📥 정보 수집
기능	상세 설명	고려 기술
빠른 메모	단축키 또는 빠른 입력창 (글/코드/ToDo)	Shadcn UI Modal, Remix Form
웹 스크랩	웹페이지 URL, 하이라이트 저장	Supabase Functions, Bookmarklet / 확장앱
음성 메모	마이크 입력 → 텍스트화 → 저장	Whisper API, Supabase Blob Storage
이미지 캡처	드래그앤드롭, 스크린샷 → OCR + 저장	Supabase Storage + Tesseract.js

2.2 🧠 지식 구조화
기능	상세 설명	고려 기술
마크다운 메모	기본 저장 포맷은 MD. 코드블럭, 체크박스 포함	Markdown Editor (Shadcn), MDX 렌더링
태그 / 트리	메모에 다중 태그 및 계층 구조 적용	Supabase RLS 기반 트리 모델
백링크	[[메모 제목]] 자동 연결 → 양방향 링크 저장	Drizzle ORM + 관계 테이블
그래프 뷰	메모 간 연결 시각화 (마인드맵 스타일)	D3.js or React-Flow

2.3 🔍 회상 보조
기능	상세 설명	고려 기술
자연어 검색	“지난달 UX 관련 메모 뭐 있었지?”	Supabase Edge Function + OpenAI Embeddings
유사 노트 추천	현재 작성 중인 메모와 유사한 과거 노트 자동 추천	Langchain + Embedding Vector
타임라인 뷰	메모 생성/수정 시간 기반 UI 뷰	Remix + Tailwind Timeline Component

2.4 ✅ 실행 연결
기능	상세 설명	고려 기술
TODO 자동 추출	메모 내 체크박스를 할 일로 전환	Markdown Parser + Drizzle ORM
반복 리마인더	일/주 단위 습관, 목표 트래킹	Supabase Row Level Cron Jobs
할 일 보드	Kanban 스타일 할 일 구성	Shadcn Tabs + Tailwind Flex UI

2.5 🤖 AI 보조 기능
기능	상세 설명	고려 기술
메모 요약	길게 쓴 글 요약 제공	GPT-4 API + Supabase Function
문맥 연관 제안	유사한 과거 글, 프로젝트 추천	Embedding 기반 벡터 검색
대화형 회상	“작년 3월에 나 뭐 고민했었지?” 같은 대화형 검색	GPT + Time Filtered Prompting

3. 🏗️ 기술 아키텍처
프론트엔드
Remix: 데이터-라우트 구조 최적화, Form 핸들링 강점

Shadcn + Tailwind: 접근성 높고 확장성 있는 UI 설계

React Flow / D3.js: 시각화 컴포넌트 (그래프 뷰)

백엔드 / 데이터
Supabase: PostgreSQL 기반 BaaS, 인증/스토리지/실시간 제공

Drizzle ORM: 타입 안정성 높은 ORM, 테이블간 관계설계에 유리

OpenAI API: GPT-4 기반 AI 요약 / 검색 / 제안

보조 컴포넌트
LangChain (선택): Embedding 관리 및 대화형 검색을 위한 추상화

Whisper (옵션): 음성 인식 (노트 변환용)

4. 📊 데이터베이스 기본 설계 (Drizzle + Supabase 기준)
ts
コピーする
編集する
// 예시 테이블: notes
notes = {
  id: uuid,
  user_id: uuid,
  title: string,
  content_md: text,
  created_at: timestamp,
  updated_at: timestamp,
  tags: string[],
  backlink_ids: uuid[], // 다른 note id 참조
  vector: vector(1536) // OpenAI embedding
}

// 태그 테이블 (복수 대응)
note_tags = {
  note_id: uuid,
  tag: string
}
※ Supabase의 Postgres Extensions (pgvector, rls 등)도 활용 가능

5. 📆 개발 로드맵 (v1 MVP 기준)
기간	내용
1주차	프로젝트 구조 구성 (Remix + Supabase + Drizzle + Shadcn 세팅)
2~3주차	메모 작성/저장, 태그, 검색 기능 기본 구축
4~5주차	백링크, 그래프 뷰, TODO 파싱, 타임라인 구현
6~7주차	AI 요약, 연관 추천, 대화형 검색 추가
8주차	마감 테스트 / PWA 지원 / 릴리즈

6. 💡 확장 아이디어
브라우저 확장 기능: 웹 하이라이트 → 메모 저장

캘린더 연동: 구글 캘린더에서 이벤트 → 메모화

지식 공유 모드: 특정 노트를 외부 공유 가능

팀 협업 버전: 프로젝트 노트 공동 편집