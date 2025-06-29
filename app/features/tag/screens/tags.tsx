import React, { useMemo, useState } from "react";
import { mockTags } from "../../bookmark/lib/mock-data";
import { TagCard } from "../components/tag-card";
import { sortArray, filterArray, paginateArray } from "~/core/lib/utils";

// Tag 타입 정의 추가
type Tag = { id: number; name: string; usage_count: number; createdAt: string };

const SORT_OPTIONS = [
  { value: "usage_count", label: "사용 횟수" },
  { value: "name", label: "이름" },
  { value: "created_at", label: "생성일" },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["value"];

export default function TagsScreen() {
  const [sortKey, setSortKey] = useState<SortKey>("usage_count");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 12;

  const filtered = useMemo(() =>
    filterArray(mockTags, tag =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      String(tag.id).includes(search)
    ), [search]
  );

  const sorted = useMemo(() => {
    if (sortKey === "usage_count") {
      return sortArray(filtered, "usage_count", sortOrder);
    } else if (sortKey === "name") {
      return sortArray(filtered, "name", sortOrder);
    } else if (sortKey === "created_at") {
      return sortArray(filtered, "createdAt", sortOrder);
    }
    return filtered;
  }, [filtered, sortKey, sortOrder]);

  const totalRows = sorted.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalRows);
  const pagedTags = useMemo(() =>
    paginateArray(sorted, page, pageSize),
    [sorted, page, pageSize]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">태그 목록</h2>
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
              setSortKey(e.target.value as SortKey);
              setSortOrder('desc');
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map(opt => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pagedTags.map(tag => (
          <TagCard
            key={tag.id}
            id={tag.id}
            name={tag.name}
            usageCount={tag.usage_count}
            createdAt={tag.createdAt}
            // onClick, onEdit, onDelete 등 필요시 추가
          />
        ))}
      </div>
      <div className="flex justify-end items-center gap-2 mt-6">
        <button className="border rounded px-2 py-1" onClick={() => setPage(page - 1)} disabled={page <= 1}>&lt;</button>
        <span className="text-sm">{page} / {totalPages}</span>
        <button className="border rounded px-2 py-1" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>&gt;</button>
      </div>
    </div>
  );
} 