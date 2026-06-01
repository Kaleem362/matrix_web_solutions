import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiBase } from "../src/utils/api.js";
import { useStore } from "../src/Context/UseStore";

const API = getApiBase();

const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
];

const TAG_STYLES_LIGHT = [
  "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "bg-violet-100 text-violet-700 border border-violet-200",
  "bg-cyan-100 text-cyan-700 border border-cyan-200",
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calcReadTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Renders plain string content (from admin textarea) ──
function PlainContent({ content, theme }) {
  return (
    <div>
      {content.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="mb-3" />;

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className={`text-2xl sm:text-3xl font-extrabold mt-10 mb-4 leading-snug ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className={`text-xl sm:text-2xl font-bold mt-10 mb-3 pl-4 border-l-4 border-indigo-500 leading-snug ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className={`text-lg font-semibold mt-7 mb-2 leading-snug ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className={`my-6 pl-4 border-l-4 border-indigo-500/40 italic text-base leading-relaxed ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {trimmed.replace("> ", "")}
            </blockquote>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li
              key={i}
              className={`ml-5 mb-2 text-base leading-relaxed list-disc ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {trimmed.replace(/^[-*] /, "")}
            </li>
          );
        }
        if (trimmed.startsWith("---")) {
          return (
            <hr
              key={i}
              className={`my-8 ${
                theme === "dark" ? "border-white/10" : "border-gray-200"
              }`}
            />
          );
        }
        return (
          <p
            key={i}
            className={`text-base leading-[1.85] mb-5 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ── Renders structured content blocks (legacy dummy format) ──
function ContentBlock({ block, theme }) {
  if (block.type === "h2") {
    return (
      <h2
        className={`text-xl sm:text-2xl font-bold mt-10 mb-3 pl-4 border-l-4 border-indigo-500 leading-snug ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3
        className={`text-lg font-semibold mt-7 mb-2 leading-snug ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {block.text}
      </h3>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote
        className={`my-6 pl-4 border-l-4 border-indigo-500/40 italic text-base leading-relaxed ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {block.text}
      </blockquote>
    );
  }
  return (
    <p
      className={`text-base leading-[1.85] mb-5 ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {block.text}
    </p>
  );
}

// ── Related Card ──
function RelatedCard({ blog, theme }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`group flex gap-3 p-3 rounded-xl border transition-all duration-300 ${
        theme === "dark"
          ? "border-white/5 hover:border-indigo-500/30 bg-gray-900/40 hover:bg-gray-900/70"
          : "border-gray-200 hover:border-indigo-400/40 bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {blog.coverImage ? (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-20 h-14 object-cover rounded-lg shrink-0"
        />
      ) : (
        <div
          className={`w-20 h-14 rounded-lg shrink-0 flex items-center justify-center ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        <h4
          className={`text-sm font-semibold leading-snug line-clamp-2 transition-colors ${
            theme === "dark"
              ? "text-white group-hover:text-indigo-300"
              : "text-gray-900 group-hover:text-indigo-600"
          }`}
        >
          {blog.title}
        </h4>
        <span
          className={`text-xs mt-1 block ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {blog.readTime ?? calcReadTime(blog.content ?? "")} min read
        </span>
      </div>
    </Link>
  );
}

// ── Loading Skeleton ──
function BlogDetailSkeleton({ theme }) {
  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full h-64 sm:h-80 lg:h-96 animate-pulse ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-200"
        }`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-4 pt-8">
            <div
              className={`h-4 w-24 rounded-full animate-pulse ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-10 w-3/4 rounded-lg animate-pulse ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-4 w-1/2 rounded-lg animate-pulse ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <div className="space-y-3 pt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-4 rounded-lg animate-pulse ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                  }`}
                  style={{ width: `${85 + Math.random() * 15}%` }}
                />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-72 shrink-0 space-y-4 pt-8">
            <div
              className={`h-40 rounded-2xl animate-pulse ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-52 rounded-2xl animate-pulse ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme } = useStore(useStore);

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // ── Fetch blog by slug ──
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/blogs/${slug}`, {
          credentials: "include",
        });
        if (res.status === 404) throw new Error("not_found");
        if (!res.ok) throw new Error("fetch_failed");
        const data = await res.json();
        setBlog(data);

        // Fetch related blogs from public endpoint
        const relRes = await fetch(`${API}/api/blogs`, {
          credentials: "include",
        });
        if (relRes.ok) {
          const relData = await relRes.json();
          const allBlogs = Array.isArray(relData)
            ? relData
            : relData.blogs ?? [];
          const filtered = allBlogs
            .filter((b) => b.slug !== slug)
            .slice(0, 3)
            .map((b) => ({
              ...b,
              readTime: b.readTime ?? calcReadTime(b.content ?? ""),
            }));
          setRelated(filtered);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ──
  if (loading) return <BlogDetailSkeleton theme={theme} />;

  // ── Not Found ──
  if (error === "not_found") {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center px-4 transition-all duration-300 ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <span className="text-6xl mb-4">📭</span>
        <h1
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Article Not Found
        </h1>
        <p
          className={`text-sm mb-6 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
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

  // ── Error ──
  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <span className="text-6xl mb-4">⚠️</span>
        <h1
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Something went wrong
        </h1>
        <p
          className={`text-sm mb-6 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Failed to load the article. Please try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const readTime = blog.readTime ?? calcReadTime(blog.content ?? "");
  const tags = theme === "dark" ? TAG_STYLES : TAG_STYLES_LIGHT;
  const isStructured = Array.isArray(blog.content);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ── Cover Hero ── */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              theme === "dark"
                ? "bg-linear-to-br from-indigo-900/60 to-gray-900"
                : "bg-linear-to-br from-indigo-100 to-gray-200"
            }`}
          >
            <svg
              className="w-20 h-20 text-indigo-400/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div
          className={`absolute inset-0 bg-linear-to-t ${
            theme === "dark"
              ? "from-gray-950 via-gray-950/50 to-gray-950/10"
              : "from-gray-50 via-gray-50/40 to-transparent"
          }`}
        />
      </div>

      {/* ── Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative pb-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0">

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-1.5 text-sm mb-6 transition-colors group cursor-pointer ${
                theme === "dark"
                  ? "text-gray-500 hover:text-indigo-400"
                  : "text-gray-400 hover:text-indigo-600"
              }`}
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags?.map((tag, i) => (
                <span
                  key={tag}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    tags[i % tags.length]
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug mb-5 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {blog.title}
            </h1>

            {/* Meta */}
            <div
              className={`flex flex-wrap items-center gap-5 text-sm mb-8 pb-8 border-b ${
                theme === "dark"
                  ? "text-gray-500 border-white/5"
                  : "text-gray-400 border-gray-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Matrix Web Solutions
              </span>
            </div>

            {/* ── Content ── */}
            {isStructured ? (
              <div>
                {blog.content.map((block, i) => (
                  <ContentBlock key={i} block={block} theme={theme} />
                ))}
              </div>
            ) : (
              <PlainContent content={blog.content ?? ""} theme={theme} />
            )}

            {/* ── Share ── */}
            <div
              className={`mt-12 pt-8 border-t flex flex-wrap items-center gap-3 ${
                theme === "dark" ? "border-white/5" : "border-gray-200"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Share this article:
              </span>
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 bg-gray-900/50"
                    : "border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 bg-white"
                }`}
              >
                𝕏 Twitter
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 bg-gray-900/50"
                    : "border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 bg-white"
                }`}
              >
                in LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copied
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                    : theme === "dark"
                    ? "border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 bg-gray-900/50"
                    : "border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 bg-white"
                }`}
              >
                {copied ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 space-y-6">

              {/* About */}
              <div
                className={`rounded-2xl border p-5 ${
                  theme === "dark"
                    ? "border-white/8 bg-gray-900/50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="text-indigo-500 text-xs font-semibold uppercase tracking-widest">
                  About This Blog
                </span>
                <p
                  className={`text-sm leading-relaxed mt-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Matrix Web Solutions publishes in-depth reviews and guides on
                  AI tools, web development, and digital productivity — written
                  by practitioners, for practitioners.
                </p>
                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-indigo-500 text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Browse all articles
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div
                  className={`rounded-2xl border p-5 ${
                    theme === "dark"
                      ? "border-white/8 bg-gray-900/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-indigo-500 text-xs font-semibold uppercase tracking-widest">
                    Related Articles
                  </span>
                  <div className="space-y-3 mt-4">
                    {related.map((r) => (
                      <RelatedCard key={r._id} blog={r} theme={theme} />
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div
                className={`rounded-2xl border p-5 ${
                  theme === "dark"
                    ? "border-indigo-500/20 bg-indigo-500/5"
                    : "border-indigo-200 bg-indigo-50"
                }`}
              >
                <h3
                  className={`font-bold text-sm mb-1 ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Get New Articles
                </h3>
                <p
                  className={`text-xs mb-4 leading-relaxed ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No spam. Just new articles on AI tools and digital strategies.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors mb-2 border ${
                    theme === "dark"
                      ? "bg-gray-900 border-white/10 text-white placeholder-gray-600"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
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