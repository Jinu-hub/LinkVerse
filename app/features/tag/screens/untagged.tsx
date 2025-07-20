import React, { useMemo, useState } from "react";
import type { Route } from "./+types/untagged";
import type { ContentType } from "~/core/lib/types";

import { CONTENT_TYPES } from "~/core/lib/constants";
import { sortArray, filterArray, paginateArray } from "~/core/lib/utils";
import { highlightText } from "~/core/lib/common";

import makeServerClient from "~/core/lib/supa-client.server";
import { requireAuthentication } from "~/core/lib/guards.server";
import { getUntaggedContents, getTags } from "../db/queries";
import type { UntaggedContent, UntaggedSortKey } from "../lib/tag.types";
import { toUntaggedContent } from "../lib/taUtils";
import UntagToolbar from "../components/untag-toolbar";
import UntagTable from "../components/untag-table";

const getType = (contentTypeId: number): ContentType["code"] => {
  return (CONTENT_TYPES.find(t => t.id === contentTypeId)?.code || 'bookmark') as ContentType["code"];
};

function getFilteredUntaggedContents(untaggedContents: UntaggedContent[], selectedType: number | null, search: string) {
  return filterArray(untaggedContents, untaggedContent =>
    (selectedType === null || untaggedContent.contentTypeId === selectedType) &&
    (untaggedContent.title.toLowerCase().includes(search.toLowerCase()) ||
      (untaggedContent.url?.toLowerCase().includes(search.toLowerCase()) ?? false))
  );
}

function getSortedUntaggedContents(filtered: UntaggedContent[], sortKey: UntaggedSortKey, sortOrder: 'asc' | 'desc') {
  if (sortKey === "createdAt") {
    return sortArray(filtered, sortKey, sortOrder, (a, b) =>
      sortOrder === 'asc'
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt)
    );
  } else {
    return sortArray(filtered, sortKey, sortOrder);
  }
}

export const meta: Route.MetaFunction = () => {
  return [{ title: `Untagged | ${import.meta.env.VITE_APP_NAME}` }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
   const [client] = makeServerClient(request);
   await requireAuthentication(client);
   const { data: { user } } = await client.auth.getUser();
   const untaggedContents = await getUntaggedContents(client, { userId: user!.id });
   const tags = await getTags(client, { userId: user!.id });
  return { untaggedContents, tags };
};

export default function UntaggedScreen({ loaderData }: Route.ComponentProps) {
  const { untaggedContents: initialUntaggedContents, tags: initialTags } = loaderData;
  // 상태
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<UntaggedSortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const allTags = useMemo(() => initialTags.map(t => t.tag_name), [initialTags]);
  const [untaggedContents, setUntaggedContents] = useState<UntaggedContent[]>(initialUntaggedContents.map(toUntaggedContent));

  // 필터/검색
  const filtered = useMemo(() =>
    getFilteredUntaggedContents(untaggedContents, selectedType, search)
  , [untaggedContents, search, selectedType]
  );

  // 정렬
  const sorted = useMemo(() => {
    return getSortedUntaggedContents(filtered, sortKey, sortOrder);
  }, [filtered, sortKey, sortOrder]);

  // 페이지네이션
  const totalRows = sorted.length;
  const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(totalRows / Number(rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startEntry = totalRows === 0 ? 0 : ((currentPage - 1) * (rowsPerPage === 'all' ? totalRows : Number(rowsPerPage))) + 1;
  const endEntry = rowsPerPage === 'all' ? totalRows : Math.min(currentPage * Number(rowsPerPage), totalRows);
  const pagedUntaggedContents = useMemo(() => {
    return paginateArray(sorted, currentPage, rowsPerPage);
  }, [sorted, currentPage, rowsPerPage]);

  // 핸들러
  const handleSort = (key: UntaggedSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const handleTypeSelect = (typeId: number) => {
    setSelectedType(typeId === 0 ? null : typeId);
    setPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">태그 미설정 콘텐츠</h1>
      {/* 콘텐츠 타입 필터 버튼 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CONTENT_TYPES.map(type => (
          <button
            key={type.id}
            className={`
              px-3 py-1 rounded-full border transition
              ${selectedType === type.id || (type.id === 0 && selectedType === null)
                ? 'bg-primary text-white border-primary-600 shadow dark:bg-gray-900 dark:text-white dark:border-2 dark:border-white'
                : 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'}
              hover:border-primary hover:bg-primary/10 dark:hover:bg-white/30
              hover:text-primary
              font-semibold
            `}
            onClick={() => handleTypeSelect(type.id)}
          >
            {type.code}
          </button>
        ))}
      </div>
      <UntagToolbar
        searchValue={search}
        onSearchChange={v => { setSearch(v); setPage(1); }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={v => {
          setRowsPerPage(v === 'all' ? 'all' : Number(v));
          setPage(1);
        }}
      />
      <UntagTable
        pagedUntaggedContents={pagedUntaggedContents}
        getType={getType}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        startEntry={startEntry}
        endEntry={endEntry}
        onPageChange={setPage}
        search={search}
        highlightText={highlightText}
        allTags={allTags}
        setUntaggedContents={setUntaggedContents}
      />
      {pagedUntaggedContents.length === 0 && (
        <div className="text-center text-gray-500 py-8">태그를 미설정인 콘텐츠가 없습니다.</div>
      )}
    </div>
  );
};
