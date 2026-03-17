"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Reveal } from "@/components/ui/Animation";
import { SectionHeading, GradientText, Paragraph } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

import { useState, useEffect } from "react";
import { fetchBlogs } from "@/lib/api";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs().then((data: any[]) => {
      setBlogs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <section className="px-5 py-[100px] max-w-[1200px] mx-auto text-center">
        <Reveal>
          <SectionHeading>Insights & <GradientText>Perspectives</GradientText></SectionHeading>
          <Paragraph className="max-w-[600px] mx-auto mt-4">Read our latest thoughts on leadership, communication, and executive growth.</Paragraph>
        </Reveal>
      </section>
      
      <section className="px-5 pb-[140px] max-w-[1200px] mx-auto grid md:grid-cols-3 gap-8">
        {loading ? (
           <p className="text-center text-[#94a3b8] col-span-3 py-20">Refreshing global insights...</p>
        ) : blogs.length > 0 ? blogs.map((blog, i) => (
          <Reveal key={blog.id || i} delay={(i%3) * 0.1}>
            <Link href={`/blog/${blog.id}`}>
              <Card className="h-full flex flex-col group p-0 overflow-hidden !rounded-2xl border border-white/5 hover:border-[#00e5ff]/50 transition-colors">
                <div className="aspect-video bg-[#0f172a] w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📝</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-[#00e5ff] text-xs font-bold uppercase tracking-wider mb-3">{blog.category || 'Leadership'}</div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#00e5ff] transition-colors">{blog.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{blog.excerpt || blog.description}</p>
                  <p className="text-xs text-[#cbd5f5] mt-6">
                    {blog.date ? (blog.date._seconds ? new Date(blog.date._seconds * 1000).toLocaleDateString() : new Date(blog.date).toLocaleDateString()) : 'March 12, 2026'} • {blog.readTime || '5 Min Read'}
                  </p>
                </div>
              </Card>
            </Link>
          </Reveal>
        )) : (
          <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-[#94a3b8] italic">No articles found in our studio. We're crafting new content as we speak!</p>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
