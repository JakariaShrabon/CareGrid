import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Checkbox({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-input text-primary accent-primary focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
