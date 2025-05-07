'use client'

import { ToggleDarkModeAnimated } from "../ui/toggleDarkmode"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"

export default function HeaderSection() {
    const { theme } = useTheme()

    return (
        <header className="flex items-center justify-center">
            <div className="max-w-[1400px] w-full flex justify-between items-center py-4">
                <Link title="home" href="/"><img src={theme === 'dark' ? '/logo-feedybacky-white.png' : '/logo-feedybacky-dark.png'} alt="Feedybacky" className="h-8" />
                </Link>
                <ToggleDarkModeAnimated />
                <nav className="flex gap-4 items-center">
                    <a title="login" href="/login" className="text-sm font-medium text-acpreto"> Login </a>
                    <a title="dashboard" href="/dashboard" className="text-sm font-medium text-acpreto"> Dashboard </a>
                    <button className="bg-acazul text-acbranco px-4 py-2 rounded hover:bg-acazul/80 text-sm">Inscreva-se</button>
                </nav>
            </div>

        </header>
    )
}
