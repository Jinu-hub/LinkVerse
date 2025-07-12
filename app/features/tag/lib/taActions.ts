import { toast } from "sonner";
import type { Tag } from "./tag.types";
import { toTag } from "./taUtils";


export async function editTagName({
    id,
    name,
    tags,
    setTags,
}: {
    id: number;
    name: string;
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
}) {
    const res = await fetch(`/tags/api/tag/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) {
        return { ok: false, error: "태그 이름 수정에 실패했습니다." };
    }
    const { tag: updatedTag } = await res.json();
    const updatedTagObj = toTag(updatedTag);
    console.log("updatedTagObj", updatedTagObj.id, updatedTagObj.name);
    setTags(tags.map(tag => tag.id === id ? updatedTagObj : tag));
    toast.success("태그 이름이 수정되었습니다");
    return { ok: true, data: updatedTagObj };
}


export async function deleteTag({
    id,
    tags,
    setTags,
}: {
    id: number;
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
}) {
    const res = await fetch(`/tags/api/tag/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        return { ok: false, error: "태그 삭제에 실패했습니다." };
    }
    setTags(tags.filter(tag => tag.id !== id));
    toast.success("태그가 삭제되었습니다");
    return { ok: true };
}