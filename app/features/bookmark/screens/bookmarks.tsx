/**
 * Supa-Bookmark 스크린
 *
 * 북마크를 표시하고 관리하는 메인 화면입니다.
 * 이 컴포넌트는 다음과 같은 현대적인 React 패턴과 기술을 사용하여 구현되었습니다.
 *
 * 1. 중앙 상태 관리: `useReducer` 훅을 사용하여 북마크 목록과 관련된 모든 상태
 *    (탭 선택, 정렬, 검색, 페이지네이션 등)를 중앙에서 효율적으로 관리합니다.
 *
 * 2. 관심사 분리 (SoC):
 *    - 데이터 처리 로직을 `useFilteredBookmarks` 커스텀 훅으로 분리하여
 *      컴포넌트가 UI 렌더링에만 집중할 수 있도록 합니다.
 *    - Reducer, 상수, 목업 데이터 등은 별도의 파일로 분리하여 유지보수성을 높였습니다.
 *
 * 3. 컴포넌트 기반 아키텍처:
 *    - `CategorySidebar`, `BookmarkToolbar`, `BookmarkTable` 등 재사용 가능한
 *      자식 컴포넌트로 UI를 분리하여 코드의 모듈성과 가독성을 향상시켰습니다.
 *
 * 4. 성능 최적화: `useCallback`과 `useMemo` 훅을 적절히 사용하여
 *    불필요한 리렌더링을 방지하고 애플리케이션의 성능을 최적화합니다.
 */
import type { Route } from "./+types/bookmarks";

import type {
  Bookmark,
  Category,
  BookmarksState,
  UI_View,
} from "../types/bookmark.types";

import { useMemo, useReducer, useCallback, useState } from "react";
import { BookmarkToolbar } from "../components/bookmark-toolbar";
import { BookmarkTable } from "../components/bookmark-table";
import {
  ALL_CATEGORY_ID,
  ALL_TAB_ID,
  DEFAULT_ROWS_PER_PAGE,
  DEFAULT_SORT_KEY,
  UNCATEGORIZED_CATEGORY_ID,
  UNCATEGORIZED_TAB_ID,
} from '../lib/constants'
import { bookmarksReducer, 
  buildCategoryTree, 
  toUIViewTabs, toBookmarks, toCategory } from '../lib/bmUtils'
import { highlightText } from "~/core/lib/common";
import { useFilteredBookmarks } from '../hooks/use-filtered-bookmarks'
import { CategorySidebar } from '../components/category-sidebar'
import { Button } from "~/core/components/ui/button";
import { FiPlus } from "react-icons/fi";
import BookmarkDetailDialog from "../components/bookmark-detail-dialog";
import makeServerClient from "~/core/lib/supa-client.server";
import { requireAuthentication } from "~/core/lib/guards.server";
import { 
  getBookmarkCategories, 
  getBookmarkContents, 
  getBookmarkMemo, 
  getBookmarkTags, 
  getUIViewTabs 
} from "../db/queries";

/**
 * Meta function for the blog posts page
 *
 * Sets the page title using the application name from environment variables
 * and adds a meta description for SEO purposes
 */
export const meta: Route.MetaFunction = () => {
  return [
    { title: `Bookmark | ${import.meta.env.VITE_APP_NAME}` },
    {
      name: 'description',
      content:
        'SupaBookmark is a bookmark manager that allows you to save and organize your bookmarks.',
    },
  ]
}

