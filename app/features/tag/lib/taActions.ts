import { toast } from "sonner";
import type { Tag, UntaggedContent } from "./tag.types";
import { toTag } from "./taUtils";
import { tagSchema, tagSchema2 } from "./constants";


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
    const {
        success,
        error,
      } = tagSchema2.safeParse({
        name,
    });
    if (!success) {
        toast.error("태그 이름 수정에 실패했습니다.", {
            description: error.flatten().fieldErrors.name?.join("\n")
        });
        return { ok: false };
    }
    try {
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
    } catch (e) {
        console.log(e);
        return { ok: false, error: "알 수 없는 에러가 발생했습니다." };
    }
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


export async function saveTags({
    contentTypeId,
    contentId,
    tags,
    setUntaggedContents,
}: {
    contentTypeId: number;
    contentId: string;
    tags: string[];
    setUntaggedContents: React.Dispatch<React.SetStateAction<UntaggedContent[]>>;
}) {
    const {
        data: validData,
        success,
        error,
      } = tagSchema.safeParse({
        contentTypeId,
        tags,
    });
    if (!success) {
        toast.error("태그 저장에 실패했습니다.", {
          description: error.flatten().fieldErrors.tags?.join("\n")
        });
        return { ok: false};
    }
    try {
        
        const res = await fetch(`/tags/api/untag/${contentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validData),
        });
        if (!res.ok) {
            return { ok: false, error: "태그 저장에 실패했습니다." };
        }
        
        setUntaggedContents(prev => prev.filter(b => b.targetId.toString() !== contentId));
        toast.success("태그가 저장되었습니다");
        return { ok: true };
    } catch (e) {
        console.log(e);
        return { ok: false, error: "알 수 없는 에러가 발생했습니다." };
    }
}