import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/core/components/ui/dialog";
import { Button } from "~/core/components/ui/button";
import { Badge } from "~/core/components/ui/badge";
import { CONTENT_TYPES } from "~/core/lib/constants";
import React, { useState } from "react";

interface TagEditDialogProps {
  editButtonTop: number;
  editTagName: string;
  setEditTagName: (v: string) => void;
  selectedContentIds: string[];
  sorted: any[];
  typeColorMap: Record<string, string>;
}

export function TagEditDialog({
  editButtonTop,
  editTagName,
  setEditTagName,
  selectedContentIds,
  sorted,
  typeColorMap,
}: TagEditDialogProps) {
  const [open, setOpen] = useState(false);

  // Edit 버튼 클릭 시 실행될 핸들러
  function handleEdit() {
    // 실제로는 API 호출 등으로 대체
    console.log("태그 이름:", editTagName);
    console.log("선택된 콘텐츠:", selectedContentIds);
    // TODO: 실제 저장 로직 추가
    setOpen(false); // 성공 시 다이얼로그 닫기
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {selectedContentIds.length > 0 && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="fixed right-8 z-50 px-6 py-3 rounded-lg font-bold shadow-md cursor-pointer hover:bg-gray-200 text-base"
            style={{ top: `${editButtonTop}px` }}
          >
            편집
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>태그 편집</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={editTagName}
            onChange={e => setEditTagName(e.target.value)}
          />
        </div>
        <div className="space-y-2 mt-4">
          <div className="font-semibold text-base mb-1">선택된 콘텐츠</div>
          <div className="flex flex-wrap gap-2">
            {selectedContentIds.map(id => {
              const content = sorted.find(c => (c.contentTypeId + '_' + c.contentId) === id);
              if (!content) return null;
              const typeCode = CONTENT_TYPES.find(t => t.id === content.contentTypeId)?.code || 'other';
              return (
                <Badge key={id} variant="default" className={typeColorMap[typeCode] || ''}>
                  {content.title}
                </Badge>
              );
            })}
          </div>
        </div>
        <DialogFooter>  
          <Button 
            className="bg-green-200 hover:bg-green-300 text-green-900 cursor-pointer disabled:cursor-not-allowed"  
            onClick={handleEdit}>Edit</Button>
          <Button
            variant="secondary"
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setOpen(false)}
            >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
