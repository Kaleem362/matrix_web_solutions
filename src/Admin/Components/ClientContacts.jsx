import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { socket } from "../../Socket.js";
import { useStore } from "../../Context/UseStore.jsx";
import { getApiBase } from "../../utils/api.js";
import { markAsSeen } from "../../utils/seenItems";

// ─── Toast system ─────────────────────────────────────────────
const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl border shadow-md px-4 py-3 min-w-65 max-w-xs
          animate-[slideIn_0.25s_ease] transition-all
          ${t.type === "success" ? "border-green-200" : t.type === "error" ? "border-red-200" : "border-blue-200"}`}
      >
        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
          ${t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-blue-100"}`}>
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
          {t.message && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.message}</p>}
        </div>
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
              <path d="M2 4h10M5 4V2.5h4V4M6 7v3M8 7v3M3 4l.5 7.5h7L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-semibold text-gray-800">{modal.title}</p>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{modal.description}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────
const ClientContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { gmail, contacts, setContacts } = useStore();
  const GET_ALL_CONTACTS_URL = `${getApiBase()}/api/contact`;
  const DEL_CONTACT_URL = `${getApiBase()}/api/contact`;

  // ── Toast state ──
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((type, title, message = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const closeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // ── Confirm modal state ──
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", description: "", onConfirm: null });
  const openConfirm = (title, description, onConfirm) => setConfirmModal({ open: true, title, description, onConfirm });
  const closeConfirm = () => setConfirmModal({ open: false, title: "", description: "", onConfirm: null });

  // ── Fetch ──
  const fetchClientContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(GET_ALL_CONTACTS_URL, { withCredentials: true });
      const contactsData = res.data.data || res.data || [];
      setContacts(contactsData);
      markAsSeen("contacts", contactsData.map((c) => c._id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contacts. Please login again.");
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
          await axios.delete(`${DEL_CONTACT_URL}/${id}`, { withCredentials: true });
          showToast("error", "Contact deleted", `${name}'s entry has been removed.`);
        } catch (err) {
          showToast("error", "Delete failed", err.response?.data?.message || err.message);
        }
      },
    );
  };

  // ── Search filter ──
  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Avatar colors ──
  const avatarColors = [
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
  ];

  // ── Helpers ──
  const getInitials = (name = "") => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  // ── Socket + initial load ──
  useEffect(() => {
    if (contacts.length === 0) fetchClientContacts();
    socket.on("newContactSubmitted", (newContact) => {
      setContacts((prev) => [newContact, ...prev]);
      showToast("info", "New contact received", `From ${newContact.name} — ${newContact.subject}`);
    });
    socket.on("ContactDeleted", ({ id }) => setContacts((prev) => prev.filter((c) => c._id !== id)));
    return () => { socket.off("newContactSubmitted"); socket.off("ContactDeleted"); };
  }, []);

  return (
    <div className="p-4 sm:p-6 ml-64 min-h-screen bg-gray-100 google-sans">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <ConfirmModal modal={confirmModal} onConfirm={confirmModal.onConfirm} onCancel={closeConfirm} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Client Contacts</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredContacts.length} {filteredContacts.length === 1 ? "contact" : "contacts"}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button onClick={fetchClientContacts} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition-all">
            {loading ? "..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 text-lg leading-none">✕</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-32 mb-2" /><div className="h-3 bg-gray-100 rounded w-48" /></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredContacts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-5xl mb-4">📭</p>
          <p className="text-gray-500 text-lg font-medium">No contacts yet</p>
          <p className="text-gray-400 text-sm mt-1">{searchTerm ? "Try adjusting your search term" : "Contacts will appear here when clients reach out"}</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredContacts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "900px" }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Name", "Email", "Phone", "Subject", "Message", "Date", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      style={{ width: ["180px", "190px", "160px", "160px", "260px", "110px", "120px"][i] }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((item, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <tr key={item._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150">
                      {/* Name + Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold shrink-0`}>
                            {getInitials(item.name)}
                          </div>
                          <span className="font-medium text-gray-800 whitespace-nowrap">{item.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{item.email}</td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs text-gray-700 transition-all">
                          📞 {item.phone}
                        </a>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {item.subject}
                        </span>
                      </td>

                      {/* Message */}
                      {item.message.length > 100 ? (
                        <td className="px-4 py-3.5" style={{ minWidth: "220px" }}>
                          <details className="cursor-pointer">
                            <summary className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors select-none">
                              Read message ▾
                            </summary>
                            <p className="mt-1.5 text-gray-500 text-xs leading-relaxed">{item.message}</p>
                          </details>
                        </td>
                      ) : (
                        <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{item.message}</td>
                      )}

                      {/* Date */}
                      <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a href={`mailto:${item.email}`} className="flex items-center gap-1 px-2 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs transition-all" title="Reply">
                            <img src={gmail} className="h-4 w-4" alt="Email" />
                            Reply
                          </a>
                          <button onClick={() => deleteContact(item._id, item.name)} className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-100 transition-colors" title="Delete contact">
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
