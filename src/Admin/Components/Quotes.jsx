import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";
import Loader from "./Loader/Loader";
import { socket } from "../../Socket";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const QUOTES_API = `${import.meta.env.VITE_API_URL}/api/quotes`;

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
    const fetchQuotes = async () => {
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
    };

    fetchQuotes();

    // FIX: Socket listeners keep admin quotes list in sync with live updates.
    socket.on("newQuoteSubmitted", (incomingQuote) => {
      setQuotes((prev) => [incomingQuote, ...prev]);
    });

    socket.on("quoteDeleted", ({ id }) => {
      setQuotes((prev) => prev.filter((item) => item._id !== id));
    });

    return () => {
      socket.off("newQuoteSubmitted");
      socket.off("quoteDeleted");
    };
  }, [QUOTES_API]);

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredQuotes.map((item) => (
                <article
                  key={item._id}
                  className="rounded-xl border border-indigo-900/15 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-indigo-900/70">{item.email}</p>
                    </div>
                    <span className="rounded-full bg-indigo-900 text-white text-xs px-3 py-1">
                      {item.service}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-indigo-900/80">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-indigo-900 font-medium">
                      {item.phone}
                    </p>

                    <button
                      onClick={() => deleteQuote(item._id)}
                      className="rounded-md border border-indigo-900 bg-indigo-900 px-3 py-1.5 text-sm text-white hover:bg-white hover:text-indigo-900 transition"
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
