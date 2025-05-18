'use client'

import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuthChecker } from '@/utils/useAuthChecker';
import useAuthLogin from "@/hooks/useAuthLogin";

export default function HeaderSection() {
    const { theme, logo } = useTheme()
    const { isLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
    const { handleGoogleLogin } = useAuthLogin();

    return (
        <header className="flex items-center justify-center bg-acbg">
            <div className="max-w-[1400px] w-full flex justify-between items-center py-4">
                <div className="flex items-center justify-center gap-5">
                    <div className="min-w-[160px]">
                    {logo !== '' && (
                        <Link title="home" href="/"><img src={logo} alt="Feedybacky" className="w-[160px]" />
                        </Link>
                    )}
                    </div>
                    <Link href="" className="text-acpreto font-medium">Features</Link>
                    <Link href="" className="text-acpreto font-medium">Preço</Link>
                    <Link href="" className="text-acpreto font-medium">Blog</Link>
                    <Link href="" className="text-acpreto font-medium"></Link>
                </div>                
                <div className="flex min-w-20">
                    {!isLoading && typeof isAuthenticated === 'boolean' && (
                    <div>
                        {!isAuthenticated && (
                            <div className="flex gap-8">
                                <button className="gap-2 bg-acazul text-acbrancohover px-4 py-2 rounded-full">
                                    <a href='/register'>
                                        Teste Grátis
                                    </a>
                                </button>
                                <button className="gap-2 bg-acpreto text-acbranco px-4 py-2 rounded-full">
                                    <a href="/login">
                                        Login
                                    </a>
                                </button>
                            </div>
                        )}
                        {isAuthenticated && (
                        <a title="dashboard" href="/dashboard" className="gap-2 bg-acazul text-acbrancohover px-4 py-2 rounded-full">Dashboard</a>
                        )}
                    </div>
                )}
                </div>
            </div>

        </header>
    )
}
