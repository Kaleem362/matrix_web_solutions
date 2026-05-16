import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./Context/store";
import { useStore } from "./Context/UseStore";
import { Analytics } from "@vercel/analytics/react";
import { PaymentProvider } from "./Context/PaymentContext";
import { AdProvider } from "./Context/AdContext";

/* ========================================================================
   APP WRAPPER STRUCTURE:
   1. ContextProvider - Provides global state (theme, currency, user data)
   2. PaymentProvider - Provides payment functionality (Stripe integration)
   3. AdProvider - Provides advertisements for public website
   4. App - Main application component
   5. Analytics - Vercel analytics for tracking

   PAYMENT FLOW:
   - PaymentProvider wraps App so PaymentModal can be accessed globally
   - QuoteModal triggers payment after client accepts quote
   - PaymentModal displays Stripe form for collecting card details

   ADS FLOW:
   - AdProvider fetches active ads from server
   - Ads display on public website in various positions
   - Views and clicks are tracked automatically
   ======================================================================== */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider store={useStore}>
    {/* PaymentProvider enables payment modal across the entire app */}
    <PaymentProvider>
      {/* AdProvider fetches and displays ads on public website */}
      <AdProvider>
        <App />
        <Analytics />
      </AdProvider>
    </PaymentProvider>
  </ContextProvider>
);
