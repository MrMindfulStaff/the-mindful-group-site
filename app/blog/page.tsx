import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | The Mindful Group",
  description: "Insights on workforce development, community building, and economic empowerment from The Mindful Group.",
};

const WIX_BLOG_URL = "https://www.themindfulgroupinc.org/blog";

const posts = [
  {
    title: "Post-Election Workforce Development: Trends and Expectations for the Future",
    excerpt: "How shifting political landscapes impact workforce development funding, policy, and program design — and what it means for organizations like ours.",
    date: "2024",
    tag: "Policy",
  },
  {
    title: "Transportation and Career Access: Breaking Barriers for Workers",
    excerpt: "Milwaukee's transportation gaps create invisible walls between communities and employment. Here's how we're breaking through.",
    date: "2024",
    tag: "Access",
  },
  {
    title: "Housing Shortage and Rent Increases: How They Impact Minority Homeownership",
    excerpt: "The connection between housing instability and workforce participation — and why our homeownership pathway matters.",
    date: "2024",
    tag: "Housing",
  },
  {
    title: "The Need for Sustainable Non-Profit Models: Why Longevity Matters",
    excerpt: "Grant-dependent nonprofits are fragile by design. Here's the case for integrated, self-sustaining models.",
    date: "2024",
    tag: "Strategy",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6">Blog</p>
          <h1 className="text-4xl md:text-6xl font-heading text-text leading-tight mb-8">
            Insights &amp; <span className="text-primary">Updates</span>
          </h1>
          <p className="text-text-light text-lg max-w-3xl">
            Perspectives on workforce development, community building, and economic empowerment from Milwaukee&apos;s frontlines.
          </p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <Image src="/images/community-csr.jpg" alt="Community engagement and impact" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <a
                key={post.title}
                href={WIX_BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <article className="bg-white border border-border-light hover:border-primary/30 rounded-lg p-8 transition-all duration-300 group h-full cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] border border-border-light text-primary/60 px-2 py-0.5">{post.tag}</span>
                    <span className="text-text-light/50 text-xs">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-heading text-text group-hover:text-primary transition-colors mb-3 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-primary text-sm uppercase tracking-wider font-semibold group-hover:text-primary-light transition-colors">
                    Read More &rarr;
                  </span>
                </article>
              </a>
            ))}
          </div>

          {/* CTA to Wix Blog */}
          <div className="text-center mt-12">
            <a
              href={WIX_BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors"
            >
              Read on Our Blog
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
