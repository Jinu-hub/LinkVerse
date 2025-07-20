import React, { useMemo, useState } from "react";
import { TagCard } from "../components/tag-card";
import { sortArray, filterArray, paginateArray } from "~/core/lib/utils";
import { SORT_OPTIONS } from "../lib/constants";
import type { SortKey, Tag } from "../lib/tag.types";
import type { Route } from "./+types/tags";
import { getTags } from "../db/queries";
import makeServerClient from "~/core/lib/supa-client.server";
import { requireAuthentication } from "~/core/lib/guards.server";
import { toTag } from "../lib/taUtils";
import { getSortedTags } from "../lib/taUtils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Tags | ${import.meta.env.VITE_APP_NAME}` }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  await requireAuthentication(client);
  const { data: { user } } = await client.auth.getUser();
  const tags = await getTags(client, { userId: user!.id });
  return { tags };
};

export default function TagsScreen({ loaderData }: Route.ComponentProps) {
  const { tags: initialTags } = loaderData;
  const [sortKey, setSortKey] = useState<SortKey>("usage_count");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [tags, setTags] = useState<Tag[]>(initialTags.map((item: any) => toTag(item)));
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 12;

  // 필터
  const filtered = useMemo(() =>
    filterArray(tags, tag =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      String(tag.id).includes(search)
    ), [tags, search]
  );

  // 정렬
  const sorted = useMemo(() => {
    return getSortedTags(filtered, sortKey, sortOrder);
  }, [filtered, sortKey, sortOrder]);

  // 페이지네이션
  const totalRows = sorted.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const pagedTags = useMemo(() =>
    paginateArray(sorted, page, pageSize),
    [sorted, page, pageSize]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
        <p className="text-muted-foreground">등록된 태그 목록</p>
      </div>
      <div className="flex flex-wrap items-center mb-4 gap-2">
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pagedTags.map(tag => (
          <TagCard
            key={`${tag.id}-${tag.name}`}
            id={tag.id}
            name={tag.name}
            usage_count={tag.usage_count}
            createdAt={tag.createdAt}
            tags={tags}
            setTags={setTags}
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