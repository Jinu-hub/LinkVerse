import React, { useState } from "react";
import { CONTENT_TYPES } from "~/core/lib/constants";
import makeServerClient from "~/core/lib/supa-client.server";
import { requireAuthentication } from "~/core/lib/guards.server";
import { getMemoDetail } from "../db/queries";
import type { Route } from "./+types/memo-detail";
import { MemoEditor } from "../components/memo-editor";
import { toMemo } from "../lib/mmUtils";
import { Button } from "~/core/components/ui/button";
import { editMemo } from "../lib/mmActions";
import type { Memo } from "../lib/memo.types";

const getType = (contentTypeId: number): string => {
  return (CONTENT_TYPES.find(t => t.id === contentTypeId)?.code || 'bookmark') as string;
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const [client] = makeServerClient(request);
  await requireAuthentication(client);
  const { data: { user } } = await client.auth.getUser();
  const memo = await getMemoDetail(client, { userId: user!.id, memoId: Number(params.id) });
  return { memo: memo && memo[0] };
}

const MemoDetailScreen = ({ loaderData }: Route.ComponentProps) => {
  const { memo: initialMemo } = loaderData;
  const [memo, setMemo] = useState<Memo>(toMemo(initialMemo));
  const [saving, setSaving] = useState(false);

  const handleSave = async (content: string) => {
    setSaving(true);
    const result = await editMemo({ id: memo!.memoId, content: content, setMemo });
    setSaving(false);
  }
  
  if (!memo) {
    return <div className="p-8 text-center text-lg">존재하지 않는 메모입니다.</div>;
  }

  const type = getType(memo!.contentTypeId);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{memo!.title}</h1>
      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
        <span
          className="
            inline-block px-2.5 py-0.5 rounded-full
            bg-primary/20 text-primary font-semibold text-xs
            border border-primary/30 tracking-wide
            mr-2
          "
          style={{ minWidth: "fit-content" }}
        >
          {type.toUpperCase()}
        </span>
        <div className="flex items-center gap-1 min-w-0 break-words">
          <span className="text-gray-400">🗓️</span> 메모 작성일: <span className="font-semibold text-gray-700 dark:text-gray-200">{memo!.createdAt.slice(0, 10)}</span>
        </div>
        <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1 min-w-0 break-words">
          <span className="text-gray-400">✏️</span> 메모 수정일: <span className="font-semibold text-gray-700 dark:text-gray-200">{memo!.updatedAt.slice(0, 10)}</span>
        </div>
      </div>
      <div className="mt-6">
        <MemoEditor 
          memoId={memo!.memoId} 
          content={memo!.content} 
          readOnly={false} 
          onSave={handleSave}
          saving={saving}
        />
      </div>
      <div className="flex justify-end mt-8">
        <Button
          variant="outline"
          className="cursor-pointer hover:bg-gray-200 px-6 py-3 text-base rounded-lg"
          onClick={() => handleSave(memo!.content)}
          disabled={saving}
        >
          {saving ? "저장중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};

export default MemoDetailScreen; 