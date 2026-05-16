/* ========================================================================
   PAYMENT CONTEXT - Manages payment state and Stripe configuration
   ========================================================================
   This context provides:
   - Stripe initialization
   - Payment modal visibility
   - Payment amount and project details
   - Payment status tracking (pending, success, failed)

   Key flows:
   1. Client accepts quote → Payment modal opens
   2. Client completes payment → Status updates to success
   3. Admin can view payment status in dashboard
   ======================================================================== */

import React, { createContext, useState, useContext } from "react";

// Create the payment context
const PaymentContext = createContext();

// Stripe publishable key - Replace with your actual key from Stripe Dashboard
// Get it from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY";

/* ========================================================================
   Payment Provider Component
   Wraps the app to provide payment functionality throughout
   ======================================================================== */
export const PaymentProvider = ({ children }) => {
  // Modal visibility state - controls when payment modal appears
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Payment details state - stores project and payment information
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0, // Amount to charge (in cents for Stripe)
    currency: "usd", // Currency code (usd, eur, pkr)
    projectName: "", // Name of the service/project
    clientName: "", // Client's name
    clientEmail: "", // Client's email for receipt
    quoteId: null, // Reference to the accepted quote
    paymentType: "upfront", // 'upfront' (50%) or 'full' (100%)
    totalAmount: 0, // Total project cost
  });

  // Payment status state - tracks current payment state
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
  const [paymentError, setPaymentError] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  /* ========================================================================
     Function: openPaymentModal
     Purpose: Opens the payment modal with project details
     Parameters:
       - details: Object containing amount, projectName, clientName, etc.
     Usage: Called when client accepts a quote
     ======================================================================== */
  const openPaymentModal = (details) => {
    setPaymentDetails(details);
    setIsPaymentModalOpen(true);
    setPaymentStatus("idle");
    setPaymentError(null);
  };

  /* ========================================================================
     Function: closePaymentModal
     Purpose: Closes the payment modal
     Usage: Called after payment completes or user cancels
     ======================================================================== */
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    // Don't clear payment details immediately - needed for receipt display
  };

  /* ========================================================================
     Function: updatePaymentStatus
     Purpose: Updates the payment status throughout the flow
     Parameters:
       - status: 'idle' | 'processing' | 'success' | 'failed'
       - error: Optional error message if failed
     ======================================================================== */
  const updatePaymentStatus = (status, error = null) => {
    setPaymentStatus(status);
    setPaymentError(error);
  };

  /* ========================================================================
     Function: setPaymentReceipt
     Purpose: Stores payment receipt data after successful payment
     Parameters:
       - receipt: Object with payment details from Stripe
     ======================================================================== */
  const setReceipt = (receipt) => {
    setPaymentReceipt(receipt);
  };

  /* ========================================================================
     Function: clearPaymentData
     Purpose: Resets all payment data after transaction completes
     Usage: Called after showing receipt or when starting new payment
     ======================================================================== */
  const clearPaymentData = () => {
    setPaymentDetails({
      amount: 0,
      currency: "usd",
      projectName: "",
      clientName: "",
      clientEmail: "",
      quoteId: null,
      paymentType: "upfront",
      totalAmount: 0,
    });
    setPaymentStatus("idle");
    setPaymentError(null);
    setPaymentReceipt(null);
  };

  // Context value - exposes all payment functions to components
  const value = {
    isPaymentModalOpen,
    paymentDetails,
    paymentStatus,
    paymentError,
    paymentReceipt,
    STRIPE_PUBLISHABLE_KEY,
    openPaymentModal,
    closePaymentModal,
    updatePaymentStatus,
    setReceipt,
    clearPaymentData,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

/* ========================================================================
   Custom Hook: usePayment
   Purpose: Easy access to payment context in any component
   Usage: const { openPaymentModal } = usePayment();
   ======================================================================== */
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export default PaymentContext;