'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Post {
  slug: string
  metadata: {
    title: string
    summary: string
    date: string
    coverImage?: string
  }
}

export default function BlogPageClient({ posts }: { posts: Post[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = posts.filter((post) => {
    const target = `${post.metadata.title} ${post.metadata.summary}`.toLowerCase()
    return target.includes(searchTerm.toLowerCase())
  })

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-acpreto">Blog Feedybacky</h1>
      <p className="text-acpreto mb-10 text-lg">Confira conteúdos sobre feedbacks visuais, produtividade e design colaborativo.</p>

      <input
        type="text"
        placeholder="Buscar por título ou resumo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-10 focus:outline-none focus:ring-2 focus:ring-acazul"
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {post.metadata.coverImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.metadata.coverImage}
                  alt={`Imagem de capa: ${post.metadata.title}`}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-acpreto group-hover:text-acazul transition">
                {post.metadata.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(post.metadata.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="mt-3 text-gray-700 text-sm">
                {post.metadata.summary}
              </p>
            </div>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">Nenhum post encontrado.</p>
        )}
      </div>
    </main>
  )
}
