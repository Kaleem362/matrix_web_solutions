import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { socket } from "../../Socket.js";
import Loader from "./Loader/Loader.jsx";
import AdminLayout from "../layout/AdminLayout";
import { MdDeleteOutline, MdOutlineVerified } from "react-icons/md";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { markAsSeen } from "../../utils/seenItems";

// ─── Toast Container ──────────────────────────────────────────
const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl border shadow-md px-4 py-3 min-w-65 max-w-xs animate-[slideIn_0.25s_ease] transition-all
          ${t.type === "success" ? "border-green-200" : t.type === "error" ? "border-red-200" : "border-blue-200"}`}
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
            ${t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-blue-100"}`}
        >
          {t.type === "success" && (
            <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-3 h-3 text-red-600" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M3 3l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          {t.type === "info" && (
            <svg className="w-3 h-3 text-blue-600" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 5.5V9M6 4v-.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">{t.title}</p>
          {t.message && (
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(t.id)}
          className="text-gray-300 hover:text-gray-500 text-sm leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────
const ConfirmModal = ({ modal, onConfirm, onCancel }) => {
  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-600" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4h10M5 4V2.5h4V4M6 7v3M8 7v3M3 4l.5 7.5h7L11 4"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-800">{modal.title}</p>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{modal.description}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Star Rating ──────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const total = 5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-medium text-gray-400">{rating}/5</span>
    </div>
  );
};

// ─── Avatar helpers ───────────────────────────────────────────
const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getAvatarColor = (name = "") =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── Avatar Component ────────────────────────────────────────
const Avatar = ({ item }) => {
  const initials = getInitials(item.name);
  const colorClass = getAvatarColor(item.name);

  // Handle both full URLs and partial paths
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
  };

  if (item.image) {
    return (
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full text-sm font-bold ${colorClass}`}>
      {initials}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
const Testimonials = () => {
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_URL;

  const GETALL_API_URL = `${BASE_URL}/api/testimonials/all`;
  const APP_testimonials_API_URL = `${BASE_URL}/api/testimonials/`;

  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");

  // ── Toast state ──
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, title, message = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Confirm modal state ──
  const [confirmModal, setConfirmModal] = useState({
    open: false, title: "", description: "", onConfirm: null,
  });

  const openConfirm = (title, description, onConfirm) => {
    setConfirmModal({ open: true, title, description, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, title: "", description: "", onConfirm: null });
  };

  // ── Fetch ──
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(GETALL_API_URL, { withCredentials: true });
      const testimonialsData = res.data.data || [];
      setTestimonialsData(testimonialsData);
      markAsSeen("testimonials", testimonialsData.map((t) => t._id));
      setError("");
    } catch (err) {
      setError("Failed to fetch testimonials: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Socket + initial load ──
  useEffect(() => {
    fetchTestimonials();

    socket.on("newTestimonialSubmitted", (newTestimonial) => {
      setTestimonialsData((prev) => [newTestimonial, ...prev]);
      showToast("info", "New testimonial received", `From ${newTestimonial.name} — awaiting your review.`);
    });

    socket.on("testimonialApproved", () => { fetchTestimonials(); });
    socket.on("testimonialDeleted", () => { fetchTestimonials(); });

    return () => {
      socket.off("newTestimonialSubmitted");
      socket.off("testimonialApproved");
      socket.off("testimonialDeleted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtering ──
  const filteredTestimonials = testimonialsData.filter((item) =>
    filter === "approved" ? item.approved === true : item.approved === false,
  );

  const pendingCount = testimonialsData.filter((t) => !t.approved).length;
  const approvedCount = testimonialsData.filter((t) => t.approved).length;

  // ── Approve ──
  const approveTestimonial = async (id) => {
    try {
      await axios.patch(`${APP_testimonials_API_URL}${id}/approve`, {}, { withCredentials: true });
      await fetchTestimonials();
      showToast("success", "Testimonial approved", "It's now visible on the public site.");
    } catch (err) {
      showToast("error", "Approval failed", err?.response?.data?.message || err.message);
    }
  };

  // ── Delete ──
  const deleteTestimonial = (id) => {
    openConfirm(
      "Delete testimonial?",
      "This will permanently remove the testimonial. This action cannot be undone.",
      async () => {
        closeConfirm();
        try {
          await axios.delete(`${APP_testimonials_API_URL}${id}`, { withCredentials: true });
          await fetchTestimonials();
          showToast("error", "Testimonial deleted", "The entry has been removed.");
        } catch (err) {
          showToast("error", "Delete failed", err.message);
        }
      },
    );
  };

  // ── Render ──
  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <ConfirmModal modal={confirmModal} onConfirm={confirmModal.onConfirm} onCancel={closeConfirm} />

      <section className="min-h-screen px-1 py-2 sm:px-2">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <HiOutlineChatAlt2 className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Testimonials
              </h2>
              <p className="text-sm text-gray-500">
                Review, approve, and manage client testimonials
              </p>
            </div>
          </div>

          {/* Count pills */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
              {pendingCount} Pending
            </span>
            <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-green-200">
              {approvedCount} Approved
            </span>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="mb-6 flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1 w-fit">
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              filter === "pending"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              filter === "approved"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Approved
          </button>
        </div>

        {/* ── States ── */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredTestimonials.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <HiOutlineChatAlt2 className="mb-3 text-5xl text-gray-200" />
            <p className="text-base font-semibold text-gray-400">
              No {filter} testimonials
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {filter === "pending"
                ? "All caught up — no testimonials waiting for review."
                : "No testimonials have been approved yet."}
            </p>
          </div>
        )}

        {/* ── Testimonial Tiles ── */}
        {!loading && !error && filteredTestimonials.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredTestimonials.map((item) => (
              <article
                key={item._id}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:gap-5"
              >
                {/* ── Avatar ── */}
                <Avatar item={item} />

                {/* ── Content ── */}
                <div className="min-w-0 flex-1">
                  {/* Name + status badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.approved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600 ring-1 ring-green-100">
                        <MdOutlineVerified className="text-sm" />
                        Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-100">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Star rating */}
                  <div className="mt-1">
                    <StarRating rating={item.rating} />
                  </div>

                  {/* Message */}
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {item.message}
                  </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex shrink-0 items-center gap-2 self-start">
                  {!item.approved && (
                    <button
                      onClick={() => approveTestimonial(item._id)}
                      title="Approve testimonial"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    >
                      <MdOutlineVerified className="text-lg" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTestimonial(item._id)}
                    title="Delete testimonial"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  >
                    <MdDeleteOutline className="text-lg" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default Testimonials;