import { Input } from "~/core/components/ui/input";
import { useState, useRef, useEffect } from "react";

interface CategoryInputProps {
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function CategoryInput({
  defaultValue = "",
  placeholder = "입력 후 엔터",
  autoFocus = false,
  onSubmit,
  onCancel,
}: CategoryInputProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.trim() !== "") {
        onSubmit(value.trim());
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
} 