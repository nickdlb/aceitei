import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostMetadata {
  title: string
  summary: string
  date: string
  coverImage?: string
  author?: string
  category?: string
  tags?: string[]
}

export interface Post {
  slug: string
  metadata: PostMetadata
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      metadata: {
        title: data.title,
        summary: data.summary,
        date: data.date,
        coverImage: data.coverImage,
      },
      content,
    }
  })
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    metadata: {
      title: data.title,
      summary: data.summary,
      date: data.date,
      coverImage: data.coverImage,
    },
    content,
  }
}
