import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/utils'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext' // Import useTheme

const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[box-shadow] duration-200 ease-in-out aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap overflow-hidden", // Removed color and background-color from transition, added duration/easing for hover
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "size-9 p-0", // Adjusted size for icon-only button
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

// Define the props type including onPressedChange
type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    onPressedChange?: (pressed: boolean) => void
    // Add a specific prop to control the dark mode behavior
    // controlsDarkMode prop is no longer needed as theme is handled by context
  }

function Toggle({
  className,
  variant,
  size,
  // onPressedChange is still supported if needed for other reasons,
  // but it won't receive the theme state directly anymore unless modified.
  onPressedChange,
  ...props
}: ToggleProps) {
  const { theme, toggleTheme } = useTheme() // Use the theme context

  // Determine if dark mode is active based on context
  const isDarkMode = theme === 'dark'

  // Handle the toggle press by calling the context function
  const handlePressedChange = () => {
    toggleTheme()
    // If an external onPressedChange handler exists, call it.
    // Note: It no longer receives the boolean state directly from this component.
    // You might need to adjust how onPressedChange is used externally if it relied on the boolean.
    if (onPressedChange) {
      // Consider what argument to pass here if needed, maybe the new theme?
      onPressedChange(theme === 'light' ? true : false) // Example: passing a boolean derived from the *next* state
    }
  }

  return (
    <TogglePrimitive.Root
      pressed={isDarkMode} // Control pressed state based on context theme
      onPressedChange={handlePressedChange} // Use the context toggle handler
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      {...props}
    >
      {/* Sun Icon - Visible in Light Mode */}
      <Sun
        className={cn(
          "absolute size-4 transition-all duration-500 ease-in-out",
          isDarkMode
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden="true"
      />
      {/* Moon Icon - Visible in Dark Mode */}
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

// The useThemeEffect hook is removed as its logic is now handled by ThemeProvider and ThemeInitScript

export { Toggle, toggleVariants }
