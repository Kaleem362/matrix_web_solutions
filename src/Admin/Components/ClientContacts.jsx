import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader/Loader.jsx";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
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

  // =========================================
  // 🔹 FETCH — sirf tab jab contacts empty hain
  // =========================================
  const fetchClientContacts = async () => {
    
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Fetching contacts from:", GET_ALL_CONTACTS_URL);

      const res = await axios.get(GET_ALL_CONTACTS_URL, {
        withCredentials: true,
      });

      console.log("✅ Contacts fetched:", res.data);
      setContacts(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Failed to fetch contacts. Please login again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // 🔹 DELETE
  // =========================================
  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      console.log("🗑️ Deleting contact:", id);

      await axios.delete(`${DEL_CONTACT_URL}/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // =========================================
  // 🔹 useEffect — smart caching + socket
  // =========================================
  useEffect(() => {
    if (contacts.length === 0) {
      console.log("🟢 No cache — fetching from API...");
      fetchClientContacts();
    } else {
      console.log("⚡ Cache hit — no API call needed");
    }

    socket.on("newContactSubmitted", (newContact) => {
      console.log("🔔 New contact via socket:", newContact);
      setContacts((prev) => [newContact, ...prev]);
    });

    socket.on("ContactDeleted", ({ id }) => {
      console.log("🗑️ Contact deleted via socket:", id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    });

    return () => {
      socket.off("newContactSubmitted");
      socket.off("ContactDeleted");
    };
  }, []);

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100 google-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold">Clients Contacted</h2>
        <button
          onClick={fetchClientContacts}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <Loader />}

      {/* Empty State */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-6xl mb-4">📭</p>
          <p className="text-gray-500 text-xl">No contacts yet</p>
        </div>
      )}

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {contacts.map((item) => (
          <div
            key={item._id}
            className="rounded-lg p-5 border bg-white shadow-lg hover:shadow-xl transition-all duration-200 relative group"
          >
            {/* Delete Button */}
            <MdDelete
              size={24}
              onClick={() => deleteContact(item._id)}
              className="absolute -top-3 -right-3 h-10 w-10 p-1 text-white bg-red-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-red-700 group-hover:scale-110 transition-all"
              title="Delete contact"
            />

            <div className="mb-4">
              <h4 className="p-3 rounded-lg text-lg uppercase text-white bg-linear-to-r from-indigo-600 to-purple-600 shadow-md font-bold">
                {item.name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 my-3">
                {/* ✅ FIXED — <a tag restored */}
                <a
                  href={`tel:${item.phone}`}
                  className="flex items-center border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all px-3 py-2 rounded-lg text-sm"
                >
                  📞 {item.phone}
                </a>
                {/* ✅ FIXED — <a tag restored */}
                <a
                  href={`mailto:${item.email}`}
                  className="flex items-center text-indigo-900 border border-indigo-300 hover:border-indigo-500 bg-indigo-50 px-3 py-2 rounded-lg gap-2"
                >
                  <img src={gmail} className="h-5 w-5" alt="Email" /> Reply
                </a>
              </div>
              <hr className="border-indigo-200" />
              <div className="flex items-center gap-2 mt-3 mb-2">
                <IoArrowRedoCircleSharp size={18} className="text-indigo-600" />
                <strong className="text-indigo-800 capitalize underline">
                  {item.subject}
                </strong>
              </div>
              <p className="text-gray-700 text-sm p-3 bg-gray-50 rounded-lg min-h-20">
                {item.message}
              </p>
              
              <p className="text-xs text-gray-500 mt-2">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </p>
            </div>
          </div>
      ))}
      </div>
    </div>
  );
};

export default ClientContacts;
