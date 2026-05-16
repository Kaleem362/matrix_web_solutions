/* ========================================================================
   EMAIL SERVICE - Handles automatic email sending via EmailJS
   ========================================================================
   Setup Instructions:
   1. Go to https://www.emailjs.com/ and create free account
   2. Go to Email Services → Add Email Service (Gmail/Outlook/custom SMTP)
   3. Go to Email Templates → Create template for quote emails
   4. Get your: PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID
   5. Replace the values below

   Free Plan: 200 emails/month
   ======================================================================== */

import emailjs from "@emailjs/browser";

// EmailJS credentials - REPLACE WITH YOUR OWN
// Get these from: https://dashboard.emailjs.com/admin
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_PUBLIC_KEY_HERE",      // From: Account → API Keys
  SERVICE_ID: "YOUR_SERVICE_ID_HERE",      // From: Email Services
  TEMPLATE_ID: "YOUR_TEMPLATE_ID_HERE",    // From: Email Templates
};

/* ========================================================================
   Function: sendQuoteEmail
   Sends quote to client automatically
   Parameters:
     - clientEmail: Client's email address
     - clientName: Client's name
     - service: Service they're requesting
     - amount: Total quoted amount
     - currency: Currency (usd/eur/pkr)
     - paymentType: "upfront" or "full"
   Returns: Promise with success/error
   ======================================================================== */
export const sendQuoteEmail = async (clientEmail, clientName, service, amount, currency, paymentType) => {
  // Format currency display
  const currencySymbol = { usd: "$", eur: "€", pkr: "PKR " };
  const symbol = currencySymbol[currency?.toLowerCase()] || "$";
  const formatAmount = (amt) => currency === "pkr" ? amt.toLocaleString() : amt.toFixed(2);

  const totalAmount = parseFloat(amount);
  const upfrontAmount = paymentType === "upfront" ? totalAmount * 0.5 : totalAmount;

  // EmailJS template parameters (match your template variables)
  const templateParams = {
    to_email: clientEmail,
    to_name: clientName,
    service_name: service,
    total_amount: `${symbol}${formatAmount(totalAmount)} ${currency?.toUpperCase()}`,
    upfront_amount: `${symbol}${formatAmount(upfrontAmount)} ${currency?.toUpperCase()}`,
    payment_type: paymentType === "upfront" ? "50% Upfront + 50% on Delivery" : "Full Payment",
    company_name: "Matrix Web Solutions",
  };

  try {
    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log("Email sent successfully!", response);
    return { success: true, message: "Quote sent to client!" };
  } catch (error) {
    console.error("EmailJS Error:", error);
    return { success: false, message: "Failed to send email. Please try again." };
  }
};

/* ========================================================================
   Function: sendPaymentConfirmation
   Sends payment confirmation to client after successful payment
   ======================================================================== */
export const sendPaymentConfirmation = async (clientEmail, clientName, amount, currency, paymentId) => {
  const currencySymbol = { usd: "$", eur: "€", pkr: "PKR " };
  const symbol = currencySymbol[currency?.toLowerCase()] || "$";
  const formatAmount = (amt) => currency === "pkr" ? amt.toLocaleString() : amt.toFixed(2);

  const templateParams = {
    to_email: clientEmail,
    to_name: clientName,
    amount_paid: `${symbol}${formatAmount(amount)} ${currency?.toUpperCase()}`,
    payment_id: paymentId,
    company_name: "Matrix Web Solutions",
  };

  try {
    // Use a different template for payment confirmation
    // Or modify the existing one with payment confirmation
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return { success: true };
  } catch (error) {
    console.error("Payment confirmation email error:", error);
    return { success: false };
  }
};

export default {
  sendQuoteEmail,
  sendPaymentConfirmation,
  EMAILJS_CONFIG,
};