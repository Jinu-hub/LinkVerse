import { Button } from "~/core/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";
import { Input } from "~/core/components/ui/input";
import FormErrors from "~/core/components/form-error";

export default function BookmarkAddDialog({ 
  open, onOpenChange, onSave, fieldErrors, setFieldErrors, saving }
  : {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (url: string) => void;
    fieldErrors: { [key: string]: string[] };
    setFieldErrors: (errors: { [key: string]: string[] }) => void;
    saving: boolean;
  }
) {
    const [url, setUrl] = useState("");
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const isError = Object.keys(fieldErrors).length > 0;
    const isSetUrlFromClipboard = useRef(false);

    // 북마크 정보 업데이트
    useEffect(() => {
      if (!isError && !saving) {
        setUrl("");
      }
    }, [isError]);

    // open이 false일 때만 입력값 리셋
    useEffect(() => {
      if (!open) {
        setUrl("");
        setFieldErrors({});
        isSetUrlFromClipboard.current = false;
      }
    }, [open]);

    // 클립보드에서 URL 읽어오기
    useEffect(() => {
      if (open && !url && !isSetUrlFromClipboard.current) {
        const timer = setTimeout(() => {
          navigator.clipboard.readText().then(text => {
            const urlSchema = z.string().url();
            const result = urlSchema.safeParse(text);
            if (result.success) {
              setUrl(result.data);
              isSetUrlFromClipboard.current = true;
            }
          });
        }, 300); // 300ms 정도 딜레이
        return () => clearTimeout(timer);
      }
    }, [open, url]);

    // 북마크 저장
    const handleSave = () => {
      onSave(url);
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={dialogContentRef}>
          <DialogHeader>
            <DialogTitle className="text-xl">북마크 추가</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <div className="relative">
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" disabled={saving} />
              {fieldErrors?.url ? (<FormErrors errors={fieldErrors.url} />) : null}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="w-full text-left">
              {fieldErrors?.form ? (<FormErrors errors={fieldErrors.form} />) : null}
            </div>
            <Button 
              className="bg-blue-200 hover:bg-blue-300 text-blue-900 cursor-pointer disabled:cursor-not-allowed" 
              onClick={handleSave} 
              disabled={saving}
            >
              Add
            </Button>
            <Button
              variant="secondary"
              disabled={saving}
              className="cursor-pointer disabled:cursor-not-allowed"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}