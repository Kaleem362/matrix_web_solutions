import { useParams, Link, useNavigate } from "react-router-dom";

const DUMMY_BLOGS = [
  {
    _id: "1",
    slug: "top-5-ai-tools-2025",
    title: "Top 5 AI Tools That Will Transform Your Workflow in 2025",
    excerpt:
      "Discover the most powerful AI tools redefining how developers, designers, and marketers work — from code generation to intelligent automation.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=85",
    tags: ["AI Tools", "Productivity", "2025"],
    publishedAt: "2025-05-10T00:00:00.000Z",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Artificial intelligence is no longer a future concept — it's already reshaping how professionals across every industry work, create, and think. In 2025, the tools available to us are more powerful, more accessible, and more specialized than ever before.",
      },
      {
        type: "p",
        text: "Whether you're a developer looking to ship code faster, a marketer trying to generate quality content at scale, or a designer seeking to speed up your workflow — there's an AI tool built exactly for you. The challenge isn't finding AI tools. It's knowing which ones are actually worth your time.",
      },
      {
        type: "h2",
        text: "1. GitHub Copilot — The Developer's AI Pair Programmer",
      },
      {
        type: "p",
        text: "GitHub Copilot has matured significantly since its early days. In 2025, it's not just autocompleting lines of code — it's generating entire functions, writing tests, explaining legacy code, and suggesting architectural patterns based on your project structure.",
      },
      {
        type: "p",
        text: "For MERN stack developers in particular, Copilot is exceptional at writing Express route handlers, React hooks, and MongoDB aggregation pipelines. The integration inside VS Code feels completely natural.",
      },
      {
        type: "h2",
        text: "2. Claude by Anthropic — Best for Reasoning & Long Documents",
      },
      {
        type: "p",
        text: "Claude has become the go-to AI assistant for tasks that require deep reasoning, nuanced writing, and long-context understanding. Unlike many competitors, Claude can handle extremely long documents — making it ideal for analyzing contracts, reviewing codebases, or writing comprehensive technical guides.",
      },
      {
        type: "h2",
        text: "3. Midjourney v6 — Professional-Grade Image Generation",
      },
      {
        type: "p",
        text: "Midjourney continues to be the gold standard for AI image generation in creative and commercial contexts. Version 6 introduced significantly better text rendering inside images, more realistic human anatomy, and a far more controllable style system.",
      },
      {
        type: "h2",
        text: "4. Perplexity AI — Research That Actually Cites Sources",
      },
      {
        type: "p",
        text: "Perplexity AI has carved out a unique niche: it's an AI-powered search engine that gives you summarized, cited answers rather than just links. For anyone who does regular research — whether for blog content, client proposals, or competitive analysis — Perplexity dramatically reduces research time.",
      },
      {
        type: "h2",
        text: "5. Notion AI — Intelligence Built Into Your Workspace",
      },
      {
        type: "p",
        text: "Notion AI transforms the already-powerful Notion workspace into an intelligent writing and organization assistant. You can summarize meeting notes, generate project outlines, translate content, and auto-fill databases — all without leaving the app.",
      },
      {
        type: "h2",
        text: "Final Thoughts",
      },
      {
        type: "p",
        text: "The AI tools landscape is evolving at a pace that can feel overwhelming. The key is to pick 2–3 tools that directly address your biggest workflow bottlenecks and master them deeply, rather than dabbling in everything. The compound productivity gains are real.",
      },
    ],
  },
  {
    _id: "2",
    slug: "chatgpt-vs-claude-comparison",
    title: "ChatGPT vs Claude: Which AI Assistant Should You Use?",
    excerpt: "A head-to-head breakdown of the two most popular AI assistants.",
    coverImage: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=1200&q=85",
    tags: ["ChatGPT", "Claude", "Comparison"],
    publishedAt: "2025-04-28T00:00:00.000Z",
    readTime: 8,
    content: [
      { type: "p", text: "A full comparison of ChatGPT and Claude is coming soon. Stay tuned!" },
    ],
  },
  {
    _id: "3",
    slug: "ai-for-web-developers-guide",
    title: "The Complete AI Guide for Web Developers in 2025",
    excerpt: "How modern web developers are using AI to ship faster and build smarter apps.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85",
    tags: ["Web Dev", "AI", "Guide"],
    publishedAt: "2025-04-15T00:00:00.000Z",
    readTime: 10,
    content: [
      { type: "p", text: "A comprehensive guide for web developers leveraging AI. Full content coming soon." },
    ],
  },
  {
    _id: "4",
    slug: "midjourney-vs-dalle-image-ai",
    title: "Midjourney vs DALL·E 3: Best AI Image Generator for Your Projects",
    excerpt: "We tested them across 20 prompts to find out which one wins.",
    coverImage: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=1200&q=85",
    tags: ["Midjourney", "DALL·E", "Image AI"],
    publishedAt: "2025-04-02T00:00:00.000Z",
    readTime: 7,
    content: [
      { type: "p", text: "Full comparison content coming soon." },
    ],
  },
  {
    _id: "5",
    slug: "prompt-engineering-tips",
    title: "10 Prompt Engineering Tips That Get 10x Better AI Responses",
    excerpt: "Practical techniques to extract precise, useful responses from any AI model.",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=85",
    tags: ["Prompt Engineering", "Tips", "AI"],
    publishedAt: "2025-03-20T00:00:00.000Z",
    readTime: 5,
    content: [
      { type: "p", text: "Full guide content coming soon." },
    ],
  },
  {
    _id: "6",
    slug: "free-ai-tools-freelancers",
    title: "7 Free AI Tools Every Freelancer Should Be Using Right Now",
    excerpt: "Free tools to help freelancers write proposals faster and deliver higher quality work.",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85",
    tags: ["Freelance", "Free Tools", "AI"],
    publishedAt: "2025-03-08T00:00:00.000Z",
    readTime: 6,
    content: [
      { type: "p", text: "Full article content coming soon." },
    ],
  },
];

