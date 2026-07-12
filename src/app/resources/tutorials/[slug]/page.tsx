import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, User, ChevronRight, Signal } from "lucide-react"
import { getTutorialBySlug, getAllTutorialSlugs } from "@/lib/tutorials/posts"

export async function generateStaticParams() {
  return getAllTutorialSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tutorial = getTutorialBySlug(slug)
  if (!tutorial) return { title: "Not Found — ProStep2Market" }
  return {
    title: `${tutorial.title} — ProStep2Market Tutorials`,
    description: tutorial.desc,
  }
}

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400",
  Intermediate: "bg-blue-500/15 text-blue-400",
  Advanced: "bg-purple-500/15 text-purple-400",
}

export default async function TutorialPostPage({ params }: Props) {
  const { slug } = await params
  const tutorial = getTutorialBySlug(slug)
  if (!tutorial) notFound()

  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Breadcrumb */}
      <section className="border-b border-[#2b3139] py-4">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-[#848e9c]">
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/resources/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate max-w-[200px]">{tutorial.title}</span>
          </nav>
        </div>
      </section>

      {/* Tutorial Header */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[rgba(252,213,53,0.15)] px-3 py-1 text-xs font-medium text-[#fcd535]">
              {tutorial.category}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColor[tutorial.difficulty] || "bg-[#2b3139] text-[#848e9c]"}`}>
              {tutorial.difficulty}
            </span>
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
            {tutorial.title}
          </h1>
          <p className="mb-6 text-lg text-[#848e9c]">{tutorial.desc}</p>
          <div className="flex flex-wrap items-center gap-4 border-t border-[#2b3139] pt-4 text-sm text-[#848e9c]">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {tutorial.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {tutorial.time}
            </span>
            <span className="flex items-center gap-1.5">
              <Signal className="h-4 w-4" />
              {tutorial.difficulty}
            </span>
            <span>{tutorial.date}</span>
          </div>
        </div>
      </section>

      {/* Tutorial Body */}
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
            {tutorial.content}
          </div>
        </article>
      </section>

      {/* Back / CTA */}
      <section className="border-t border-[#2b3139] py-12">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/resources/tutorials"
            className="flex items-center gap-2 text-sm font-medium text-[#fcd535] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tutorials
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
