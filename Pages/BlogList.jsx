
import CoverBlogPage from "./coversforpages/CoverBlogPage";




import { useState } from "react";
import { Link } from "react-router-dom";

const DUMMY_BLOGS = [
  {
    _id: "1",
    slug: "top-5-ai-tools-2025",
    title: "Top 5 AI Tools That Will Transform Your Workflow in 2025",
    excerpt:
      "Discover the most powerful AI tools redefining how developers, designers, and marketers work — from code generation to intelligent automation.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    tags: ["AI Tools", "Productivity", "2025"],
    publishedAt: "2025-05-10T00:00:00.000Z",
    readTime: 6,
  },
  {
    _id: "2",
    slug: "chatgpt-vs-claude-comparison",
    title: "ChatGPT vs Claude: Which AI Assistant Should You Use?",
    excerpt:
      "A head-to-head breakdown of the two most popular AI assistants — comparing reasoning, creativity, coding ability, and real-world use cases.",
    coverImage: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80",
    tags: ["ChatGPT", "Claude", "Comparison"],
    publishedAt: "2025-04-28T00:00:00.000Z",
    readTime: 8,
  },
  {
    _id: "3",
    slug: "ai-for-web-developers-guide",
    title: "The Complete AI Guide for Web Developers in 2025",
    excerpt:
      "From GitHub Copilot to AI-powered design tools — here's how modern web developers are using AI to ship faster, write cleaner code, and build smarter apps.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["Web Dev", "AI", "Guide"],
    publishedAt: "2025-04-15T00:00:00.000Z",
    readTime: 10,
  },
  {
    _id: "4",
    slug: "midjourney-vs-dalle-image-ai",
    title: "Midjourney vs DALL·E 3: Best AI Image Generator for Your Projects",
    excerpt:
      "Both tools generate stunning images, but they excel in very different areas. We tested them across 20 prompts to find out which one wins.",
    coverImage: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80",
    tags: ["Midjourney", "DALL·E", "Image AI"],
    publishedAt: "2025-04-02T00:00:00.000Z",
    readTime: 7,
  },
  {
    _id: "5",
    slug: "prompt-engineering-tips",
    title: "10 Prompt Engineering Tips That Get 10x Better AI Responses",
    excerpt:
      "Stop getting generic answers. These practical prompt engineering techniques will help you extract precise, useful responses from any AI model.",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    tags: ["Prompt Engineering", "Tips", "AI"],
    publishedAt: "2025-03-20T00:00:00.000Z",
    readTime: 5,
  },
  {
    _id: "6",
    slug: "free-ai-tools-freelancers",
    title: "7 Free AI Tools Every Freelancer Should Be Using Right Now",
    excerpt:
      "These free AI tools help freelancers write proposals faster, manage clients better, and deliver higher quality work without spending a dime.",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    tags: ["Freelance", "Free Tools", "AI"],
    publishedAt: "2025-03-08T00:00:00.000Z",
    readTime: 6,
  },
];

const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
  "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  "bg-pink-500/15 text-pink-300 border border-pink-500/30",
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function FeaturedCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group relative block rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all duration-500 shadow-xl shadow-black/30"
    >
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Featured
        </span>
        <h2 className="text-xl sm:text-3xl font-bold text-white leading-snug mb-3 group-hover:text-indigo-300 transition-colors duration-300">
          {blog.title}
        </h2>
        <p className="text-gray-400 text-sm sm:text-base line-clamp-2 mb-4 max-w-2xl">
          {blog.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLES[i % TAG_STYLES.length]}`}>
                {tag}
              </span>
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-auto hidden sm:block">
            {formatDate(blog.publishedAt)} · {blog.readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/40 bg-gray-900/50 hover:bg-gray-900/80 transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-gray-300 text-xs px-2.5 py-1 rounded-full border border-white/10">
          {blog.readTime} min read
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {blog.tags.slice(0, 2).map((tag, i) => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_STYLES[i % TAG_STYLES.length]}`}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-2 group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-gray-500 text-xs">{formatDate(blog.publishedAt)}</span>
          <span className="text-indigo-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
            Read more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogList() {
  const [activeTag, setActiveTag] = useState("All");

  const allTags = ["All", ...Array.from(new Set(DUMMY_BLOGS.flatMap((b) => b.tags)))];
  const filtered =
    activeTag === "All" ? DUMMY_BLOGS : DUMMY_BLOGS.filter((b) => b.tags.includes(activeTag));
  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* <CoverBlogPage/> */}
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-indigo-500" />
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">
              Matrix Web Solutions
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            AI Tools &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Digital Insights
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            In-depth reviews, comparisons, and guides on the latest AI tools — written for
            developers, freelancers, and digital professionals.
          </p>
          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { label: "Articles Published", value: "24+" },
              { label: "AI Tools Reviewed", value: "50+" },
              { label: "Monthly Readers", value: "2K+" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-indigo-400">{s.value}</span>
                <span className="text-gray-500 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-white/5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all duration-200 cursor-pointer ${
                activeTag === tag
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-transparent border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300"
              }`}
            >
              {tag}
            </button>
          ))}
          <span className="ml-auto text-gray-600 text-sm self-center hidden sm:block">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            No articles found for <span className="text-indigo-400">"{activeTag}"</span>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-10">
                <FeaturedCard blog={featured} />
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-6 sm:px-10 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <h3 className="text-2xl font-bold text-white mb-2 relative">Stay in the Loop</h3>
          <p className="text-gray-400 text-sm mb-6 relative max-w-md mx-auto">
            Get the latest AI tool reviews and digital guides delivered to your inbox. No spam, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}