import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | The Mindful Group",
  description: "Insights on workforce development, community impact, and the Stellar Engine model from The Mindful Group in Milwaukee.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">Blog</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Insights & <span className="text-accent">Updates</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Perspectives on workforce development, community impact, and building systems that work.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg border border-border-light hover:border-primary/30 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-wider rounded-full font-semibold">
                      {post.tag}
                    </span>
                    <span className="text-text-light text-xs">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-xl font-heading text-text group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-accent text-sm uppercase tracking-wider font-semibold group-hover:text-accent-light transition-colors">
                    Read More &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
