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
      <section className="rounded-2xl bg-white border border-indigo-900/10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-indigo-900">
              Quotes Management
            </h1>
            <p className="text-sm text-indigo-900/70 mt-1">
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

        <div className="mt-4 rounded-lg bg-indigo-900 text-white px-4 py-2 text-sm inline-block">
          Total Quotes: {filteredQuotes.length}
        </div>

        <div className="mt-6">
          {loading && <Loader />}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {!loading && !error && filteredQuotes.length === 0 && (
            <div className="rounded-xl border border-indigo-900/20 bg-white p-8 text-center text-indigo-900/70">
              No quotes found.
            </div>
          )}

          {!loading && !error && filteredQuotes.length > 0 && (
            <div className="flex flex-wrap items-stretch gap-4 sm:gap-5 lg:gap-6">
              {filteredQuotes.map((item) => (
                <article
                  key={item._id}
                  className="w-full sm:w-[calc(50%-0.625rem)] xl:w-[calc(33.333%-1rem)] rounded-xl border border-indigo-900/15 bg-white p-4 sm:p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-extrabold text-indigo-900 wrap-break-word">
                        {item.name}
                      </h3>
                      <p className="text-sm underline text-black break-all">
                        {item.email}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-900 text-white text-xs px-3 py-2">
                      {item.service}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-indigo-900/80 font-medium wrap-break-word">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="w-full sm:w-auto text-sm sm:text-base flex items-center gap-1 flex-row-reverse text-indigo-900 font-extrabold break-all">
                      {"+" + item.phone} <FcPhone />
                    </p>

                    <a
                      href={`https://wa.me/${item.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none min-w-36 flex items-center justify-center rounded-full border border-green-700 bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-900 hover:text-white transition hover:border-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 gap-2"
                    >
                      <span>WhatsApp</span>
                      <FaWhatsapp size={18} />
                    </a>
                    <a
                      href={`mailto:${item.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 outline-none sm:flex-none min-w-32 flex items-center justify-center rounded-full border  bg-linear-to-r from-pink-500 to-indigo-400 px-3 py-2 text-sm font-medium text-white hover:from-pink-600  hover:to-indigo-500 transition-all duration-200  focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 gap-2"
                    >
                      <span className="outline-none">Email</span>
                      <TfiEmail size={18} />
                    </a>
                    <button
                      onClick={() => deleteQuote(item._id)}
                      className="flex-1 sm:flex-none min-w-28 rounded-full border border-red-700 bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-900 hover:text-white transition hover:border-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
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
