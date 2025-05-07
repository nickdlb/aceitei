// app/(public)/blog/[slug]/page.tsx
import { getPostBySlug } from '@/utils/posts'
import { remark } from 'remark'
import html from 'remark-html'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

interface BlogPostParams {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostParams): Promise<Metadata> {
  const { metadata } = getPostBySlug(params.slug)

  return {
    title: metadata.title,
    description: metadata.summary,
    openGraph: {
      title: metadata.title,
      description: metadata.summary,
      type: 'article',
      url: `https://feedybacky.com.br/blog/${params.slug}`,
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

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export async function generateStaticParams() {
  const filenames = fs.readdirSync(postsDirectory)
  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    return { params: { slug } }
  })
}

export default async function BlogPost({ params }: BlogPostParams) {
  const { slug } = params
  const { content, metadata } = getPostBySlug(slug)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return (
    <main className="w-full max-w-[1400px] mx-auto py-12 px-4">
      <article
        className="prose prose-lg lg:prose-xl"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="mb-10">
          {metadata.coverImage && (
            <img
              src={metadata.coverImage}
              alt={`Imagem de capa: ${metadata.title}`}
              className="w-full h-auto rounded-lg shadow mb-6"
              itemProp="image"
            />
          )}
          <h1 className="text-4xl font-bold" itemProp="headline">
            {metadata.title}
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            <time dateTime={metadata.date} itemProp="datePublished">
              {new Date(metadata.date).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {metadata.author && (
              <span className="ml-2" itemProp="author">
                {metadata.author}
              </span>
            )}
          </div>
          {metadata.category && (
            <div className="mt-2 text-xs font-semibold uppercase text-acazul">
              {metadata.category}
            </div>
          )}
          {metadata.tags && (
            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
              {metadata.tags.map((tag: string) => (
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

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metadata.title,
              description: metadata.summary,
              image: metadata.coverImage
                ? `https://feedybacky.com.br${metadata.coverImage}`
                : undefined,
              author: {
                '@type': 'Person',
                name: metadata.author || 'Feedybacky',
              },
              datePublished: metadata.date,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://feedybacky.com.br/blog/${slug}`,
              },
            }),
          }}
        />
      </article>
    </main>
  )
}