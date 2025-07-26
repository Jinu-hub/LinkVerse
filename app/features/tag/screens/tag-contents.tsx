import React, { useMemo, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";

import TagContentCard from "../components/tag-content-card";
import { sortArray, filterArray, paginateArray } from "~/core/lib/utils";
import type { SortKeyContents, TagContent } from "../lib/tag.types";
import { SORT_OPTIONS_CONTENTS } from "../lib/constants";
import { CONTENT_TYPES } from "~/core/lib/constants";
// import { typeColorMap } from "~/core/lib/constants";
// import { TagEditDialog } from "../components/tag-edit-dialog";
import { getTagContents } from "../db/queries";
import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import type { Route } from "./+types/tag-contents";
import { toTagContent } from "../lib/taUtils";

function getFilteredContents(contents: TagContent[], tagId: number, selectedType: number | null, search: string) {
  return filterArray(contents, content =>
    content.tagId === tagId &&
    (selectedType === null || content.contentTypeId === selectedType) &&
    (content.title.toLowerCase().includes(search.toLowerCase()) ||
      (typeof content.memo === 'string' && content.memo.toLowerCase().includes(search.toLowerCase())))
  );
}

function getSortedContents(contents: TagContent[], sortKey: SortKeyContents, sortOrder: 'asc' | 'desc') {
  if (sortKey === "createdAt") {
    return sortArray(contents, "createdAt", sortOrder);
  } else if (sortKey === "title") {
    return sortArray(contents, "title", sortOrder);
  } else if (sortKey === "type") {
    return sortArray(contents, "contentTypeId", sortOrder);
  }
  return contents;
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  await requireAuthentication(client);
  const { data: { user } } = await client.auth.getUser();
  const tagContents = await getTagContents(client, { userId: user!.id, tagId: Number(params.id) });
  return { tagContents };
}

export default function TagContentsScreen({ loaderData }: Route.ComponentProps) {
  const { id } = useParams<{ id: string }>();
  const tagId = Number(id);
  const tagName = useLocation().state?.tagName;

  const [sortKey, setSortKey] = useState<SortKeyContents>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 8;
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [editButtonTop, setEditButtonTop] = useState(170);
  const [editTagName, setEditTagName] = useState(tagName || "");

  const tagContents = useMemo(() => {
    const t = loaderData.tagContents;
    if (!t) return [];
    return t.map(toTagContent);
  }, [loaderData.tagContents]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setEditButtonTop(80);
      } else {
        setEditButtonTop(170);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 필터
  const filtered = useMemo(() =>
    getFilteredContents(tagContents, tagId, selectedType, search)
  , [tagId, search, selectedType]
  );

  // 정렬
  const sorted = useMemo(() =>
    getSortedContents(filtered, sortKey, sortOrder)
  , [filtered, sortKey, sortOrder]
  );

  // 페이지네이션
  const totalRows = sorted.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const pagedContents = useMemo(() =>
    paginateArray(sorted, page, pageSize),
    [sorted, page, pageSize]
  );

  if (!tagName) return <div className="p-8 text-center text-lg">존재하지 않는 태그입니다.</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">#{tagName}</span>
          <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {pagedContents.length} items
          </span>
        </h2>
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="검색..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm">정렬 기준:</label>
          <select
            id="sort-select"
            className="border rounded px-2 py-1 text-sm"
            value={sortKey}
            onChange={e => {
              setSortKey(e.target.value as SortKeyContents);
              setSortOrder('desc');
              setPage(1);
            }}
          >
            {SORT_OPTIONS_CONTENTS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className="border rounded px-2 py-1 text-sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? '오름차순' : '내림차순'}
          >
            {sortOrder === 'asc' ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {/*
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
            onClick={() => setSelectedType(type.id === 0 ? null : type.id)}
          >
            {type.code}
          </button>
        ))}
      </div>
      */}
      {/*
      <TagEditDialog
        editButtonTop={editButtonTop}
        editTagName={editTagName}
        setEditTagName={setEditTagName}
        selectedContentIds={selectedContentIds}
        sorted={sorted}
        typeColorMap={typeColorMap}
      />
      */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedContents.map(content => {
          const contentId = content.contentTypeId + '_' + content.contentId;
          const isSelected = selectedContentIds.includes(contentId);
          return (
            <TagContentCard
              key={contentId}
              type={
                (
                  CONTENT_TYPES.find(t => t.id === content.contentTypeId)?.code || 'other'
                ) as string
              }
              content={content}
              selected={isSelected}
              onClick={() => {
                setSelectedContentIds(prev =>
                  prev.includes(contentId)
                    ? prev.filter(id => id !== contentId)
                    : [...prev, contentId]
                );
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-end items-center gap-2 mt-6">
        <button className="border rounded px-2 py-1" onClick={() => setPage(page - 1)} disabled={page <= 1}>&lt;</button>
        <span className="text-sm">{page} / {totalPages}</span>
        <button className="border rounded px-2 py-1" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>&gt;</button>
      </div>
    </div>
  );
} 