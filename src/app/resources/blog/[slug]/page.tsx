import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, User, Tag, ChevronRight } from "lucide-react"
import { getPostBySlug, getAllSlugs } from "@/lib/blog/posts"

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Not Found — ProStep2Market" }
  return {
    title: `${post.title} — ProStep2Market Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Breadcrumb */}
      <section className="border-b border-[#2b3139] py-4">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-[#848e9c]">
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/resources/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <span className="mb-4 inline-block rounded-full bg-[rgba(252,213,53,0.15)] px-3 py-1 text-xs font-medium text-[#fcd535]">
            {post.category}
          </span>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <p className="mb-6 text-lg text-[#848e9c]">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 border-t border-[#2b3139] pt-4 text-sm text-[#848e9c]">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {post.category}
            </span>
            <span>{post.date}</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="border-t border-[#2b3139] py-12">
        <article className="mx-auto max-w-[860px] px-4 sm:px-6">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-[#c9d1d9] prose-p:leading-relaxed
            prose-strong:text-white
            prose-a:text-[#fcd535] prose-a:no-underline hover:prose-a:underline
            prose-li:text-[#c9d1d9]
            prose-blockquote:border-l-[#fcd535] prose-blockquote:text-[#848e9c]
            prose-code:text-[#fcd535] prose-code:bg-[#1e2329] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#1e2329] prose-pre:border prose-pre:border-[#2b3139]
          ">
            {post.content}
          </div>
        </article>
      </section>

      {/* Related / Back to Blog */}
      <section className="border-t border-[#2b3139] py-12">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/resources/blog"
            className="flex items-center gap-2 text-sm font-medium text-[#fcd535] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <Link
            href="/pricing"
            className="rounded-[8px] bg-[#fcd535] px-5 py-2.5 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#e6c02e]"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}
