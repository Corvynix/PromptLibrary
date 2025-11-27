import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold tracking-wider ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-all duration-100 uppercase",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 border-2 border-transparent",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border-2 border-transparent",
        outline:
          "border-2 border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background",
        secondary:
          "bg-foreground/10 text-foreground hover:bg-foreground/20 border-2 border-transparent",
        ghost: "hover:bg-foreground/10 hover:text-foreground text-foreground/70",
        link: "text-blue-400 underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black border-0 hover:brightness-110",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Motion Button for extra juice
const MotionButton = motion(Button)

export { Button, buttonVariants, MotionButton }
