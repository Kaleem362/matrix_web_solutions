import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { socket } from "../../Socket.js";
import Loader from "./Loader/Loader.jsx";

// ─── Toast system ─────────────────────────────────────────────
const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl border shadow-md px-4 py-3 min-w-[260px] max-w-xs
          animate-[slideIn_0.25s_ease] transition-all
          ${t.type === "success" ? "border-green-200" : t.type === "error" ? "border-red-200" : "border-blue-200"}`}
      >
        {/* Icon */}
        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
          ${t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-blue-100"}`}>
          {t.type === "success" && (
            <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-3 h-3 text-red-600" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M3 3l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
          {t.type === "info" && (
            <svg className="w-3 h-3 text-blue-600" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 5.5V9M6 4v-.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">{t.title}</p>
          {t.message && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.message}</p>}
        </div>

        {/* Close */}
        <button onClick={() => onClose(t.id)} className="text-gray-300 hover:text-gray-500 text-sm leading-none mt-0.5">✕</button>
      </div>
    ))}
  </div>
);

// ─── Confirm modal ────────────────────────────────────────────
const ConfirmModal = ({ modal, onConfirm, onCancel }) => {
  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-600" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M5 4V2.5h4V4M6 7v3M8 7v3M3 4l.5 7.5h7L11 4"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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

// ─── Main component ───────────────────────────────────────────
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
    open: false,
    title: "",
    description: "",
    onConfirm: null,
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
      setTestimonialsData(res.data.data || []);
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

    socket.on("testimonialApproved", () => {
      fetchTestimonials();
    });

    socket.on("testimonialDeleted", () => {
      fetchTestimonials();
    });

    return () => {
      socket.off("newTestimonialSubmitted");
      socket.off("testimonialApproved");
      socket.off("testimonialDeleted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtering ──
  const filteredTestimonials = testimonialsData.filter((item) =>
    filter === "approved" ? item.approved === true : item.approved === false
  );

  // ── Approve ──
  const approveTestimonial = async (id) => {
    try {
      await axios.patch(
        `${APP_testimonials_API_URL}${id}/approve`,
        {},
        { withCredentials: true }
      );
      await fetchTestimonials();
      showToast("success", "Testimonial approved", "It's now visible on the public site.");
    } catch (err) {
      showToast(
        "error",
        "Approval failed",
        err?.response?.data?.message || err.message
      );
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
          await axios.delete(`${APP_testimonials_API_URL}${id}`, {
            withCredentials: true,
          });
          await fetchTestimonials();
          showToast("error", "Testimonial deleted", "The entry has been removed.");
        } catch (err) {
          showToast("error", "Delete failed", err.message);
        }
      }
    );
  };

  // ── UI ──
  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <ConfirmModal
        modal={confirmModal}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />

      <h2 className="text-2xl font-semibold mb-6">Testimonials Management</h2>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded border ${
            filter === "pending"
              ? "bg-indigo-900 text-white border-indigo-900"
              : "bg-white/50 text-gray-700"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded border ${
            filter === "approved"
              ? "bg-black text-white border-black"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Approved
        </button>
      </div>

      {loading && <Loader />}
      {error && (
        <p className="text-red-200 google-sans h-screen w-full text-center flex items-center text-5xl">
          {error}
        </p>
      )}
      {!loading && filteredTestimonials.length === 0 && (
        <p className="text-gray-500/30 text-center flex items-center justify-center text-5xl h-82">
          No testimonials found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {filteredTestimonials.map((item) => (
          <div
            key={item._id}
            className="rounded-lg p-5 bg-white shadow-lg hover:bg-gray-100 shadow-gray-500"
          >
            <div className="mb-2">
              <h4 className="font-semibold text-lg">{item.name}</h4>
              <p className="text-sm text-gray-500">Rating: ⭐ {item.rating}</p>
            </div>
            <p className="text-gray-700 text-sm mb-4">{item.message}</p>
            <div className="flex gap-3">
              {!item.approved && (
                <button
                  onClick={() => approveTestimonial(item._id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-transparent hover:text-indigo-900 border hover:border transition"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => deleteTestimonial(item._id)}
                className="px-4 py-2 bg-red-600 text-white border hover:border-red-600 hover:bg-transparent hover:text-red-600 transition rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;