import { Input } from "~/core/components/ui/input";
import { useState, useRef, useEffect } from "react";
import FormErrors from "~/core/components/form-error";

interface CategoryInputProps {
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  error?: string;
  disabled?: boolean;
}

export function CategoryInput({
  defaultValue = "",
  placeholder = "입력 후 엔터",
  autoFocus = false,
  onSubmit,
  onCancel,
  error,
  disabled = false,
}: CategoryInputProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "" && !disabled) {
      onSubmit(value.trim());
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  return (
    <div>
      <Input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {error && <FormErrors errors={[error]} />}
    </div>
  );
} 