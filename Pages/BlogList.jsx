import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getApiBase } from "../src/utils/api.js";
import { useStore } from "../src/Context/UseStore";

const API = getApiBase();

const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
  "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  "bg-pink-500/15 text-pink-300 border border-pink-500/30",
];

const TAG_STYLES_LIGHT = [
  "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "bg-violet-100 text-violet-700 border border-violet-200",
  "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "bg-pink-100 text-pink-700 border border-pink-200",
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

// ── Featured Card ──
function FeaturedCard({ blog, theme }) {
  const tags = theme === "dark" ? TAG_STYLES : TAG_STYLES_LIGHT;

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`group relative block rounded-2xl overflow-hidden border transition-all duration-500 shadow-xl ${
        theme === "dark"
          ? "border-white/10 hover:border-indigo-500/50 shadow-black/30"
          : "border-gray-200 hover:border-indigo-400/60 shadow-black/10"
      }`}
    >
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              theme === "dark"
                ? "bg-linear-to-br from-indigo-900/60 to-gray-900"
                : "bg-linear-to-br from-indigo-100 to-gray-100"
            }`}
          >
            <svg
              className={`w-16 h-16 ${
                theme === "dark" ? "text-indigo-500/30" : "text-indigo-300"
              }`}
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
              ? "from-gray-950 via-gray-950/60 to-transparent"
              : "from-white/95 via-white/50 to-transparent"
          }`}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Featured
        </span>
        <h2
          className={`text-xl sm:text-3xl font-bold leading-snug mb-3 transition-colors duration-300 group-hover:text-indigo-400 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {blog.title}
        </h2>
        <p
          className={`text-sm sm:text-base line-clamp-2 mb-4 max-w-2xl ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {blog.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
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
          <span
            className={`text-xs ml-auto hidden sm:block ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatDate(blog.publishedAt)} · {blog.readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Blog Card ──
function BlogCard({ blog, theme }) {
  const tags = theme === "dark" ? TAG_STYLES : TAG_STYLES_LIGHT;

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg hover:-translate-y-1 ${
        theme === "dark"
          ? "border-white/10 hover:border-indigo-500/40 bg-gray-900/50 hover:bg-gray-900/80 shadow-black/20"
          : "border-gray-200 hover:border-indigo-400/50 bg-white hover:bg-gray-50 shadow-black/5"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              theme === "dark"
                ? "bg-linear-to-br from-indigo-900/40 to-gray-900"
                : "bg-linear-to-br from-indigo-50 to-gray-100"
            }`}
          >
            <svg
              className={`w-10 h-10 ${
                theme === "dark" ? "text-indigo-500/30" : "text-indigo-300"
              }`}
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
              ? "from-gray-900/80 to-transparent"
              : "from-white/60 to-transparent"
          }`}
        />
        <span
          className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm ${
            theme === "dark"
              ? "bg-black/60 text-gray-300 border-white/10"
              : "bg-white/80 text-gray-600 border-gray-200"
          }`}
        >
          {blog.readTime} min read
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {blog.tags.slice(0, 2).map((tag, i) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                tags[i % tags.length]
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className={`font-bold text-base sm:text-lg leading-snug mb-2 transition-colors duration-300 line-clamp-2 group-hover:text-indigo-500 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {blog.title}
        </h3>
        <p
          className={`text-sm leading-relaxed line-clamp-3 mb-4 flex-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {blog.excerpt}
        </p>
        <div
          className={`flex items-center justify-between pt-3 border-t ${
            theme === "dark" ? "border-white/5" : "border-gray-100"
          }`}
        >
          <span
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatDate(blog.publishedAt)}
          </span>
          <span className="text-indigo-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
            Read more
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton Loaders ──
function FeaturedSkeleton({ theme }) {
  return (
    <div
      className={`animate-pulse rounded-2xl overflow-hidden border shadow-xl ${
        theme === "dark"
          ? "border-white/10 shadow-black/30"
          : "border-gray-200 shadow-black/10"
      }`}
    >
      <div
        className={`h-72 sm:h-96 ${
          theme === "dark" ? "bg-gray-800/60" : "bg-gray-200"
        }`}
      />
      <div
        className={`p-6 sm:p-8 space-y-3 ${
          theme === "dark" ? "bg-gray-900/80" : "bg-gray-50"
        }`}
      >
        <div
          className={`h-4 w-24 rounded-full ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`h-8 w-3/4 rounded-lg ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`h-4 w-full rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-4 w-2/3 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        />
      </div>
    </div>
  );
}

function CardSkeleton({ theme }) {
  return (
    <div
      className={`animate-pulse flex flex-col rounded-2xl overflow-hidden border shadow-lg ${
        theme === "dark"
          ? "border-white/10 bg-gray-900/50 shadow-black/20"
          : "border-gray-200 bg-white shadow-black/5"
      }`}
    >
      <div
        className={`h-48 ${
          theme === "dark" ? "bg-gray-800/60" : "bg-gray-200"
        }`}
      />
      <div className="p-5 space-y-3">
        <div
          className={`h-3 w-1/3 rounded-full ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`h-5 w-4/5 rounded-lg ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`h-3 w-full rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-3 w-2/3 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-3 w-1/4 rounded-full mt-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
      </div>
    </div>
  );
}

// ── Main Component ──
export default function BlogList() {
  const { theme } = useStore(useStore);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTag, setActiveTag] = useState("All");

  // ── Fetch published blogs ──
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/blogs`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();

        // Unwrap paginated response { blogs: [...] } or plain array
        const blogArray = Array.isArray(data) ? data : (data.blogs ?? []);

        // Use backend readTime if available, otherwise calculate from content
        const enriched = blogArray.map((blog) => ({
          ...blog,
          readTime: blog.readTime ?? calcReadTime(blog.content ?? ""),
        }));

        setBlogs(enriched);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ── Tags & filtering ──
  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(blogs.flatMap((b) => b.tags ?? [])))],
    [blogs]
  );

  const filtered = useMemo(
    () =>
      activeTag === "All"
        ? blogs
        : blogs.filter((b) => b.tags?.includes(activeTag)),
    [blogs, activeTag]
  );

  const [featured, ...rest] = filtered;

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ── Hero ── */}
      <div
        className={`relative overflow-hidden border-b transition-all duration-300 ${
          theme === "dark" ? "border-white/5" : "border-gray-200"
        }`}
      >
        {/* Orbs */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full blur-3xl pointer-events-none ${
            theme === "dark" ? "bg-indigo-600/10" : "bg-indigo-300/20"
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            theme === "dark" ? "bg-violet-600/5" : "bg-violet-300/10"
          }`}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-indigo-500" />
            <span className="text-indigo-500 text-xs font-semibold uppercase tracking-widest">
              Matrix Web Solutions
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            AI Tools &{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
              Digital Insights
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            In-depth reviews, comparisons, and guides on the latest AI tools —
            written for developers, freelancers, and digital professionals.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { label: "Articles Published", value: `${blogs.length}+` },
              { label: "AI Tools Reviewed", value: "50+" },
              { label: "Monthly Readers", value: "2K+" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-indigo-500">
                  {s.value}
                </span>
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Error state ── */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error} — please try refreshing the page.
          </div>
        )}

        {/* ── Tag Filter ── */}
        {!loading && !error && (
          <div
            className={`flex flex-wrap gap-2 mb-10 pb-6 border-b ${
              theme === "dark" ? "border-white/5" : "border-gray-200"
            }`}
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all duration-200 cursor-pointer ${
                  activeTag === tag
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : theme === "dark"
                    ? "bg-transparent border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300"
                    : "bg-transparent border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {tag}
              </button>
            ))}
            <span
              className={`ml-auto text-sm self-center hidden sm:block ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <>
            <div className="mb-10">
              <FeaturedSkeleton theme={theme} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} theme={theme} />
              ))}
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filtered.length === 0 && (
          <div
            className={`text-center py-24 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {activeTag === "All" ? (
              "No published blogs yet. Check back soon."
            ) : (
              <>
                No articles found for{" "}
                <span className="text-indigo-500">"{activeTag}"</span>
              </>
            )}
          </div>
        )}

        {/* ── Blog cards ── */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {featured && (
              <div className="mb-10">
                <FeaturedCard blog={featured} theme={theme} />
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} theme={theme} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Newsletter CTA ── */}
        <div
          className={`mt-16 rounded-2xl border px-6 sm:px-10 py-10 text-center relative overflow-hidden transition-all duration-300 ${
            theme === "dark"
              ? "border-indigo-500/20 bg-indigo-500/5"
              : "border-indigo-200 bg-indigo-50"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <h3
            className={`text-2xl font-bold mb-2 relative ${
              theme === "dark" ? "text-white" : "text-indigo-900"
            }`}
          >
            Stay in the Loop
          </h3>
          <p
            className={`text-sm mb-6 relative max-w-md mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Get the latest AI tool reviews and digital guides delivered to your
            inbox. No spam, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="your@email.com"
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors border ${
                theme === "dark"
                  ? "bg-gray-900 border-white/10 text-white placeholder-gray-600"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
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