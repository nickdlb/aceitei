import { getAllPosts } from '@/utils/posts'
import { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog Feedybacky',
  description: 'Conteúdos e artigos sobre feedback visual, produtividade e colaboração criativa.'
}

export default function BlogPage() {
  const posts = getAllPosts() // ✅ executado no servidor
  return <BlogPageClient posts={posts} />
}
