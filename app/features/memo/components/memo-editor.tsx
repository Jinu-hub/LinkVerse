import React, { useEffect, useState } from "react"

interface MemoEditorProps {
  memoId: number
  content: string
  readOnly?: boolean
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  saving?: boolean
}

export function MemoEditor({ memoId, content, readOnly = false
  , onChange, onSave, saving = false }: MemoEditorProps) {
  const [value, setValue] = useState(content)

  if (readOnly) {
    return (
      <div className="whitespace-pre-line text-base leading-relaxed bg-zinc-50 dark:bg-zinc-900 rounded p-4 min-h-[120px]">
        {content}
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleBlur = () => {
    onSave?.(value)
  }

  return (
    <textarea
      className="w-full min-h-[240px] rounded border p-2 text-base"
      value={value}
      onChange={handleChange}
      //onBlur={handleBlur}
      placeholder="메모를 입력하세요..."
      disabled={saving}
    />
  )
}
