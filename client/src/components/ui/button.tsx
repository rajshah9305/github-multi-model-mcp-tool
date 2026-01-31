import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-emerald-500 to-amber-600 text-white hover:from-emerald-600 hover:to-amber-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5": variant === "default",
            "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700": variant === "destructive",
            "border border-emerald-500/30 bg-transparent text-stone-300 hover:bg-emerald-500/10 hover:text-white hover:border-emerald-500/50": variant === "outline",
            "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white": variant === "secondary",
            "text-stone-400 hover:bg-emerald-500/10 hover:text-white": variant === "ghost",
            "text-emerald-400 underline-offset-4 hover:underline hover:text-emerald-300": variant === "link",
          },
          {
            "h-10 px-5 py-2": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
