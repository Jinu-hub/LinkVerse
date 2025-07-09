import { bookmarkSchema } from "./constants";
import { data } from "react-router";


export async function addBookmark({
    title,
    url,
    tags,
    categoryId,
    parentCategoryId,
    newCategoryName,
    memo,
}: {
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    memo: string;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        tags,
        newCategoryName,
        memo,
    });
    if (!success) {
        return { ok: false, fieldErrors: error.flatten().fieldErrors };
    }

    return {ok: true};
   
}

export async function editBookmark({
    id,
    title,
    url,
    tags,
    categoryId,
    parentCategoryId,
    newCategoryName,
    memo,
}: {
    id: number;
    title: string;
    url: string;
    tags: string[];
    categoryId?: number;
    parentCategoryId?: number;
    newCategoryName: string;
    memo: string;
}) {
    const {
        data: validData,
        success,
        error,
      } = bookmarkSchema.safeParse({
        title,
        url,
        tags,
        newCategoryName,
        memo,
    });
    if (!success) {
        return { ok: false, fieldErrors: error.flatten().fieldErrors };
    }

    return {ok: true};
   
}