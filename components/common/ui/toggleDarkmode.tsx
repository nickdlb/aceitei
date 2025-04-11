import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/utils'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[box-shadow] duration-200 ease-in-out aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "size-9 p-0",
        sm: "size-8 p-0",
        lg: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    onPressedChange?: (pressed: boolean) => void

  }

function Toggle({
  className,
  variant,
  size,

  onPressedChange,
  ...props
}: ToggleProps) {
  const { theme, toggleTheme } = useTheme()

  const isDarkMode = theme === 'dark'

  const handlePressedChange = () => {
    toggleTheme()

    if (onPressedChange) {

      onPressedChange(theme === 'light' ? true : false)
    }
  }

  return (
    <TogglePrimitive.Root
      pressed={isDarkMode}
      onPressedChange={handlePressedChange}
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      {...props}
    >
      <Sun
        className={cn(
          "absolute size-4 transition-all duration-500 ease-in-out",
          isDarkMode
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-500 ease-in-out",
          isDarkMode
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
