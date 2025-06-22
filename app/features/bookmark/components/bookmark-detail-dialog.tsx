import { Button } from "~/core/components/ui/button";
import { useState, useEffect } from "react";
import { Badge } from "~/core/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/core/components/ui/dialog";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";


type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void; 
    bookmark: {
      id: string;
      title: string;
      url: string;
      tags: string[];
      //memo: string;
    };
    onSave: (updated: Props["bookmark"]) => void;
  };

export default function BookmarkDetailDialog({ open, onOpenChange, bookmark, onSave }: Props) {
    const [title, setTitle] = useState(bookmark.title);
    const [url, setUrl] = useState(bookmark.url);
    const [tags, setTags] = useState<string[]>(bookmark.tags);
    //const [memo, setMemo] = useState(bookmark.memo);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        setTitle(bookmark.title);
        setUrl(bookmark.url);
        setTags(bookmark.tags);
        //setMemo(bookmark.memo);
        setNewTag("");
    }, [bookmark]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
          setTags([...tags, newTag.trim()]);
          setNewTag("");
        }
      };
    
    const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    };

    const handleSave = () => {
    onSave({ ...bookmark, title, url, tags });
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>북마크 상세 정보</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" />
  
            <div>
              <div className="mb-1 text-sm text-muted-foreground">태그</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ✕
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="태그 추가 후 Enter"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
  
            <Textarea
              //value={memo}
              //onChange={e => setMemo(e.target.value)}
              placeholder="메모 입력"
              rows={4}
            />
          </div>
  
          <DialogFooter className="mt-4">
            <Button className="bg-blue-200 hover:bg-blue-300 text-blue-900" onClick={handleSave}>Add</Button>
            <Button className="bg-green-200 hover:bg-green-300 text-green-900" onClick={handleSave}>Edit</Button>
            <Button className="bg-red-200 hover:bg-red-300 text-red-900" onClick={handleSave}>Del</Button>
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}