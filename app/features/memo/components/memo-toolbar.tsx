import React from "react";

interface MemoToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  rowsPerPage: number | 'all';
  onRowsPerPageChange: (value: string) => void;
}

const MemoToolbar: React.FC<MemoToolbarProps> = ({
  searchValue,
  onSearchChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  return (
    <div className="flex flex-wrap items-center mb-4 justify-between w-full">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <input
          className="border rounded px-2 py-1 text-sm w-full max-w-xs"
          placeholder="메모 검색"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-muted-foreground hidden sm:inline">표시 개수</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={String(rowsPerPage)}
          onChange={e => onRowsPerPageChange(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
};

export default MemoToolbar; 