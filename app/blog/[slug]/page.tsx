import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPost, getAllPosts } from "@/lib/blog";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | The Mindful Group`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <section className="pt-32 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors mb-8 inline-block">
            &larr; Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-wider rounded-full font-semibold">
              {post.tag}
            </span>
            <span className="text-text-light text-xs">
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading text-text leading-tight mb-6">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg max-w-none text-text-light leading-relaxed">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6 text-text-light leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border-light">
            <Link href="/blog" className="text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors">
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
