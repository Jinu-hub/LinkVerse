import React, { createContext, useReducer, useContext } from "react";
import type { Dispatch } from "react";
import type { Category } from "./category-tree";

// 상태 타입
interface CategoryTreeState {
  renamingId: number | null;
  addingToId: number | null;
  deleteCandidate: Category | null;
}

// 액션 타입
export type CategoryTreeAction =
  | { type: "RENAME"; id: number }
  | { type: "ADD"; parentId: number | null }
  | { type: "CANCEL" }
  | { type: "DELETE_CANDIDATE_SET"; category: Category }
  | { type: "DELETE_CANDIDATE_CLEAR" };

const initialState: CategoryTreeState = {
  renamingId: null,
  addingToId: null,
  deleteCandidate: null,
};

function reducer(state: CategoryTreeState, action: CategoryTreeAction): CategoryTreeState {
  switch (action.type) {
    case "RENAME":
      return { ...state, renamingId: action.id, addingToId: null };
    case "ADD":
      return { ...state, addingToId: action.parentId ?? 0, renamingId: null };
    case "CANCEL":
      return { ...state, renamingId: null, addingToId: null };
    case "DELETE_CANDIDATE_SET":
      return { ...state, deleteCandidate: action.category };
    case "DELETE_CANDIDATE_CLEAR":
      return { ...state, deleteCandidate: null };
    default:
      return state;
  }
}

const CategoryTreeContext = createContext<
  | {
      state: CategoryTreeState;
      dispatch: Dispatch<CategoryTreeAction>;
    }
  | undefined
>(undefined);

export function CategoryTreeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CategoryTreeContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryTreeContext.Provider>
  );
}

export function useCategoryTreeContext() {
  const ctx = useContext(CategoryTreeContext);
  if (!ctx) throw new Error("useCategoryTreeContext must be used within CategoryTreeProvider");
  return ctx;
} 