const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Renders structured content blocks with Tailwind classes only
function ContentBlock({ block }) {
  if (block.type === "h2") {
    return (
      <h2 className="text-white text-xl sm:text-2xl font-bold mt-10 mb-3 pl-4 border-l-4 border-indigo-500 leading-snug">
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3 className="text-gray-100 text-lg font-semibold mt-7 mb-2 leading-snug">
        {block.text}
      </h3>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-6 pl-4 border-l-4 border-indigo-500/40 text-gray-400 italic text-base leading-relaxed">
        {block.text}
      </blockquote>
    );
  }
  // default: paragraph
  return (
    <p className="text-gray-400 text-base leading-[1.85] mb-5">{block.text}</p>
  );
}

function RelatedCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex gap-3 p-3 rounded-xl border border-white/5 hover:border-indigo-500/30 bg-gray-900/40 hover:bg-gray-900/70 transition-all duration-300"
    >
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-20 h-14 object-cover rounded-lg shrink-0"
      />
      <div className="min-w-0">
        <h4 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {blog.title}
        </h4>
        <span className="text-gray-500 text-xs mt-1 block">{blog.readTime} min read</span>
      </div>
    </Link>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const blog = DUMMY_BLOGS.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl mb-4">📭</span>
        <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const related = DUMMY_BLOGS.filter((b) => b.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Cover Hero */}
      <div className="relative w-full h-64 sm:h-80 lg:h-105 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/50 to-gray-950/10" />
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative pb-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Article */}
          <article className="flex-1 min-w-0">

            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-400 text-sm mb-6 transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, i) => (
                <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLES[i % TAG_STYLES.length]}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug mb-5">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm mb-8 pb-8 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Matrix Web Solutions
              </span>
            </div>

            {/* Content Blocks */}
            <div>
              {blog.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center gap-3">
              <span className="text-gray-400 text-sm font-medium">Share this article:</span>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer bg-gray-900/50"
              >
                𝕏 Twitter
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer bg-gray-900/50"
              >
                in LinkedIn
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer bg-gray-900/50"
              >
                🔗 Copy Link
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 space-y-6">

              {/* About */}
              <div className="rounded-2xl border border-white/8 bg-gray-900/50 p-5">
                <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                  About This Blog
                </span>
                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  Matrix Web Solutions publishes in-depth reviews and guides on AI tools, web
                  development, and digital productivity — written by practitioners, for practitioners.
                </p>
                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
                >
                  Browse all articles
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-gray-900/50 p-5">
                  <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                    Related Articles
                  </span>
                  <div className="space-y-3 mt-4">
                    {related.map((r) => (
                      <RelatedCard key={r._id} blog={r} />
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <h3 className="text-white font-bold text-sm mb-1">Get New Articles</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  No spam. Just new articles on AI tools and digital strategies.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors mb-2"
                />
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors cursor-pointer">
                  Subscribe
                </button>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}