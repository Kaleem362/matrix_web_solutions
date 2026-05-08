import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";
import Loader from "./Loader/Loader";
import { socket } from "../../Socket";
import { FaWhatsapp } from "react-icons/fa";
import { FcPhone } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { BsQuote } from "react-icons/bs";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const QUOTES_API = `${import.meta.env.VITE_API_URL}/api/quotes`;

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(QUOTES_API, { withCredentials: true });
      setQuotes(res?.data?.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch quotes.");
    } finally {
      setLoading(false);
    }
  }, [QUOTES_API]);

  const deleteQuote = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quote?",
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`${QUOTES_API}/${id}`, { withCredentials: true });
      setQuotes((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed.");
    }
  };

  useEffect(() => {
    fetchQuotes();

    socket.on("newQuoteSubmitted", () => {
      fetchQuotes();
    });

    socket.on("quoteDeleted", () => {
      fetchQuotes();
    });

    return () => {
      socket.off("newQuoteSubmitted");
      socket.off("quoteDeleted");
    };
  }, [fetchQuotes]);

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return quotes;

    return quotes.filter((item) => {
      const name = item?.name?.toLowerCase() || "";
      const email = item?.email?.toLowerCase() || "";
      const service = item?.service?.toLowerCase() || "";
      const phone = String(item?.phone || "");
      return (
        name.includes(query) ||
        email.includes(query) ||
        service.includes(query) ||
        phone.includes(query)
      );
    });
  }, [quotes, search]);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];

  const getAvatarColor = (name = "") => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <AdminLayout>
      <section className="min-h-screen px-1 py-2 sm:px-2">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <BsQuote className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Quote Requests
              </h2>
              <p className="text-sm text-gray-500">
                Manage and respond to incoming client quotes
              </p>
            </div>
          </div>

          {/* Stats pill */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200">
              {filteredQuotes.length}{" "}
              {filteredQuotes.length === 1 ? "Quote" : "Quotes"}
            </span>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-6 relative w-full sm:max-w-sm">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or service…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
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

        {!loading && !error && filteredQuotes.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <BsQuote className="mb-3 text-5xl text-gray-200" />
            <p className="text-base font-semibold text-gray-400">
              No quotes found
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {search ? "Try a different search term." : "No quotes have been submitted yet."}
            </p>
          </div>
        )}

        {/* ── Quote Tiles List ── */}
        {!loading && !error && filteredQuotes.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredQuotes.map((item) => (
              <article
                key={item._id}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5"
              >
                {/* ── Avatar ── */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full text-sm font-bold sm:self-auto ${getAvatarColor(item.name)}`}
                >
                  {getInitials(item.name)}
                </div>

                {/* ── Client Info ── */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
                      {item.service}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <TfiEmail className="shrink-0" />
                      <span className="truncate text-indigo-500 underline underline-offset-2">
                        {item.email}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FcPhone className="shrink-0" />
                      +{item.phone}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* ── Actions ── */}
                <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                  <a
                    href={`https://wa.me/${item.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                  >
                    <FaWhatsapp className="text-base" />
                  </a>
                  <a
                    href={`mailto:${item.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Send Email"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                  >
                    <TfiEmail className="text-base" />
                  </a>
                  <button
                    onClick={() => deleteQuote(item._id)}
                    title="Delete quote"
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

export default Quotes;
