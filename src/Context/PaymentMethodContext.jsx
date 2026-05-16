/* ========================================================================
   PAYMENT METHOD CONTEXT - Manages different payment options
   ========================================================================
   Purpose: Provides support for multiple payment methods
   - Credit/Debit Card (Stripe)
   - PayPal
   - Bank Transfer
   - Easypaisa
   - Payoneer
   - JazzCash

   This allows clients worldwide to pay using their preferred method
   ======================================================================== */

import React, { createContext, useState, useContext } from "react";

const PaymentMethodContext = createContext();

// Business payment details - UPDATE WITH YOUR ACTUAL DETAILS
export const PAYMENT_DETAILS = {
  // Bank Transfer Details
  bank: {
    bankName: "Bank of Punjab (BOP)",
    accountTitle: "KALEEM ULLAH",
    accountNumber: "6300358992100017",
    iban: "PK77BPUN6300358992100017",
    swiftCode: "BPUNPKKAXXX",
    branchCode: "277",
    instructions: "Use the above details to make a bank transfer and share the receipt",
  },

  // Easypaisa Details
  easypaisa: {
    merchantName: "KALEEM ULLAH",
    accountNumber: "0348 5427362",
    instructions: "Send payment to this number and screenshot the receipt",
  },
  // Payoneer Details
  payoneer: {
    email: "yourname@payoneer.com",
    instructions: "Send payment to my Payoneer account",
  },
};

/* ========================================================================
   Helper function: getPaymentMethodDetails
   Returns details for a specific payment method
   ======================================================================== */
export const getPaymentMethodDetails = (method) => {
  const methods = {
    stripe: {
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Pay securely with any Visa, Mastercard, or Amex",
      isOnline: true,
    },
    paypal: {
      name: "PayPal",
      icon: "🅿️",
      description: "Pay using your PayPal account",
      isOnline: true,
    },
    bank: {
      name: "Bank Transfer",
      icon: "🏦",
      description: "Transfer directly to our bank account",
      isOnline: false,
    },
    easypaisa: {
      name: "Easypaisa",
      icon: "📱",
      description: "Send payment via Easypaisa mobile wallet",
      isOnline: false,
    },
    jazzcash: {
      name: "JazzCash",
      icon: "📲",
      description: "Send payment via JazzCash app",
      isOnline: false,
    },
    payoneer: {
      name: "Payoneer",
      icon: "💵",
      description: "Pay using your Payoneer account (International)",
      isOnline: true,
    },
  };

  return methods[method] || methods.stripe;
};

/* ========================================================================
   Helper function: formatAmount
   Formats amount based on currency
   ======================================================================== */
export const formatPaymentAmount = (amount, currency) => {
  const currencyLower = currency?.toLowerCase();

  if (currencyLower === "pkr") {
    return `${amount.toLocaleString()} PKR`;
  } else if (currencyLower === "eur") {
    return `€${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
};

export default PaymentMethodContext;