/* ========================================================================
   PAYMENT MODAL COMPONENT - Multiple Payment Methods
   ========================================================================
   Purpose: Displays payment form with multiple payment options

   Supported Methods:
   - Credit/Debit Card (Stripe)
   - PayPal
   - Bank Transfer
   - Easypaisa
   - JazzCash
   - Payoneer

   Flow:
   1. Modal opens with project details and amount
   2. Client selects payment method
   3. Payment instructions shown based on method
   4. Client completes payment (online or sends screenshot)
   ======================================================================== */

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { usePayment } from "../src/Context/PaymentContext";
import { StoreContext } from "../src/Context/store";
import {
  PAYMENT_DETAILS,
  getPaymentMethodDetails,
  formatPaymentAmount,
} from "../src/Context/PaymentMethodContext";

// Initialize Stripe with publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLISHABLE_KEY");

/* ========================================================================
   CardInput Component - Stripe card element
   ======================================================================== */
const CardInput = ({ onCardChange, error }) => {
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="mt-4">
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <CardElement options={cardStyle} onChange={onCardChange} />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your payment is secured by Stripe (SSL encrypted)</span>
      </div>
    </div>
  );
};

/* ========================================================================
   StripePaymentForm Component - For card payments
   ======================================================================== */
const StripePaymentForm = () => {
  const { paymentDetails, updatePaymentStatus, setReceipt } = usePayment();

  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateAmount = () => {
    if (paymentDetails.paymentType === "upfront") {
      return Math.round(paymentDetails.totalAmount * 0.5 * 100);
    }
    return Math.round(paymentDetails.amount * 100);
  };

  const displayAmount = () => {
    const amount = paymentDetails.paymentType === "upfront"
      ? paymentDetails.totalAmount * 0.5
      : paymentDetails.amount;
    return formatPaymentAmount(amount, paymentDetails.currency);
  };

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    if (!cardComplete) {
      setCardError("Please complete your card details");
      return;
    }

    setIsProcessing(true);
    updatePaymentStatus("processing");

    try {
      // Simulate payment for demo - replace with backend integration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Demo: Simulate success
      updatePaymentStatus("success");
      setReceipt({
        id: "pi_demo_" + Date.now(),
        amount: paymentDetails.paymentType === "upfront"
          ? paymentDetails.totalAmount * 0.5
          : paymentDetails.amount,
        status: "succeeded",
      });
    } catch (error) {
      console.error("Payment error:", error);
      updatePaymentStatus("failed", "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          {paymentDetails.projectName || "Project Payment"}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Payment Type:</span>
          <span className="font-medium">
            {paymentDetails.paymentType === "upfront" ? "50% Upfront" : "Full Payment"}
          </span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Amount to Pay:</span>
          <span className="text-2xl font-bold text-blue-600">{displayAmount()}</span>
        </div>
      </div>

      <CardInput onCardChange={handleCardChange} error={cardError} />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
          isProcessing || !stripe ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? "Processing..." : `Pay ${displayAmount()}`}
      </button>
    </form>
  );
};

/* ========================================================================
   BankTransfer Component - For bank transfers
   ======================================================================== */
