/* ========================================================================
   QUOTE SERVICE - Handles quote operations with payment integration
   ========================================================================
   Purpose: Manages quote CRUD operations and integrates with payment system

   Flow:
   1. New quote submitted → stored in database
   2. Admin reviews quote → can accept/decline/send pricing
   3. If accepted with price → payment modal triggers for client
   4. Payment completed → quote status updates

   Backend API Endpoints Used:
   - GET /api/quotes - Fetch all quotes
   - POST /api/quotes - Create new quote
   - PUT /api/quotes/:id - Update quote (status, price)
   - DELETE /api/quotes/:id - Delete quote

   Payment Flow:
   - Admin sets price for quote
   - Client receives email with quote and payment link
   - Client clicks payment link → payment modal opens
   - Client pays → quote status updates to "paid"
   ======================================================================== */

import axios from "axios";

// Base URL configuration for API calls
const getBaseUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ========================================================================
   Function: fetchQuotes
   Purpose: Retrieves all quotes from the server
   Returns: Array of quote objects
   Usage: Admin dashboard quote list
   ======================================================================== */
export const fetchQuotes = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/quotes`, {
      withCredentials: true, // Include cookies for auth
    });
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch quotes",
    };
  }
};

/* ========================================================================
   Function: createQuote
   Purpose: Creates a new quote from client submission
   Parameters:
     - quoteData: { name, email, phone, service, description }
   Returns: Created quote object
   Usage: When client submits quote form on website
   ======================================================================== */
export const createQuote = async (quoteData) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/quotes`,
      quoteData,
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating quote:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create quote",
    };
  }
};

/* ========================================================================
   Function: updateQuoteStatus
   Purpose: Updates quote status (pending, pricing_sent, accepted, declined, paid)
   Parameters:
     - quoteId: ID of the quote to update
     - status: New status string
     - pricing: Optional pricing details { amount, currency, paymentType }
   Returns: Updated quote object
   Usage: Admin actions in dashboard
   ======================================================================== */
export const updateQuoteStatus = async (quoteId, status, pricing = null) => {
  try {
    const updateData = {
      status,
      ...(pricing && {
        // Include pricing details if provided
        pricing: {
          amount: pricing.amount,
          currency: pricing.currency,
          paymentType: pricing.paymentType, // 'upfront' (50%) or 'full' (100%)
          upfrontAmount: pricing.paymentType === "upfront" ? pricing.amount * 0.5 : pricing.amount,
          totalAmount: pricing.amount,
        },
      }),
      // Add timestamp for status change
      statusUpdatedAt: new Date().toISOString(),
    };

    const response = await axios.put(
      `${getBaseUrl()}/api/quotes/${quoteId}`,
      updateData,
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating quote:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update quote",
    };
  }
};

/* ========================================================================
   Function: sendQuoteToClient
   Purpose: Sends quote with pricing to client via email
   Parameters:
     - quoteId: ID of the quote
     - pricing: { amount, currency, paymentType }
   Returns: Success status
   Usage: Admin clicks "Send Quote" button
   ======================================================================== */
export const sendQuoteToClient = async (quoteId, pricing) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/quotes/${quoteId}/send`,
      { pricing },
      { withCredentials: true }
    );
    return {
      success: true,
      message: "Quote sent to client successfully",
    };
  } catch (error) {
    console.error("Error sending quote:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send quote",
    };
  }
};

/* ========================================================================
   Function: deleteQuote
   Purpose: Deletes a quote
   Parameters:
     - quoteId: ID of the quote to delete
   Returns: Success status
   Usage: Admin clicks delete button
   ======================================================================== */
export const deleteQuote = async (quoteId) => {
  try {
    await axios.delete(`${getBaseUrl()}/api/quotes/${quoteId}`, {
      withCredentials: true,
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting quote:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete quote",
    };
  }
};

/* ========================================================================
   Function: recordPayment
   Purpose: Records payment against a quote (called after successful payment)
   Parameters:
     - quoteId: ID of the quote
     - paymentDetails: { paymentId, amount, currency, type }
   Returns: Updated quote object
   Usage: After Stripe payment succeeds
   ======================================================================== */
export const recordPayment = async (quoteId, paymentDetails) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/quotes/${quoteId}/payment`,
      {
        paymentId: paymentDetails.paymentId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        paymentType: paymentDetails.type, // 'upfront' or 'full'
        paidAt: new Date().toISOString(),
      },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error recording payment:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to record payment",
    };
  }
};

/* ========================================================================
   QUOTE STATUS CONSTANTS
   These are the possible states a quote can be in throughout its lifecycle
   ======================================================================== */
export const QUOTE_STATUS = {
  PENDING: "pending", // Initial state when client submits quote
  PRICING_SENT: "pricing_sent", // Admin has sent pricing to client
  ACCEPTED: "accepted", // Client accepted the quote
  DECLINED: "declined", // Client declined or admin declined
  PAYMENT_PENDING: "payment_pending", // Waiting for payment
  PARTIALLY_PAID: "partially_paid", // 50% upfront payment received
  PAID: "paid", // Full payment received
  COMPLETED: "completed", // Project work completed
  CANCELLED: "cancelled", // Quote cancelled
};

/* ========================================================================
   Function: getStatusColor
   Purpose: Returns Tailwind color classes based on quote status
   Parameters:
     - status: Quote status string
   Returns: Object with bgColor and textColor classes
   Usage: Styling status badges in UI
   ======================================================================== */
export const getStatusColor = (status) => {
  const statusColors = {
    [QUOTE_STATUS.PENDING]: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      ring: "ring-gray-200",
    },
    [QUOTE_STATUS.PRICING_SENT]: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      ring: "ring-blue-200",
    },
    [QUOTE_STATUS.ACCEPTED]: {
      bg: "bg-green-100",
      text: "text-green-700",
      ring: "ring-green-200",
    },
    [QUOTE_STATUS.DECLINED]: {
      bg: "bg-red-100",
      text: "text-red-700",
      ring: "ring-red-200",
    },
    [QUOTE_STATUS.PAYMENT_PENDING]: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      ring: "ring-yellow-200",
    },
    [QUOTE_STATUS.PARTIALLY_PAID]: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
    },
    [QUOTE_STATUS.PAID]: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
    },
    [QUOTE_STATUS.COMPLETED]: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      ring: "ring-purple-200",
    },
    [QUOTE_STATUS.CANCELLED]: {
      bg: "bg-gray-100",
      text: "text-gray-500",
      ring: "ring-gray-200",
    },
  };

  return statusColors[status] || statusColors[QUOTE_STATUS.PENDING];
};

/* ========================================================================
   Function: formatStatusLabel
   Purpose: Formats status string for display (e.g., "partially_paid" → "Partially Paid")
   ======================================================================== */
export const formatStatusLabel = (status) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default {
  fetchQuotes,
  createQuote,
  updateQuoteStatus,
  sendQuoteToClient,
  deleteQuote,
  recordPayment,
  QUOTE_STATUS,
  getStatusColor,
  formatStatusLabel,
};