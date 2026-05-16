# Matrix Web Solutions - Payment & Project Booking System

## Overview

This document explains the complete payment system and project booking flow for Matrix Web Solutions website. It covers how clients book projects, how payments are processed, and the entire lifecycle from quote request to project completion.

---

## Table of Contents

1. [Payment Strategy](#payment-strategy)
2. [Project Booking Flow](#project-booking-flow)
3. [Free vs Paid Services](#free-vs-paid-services)
4. [Payment Flow Diagram](#payment-flow-diagram)
5. [Currency Configuration](#currency-configuration)
6. [Stripe Integration](#stripe-integration)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [Client Experience](#client-experience)
9. [Technical Implementation](#technical-implementation)
10. [Setup Instructions](#setup-instructions)

---

## Payment Strategy

### Our Chosen Approach: 50% Upfront, 50% on Delivery

**Why this approach?**
- Shows client commitment before starting work
- Protects us from non-paying clients
- Gives leverage if scope changes mid-project
- Industry standard that clients expect
- Balances risk between both parties

**Breakdown:**
| Stage | Amount | When |
|-------|--------|------|
| Project Start | 50% | Before any work begins |
| Project Delivery | 50% | Before final files/deliverables |

### Alternative Approaches (Not Used)

| Approach | When | Risk Level | Notes |
|----------|------|------------|-------|
| Full Payment Upfront | 100% before start | Low for us | May scare clients away |
| Payment on Delivery | 100% after completion | High risk | Client could ghost |
| Monthly Installments | Spread over time | Medium | Good for large projects |

---

## Project Booking Flow

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PROJECT BOOKING FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENT SIDE                          ADMIN SIDE                         STATUS
─────────────────────────────────    ─────────────────────────────────────────
1. Client visits website
   │
   ├─→ 2. Fills Quote Form
   │      (Name, Email, Phone, Service, Description)
   │      → FREE: No payment required
   │
   │                       3. Admin receives notification
   │                          (Real-time via Socket.io)
   │
   │                       4. Admin reviews quote
   │                          (Contact client via WhatsApp/Email)
   │
   │                       5. Admin sets pricing
   │                          (Amount, Currency, Payment Type)
   │
   │                       6. Admin sends quote to client
   │                          (Email with payment link)
   │
   └─→ 7. Client receives email
           with quote details
           and payment link
           │
           ├─→ 8. Client clicks payment link
           │       → Payment Modal opens
           │       → Client pays 50% upfront
           │       → Payment confirmed
           │
           │                       9. Admin sees payment
           │                          (Quote status: "Partially Paid")
           │
           │                       10. Admin starts project work
           │
           │                       11. Admin delivers partial work
           │                          (if milestone-based)
           │
           │                       12. Admin delivers final work
           │
           └─→ 13. Client pays remaining 50%
                   → Payment confirmed
                   → Quote status: "Paid"

                                    14. Admin marks project "Completed"
                                        → Files/deliverables released

PROJECT COMPLETE ✓
```

---

## Free vs Paid Services

### What Is Free (For Clients)

| Service | Cost to Client | Why Free? |
|---------|----------------|-----------|
| **Initial Consultation** | FREE | Understand client needs |
| **Quote/Proposal** | FREE | Shows value, builds trust |
| **Small Mockups/Demos** | FREE | Win client confidence |

### What Is Paid (For Clients)

| Service | Payment Required | Amount |
|---------|------------------|--------|
| **Full Design Work** | 50% upfront | Based on quote |
| **Development** | 50% upfront | Based on quote |
| **Deliverables** | 50% upfront | Based on quote |
| **Revisions** | 50% upfront | Based on scope |

### Why This Balance Works

1. **Free consultation** → Client feels heard, you understand the project
2. **Free quote** → Client can compare prices without pressure
3. **Paid work** → You don't work for free
4. **50% upfront** → Shows client commitment, covers initial costs

---

## Payment Flow Diagram

### Complete Payment Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        PAYMENT LIFECYCLE                                    │
└────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   QUOTE SUBMITTED │
                    │     (Pending)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  ADMIN SETS      │
                    │  PRICING         │
                    │  (Amount/Currency│
                    │   Payment Type)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  QUOTE SENT TO   │
                    │  CLIENT          │
                    │  (Pricing Sent)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  CLIENT CLICKS   │
                    │  PAYMENT LINK    │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────────────────────────┐
                    │     PAYMENT MODAL OPENS             │
                    │                                      │
                    │  ┌────────────────────────────┐    │
                    │  │   Project: [Service Name]  │    │
                    │  │   Total: $XXX              │    │
                    │  │   ─────────────────────   │    │
                    │  │   PAY 50% NOW: $XX        │    │
                    │  │   [Card Details Form]     │    │
                    │  │   [Pay Now Button]         │    │
                    │  └────────────────────────────┘    │
                    └────────┬────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼─────────┐        ┌─────────▼────────┐
     │  PAYMENT SUCCESS  │        │  PAYMENT FAILED  │
     │  (Card Accepted)  │        │  (Card Declined) │
     └────────┬─────────┘        └─────────┬────────┘
              │                             │
    ┌─────────▼─────────┐        ┌─────────▼────────┐
    │  STATUS: PARTIALLY│        │  RETRY PAYMENT    │
    │  PAID (50%)        │        │  (Client tries   │
    └─────────┬─────────┘        │   again)         │
              │                  └───────────────────┘
    ┌─────────▼─────────┐
    │  ADMIN NOTIFIED   │
    │  (Email + Dashboard│
    │   updated)        │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │  ADMIN STARTS     │
    │  PROJECT WORK     │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │  ADMIN DELIVERS   │
    │  FINAL WORK       │
    └─────────┬─────────┘
              │
    ┌─────────▼────────────────────────────┐
    │  CLIENT PAYS REMAINING 50%           │
    │  (Second Payment Modal)              │
    └─────────┬────────────────────────────┘
              │
    ┌─────────▼─────────┐
    │  STATUS: PAID     │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │  ADMIN MARKS      │
    │  PROJECT COMPLETE │
    │  → Files released │
    │  → Client happy   │
    └───────────────────┘
```

---

## Currency Configuration

### Geolocation-Based Currency Detection

The system automatically detects user's location and shows prices in their local currency.

### Supported Currencies

| Region | Currency | Symbol | Detection Method |
|--------|----------|--------|------------------|
| Pakistan | PKR | ₨ | Timezone (Asia/Karachi) + Browser Language |
| European Countries | EUR | € | IP Geolocation (ipapi.co / ip-api.com) |
| Rest of World | USD | $ | Default fallback |

### European Countries (EUR)

Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, United Kingdom

### Currency Conversion

| From USD | To PKR | To EUR |
|----------|--------|--------|
| $1 | ₨280 | €0.92 |

---

## Payment Methods Supported

We've implemented multiple payment methods so clients worldwide can pay easily:

### Available Payment Options

| Method | Icon | Description | Best For |
|--------|------|-------------|----------|
| **Credit/Debit Card** | 💳 | Stripe - All major cards | International clients |
| **PayPal** | 🅿️ | PayPal account | International clients |
| **Bank Transfer** | 🏦 | Direct bank transfer | Large payments |
| **Easypaisa** | 📱 | Mobile wallet | Pakistani clients |
| **JazzCash** | 📲 | Mobile wallet | Pakistani clients |
| **Payoneer** | 💵 | International payments | Freelancers & agencies |

### How Client Payment Works

```
Payment Modal Opens
       ↓
Client selects payment method (6 options shown)
       ↓
    ┌────┴────┐
    ↓         ↓
Online    Offline
(Card,    (Bank,
PayPal)   Wallet)
    ↓         ↓
Payment   Client sends
confirms  screenshot/receipt
    ↓         ↓
 Admin confirms
```

---

## Stripe Integration

### What is Stripe?

Stripe is a payment processor that:
- Handles credit/debit card transactions securely
- Provides PCI-compliant payment forms
- Transfers money directly to your bank account
- Offers fraud protection

### How It Works

```
┌──────────┐          ┌─────────┐          ┌───────────┐          ┌──────────┐
│  CLIENT  │ ───────→ │  YOUR   │ ───────→ │   STRIPE  │ ───────→ │   YOUR   │
│  BROWSER │          │  WEBSITE │          │   SERVER  │          │   BANK   │
└──────────┘          └─────────┘          └───────────┘          └──────────┘
     │                    │                    │                     │
     │  1. Click Pay      │                    │                     │
     │───────────────────→│                    │                     │
     │                    │  2. Create Payment│                     │
     │                    │     Intent         │                     │
     │                    │───────────────────→│                     │
     │                    │                    │  3. Process Card    │
     │                    │                    │←─────────────────────│
     │                    │  4. Confirm        │                     │
     │                    │←───────────────────│                     │
     │  5. Payment Done   │                    │  6. Transfer Funds  │
     │←───────────────────│                    │←─────────────────────│
```

### Stripe Setup Steps

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com
   - Sign up for free
   - Verify your email

2. **Get API Keys**
   - Navigate to Developers → API Keys
   - Copy your Publishable Key (pk_test_...)
   - Copy your Secret Key (sk_test_...) for backend

3. **Add Keys to Your App**
   ```javascript
   // Replace in PaymentContext.jsx
   const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_KEY_HERE";
   ```

4. **Test Mode vs Live Mode**
   - Use test keys (pk_test_...) during development
   - Switch to live keys (pk_live_...) when ready to accept real payments

---

## Admin Dashboard Features

### Quote Management Panel

**Location:** `/admin/quotes`

**Features:**
1. **View All Quotes**
   - Client name, email, phone
   - Service requested
   - Project description
   - Timestamp

2. **Status Tracking**
   - Pending (new submission)
   - Pricing Sent (quote sent to client)
   - Partially Paid (50% received)
   - Paid (100% received)
   - Completed (project done)

3. **Pricing Actions**
   - Set amount in USD/EUR/PKR
   - Choose payment type (50% upfront or full)
   - Send quote to client via email

4. **Payment Actions**
   - View payment status
   - Mark as partially paid
   - Mark as fully paid
   - Mark as completed

### New Admin Buttons

| Button | Icon | Color | Action |
|--------|------|-------|--------|
| Set Pricing | $ | Blue | Opens pricing modal |
| Simulate Payment | € | Green | Opens payment modal (testing) |
| Mark Paid | ✓ | Emerald | Updates status to "Paid" |
| Mark Complete | ✓ | Purple | Updates status to "Completed" |

---

## Client Experience

### Step 1: Submit Quote (Free)

```
┌─────────────────────────────────────────┐
│           GET A FREE QUOTE              │
│                                         │
│  Name: [________________]                │
│  Email: [________________]              │
│  Phone: [________________]               │
│  Service: [Select Service ▼]            │
│  Description: [___________________]     │
│                                         │
│  [SUBMIT QUOTE REQUEST]                 │
│                                         │
│  OR                                     │
│                                         │
│  [WhatsApp Us] 📱                       │
└─────────────────────────────────────────┘
```

### Step 2: Receive Quote via Email

```
Subject: Your Quote from Matrix Web Solutions

Hi [Client Name],

Thank you for your interest in [Service Name]!

Here's your quote:

Project: [Service Name]
Total Cost: $XXX USD
Payment: 50% upfront ($XX) + 50% on delivery ($XX)

To proceed, click the payment link below:
[PAY NOW - $XX]

Best regards,
Matrix Web Solutions
```

### Step 3: Payment Modal

```
┌─────────────────────────────────────────┐
│         COMPLETE PAYMENT            ✕   │
│         Secure payment via Stripe       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Project: Website Development   │    │
│  │ Payment Type: 50% Upfront      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Amount to Pay: $175.00 USD     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Card Number                     │    │
│  │ [____ ____ ____ ____]           │    │
│  │                                 │    │
│  │ Expiry     CVV                  │    │
│  │ [__/__]    [___]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🔒 Your payment is secured by Stripe  │
│                                         │
│  [        PAY $175.00 USD        ]     │
│                                         │
│  Powered by Stripe                      │
└─────────────────────────────────────────┘
```

### Step 4: Payment Success

```
┌─────────────────────────────────────────┐
│                                         │
│           ✓ Payment Successful!         │
│                                         │
│  Your payment has been processed.       │
│  You'll receive a receipt via email.   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Receipt ID: pi_xxx123           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [            DONE             ]        │
│                                         │
└─────────────────────────────────────────┘
```

---

## Technical Implementation

### File Structure

```
src/
├── Components/
│   └── PaymentModal.jsx          # Stripe payment form modal
│
├── Context/
│   ├── store.jsx                 # Main app context (existing)
│   └── PaymentContext.jsx       # Payment state management (new)
│
├── Admin/
│   ├── Components/
│   │   └── Quotes.jsx           # Admin quote management (updated)
│   │
│   └── services/
│       └── quoteService.js       # Quote API service (new)
│
├── main.jsx                      # App entry point (updated)
└── App.jsx                       # Routes (updated)
```

### Key Components

#### 1. PaymentContext.jsx
- Manages payment modal state
- Stores payment details (amount, currency, client info)
- Provides `openPaymentModal()` function
- Handles payment status tracking

#### 2. PaymentModal.jsx
- Displays Stripe card form
- Handles payment submission
- Shows success/error states
- Matches existing modal styling

#### 3. Quotes.jsx (Admin)
- Displays all quotes
- Admin can set pricing
- Admin can trigger payment modal for testing
- Status badges show payment state

#### 4. quoteService.js
- API calls for quote management
- Payment recording functions
- Status constants

### Important Functions

```javascript
// Open payment modal from anywhere
import { usePayment } from './Context/PaymentContext';

const { openPaymentModal } = usePayment();

openPaymentModal({
  amount: 175,           // Amount to charge
  totalAmount: 350,      // Total project cost
  currency: "usd",       // usd, eur, or pkr
  projectName: "Website Development",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  quoteId: "quote_123",
  paymentType: "upfront", // or "full"
});
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Get Stripe Keys

1. Create account at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy publishable key

### 3. Update PaymentContext.jsx

Replace the placeholder key:
```javascript
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_KEY_HERE";
```

### 4. Update PaymentModal.jsx

Replace the Stripe initialization:
```javascript
const stripePromise = loadStripe("pk_test_YOUR_KEY_HERE");
```

### 5. Backend Requirements

For production, you need a backend that:
1. Creates Stripe Payment Intents
2. Handles webhook callbacks
3. Updates quote status after payment

Example backend endpoint:
```
POST /api/create-payment-intent
Body: { amount, currency, clientEmail, projectName }
Response: { clientSecret }
```

### 6. Connect Frontend to Backend

In PaymentModal.jsx, uncomment the backend call section:
```javascript
// Call your backend to create payment intent
const response = await fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: calculateAmount(),
    currency: paymentDetails.currency,
    clientEmail: paymentDetails.clientEmail,
    projectName: paymentDetails.projectName,
  }),
});
const data = await response.json();
setClientSecret(data.clientSecret);
```

---

## Quote Status Guide

| Status | Meaning | Next Action |
|--------|---------|-------------|
| `pending` | New quote, no pricing | Admin sets pricing |
| `pricing_sent` | Quote sent to client | Client pays |
| `accepted` | Client accepted quote | Awaiting payment |
| `payment_pending` | Waiting for payment | Client pays |
| `partially_paid` | 50% received | Admin works, collect rest |
| `paid` | 100% received | Admin completes work |
| `completed` | Project done | Admin delivers files |
| `declined` | Client/Admin declined | Close quote |
| `cancelled` | Quote cancelled | Archive quote |

---

## Testing the Payment System

### Test Card Numbers (Stripe Test Mode)

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined card |
| 4000 0025 0000 3155 | 3D Secure required |

### Testing Flow

1. Set Stripe to Test Mode (developer toggle)
2. Use test card `4242 4242 4242 4242`
3. Enter any future expiry date
4. Enter any 3-digit CVV
5. Payment will succeed (test mode)

---

## Common Issues & Solutions

### Payment Modal Not Opening
- Check if PaymentProvider wraps the app in main.jsx
- Verify usePayment hook is imported correctly

### Stripe Not Loading
- Check internet connection
- Verify Stripe.js is installed: `npm list @stripe/stripe-js`
- Check browser console for errors

### Payment Failing
- Use test card numbers (not real cards in test mode)
- Check Stripe dashboard for error details
- Verify API keys are correct

### Currency Not Detected
- Check geolocation API is working
- Verify Europe countries list is complete
- Test with VPN set to European location

---

## Next Steps

1. **Set up Stripe account** and get API keys
2. **Update PaymentContext.jsx** with your publishable key
3. **Update PaymentModal.jsx** with your publishable key
4. **Create backend endpoints** for PaymentIntent creation
5. **Test the full flow** with Stripe test cards
6. **Switch to live mode** when ready for real payments

---

## Support

For questions about this payment system:
- Check Stripe documentation: https://stripe.com/docs
- Review this README for implementation details
- Contact development team for integration help

---

*Document Version: 1.0*
*Last Updated: May 2026*
*Matrix Web Solutions*