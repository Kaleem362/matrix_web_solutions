import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";
import Loader from "./Loader/Loader";
import { socket } from "../../Socket";
import { FaWhatsapp } from "react-icons/fa";
import { FcPhone } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";

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

    // FIX: Refetch on socket events so UI always shows server source-of-truth.
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

  return (
    <AdminLayout>
      <section className="rounded-2xl border border-indigo-900/10 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-indigo-900">
              Quotes Management
            </h1>
            <p className="mt-1 text-sm text-indigo-900/70">
              Review, filter and remove submitted client quotes.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, service"
              className="w-full rounded-lg border border-indigo-900/30 bg-white px-3 py-2 text-sm text-indigo-900 placeholder:text-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-900"
            />
          </div>
        </div>

        <div className="mt-4 inline-block rounded-lg bg-indigo-900 px-4 py-2 text-sm text-white">
          Total Quotes: {filteredQuotes.length}
        </div>

        <div className="mt-6">
          {loading && <Loader />}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && filteredQuotes.length === 0 && (
            <div className="rounded-xl border border-indigo-900/20 bg-white p-8 text-center text-indigo-900/70">
              No quotes found.
            </div>
          )}

          {!loading && !error && filteredQuotes.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {filteredQuotes.map((item) => (
                <article
                  key={item._id}
                  className="flex h-full min-w-0 flex-col rounded-xl border border-indigo-900/15 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word text-lg font-extrabold text-indigo-900 sm:text-xl">
                        {item.name}
                      </h3>
                      <p className="mt-1 break-all text-sm text-black underline underline-offset-2">
                        {item.email}
                      </p>
                    </div>
                    <span className="max-w-full shrink-0 rounded-full bg-green-900 px-3 py-2 text-center text-xs text-white wrap-break-word">
                      {item.service}
                    </span>
                  </div>

                  <p className="mt-3 wrap-break-word text-sm font-medium leading-relaxed text-indigo-900/80">
                    {item.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                    <p className="col-span-1 inline-flex min-w-0 items-center gap-1 break-all text-sm font-extrabold text-indigo-900 sm:col-span-2 sm:text-base lg:col-span-3">
                      <FcPhone />
                      {"+" + item.phone}
                    </p>

                    <a
                      href={`https://wa.me/${item.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-green-700 bg-green-700 px-3 py-2 text-sm text-white transition hover:border-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                      <span>WhatsApp</span>
                      <FaWhatsapp size={18} />
                    </a>
                    <a
                      href={`mailto:${item.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border bg-linear-to-r from-pink-500 to-indigo-400 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-pink-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                      <span>Email</span>
                      <TfiEmail size={18} />
                    </a>
                    <button
                      onClick={() => deleteQuote(item._id)}
                      className="w-full rounded-full border border-red-700 bg-red-700 px-3 py-2 text-sm text-white transition hover:border-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 sm:col-span-2 lg:col-span-1"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default Quotes;
