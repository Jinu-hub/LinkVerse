import React, { useMemo, useState } from "react";
import { mockMemoContents, mockContentTypes } from "../../bookmark/lib/mock-data";
import type { ContentType } from "../../tag/components/tag-content-card";
import MemoToolbar from "../components/memo-toolbar";
import MemoTable from "../components/memo-table";
import type { SortKey } from "../types/memo.types";

const getType = (contentTypeId: number): ContentType => {
  return (mockContentTypes.find(t => t.id === contentTypeId)?.code || 'bookmark') as ContentType;
};

const MemosScreen = () => {
  // 상태
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<number | null>(null);

  // 필터/검색
  const filtered = useMemo(() =>
    mockMemoContents.filter(memo =>
      (selectedType === null || memo.contentTypeId === selectedType) &&
      (memo.title.toLowerCase().includes(search.toLowerCase()) ||
        memo.content.toLowerCase().includes(search.toLowerCase()))
    ), [search, selectedType]
  );

  // 정렬
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === "createdAt" || sortKey === "updatedAt") {
        return sortOrder === 'asc'
          ? a[sortKey].localeCompare(b[sortKey])
          : b[sortKey].localeCompare(a[sortKey]);
      } else if (sortKey === "contentTypeId") {
        return sortOrder === 'asc'
          ? a.contentTypeId - b.contentTypeId
          : b.contentTypeId - a.contentTypeId;
      } else {
        return sortOrder === 'asc'
          ? a[sortKey].localeCompare(b[sortKey])
          : b[sortKey].localeCompare(a[sortKey]);
      }
    });
    return arr;
  }, [filtered, sortKey, sortOrder]);

  // 페이지네이션
  const totalRows = sorted.length;
  const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(totalRows / Number(rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startEntry = totalRows === 0 ? 0 : ((currentPage - 1) * (rowsPerPage === 'all' ? totalRows : Number(rowsPerPage))) + 1;
  const endEntry = rowsPerPage === 'all' ? totalRows : Math.min(currentPage * Number(rowsPerPage), totalRows);
  const pagedMemos = useMemo(() => {
    if (rowsPerPage === 'all') return sorted;
    return sorted.slice((currentPage - 1) * Number(rowsPerPage), currentPage * Number(rowsPerPage));
  }, [sorted, currentPage, rowsPerPage]);

  // 핸들러
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">메모 리스트</h1>
      {/* 콘텐츠 타입 필터 버튼 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {mockContentTypes.map(type => (
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
            onClick={() => {
              setSelectedType(type.id === 0 ? null : type.id);
              setPage(1);
            }}
          >
            {type.code}
          </button>
        ))}
      </div>
      <MemoToolbar
        searchValue={search}
        onSearchChange={v => { setSearch(v); setPage(1); }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={v => {
          setRowsPerPage(v === 'all' ? 'all' : Number(v));
          setPage(1);
        }}
      />
      <MemoTable
        pagedMemos={pagedMemos}
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
      />
    </div>
  );
};

export default MemosScreen; 