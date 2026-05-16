/* ========================================================================
   QUOTES COMPONENT - Admin panel for managing quote requests
   ========================================================================
   Purpose: Display and manage incoming client quote requests

   Features:
   - View all submitted quotes with client details
   - Search/filter quotes by name, email, phone, service
   - Set pricing for quotes (50% upfront or full payment)
   - Send quotes to clients via email
   - Trigger payment modal when client accepts quote
   - Track payment status (pending, paid, completed)

   Integration:
   - Uses quoteService for API calls
   - Uses usePayment hook to trigger payment modal
   - Real-time updates via Socket.io

   Payment Flow:
   1. Admin sets price → client receives email with quote
   2. Client clicks payment link → PaymentModal opens
   3. Client pays 50% upfront → status updates to "partially_paid"
   4. Admin delivers work → final payment collected → "paid"
   ======================================================================== */

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import Loader from "./Loader/Loader";
import { socket } from "../../Socket";
import { FaWhatsapp } from "react-icons/fa";
import { FcPhone } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { BsQuote } from "react-icons/bs";
import { markAsSeen } from "../../utils/seenItems";
import { usePayment } from "../../Context/PaymentContext"; // Payment context for triggering payment modal

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Quote status constants for consistency
const QUOTE_STATUS = {
  PENDING: "pending",
  PRICING_SENT: "pricing_sent",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  PAYMENT_PENDING: "payment_pending",
  PARTIALLY_PAID: "partially_paid",
  PAID: "paid",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/* ========================================================================
   Helper function: formatStatusLabel
   Converts status string to readable format
   Example: "partially_paid" → "Partially Paid"
   ======================================================================== */
const formatStatusLabel = (status) => {
  if (!status) return "Pending";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/* ========================================================================
   Helper function: getStatusColor
   Returns Tailwind color classes based on quote status
   Used for status badges in the UI
   ======================================================================== */
const getStatusColor = (status) => {
  const statusColors = {
    [QUOTE_STATUS.PENDING]: { bg: "bg-gray-100", text: "text-gray-700" },
    [QUOTE_STATUS.PRICING_SENT]: { bg: "bg-blue-100", text: "text-blue-700" },
    [QUOTE_STATUS.ACCEPTED]: { bg: "bg-green-100", text: "text-green-700" },
    [QUOTE_STATUS.DECLINED]: { bg: "bg-red-100", text: "text-red-700" },
    [QUOTE_STATUS.PAYMENT_PENDING]: { bg: "bg-yellow-100", text: "text-yellow-700" },
    [QUOTE_STATUS.PARTIALLY_PAID]: { bg: "bg-indigo-100", text: "text-indigo-700" },
    [QUOTE_STATUS.PAID]: { bg: "bg-emerald-100", text: "text-emerald-700" },
    [QUOTE_STATUS.COMPLETED]: { bg: "bg-purple-100", text: "text-purple-700" },
    [QUOTE_STATUS.CANCELLED]: { bg: "bg-gray-100", text: "text-gray-500" },
  };
  return statusColors[status] || statusColors[QUOTE_STATUS.PENDING];
};

const Quotes = () => {
  const { openPaymentModal } = usePayment(); // Hook to trigger payment modal
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // State for pricing modal (admin sets price for a quote)
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pricingForm, setPricingForm] = useState({
    amount: "",
    currency: "usd",
    paymentType: "upfront", // 'upfront' (50%) or 'full' (100%)
  });

  // State for send payment link modal
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [paymentLinkQuote, setPaymentLinkQuote] = useState(null);

  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteQuoteId, setDeleteQuoteId] = useState(null);

  const QUOTES_API = `${import.meta.env.VITE_API_URL}/api/quotes`;

  /* ========================================================================
     Function: fetchQuotes
     Fetches all quotes from the backend API
     ======================================================================== */
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(QUOTES_API, { withCredentials: true });
      const quotesData = res?.data?.data || [];
      setQuotes(quotesData);
      markAsSeen("quotes", quotesData.map((q) => q._id));
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch quotes.");
    } finally {
      setLoading(false);
    }
  }, [QUOTES_API]);

  /* ========================================================================
     Function: deleteQuote
     Opens delete confirmation modal
     ======================================================================== */
  const handleDeleteClick = (id) => {
    setDeleteQuoteId(id);
    setShowDeleteConfirm(true);
  };

  /* ========================================================================
     Function: confirmDelete
     Actually deletes the quote after confirmation
     ======================================================================== */
  const confirmDelete = async () => {
    if (!deleteQuoteId) return;

    try {
      await axios.delete(`${QUOTES_API}/${deleteQuoteId}`, { withCredentials: true });
      setQuotes((prev) => prev.filter((item) => item._id !== deleteQuoteId));
      toast.success("Quote deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete quote.");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteQuoteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteQuoteId(null);
  };

  /* ========================================================================
     Function: updateQuoteStatus
     Updates the status of a quote (e.g., "paid", "completed")
     ======================================================================== */
  const updateQuoteStatus = async (id, status) => {
    try {
      await axios.put(
        `${QUOTES_API}/${id}`,
        { status, statusUpdatedAt: new Date().toISOString() },
        { withCredentials: true }
      );
      fetchQuotes(); // Refresh the list
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to update status.");
    }
  };

  /* ========================================================================
     Function: handleSetPricing
     Opens the pricing modal for a specific quote
     ======================================================================== */
  const handleSetPricing = (quote) => {
    setSelectedQuote(quote);
    setPricingForm({
      amount: quote?.pricing?.amount || "",
      currency: quote?.pricing?.currency || "usd",
      paymentType: quote?.pricing?.paymentType || "upfront",
    });
    setShowPricingModal(true);
  };

  /* ========================================================================
     Function: submitPricing
     Sends quote to client via backend (Nodemailer)
     ======================================================================== */
  const submitPricing = async (e) => {
    e.preventDefault();

    if (!pricingForm.amount || parseFloat(pricingForm.amount) <= 0) {
      toast("Please enter a valid amount");
      return;
    }

    // Show loading state
    const sendButton = document.getElementById("send-quote-btn");
    if (sendButton) {
      sendButton.textContent = "Sending...";
      sendButton.disabled = true;
    }

    try {
      // Send email via backend API
      const response = await axios.post(
        `${API_URL}/api/quotes/send`,
        {
          clientEmail: selectedQuote?.email,
          clientName: selectedQuote?.name,
          service: selectedQuote?.service,
          amount: pricingForm.amount,
          currency: pricingForm.currency,
          paymentType: pricingForm.paymentType,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast("✅ Quote sent to client successfully!");
        setShowPricingModal(false);
        setSelectedQuote(null);
      } else {
        toast("⚠️ " + (response.data.message || "Failed to send quote"));
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      toast("⚠️ Failed to send quote. Please try again or use fallback.");
    } finally {
      // Reset button state
      if (sendButton) {
        sendButton.textContent = "Send Quote to Client";
        sendButton.disabled = false;
      }
    }
  };

  /* ========================================================================
     Function: fallbackToMailto
     Fallback: open email client if backend fails
     ======================================================================== */
  const fallbackToMailto = () => {
    const totalAmount = parseFloat(pricingForm.amount);
    const upfrontAmount = pricingForm.paymentType === "upfront" ? totalAmount * 0.5 : totalAmount;
    const currencySymbol = { usd: "$", eur: "€", pkr: "PKR " };
    const symbol = currencySymbol[pricingForm.currency] || "$";
    const formatAmount = (amt) => pricingForm.currency === "pkr" ? amt.toLocaleString() : amt.toFixed(2);

    const subject = encodeURIComponent(`Quote for ${selectedQuote?.service || "Your Project"} - Matrix Web Solutions`);
    const body = encodeURIComponent(
      `Hi ${selectedQuote?.name || "Client"},\n\n` +
      `Thank you for your interest in our services!\n\n` +
      `Here is your quote:\n` +
      `─────────────────────────────\n` +
      `Service: ${selectedQuote?.service || "Web Development"}\n` +
      `Total Cost: ${symbol}${formatAmount(totalAmount)} ${pricingForm.currency.toUpperCase()}\n` +
      `Payment Option: ${pricingForm.paymentType === "upfront" ? "50% Upfront + 50% on Delivery" : "Full Payment"}\n` +
      `Amount to Pay Now (50%): ${symbol}${formatAmount(upfrontAmount)} ${pricingForm.currency.toUpperCase()}\n` +
      `─────────────────────────────\n\n` +
      `To proceed, please confirm and we'll share payment details.\n\n` +
      `Best regards,\n` +
      `Matrix Web Solutions`
    );

    window.location.href = `mailto:${selectedQuote?.email}?subject=${subject}&body=${body}`;
    setShowPricingModal(false);
    setSelectedQuote(null);
  };

  /* ========================================================================
     Function: handleSendPaymentLink
     Opens payment link modal for a quote
     ======================================================================== */
  const handleSendPaymentLink = (quote) => {
    setPaymentLinkQuote(quote);
    setShowPaymentLinkModal(true);
  };

  /* ========================================================================
     Function: sendPaymentLink
     Sends payment link to client via email
     ======================================================================== */
  const sendPaymentLink = async () => {
    try {
      // In production, this would trigger an email to the client
      // with a payment link that opens the payment modal
      await axios.post(
        `${QUOTES_API}/${paymentLinkQuote._id}/send-payment-link`,
        {},
        { withCredentials: true }
      );

      toast("Payment link sent to client!");
      setShowPaymentLinkModal(false);
      setPaymentLinkQuote(null);
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to send payment link.");
    }
  };

  /* ========================================================================
     Function: simulateClientPayment
     Simulates client clicking payment link (for testing)
     Opens the payment modal with the quote's pricing details
     ======================================================================== */
  const simulateClientPayment = (quote) => {
    // Check if pricing has been set - payment should only work AFTER quote is sent
    if (!quote?.pricing?.amount) {
      toast("⚠️ Please set pricing first!\n\nClient must receive the quote before making payment.\n\nSteps:\n1. Click the $ button to set pricing\n2. Click 'Send Quote to Client'\n3. Wait for client confirmation\n4. Then client can pay");
      return;
    }

    const pricing = quote.pricing;

    // Open payment modal with the actual quote pricing
    openPaymentModal({
      amount: pricing.upfrontAmount || pricing.amount * 0.5, // 50% upfront
      totalAmount: pricing.totalAmount || pricing.amount,
      currency: pricing.currency?.toLowerCase() || "usd",
      projectName: quote.service || "Project",
      clientName: quote.name,
      clientEmail: quote.email,
      quoteId: quote._id,
      paymentType: pricing.paymentType || "upfront",
    });
  };

  // Socket event listeners for real-time updates
  useEffect(() => {
    fetchQuotes();

    socket.on("newQuoteSubmitted", () => {
      fetchQuotes();
    });

    socket.on("quoteDeleted", () => {
      fetchQuotes();
    });

    socket.on("quotePaymentReceived", () => {
      fetchQuotes();
    });

    return () => {
      socket.off("newQuoteSubmitted");
      socket.off("quoteDeleted");
      socket.off("quotePaymentReceived");
    };
  }, [fetchQuotes]);

  // Filter quotes based on search input
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

  // Helper functions for avatar display
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

  // Currency symbol helper
  const getCurrencySymbol = (currency) => {
    const symbols = { usd: "$", eur: "€", pkr: "PKR " };
    return symbols[currency?.toLowerCase()] || "$";
  };

  // Format price for display
  const formatPrice = (amount, currency) => {
    if (!amount) return "";
    const symbol = getCurrencySymbol(currency);
    if (currency?.toLowerCase() === "pkr") {
      return `${symbol}${amount.toLocaleString()}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
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
            {filteredQuotes.map((item) => {
              const statusColors = getStatusColor(item.status);
              return (
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
                      {/* Status badge */}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors.bg} ${statusColors.text} ring-1`}>
                        {formatStatusLabel(item.status)}
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

                    {/* Pricing display (if set) */}
                    {item.pricing && (
                      <div className="mt-2 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">Price:</span>
                        <span className="font-semibold text-gray-800">
                          {formatPrice(item.pricing.totalAmount, item.pricing.currency)}
                        </span>
                        {item.pricing.paymentType === "upfront" && (
                          <span className="text-xs text-gray-500">
                            (50% upfront: {formatPrice(item.pricing.upfrontAmount, item.pricing.currency)})
                          </span>
                        )}
                      </div>
                    )}

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                    {/* Pricing button */}
                    <button
                      onClick={() => handleSetPricing(item)}
                      title="Set Pricing & Send Quote"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                    >
                      <span className="text-sm font-bold">$</span>
                    </button>

                    {/* Payment button - only shows when pricing is set */}
                    {item.pricing && (
                      <button
                        onClick={() => simulateClientPayment(item)}
                        title="Open Payment for Client"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                      >
                        <span className="text-sm font-bold">💳</span>
                      </button>
                    )}

                    {/* Mark as paid (if partially paid) */}
                    {item.status === "partially_paid" && (
                      <button
                        onClick={() => updateQuoteStatus(item._id, "paid")}
                        title="Mark as Fully Paid"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
                      >
                        <span className="text-sm">✓</span>
                      </button>
                    )}

                    {/* Mark as completed (if paid) */}
                    {item.status === "paid" && (
                      <button
                        onClick={() => updateQuoteStatus(item._id, "completed")}
                        title="Mark as Completed"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
                      >
                        <span className="text-sm">✓</span>
                      </button>
                    )}

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${item.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat on WhatsApp"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                    >
                      <FaWhatsapp className="text-base" />
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${item.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Send Email"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                    >
                      <TfiEmail className="text-base" />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      title="Delete quote"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    >
                      <MdDeleteOutline className="text-lg" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          PRICING MODAL - Admin sets price for a quote
          Shows when admin clicks the "$" button on a quote
          ==================================================================== */}
      {showPricingModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Set Quote Pricing</h3>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Client info summary */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="font-semibold text-gray-800">{selectedQuote.name}</p>
              <p className="text-sm text-gray-500">{selectedQuote.email}</p>
              <p className="text-sm text-gray-500">{selectedQuote.service}</p>
            </div>

            <form onSubmit={submitPricing}>
              {/* Amount input */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="number"
                  value={pricingForm.amount}
                  onChange={(e) => setPricingForm({ ...pricingForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Currency selection */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={pricingForm.currency}
                  onChange={(e) => setPricingForm({ ...pricingForm, currency: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="pkr">PKR</option>
                </select>
              </div>

              {/* Payment type selection */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      value="upfront"
                      checked={pricingForm.paymentType === "upfront"}
                      onChange={() => setPricingForm({ ...pricingForm, paymentType: "upfront" })}
                      className="text-indigo-600"
                    />
                    <span className="text-sm">50% Upfront (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={pricingForm.paymentType === "full"}
                      onChange={() => setPricingForm({ ...pricingForm, paymentType: "full" })}
                      className="text-indigo-600"
                    />
                    <span className="text-sm">Full Payment</span>
                  </label>
                </div>
                {pricingForm.paymentType === "upfront" && pricingForm.amount && (
                  <p className="mt-2 text-sm text-blue-600">
                    Client will pay {getCurrencySymbol(pricingForm.currency)}
                    {(parseFloat(pricingForm.amount) * 0.5).toFixed(2)} upfront
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                id="send-quote-btn"
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition"
              >
                Send Quote to Client
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          DELETE CONFIRMATION MODAL
          Replaces browser's ugly window.confirm()
          ==================================================================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl transform transition-all">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Quote?</h3>
              <p className="text-gray-500 mb-6">
                This action cannot be undone. The quote will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Quotes;