const initialState: BookmarksState = {
  selectedTabId: ALL_TAB_ID,
  selectedCategoryId: ALL_CATEGORY_ID,
  searchMap: {},
  sortKeyMap: {},
  sortOrderMap: {},
  pageMap: {},
  rowsPerPageMap: {},
  selectedBookmark: null,
  isDetailDialogOpen: false,
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  await requireAuthentication(client);
  const { data: { user } } = await client.auth.getUser();
  const categories = await getBookmarkCategories(client, { userId: user!.id });
  const tabs = await getUIViewTabs(client, { userId: user!.id });
  const bookmarks = await getBookmarkContents(client, { userId: user!.id });
  const bookmarksWithTagsMemo = await Promise.all(
    bookmarks.map(async (bookmark) => {
      const bookmarkId = bookmark.bookmark_id;
      let tags: string[] = [];
      let memo: string = '';
      try {
        tags = bookmarkId != null
          ? await getBookmarkTags(client, { userId: user!.id, bookmarkId })
          : [];
        memo = bookmarkId != null
          ? (await getBookmarkMemo(client, { userId: user!.id, bookmarkId }) ?? '')
          : '';
      } catch (e) {
        console.error('getBookmarkTags or getBookmarkMemo error', e);
        tags = [];
        memo = '';
      }
      return { ...bookmark, tags, memo };
    })
  );
  return { categories, tabs, bookmarks: bookmarksWithTagsMemo };
}

/**
 * Bookmarks 컨테이너 컴포넌트
 *
 * 이 컴포넌트는 북마크 애플리케이션의 메인 컨테이너 역할을 합니다.
 * 중앙 집중식 상태와 이벤트 핸들러를 정의하고, 이를 각 자식 컴포넌트에 `props`로 전달합니다.
 *
 * 주요 책임:
 * - `useReducer`를 사용한 상태 관리 초기화
 * - `useCallback`으로 최적화된 이벤트 핸들러 정의
 * - `useFilteredBookmarks` 커스텀 훅을 사용한 데이터 처리
 * - `CategorySidebar`, `BookmarkToolbar`, `BookmarkTable` 등 하위 컴포넌트의 조합 및 데이터 전달
 */
