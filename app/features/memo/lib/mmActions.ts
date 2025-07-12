import { toast } from "sonner";
import type { Memo } from "./memo.types";
import { toMemo } from "./mmUtils";


export async function editMemo({
    id,
    content,
    setMemo,
}: {
    id: number;
    content: string;
    setMemo: (memo: Memo) => void;
}) {
    const res = await fetch(`/memos/api/memo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        return { ok: false, error: "메모 수정에 실패했습니다." };
    }
    const { memo: updatedMemo } = await res.json();
    toast.success("메모가 수정되었습니다");
    setMemo(toMemo(updatedMemo));
    return { ok: true, data: updatedMemo };
}