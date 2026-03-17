"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import Image from "next/image";

export default function BlogPostPage({ params }: any) {
  return (
    <PageWrapper>
      <article className="px-5 py-[100px] max-w-[800px] mx-auto">
        <Reveal>
          <div className="text-[#00e5ff] text-sm font-bold uppercase tracking-wider mb-4 text-center">Leadership</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center leading-tight">How to Overcome Imposter Syndrome in the C-Suite</h1>
          <div className="flex items-center justify-center gap-4 mb-12 text-sm text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0f172a] overflow-hidden">
                <Image src="https://marktaleevents.com/mentorleap/wp-content/uploads/2026/03/MriduBhandari_ProfilePic.jpg" alt="Mridu" width={32} height={32} />
              </div>
              <span className="text-white font-medium">Mridu Bhandari</span>
            </div>
            <span>•</span>
            <span>March 12, 2026</span>
            <span>•</span>
            <span>5 Min Read</span>
          </div>
          
          <div className="aspect-video w-full rounded-3xl bg-[#0f172a] mb-12 border border-white/10 flex items-center justify-center text-4xl">📸</div>
          
          <div className="prose prose-invert prose-lg max-w-none text-[#cbd5f5]">
            <p>Imposter syndrome is a psychological pattern in which an individual doubts their skills, talents, or accomplishments and has a persistent internalized fear of being exposed as a "fraud". Despite external evidence of their competence...</p>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. The Power of Reframing</h2>
            <p>One of the most effective strategies for combating imposter syndrome is cognitive reframing. This involves identifying and then changing the way situations, experiences, events, ideas, and/or emotions are viewed...</p>
            <blockquote className="border-l-4 border-[#00e5ff] pl-6 py-2 my-8 text-xl font-medium text-white italic bg-gradient-to-r from-[#00e5ff]/10 to-transparent">
              "You don't have to be perfect. You just have to be powerfully authentic."
            </blockquote>
            <p>In conclusion, overcoming imposter syndrome is not about eliminating all self-doubt, but about managing it effectively so that it doesn't hinder your performance and leadership capabilities.</p>
          </div>
        </Reveal>
      </article>
    </PageWrapper>
  );
}
