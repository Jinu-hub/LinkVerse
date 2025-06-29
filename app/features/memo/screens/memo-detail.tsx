import React from "react";
import { useParams } from "react-router";
import { mockMemoContents, mockContentTypes } from "~/features/mock-data";
import type { ContentType } from "../../tag/components/tag-content-card";
import { MemoEditor } from "../components/memo-editor";

const getType = (contentTypeId: number): ContentType => {
  return (mockContentTypes.find(t => t.id === contentTypeId)?.code || 'bookmark') as ContentType;
};

const MemoDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const memoId = Number(id);
  const memo = mockMemoContents.find(m => m.memoId === memoId);

  if (!memo) {
    return <div className="p-8 text-center text-lg">존재하지 않는 메모입니다.</div>;
  }

  const type = getType(memo.contentTypeId);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{memo.title}</h1>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-xs mr-2">
          {type.toUpperCase()}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-gray-400">🗓️</span> 메모 작성일: <span className="font-semibold text-gray-700 dark:text-gray-200">{memo.createdAt.slice(0, 10)}</span>
        </span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="flex items-center gap-1">
          <span className="text-gray-400">✏️</span> 메모 수정일: <span className="font-semibold text-gray-700 dark:text-gray-200">{memo.updatedAt.slice(0, 10)}</span>
        </span>
      </div>
      <div className="mt-6">
        <MemoEditor memoId={memo.memoId} content={memo.content} readOnly={false} />
      </div>
    </div>
  );
};

export default MemoDetailScreen; 