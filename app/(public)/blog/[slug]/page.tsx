// app/(public)/blog/[slug]/page.tsx
import { getPostBySlug } from '@/utils/posts'
import { remark } from 'remark'
import html from 'remark-html'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

export const dynamicParams = true

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content', 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => {
    return {
      slug: filename.replace(/\.md$/, ''),
    }
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { metadata } = getPostBySlug(params.slug)

  return {
    title: metadata.title,
    description: metadata.summary,
    openGraph: {
      title: metadata.title,
      description: metadata.summary,
      url: `https://feedybacky.com.br/blog/${params.slug}`,
      type: 'article',
      images: metadata.coverImage
        ? [{ url: `https://feedybacky.com.br${metadata.coverImage}` }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.summary,
      images: metadata.coverImage
        ? [`https://feedybacky.com.br${metadata.coverImage}`]
        : [],
    },
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  const processed = await remark().use(html).process(post.content)
  const contentHtml = processed.toString()

  return (
    <main className="w-full max-w-[1400px] mx-auto py-12 px-4">
      <article
        className="prose prose-lg lg:prose-xl"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="mb-10">
          {post.metadata.coverImage && (
            <img
              src={post.metadata.coverImage}
              alt={`Imagem de capa: ${post.metadata.title}`}
              className="w-full h-auto rounded-lg shadow mb-6"
              itemProp="image"
            />
          )}
          <h1 className="text-4xl font-bold" itemProp="headline">
            {post.metadata.title}
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            <time dateTime={post.metadata.date} itemProp="datePublished">
              {new Date(post.metadata.date).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {post.metadata.author && (
              <span className="ml-2" itemProp="author">
                {post.metadata.author}
              </span>
            )}
          </div>
          {post.metadata.category && (
            <div className="mt-2 text-xs font-semibold uppercase text-acazul">
              {post.metadata.category}
            </div>
          )}
          {post.metadata.tags && (
            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
              {post.metadata.tags.map((tag: string) => (
                <li key={tag} className="bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <section
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          itemProp="articleBody"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.metadata.title,
              description: post.metadata.summary,
              image: post.metadata.coverImage
                ? `https://feedybacky.com.br${post.metadata.coverImage}`
                : undefined,
              author: {
                '@type': 'Person',
                name: post.metadata.author || 'Feedybacky',
              },
              datePublished: post.metadata.date,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://feedybacky.com.br/blog/${params.slug}`,
              },
            }),
          }}
        />
      </article>
    </main>
  )
}