const BankTransfer = ({ amount, currency }) => {
  const { bank } = PAYMENT_DETAILS;
  const displayAmount = formatPaymentAmount(
    amount.paymentType === "upfront" ? amount.totalAmount * 0.5 : amount.amount,
    amount.currency
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Amount to Pay:</span>
          <span className="text-xl font-bold text-blue-600">{displayAmount}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Send this amount to our bank account</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Bank Name:</span>
          <span className="font-semibold text-gray-800">{bank.bankName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account Title:</span>
          <span className="font-semibold text-gray-800">{bank.accountTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account Number:</span>
          <span className="font-mono font-semibold text-gray-800">{bank.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">IBAN:</span>
          <span className="font-mono text-sm text-gray-800">{bank.iban}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">SWIFT Code:</span>
          <span className="font-mono font-semibold text-gray-800">{bank.swiftCode}</span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800 font-semibold">Next Steps:</p>
        <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
          <li>Transfer {displayAmount} to the account above</li>
          <li>Take a screenshot of the transfer receipt</li>
          <li>Email the receipt to us with your project details</li>
          <li>We'll confirm payment within 24 hours</li>
        </ol>
      </div>

      <a
        href={`mailto:matrixwebsolutions@example.com?subject=Bank Transfer Payment - ${encodeURIComponent(amount.projectName || 'Project')}&body=Hi, I have made a bank transfer of ${displayAmount}. Please find the receipt attached.`}
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        Email Payment Receipt
      </a>
    </div>
  );
};

/* ========================================================================
   WalletPayment Component - For Easypaisa/JazzCash/Payoneer
   ======================================================================== */
const WalletPayment = ({ method, amount }) => {
  const details = PAYMENT_DETAILS[method];
  const methodInfo = getPaymentMethodDetails(method);

  const displayAmount = formatPaymentAmount(
    amount.paymentType === "upfront" ? amount.totalAmount * 0.5 : amount.amount,
    amount.currency
  );

  if (!details) return <div>Payment method not available</div>;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Amount to Pay:</span>
          <span className="text-xl font-bold text-blue-600">{displayAmount}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500">Account Number:</span>
          <span className="font-mono font-bold text-lg text-gray-800">{details.accountNumber || details.email}</span>
        </div>
        {details.merchantName && (
          <div className="flex justify-between">
            <span className="text-gray-500">Merchant:</span>
            <span className="font-semibold text-gray-800">{details.merchantName}</span>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800 font-semibold">How to Pay:</p>
        <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
          <li>Open your {methodInfo.name} app</li>
          <li>Send {displayAmount} to account: {details.accountNumber || details.email}</li>
          <li>Save the payment confirmation/screenshot</li>
          <li>Email us the payment proof</li>
        </ol>
      </div>

      <a
        href={`mailto:matrixwebsolutions@example.com?subject=${methodInfo.name} Payment - ${encodeURIComponent(amount.projectName || 'Project')}&body=Hi, I have made a payment of ${displayAmount} via ${methodInfo.name}. Please find the receipt attached.`}
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        Send Payment Proof
      </a>
    </div>
  );
};

/* ========================================================================
   Main PaymentModal Component
   ======================================================================== */
const PaymentModal = () => {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    paymentStatus,
    paymentError,
    paymentReceipt,
    clearPaymentData,
    paymentDetails,
    updatePaymentStatus,
  } = usePayment();
  const { close } = React.useContext(StoreContext);

  // Track selected payment method
  const [selectedMethod, setSelectedMethod] = useState("stripe");

  if (!isPaymentModalOpen) return null;

  const handleClose = () => {
    closePaymentModal();
    setTimeout(() => {
      clearPaymentData();
    }, 500);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && paymentStatus !== "processing") {
      handleClose();
    }
  };

  const displayAmount = () => {
    const amount = paymentDetails.paymentType === "upfront"
      ? paymentDetails.totalAmount * 0.5
      : paymentDetails.amount;
    return formatPaymentAmount(amount, paymentDetails.currency);
  };

  // Payment methods to display (PayPal removed - not available in Pakistan)
  const paymentMethods = [
    { id: "stripe", ...getPaymentMethodDetails("stripe") },
    { id: "bank", ...getPaymentMethodDetails("bank") },
    { id: "easypaisa", ...getPaymentMethodDetails("easypaisa") },
    { id: "jazzcash", ...getPaymentMethodDetails("jazzcash") },
    { id: "payoneer", ...getPaymentMethodDetails("payoneer") },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
            <p className="text-sm text-gray-500">Choose your payment method</p>
          </div>
          <button
            onClick={handleClose}
            disabled={paymentStatus === "processing"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src={close} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Success State */}
          {paymentStatus === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your payment has been processed. You'll receive a confirmation email.
              </p>
              {paymentReceipt && (
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                  <p className="text-sm text-gray-500">Receipt ID</p>
                  <p className="font-mono text-sm text-gray-800">{paymentReceipt.id}</p>
                </div>
              )}
              <button
                onClick={handleClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Failed State */}
          {paymentStatus === "failed" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h3>
              <p className="text-red-600 mb-4">{paymentError || "Something went wrong"}</p>
              <button
                onClick={() => updatePaymentStatus("idle")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Idle/Processing State */}
          {(paymentStatus === "idle" || paymentStatus === "processing") && (
            <>
              {/* Amount Display */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-blue-600">{displayAmount()}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <p className="font-semibold text-gray-800 text-sm mt-1">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Form Based on Method */}
              <div className="border-t border-gray-200 pt-6">
                {selectedMethod === "stripe" && (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm />
                  </Elements>
                )}
                {selectedMethod === "bank" && (
                  <BankTransfer amount={paymentDetails} />
                )}
                {selectedMethod === "easypaisa" && (
                  <WalletPayment method="easypaisa" amount={paymentDetails} />
                )}
                {selectedMethod === "jazzcash" && (
                  <WalletPayment method="jazzcash" amount={paymentDetails} />
                )}
                {selectedMethod === "payoneer" && (
                  <WalletPayment method="payoneer" amount={paymentDetails} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            For help, contact us via WhatsApp or Email
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;