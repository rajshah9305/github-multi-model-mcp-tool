import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-stone-900/50 px-4 py-3 text-sm text-stone-100 transition-all duration-200 placeholder:text-stone-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "border-emerald-500/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-emerald-500/40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
