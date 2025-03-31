import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/utils"
import { Sun, Moon } from "lucide-react"

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
    controlsDarkMode?: boolean
  }

function Toggle({
  className,
  variant,
  size,
  onPressedChange,
  controlsDarkMode = false, // Default to false
  ...props
}: ToggleProps) {
  // State to manage the current theme based on the body class
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  // Effect to set initial state based on body class
  React.useEffect(() => {
    setIsDarkMode(document.body.classList.contains("dark"))
  }, [])

  const handlePressedChange = (pressed: boolean) => {
    // The 'pressed' state from Radix Toggle might not directly map to dark mode state
    // We toggle our internal state and update the body class
    const newDarkModeState = !isDarkMode
    setIsDarkMode(newDarkModeState)

    if (controlsDarkMode) {
      if (newDarkModeState) {
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark") // Optional: Persist theme
      } else {
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light") // Optional: Persist theme
      }
    }
    // Call the original onPressedChange if it exists, passing the new dark mode state
    if (onPressedChange) {
      onPressedChange(newDarkModeState)
    }
  }

  // Determine the pressed state for Radix based on our dark mode state
  const pressedState = isDarkMode

  return (
    <TogglePrimitive.Root
      pressed={pressedState} // Control pressed state based on isDarkMode
      onPressedChange={handlePressedChange} // Use the custom handler
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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

// Effect hook to apply theme from localStorage on initial load
// This should ideally be in a top-level layout component or provider
// but placing it here for simplicity based on the request.
function useThemeEffect() {
  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [])
}

// You might want to call useThemeEffect() in your main layout component
// e.g., in app/layout.tsx or components/layouts/PageLayout.tsx

export { Toggle, toggleVariants, useThemeEffect }
