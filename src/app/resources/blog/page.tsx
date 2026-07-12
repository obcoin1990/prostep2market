import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, User, Tag } from "lucide-react"
import { blogPosts } from "@/lib/blog/posts"

export const metadata: Metadata = {
  title: "Blog — ProStep2Market Resources",
  description: "Trading psychology, platform tips, and industry insights from the ProStep2Market team.",
  openGraph: {
    title: "Blog — ProStep2Market",
    description: "Trading psychology, platform tips, and industry insights from the ProStep2Market team.",
  },
}

const categories = [...new Set(blogPosts.map(p => p.category))]

export default function BlogPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Blog</h1>
          <p className="text-[#848e9c]">Trading psychology insights, platform updates, and expert perspectives.</p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="border-t border-[#2b3139] py-6">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#fcd535] px-3 py-1 text-xs font-medium text-[#181a20]">All</span>
            {categories.map(cat => (
              <span key={cat} className="rounded-full border border-[#2b3139] px-3 py-1 text-xs font-medium text-[#848e9c] hover:border-[#3a3a5c] hover:text-white transition-colors cursor-pointer">{cat}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="border-t border-[#2b3139] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <Link href={`/resources/blog/${blogPosts[0].slug}`} className="group block rounded-[12px] border border-[#2b3139] bg-gradient-to-r from-[#1e2329] to-[#1a1f25] p-8 transition-all hover:border-[#3a3a5c]">
            <span className="mb-3 inline-block rounded-full bg-[rgba(252,213,53,0.15)] px-3 py-1 text-xs font-medium text-[#fcd535]">Featured</span>
            <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-[#fcd535] transition-colors">{blogPosts[0].title}</h2>
            <p className="mb-4 text-[#848e9c]">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-[#848e9c]">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{blogPosts[0].author}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blogPosts[0].readTime}</span>
              <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{blogPosts[0].category}</span>
              <span>{blogPosts[0].date}</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Post Grid */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/resources/blog/${post.slug}`} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <span className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: 'rgba(252,213,53,0.1)', color: '#fcd535' }}>{post.category}</span>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{post.title}</h3>
                <p className="mb-4 text-sm text-[#848e9c] line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-[#848e9c]">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
