import { useState, useEffect, useMemo, useRef } from "react";
import { FaBlog } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDeleteOutline, MdOutlineEdit, MdOutlineAdd } from "react-icons/md";
import { getApiBase } from "../../utils/api.js";

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
  const [view, setView] = useState("list");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [search, setSearch] = useState("");

  // ── Cover image upload states ──
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const fileInputRef = useRef(null);

  // ── Fetch all blogs ──
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs/admin/all`, {
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

  // ── Cover image upload handler ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local blob preview instantly
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImageError(null);
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      // Store Cloudinary URL in form
      setForm((prev) => ({ ...prev, coverImage: data.url }));
      showToast("Cover image uploaded successfully");
    } catch (err) {
      setImageError(err.message || "Image upload failed");
      setImagePreview(null);
      setForm((prev) => ({ ...prev, coverImage: "" }));
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setImageUploading(false);
    }
  };

  // ── Remove cover image ──
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    setForm((prev) => ({ ...prev, coverImage: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit: create or update ──
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      showToast("Title, slug, and content are required", "error");
      return;
    }
    if (imageUploading) {
      showToast("Please wait for image upload to finish", "error");
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
      setImagePreview(null);
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
    // Show existing image as preview when editing
    setImagePreview(blog.coverImage || null);
    setImageError(null);
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
    setImagePreview(null);
    setImageError(null);
    setView("create");
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // ── Filtered blogs ──
  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [blogs, search]);

  return (
    <section className="min-h-screen px-1 py-2 sm:px-2">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-md transition-all duration-300 ${
            toast.type === "error"
              ? "border-red-200 text-red-700"
              : "border-green-200 text-green-700"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full ${
              toast.type === "error" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {toast.type === "error" ? "⚠" : "✓"}
          </span>
          {toast.message}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
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
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                Delete Blog?
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                This action cannot be undone. The blog will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {view !== "list" && (
            <button
              onClick={() => {
                setView("list");
                setPreviewMode(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 ring-1 ring-gray-200 transition hover:bg-gray-50 hover:text-indigo-600"
              title="Back to list"
            >
              <svg
                className="h-5 w-5"
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <FaBlog className="text-lg text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {view === "list" && "Blog Manager"}
              {view === "create" && "New Blog Post"}
              {view === "edit" && "Edit Blog Post"}
            </h2>
            <p className="text-sm text-gray-500">
              {view === "list" &&
                `${blogs.length} total ${blogs.length === 1 ? "post" : "posts"}`}
              {(view === "create" || view === "edit") &&
                `${wordCount} words · ~${readTime} min read`}
            </p>
          </div>
        </div>

        {view === "list" ? (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <MdOutlineAdd className="text-lg" />
            New Post
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                previewMode
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="h-4 w-4"
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
              disabled={submitting || imageUploading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? (
                <svg
                  className="h-4 w-4 animate-spin"
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
                  className="h-4 w-4"
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

      {/* ── List View ── */}
      {view === "list" && (
        <>
          <div className="mb-6 relative w-full sm:max-w-sm">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, excerpt, or tag…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex animate-pulse gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4"
                >
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 rounded-lg bg-gray-200" />
                    <div className="h-3 w-2/3 rounded-lg bg-gray-100" />
                    <div className="h-3 w-1/4 rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
              <FaBlog className="mb-3 text-5xl text-gray-200" />
              <p className="text-base font-semibold text-gray-400">
                {search ? "No posts match your search" : "No blog posts yet"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {search
                  ? "Try a different keyword."
                  : "Create your first post to get started."}
              </p>
              {!search && (
                <button
                  onClick={openCreate}
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Write First Post
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5"
                >
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-300"
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
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                          blog.isPublished
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-indigo-700">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
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
                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleEdit(blog)}
                      title="Edit"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                    >
                      <MdOutlineEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(blog._id)}
                      title="Delete"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    >
                      <MdDeleteOutline className="text-lg" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Create / Edit View ── */}
      {(view === "create" || view === "edit") && (
        <>
          {previewMode ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover"
                  className="mb-6 h-56 w-full rounded-xl object-cover"
                />
              )}
              <div className="mb-4 flex flex-wrap gap-2">
                {form.tags
                  .split(",")
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900">
                {form.title || "Untitled Post"}
              </h1>
              {form.excerpt && (
                <p className="mb-6 border-l-4 border-indigo-500 pl-4 text-base leading-relaxed text-gray-600">
                  {form.excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {form.content}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* ── Main content ── */}
              <div className="space-y-5 lg:col-span-2">
                {/* Title */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label className="mb-2 block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Enter a compelling title..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg font-medium text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Excerpt */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label className="mb-2 block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Excerpt / Summary
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="Brief description shown in blog listings..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Content */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-400">
                      {wordCount} words · ~{readTime} min read
                    </span>
                  </div>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write your blog content here... (Markdown supported)"
                    rows={20}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-5">
                {/* Publish toggle */}
                {/* Publish toggle */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Publish Settings
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {form.isPublished ? "Published" : "Draft"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {form.isPublished
                          ? "Visible on public site"
                          : "Only visible to admin"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, isPublished: !p.isPublished }))
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        form.isPublished ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          form.isPublished ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Publish status indicator */}
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                      form.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        form.isPublished ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {form.isPublished
                      ? "Will be visible on the public blog page"
                      : "Save as draft — not visible to visitors"}
                  </div>
                </div>

                {/* Slug */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label className="mb-2 block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <span className="whitespace-nowrap border-r border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500">
                      /blog/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="my-blog-post"
                      className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <p className="mt-2 pl-1 text-xs text-gray-400">
                    Auto-generated from title
                  </p>
                </div>

                {/* ── Cover Image Upload ── */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label className="mb-3 block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Cover Image
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Preview state */}
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="h-40 w-full rounded-xl object-cover"
                      />

                      {/* Uploading overlay */}
                      {imageUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50 backdrop-blur-sm">
                          <svg
                            className="h-6 w-6 animate-spin text-white"
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
                          <span className="text-xs font-medium text-white">
                            Uploading to Cloudinary...
                          </span>
                        </div>
                      )}

                      {/* Actions — shown after upload done */}
                      {!imageUploading && (
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          {/* Replace */}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Replace image"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-gray-600 shadow backdrop-blur-sm transition hover:bg-indigo-600 hover:text-white"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              />
                            </svg>
                          </button>
                          {/* Remove */}
                          <button
                            onClick={handleRemoveImage}
                            title="Remove image"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Cloudinary success badge */}
                      {!imageUploading && form.coverImage && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-medium text-white">
                            Saved to Cloudinary
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Drop zone */
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 transition-all hover:border-indigo-400 hover:bg-indigo-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-indigo-100">
                        <svg
                          className="h-5 w-5 text-gray-400 group-hover:text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600">
                          Click to upload cover image
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          JPG, PNG, GIF, WEBP · Max 5MB
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Error message */}
                  {imageError && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
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
                      {imageError}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label className="mb-2 block pl-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="react, node, web-dev"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <p className="mt-2 pl-1 text-xs text-gray-400">
                    Comma-separated
                  </p>
                  {form.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {form.tags
                        .split(",")
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || imageUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {imageUploading
                    ? "Waiting for image..."
                    : submitting
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
  );
}
