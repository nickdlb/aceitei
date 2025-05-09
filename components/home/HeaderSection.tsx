'use client'

import { ToggleDarkModeAnimated } from "../ui/toggleDarkmode"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuthChecker } from '@/utils/useAuthChecker';

export default function HeaderSection() {
    const { theme } = useTheme()
    const { isLoading, isAuthenticated, shouldRedirect } = useAuthChecker();

    return (
        <header className="flex items-center justify-center">
            <div className="max-w-[1400px] w-full flex justify-between items-center py-4">
                <Link title="home" href="/"><img src={theme === 'dark' ? '/logo-feedybacky-white.png' : '/logo-feedybacky-dark.png'} alt="Feedybacky" className="h-8" />
                </Link>
                <ToggleDarkModeAnimated />
                <nav className="flex gap-10 items-center">
                    <a title="login" href="/login" className={`${isAuthenticated === true ? 'hidden' : 'block'} bg-acpreto text-acbranco px-4 py-2 rounded-xl text-sm`}> Login </a>
                    <a title="dashboard" href="/dashboard" className={`${isAuthenticated === true ? 'block' : 'hidden'} text-sm font-medium text-acpreto rounded-xl`}> Dashboard </a>
                    <button className="bg-acazul text-acbranco px-4 py-2 rounded-xl text-sm">Inscreva-se</button>
                </nav>
            </div>

        </header>
    )
}
