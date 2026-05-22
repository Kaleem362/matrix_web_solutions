import { useState, useEffect } from "react";
import { getApiBase } from "../../utils/api.js";
import AdminLayout from "../layout/AdminLayout";

const API = getApiBase();

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  isPublished: false,
};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // ── Fetch all blogs (admin sees all including drafts) ──
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Auto-slug from title ──
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Submit: create or update ──
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      showToast("Title, slug, and content are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const url =
        view === "edit" ? `${API}/api/blogs/${editId}` : `${API}/api/blogs`;
      const method = view === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      showToast(
        view === "edit"
          ? "Blog updated successfully"
          : "Blog posted successfully",
      );
      setForm(EMPTY_FORM);
      setEditId(null);
      setView("list");
      fetchBlogs();
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ──
  const handleEdit = (blog) => {
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      isPublished: blog.isPublished || false,
    });
    setEditId(blog._id);
    setView("edit");
    setPreviewMode(false);
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Blog deleted");
      setDeleteConfirm(null);
      fetchBlogs();
    } catch {
      showToast("Failed to delete blog", "error");
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPreviewMode(false);
    setView("create");
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <section className="min-h-screen px-4 py-2 sm:px-2 bg-white rounded-lg text-gray-100">
        {/* ── Toast ── */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all duration-300 ${
              toast.type === "error"
                ? "bg-red-500/20 border border-red-500/40 text-red-300"
                : "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
            }`}
          >
            {toast.type === "error" ? "⚠️" : "✅"} {toast.message}
          </div>
        )}

        {/* ── Delete Confirm Modal ── */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Delete Blog?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone. The blog will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            {view !== "list" && (
              <button
                onClick={() => {
                  setView("list");
                  setPreviewMode(false);
                }}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {view === "list" && "Blog Manager"}
                {view === "create" && "New Blog Post"}
                {view === "edit" && "Edit Blog Post"}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 ml-4 border py-1 border-l-4 border-gray-700 pl-4 bg-gray-100">
                {view === "list" && `${blogs.length} total posts`}
                {(view === "create" || view === "edit") &&
                  `${wordCount} words · ~${readTime} min read`}
              </p>
            </div>
          </div>

          {view === "list" ? (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  previewMode
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {previewMode ? "Editor" : "Preview"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                {submitting ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {submitting
                  ? "Saving..."
                  : view === "edit"
                    ? "Update Post"
                    : "Publish Post"}
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
          LIST VIEW
      ══════════════════════════════════════════════════ */}
        {view === "list" && (
          <>
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-5 bg-gray-800 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-800 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  No blog posts yet
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Create your first post to get started
                </p>
                <button
                  onClick={openCreate}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Write First Post
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="group bg-gray-900 border border-gray-800 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-200 flex gap-5"
                  >
                    {/* Cover thumbnail */}
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-8 h-8 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                blog.isPublished
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {blog.isPublished ? "Published" : "Draft"}
                            </span>
                            {blog.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-semibold text-white truncate text-base group-hover:text-indigo-300 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                            {blog.excerpt}
                          </p>
                          <p className="text-gray-600 text-xs mt-2">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "Not published yet"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-500/20 hover:text-indigo-400 text-gray-400 transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(blog._id)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════
          CREATE / EDIT VIEW
      ══════════════════════════════════════════════════ */}
        {(view === "create" || view === "edit") && (
          <>
            {previewMode ? (
              /* ── PREVIEW ── */
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-3xl mx-auto">
                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt="Cover"
                    className="w-full h-56 object-cover rounded-xl mb-6"
                  />
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.tags
                    .split(",")
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                  {form.title || "Untitled Post"}
                </h1>
                <p className="text-indigo-300 text-base mb-6 leading-relaxed border-l-2 border-indigo-500 pl-4">
                  {form.excerpt}
                </p>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {form.content}
                  </div>
                </div>
              </div>
            ) : (
              /* ── EDITOR ── */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Title */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Blog Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleTitleChange}
                      placeholder="Enter a compelling title..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-lg font-medium transition-colors"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Excerpt / Summary
                    </label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      placeholder="Brief description shown in blog listings..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors text-sm leading-relaxed"
                    />
                  </div>

                  {/* Content */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Content <span className="text-red-400">*</span>
                      </label>
                      <span className="text-xs text-gray-600">
                        {wordCount} words · ~{readTime} min read
                      </span>
                    </div>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Write your blog content here... (Markdown supported)"
                      rows={20}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors text-sm leading-relaxed font-mono"
                    />
                  </div>
                </div>

                {/* Sidebar settings */}
                <div className="space-y-5">
                  {/* Publish toggle */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                      Publish Settings
                    </h3>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {form.isPublished ? "Published" : "Draft"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {form.isPublished
                            ? "Visible on public site"
                            : "Only visible to admin"}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isPublished"
                          checked={form.isPublished}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              isPublished: !p.isPublished,
                            }))
                          }
                          className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                            form.isPublished ? "bg-indigo-600" : "bg-gray-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                              form.isPublished
                                ? "translate-x-5 ml-0.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Slug */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      URL Slug <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-colors">
                      <span className="px-3 text-gray-600 text-xs border-r border-gray-700 py-3 whitespace-nowrap">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="my-blog-post"
                        className="flex-1 bg-transparent px-3 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Auto-generated from title
                    </p>
                  </div>

                  {/* Cover Image */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      name="coverImage"
                      value={form.coverImage}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    {form.coverImage && (
                      <img
                        src={form.coverImage}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl mt-3"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="react, node, web-dev"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Comma-separated
                    </p>
                    {form.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {form.tags
                          .split(",")
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Submit button (mobile/sidebar) */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    {submitting
                      ? "Saving..."
                      : view === "edit"
                        ? "Update Post"
                        : "Publish Post"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </AdminLayout>
  );
}
