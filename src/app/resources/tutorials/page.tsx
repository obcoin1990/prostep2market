import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, Clock } from "lucide-react"
import { tutorialPosts } from "@/lib/tutorials/posts"

export const metadata: Metadata = {
  title: "Tutorials — ProStep2Market Resources",
  description: "Step-by-step tutorials for setting up and using every feature of the ProStep2Market platform.",
}

export default function TutorialsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Tutorials</h1>
          <p className="text-[#848e9c]">Step-by-step guides to get the most out of every ProStep2Market feature.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {tutorialPosts.map((t) => (
              <Link key={t.slug} href={`/resources/tutorials/${t.slug}`} className="group flex items-start gap-4 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-5 transition-all hover:border-[#3a3a5c]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <GraduationCap className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#fcd535] transition-colors">{t.title}</h3>
                    <span className="rounded-full border border-[#2b3139] px-2 py-0.5 text-xs text-[#848e9c]">{t.difficulty}</span>
                  </div>
                  <p className="text-sm text-[#848e9c]">{t.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[#848e9c]">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.time}</span>
                    <span>{t.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
