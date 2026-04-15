import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Loader from "./Loader/Loader.jsx";
import { MdDelete } from "react-icons/md";
import { socket } from "../../Socket.js";
import { useStore } from "../../Context/UseStore.jsx";
import { getApiBase } from "../../utils/api.js";

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
        <div
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
          ${t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-blue-100"}`}
        >
          {t.type === "success" && (
            <svg
              className="w-3 h-3 text-green-600"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {t.type === "error" && (
            <svg
              className="w-3 h-3 text-red-600"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M3 9L9 3M3 3l6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
          {t.type === "info" && (
            <svg
              className="w-3 h-3 text-blue-600"
              viewBox="0 0 12 12"
              fill="none"
            >
              <circle
                cx="6"
                cy="6"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M6 5.5V9M6 4v-.3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {t.title}
          </p>
          {t.message && (
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              {t.message}
            </p>
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

// ─── Confirm modal ────────────────────────────────────────────
const ConfirmModal = ({ modal, onConfirm, onCancel }) => {
  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-red-600"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M2 4h10M5 4V2.5h4V4M6 7v3M8 7v3M3 4l.5 7.5h7L11 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-800">{modal.title}</p>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          {modal.description}
        </p>
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
const ClientContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { gmail, contacts, setContacts } = useStore();

  const GET_ALL_CONTACTS_URL = `${getApiBase()}/api/contact`;
  const DEL_CONTACT_URL = `${getApiBase()}/api/contact`;

  // ── Toast state ──
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, title, message = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
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
    setConfirmModal({
      open: false,
      title: "",
      description: "",
      onConfirm: null,
    });
  };

  // ── Fetch ──
  const fetchClientContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(GET_ALL_CONTACTS_URL, {
        withCredentials: true,
      });
      setContacts(res.data.data || res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch contacts. Please login again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──
  const deleteContact = (id, name) => {
    openConfirm(
      "Delete contact?",
      `This will permanently remove ${name}'s contact entry. This action cannot be undone.`,
      async () => {
        closeConfirm();
        try {
          await axios.delete(`${DEL_CONTACT_URL}/${id}`, {
            withCredentials: true,
          });
          // State is updated via the ContactDeleted socket event
          showToast(
            "error",
            "Contact deleted",
            `${name}'s entry has been removed.`,
          );
        } catch (err) {
          showToast(
            "error",
            "Delete failed",
            err.response?.data?.message || err.message,
          );
        }
      },
    );
  };
  // audio unlock for browsers that block autoplay until user interaction
  useEffect(() => {
  const unlockAudio = () => {
    const audio = new Audio("../Audio/contacttone.mp3");
    audio.play().catch(() => {});
    window.removeEventListener("click", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);
}, []);

  // ── Socket + initial load ──
  useEffect(() => {
    if (contacts.length === 0) fetchClientContacts();

    socket.on("newContactSubmitted", (newContact) => {
      setContacts((prev) => [newContact, ...prev]);
      showToast(
        "info",
        "New contact received",
        `From ${newContact.name} — ${newContact.subject}`,
      );

      // 🔊 ADDED: notification sound
      const audio = new Audio("../Audio/contacttone.mp3");
      audio.play().catch((err) => {
        console.log("🔇 Sound blocked by browser:", err);
      });
    });
    socket.on("ContactDeleted", ({ id }) => {
      setContacts((prev) => prev.filter((c) => c._id !== id));
    });

    return () => {
      socket.off("newContactSubmitted");
      socket.off("ContactDeleted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ──
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const avatarColors = [
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
  ];

  // ── UI ──
  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100 google-sans">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <ConfirmModal
        modal={confirmModal}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Clients Contacted</h2>
        <button
          onClick={fetchClientContacts}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
        >
          {loading ? "..." : "↻"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {loading && <Loader />}

      {/* Empty state */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-6xl mb-4">📭</p>
          <p className="text-gray-500 text-xl">No contacts yet</p>
        </div>
      )}

      {/* Table */}
      {!loading && contacts.length > 0 && (
        <div
          className="bg-white rounded-xl border border-gray-200 shadow-sm"
          style={{ overflowX: "auto" }}
        >
          <style>{`
            .contacts-scroll::-webkit-scrollbar { height: 5px; }
            .contacts-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 99px; }
            .contacts-scroll::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 99px; }
            .contacts-scroll::-webkit-scrollbar-thumb:hover { background: #6366f1; }
            details > summary { list-style: none; }
            details > summary::-webkit-details-marker { display: none; }
          `}</style>

          <div className="contacts-scroll" style={{ overflowX: "auto" }}>
            <table
              className="text-sm"
              style={{
                minWidth: "900px",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Subject",
                    "Message",
                    "Date",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wide whitespace-nowrap"
                      style={{
                        width: [
                          "180px",
                          "190px",
                          "160px",
                          "160px",
                          "260px",
                          "110px",
                          "120px",
                        ][i],
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {contacts.map((item, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Name + Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold shrink-0`}
                          >
                            {getInitials(item.name)}
                          </div>
                          <span className="font-medium text-gray-800 whitespace-nowrap">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {item.email}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs text-gray-700 transition-all whitespace-nowrap"
                        >
                          📞 {item.phone}
                        </a>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {item.subject}
                        </span>
                      </td>

                      {/* Message */}
                      {item.message.length > 100 ? (
                        <td className="px-4 py-3" style={{ minWidth: "220px" }}>
                          <details className="cursor-pointer">
                            <summary className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors select-none">
                              Read message ▾
                            </summary>
                            <p className="mt-1.5 text-gray-500 text-xs leading-relaxed">
                              {item.message}
                            </p>
                          </details>
                        </td>
                      ) : (
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {item.message}
                        </td>
                      )}

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${item.email}`}
                            className="flex items-center gap-1 px-2 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs transition-all"
                            title="Reply"
                          >
                            <img src={gmail} className="h-4 w-4" alt="Email" />
                            Reply
                          </a>
                          <button
                            onClick={() => deleteContact(item._id, item.name)}
                            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-100 transition-colors"
                            title="Delete contact"
                          >
                            <MdDelete size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientContacts;
