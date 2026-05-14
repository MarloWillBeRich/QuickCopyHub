import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Simplistic cva implementation for our variants
    const variants: Record<string, string> = {
      default: "bg-white text-black hover:bg-gray-200",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-card-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white",
      ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-white",
      link: "text-primary underline-offset-4 hover:underline",
    }
    
    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
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
