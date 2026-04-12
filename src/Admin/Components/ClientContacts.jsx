import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader/Loader.jsx";
import { MdDelete } from "react-icons/md";
import { socket } from "../../Socket.js";
import { useStore } from "../../Context/UseStore.jsx";
import { getApiBase } from "../../utils/api.js";

const ClientContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { gmail, contacts, setContacts } = useStore();

  const GET_ALL_CONTACTS_URL = `${getApiBase()}/api/contact`;
  const DEL_CONTACT_URL = `${getApiBase()}/api/contact`;

  const fetchClientContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(GET_ALL_CONTACTS_URL, { withCredentials: true });
      setContacts(res.data.data || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contacts. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await axios.delete(`${DEL_CONTACT_URL}/${id}`, { withCredentials: true });
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (contacts.length === 0) fetchClientContacts();

    socket.on("newContactSubmitted", (newContact) => {
      setContacts((prev) => [newContact, ...prev]);
    });
    socket.on("ContactDeleted", ({ id }) => {
      setContacts((prev) => prev.filter((c) => c._id !== id));
    });

    return () => {
      socket.off("newContactSubmitted");
      socket.off("ContactDeleted");
    };
  }, []);

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-teal-100",   text: "text-teal-700"   },
    { bg: "bg-amber-100",  text: "text-amber-700"  },
    { bg: "bg-blue-100",   text: "text-blue-700"   },
    { bg: "bg-pink-100",   text: "text-pink-700"   },
  ];

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100 google-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Clients Contacted</h2>
        <button
          onClick={fetchClientContacts}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Loading */}
      {loading && <Loader />}

      {/* Empty State */}
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
          {/* ─── Custom thin scrollbar ─── */}
          <style>{`
            .contacts-scroll::-webkit-scrollbar {
              height: 5px;
            }
            .contacts-scroll::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 99px;
            }
            .contacts-scroll::-webkit-scrollbar-thumb {
              background: #c7d2fe;
              border-radius: 99px;
            }
            .contacts-scroll::-webkit-scrollbar-thumb:hover {
              background: #6366f1;
            }
            details > summary {
              list-style: none;
            }
            details > summary::-webkit-details-marker {
              display: none;
            }
          `}</style>

          <div className="contacts-scroll" style={{ overflowX: "auto" }}>
            <table
              className="text-sm"
              style={{ minWidth: "900px", width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Name", "Email", "Phone", "Subject", "Message", "Date", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wide whitespace-nowrap"
                      style={{
                        width: ["180px","190px","160px","160px","260px","110px","120px"][i],
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
                          <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold shrink-0`}>
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

                      {/* Message — details/summary collapsible */}
                      {item.message.length > 50 ? (<td className="px-4 py-3" style={{ minWidth: "220px" }}>
                        <details className="cursor-pointer">
                          <summary className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors select-none">
                            Read message ▾
                          </summary>
                          <p className="mt-1.5 text-gray-500 text-xs leading-relaxed">
                            {item.message}
                          </p>
                        </details>
                      </td>): (<td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {item.message}
                      </td>)}

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${item.email}`}
                            className="flex items-center gap-1 px-2 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs w-18 transition-all "
                            title="Reply"
                          >
                            <img src={gmail} className="h-4 w-4" alt="Email" />
                            Reply
                          </a>
                          <button
                            onClick={() => deleteContact(item._id)}
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