export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { categories: initialCategories, tabs: initialTabs, bookmarks } = loaderData;

  const [categories, setCategories] = useState<Category[]>(initialCategories.map(toCategory));
  const [tabs, setTabs] = useState<UI_View[]>(initialTabs.map(toUIViewTabs));

  //console.log(categories);
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  const uiViewTabs = useMemo(() => {
    // 항상 추가할 탭 2개
    const defaultTabs = [
      { id: ALL_TAB_ID, name: '전체', content_type_id: 1, ui_view_type_id: 1, category_id: ALL_CATEGORY_ID },
      { id: UNCATEGORIZED_TAB_ID, name: '미분류', content_type_id: 1, ui_view_type_id: 1, category_id: UNCATEGORIZED_CATEGORY_ID },
    ];
    // DB에서 온 탭 데이터 변환
    //const dbTabs = tabs.map(toUIViewTabs);
    return [...defaultTabs, ...tabs];
  }, [tabs]);

  const bmList = useMemo(() => {
    return bookmarks.map(toBookmarks);
  }, [bookmarks]);

  const [state, dispatch] = useReducer(bookmarksReducer, initialState);
  const {
    selectedTabId,
    selectedCategoryId,
    searchMap,
    sortKeyMap,
    sortOrderMap,
    pageMap,
    rowsPerPageMap,
  } = state;

  const rowsPerPage = rowsPerPageMap[selectedTabId] ?? DEFAULT_ROWS_PER_PAGE;
  const page = pageMap[selectedTabId] ?? 1;

  const search = searchMap[selectedTabId] ?? "";
  const sortKey = sortKeyMap[selectedTabId] ?? DEFAULT_SORT_KEY;
  const sortOrder = sortOrderMap[selectedTabId] ?? "asc";

  const { pagedBookmarks, totalPages, totalRows, startEntry, endEntry } =
    useFilteredBookmarks({
      bookmarks: bmList,
      categories: categoryTree,
      selectedCategoryId,
      search,
      sortKey,
      sortOrder,
      page,
      rowsPerPage,
    })

  // 카테고리 ID를 루트 카테고리 ID로 매핑하는 맵 생성
  const categoryToRootMap = useMemo(() => {
    const map = new Map<number, number>();
    const buildMap = (categories: Category[], rootId: number | null = null) => {
      for (const category of categories) {
        const currentRootId = rootId === null ? category.id : rootId;
        map.set(category.id, currentRootId);
        if (category.children) {
          buildMap(category.children, currentRootId);
        }
      }
    };
    buildMap(categoryTree);
    return map;
  }, [categoryTree]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback(
    (newTabId: number) => {
      const categoryId = uiViewTabs.find(t => t.id === newTabId)?.category_id;
      dispatch({ type: 'CHANGE_TAB', payload: { tabId: newTabId, categoryId } });
    },
    [uiViewTabs]
  );

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback(
    (newCategoryId: number) => {
      const rootId = categoryToRootMap.get(newCategoryId);
      const tabId = uiViewTabs.find(t => t.category_id === rootId)?.id;
      dispatch({
        type: 'CHANGE_CATEGORY',
        payload: {
          categoryId: newCategoryId,
          tabId: tabId,
        },
      });
    },
    [dispatch, categoryToRootMap],
  );

  // 소트 변경
  const handleSort = useCallback(
    (key: keyof Bookmark) => {
      dispatch({ type: 'SORT', payload: key });
    },
    [dispatch],
  );

  // 검색어 변경
  const handleSearch = useCallback(
    (value: string) => {
      dispatch({ type: 'SEARCH', payload: value });
    },
    [dispatch],
  );

  // 한 페이지에 표시할 개수 변경
  const handleRowsPerPageChange = useCallback(
    (value: string) => {
      dispatch({
        type: 'CHANGE_ROWS_PER_PAGE',
        payload: value === 'all' ? 'all' : Number(value),
      });
    },
    [dispatch],
  );
  // 페이지 이동
  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch({ type: 'CHANGE_PAGE', payload: newPage });
    },
    [dispatch],
  );

  // 상세 다이얼로그 열기
  const handleRowClick = useCallback(
    (bookmark: Bookmark) => {
      dispatch({ type: 'OPEN_DETAIL', payload: bookmark });
    },
    [dispatch],
  );

  // 추가 다이얼로그 상태
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const emptyBookmark = {
    id: 0,
    title: '',
    url: '',
    tags: [],
    memo: '',
    categoryId: undefined,
  };

  return (
    <div className="flex gap-10">
      <CategorySidebar
        categories={categoryTree}
        setCategories={setCategories}
        selectedId={selectedCategoryId}
        onSelect={handleCategoryChange}
        setTabs={setTabs}
      />
      {/* 🔹 2. 메인 콘텐츠 영역 */}
      <main className="flex-1 space-y-4">
        {/* 오른쪽 상단 북마크 추가 버튼 */}
        <div className="hidden md:flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow w-12 h-12 flex items-center justify-center text-2xl cursor-pointer"
            onClick={() => setAddDialogOpen(true)}
            aria-label="북마크 추가"
          >
            <FiPlus />
          </Button>
        </div>
        <BookmarkToolbar
          tabs={uiViewTabs}
          selectedTabId={selectedTabId}
          onTabChange={handleTabChange}
          searchValue={search}
          onSearchChange={handleSearch}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          categories={categoryTree}
          selectedId={selectedCategoryId}
          onSelect={handleCategoryChange}
        />

        <BookmarkTable
          pagedBookmarks={pagedBookmarks}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
          highlightText={highlightText}
          search={search}
          page={page}
          totalPages={totalPages}
          totalRows={totalRows}
          startEntry={startEntry}
          endEntry={endEntry}
          onPageChange={handlePageChange}
          categoryTree={categoryTree}
        />

        {/* 모바일: 오른쪽 하단 플로팅 버튼 */}
        <button
          type="button"
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-colors md:hidden cursor-pointer"
          onClick={() => setAddDialogOpen(true)}
          aria-label="북마크 추가"
        >
          <FiPlus />
        </button>

        {/* 북마크 추가 다이얼로그 */}
        <BookmarkDetailDialog
          open={addDialogOpen}
          onOpenChange={(open) => setAddDialogOpen(open)}
          bookmark={emptyBookmark}
          onSave={(updated) => {
            // 저장 로직 (원하면 구현)
            setAddDialogOpen(false);
          }}
          categories={categoryTree.filter(cat => cat.id > ALL_CATEGORY_ID)}
        />
      </main>
    </div>
  );
}