# Matrix Web Solutions - Project Context

## Project Overview

Client-facing website for a web development agency with admin dashboard for managing quotes, testimonials, and client contacts.

---

## Payment System Integration

### Payment Strategy
- **50% upfront, 50% on delivery** for all projects
- Client pays before work begins (protects agency)
- No payment required for consultations/quotes (free)

### Files Created

| File | Purpose |
|------|---------|
| `src/Context/PaymentContext.jsx` | Payment state management, opens/closes modal |
| `src/Components/PaymentModal.jsx` | Stripe payment form UI |
| `src/Admin/services/quoteService.js` | Quote API service with payment helpers |
| `src/Admin/Components/Quotes.jsx` | Updated with pricing modal and payment triggers |
| `PAYMENT_SYSTEM_README.md` | Complete payment documentation |

### Key Functions

```javascript
// Open payment modal (any component)
import { usePayment } from './Context/PaymentContext';
const { openPaymentModal } = usePayment();

openPaymentModal({
  amount: 175,           // Amount to charge (50% upfront)
  totalAmount: 350,      // Total project cost
  currency: "usd",        // usd, eur, pkr (auto-detected)
  projectName: "Website Development",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  quoteId: "quote_123",
  paymentType: "upfront", // or "full"
});
```

### Quote Status Flow

```
pending → pricing_sent → partially_paid → paid → completed
```

### Currency Detection (Geolocation)

- **Pakistan** → PKR (timezone + browser language)
- **European countries** → EUR (ipapi.co / ip-api.com)
- **Rest of world** → USD (default)

### Stripe Setup Required

1. Create account at https://stripe.com
2. Get publishable key (pk_test_...)
3. Update in:
   - `PaymentContext.jsx` → `STRIPE_PUBLISHABLE_KEY`
   - `PaymentModal.jsx` → `loadStripe("pk_test_...")`
4. Backend required for production (create PaymentIntent)

### Test Card Numbers (Stripe Test Mode)

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **State**: Context API (store.jsx, PaymentContext.jsx)
- **Payments**: Stripe (@stripe/react-stripe-js)
- **Backend**: Node.js/Express (separate repo)
- **Real-time**: Socket.io

---

## Key Context Values

| Context | Purpose |
|---------|---------|
| `store.jsx` | Theme, currency, user location, services |
| `PaymentContext` | Payment modal, amounts, Stripe state |

---

## Admin Dashboard Routes

- `/admin/quotes` - Quote management with payment actions
- `/admin/testimonials` - Client testimonials
- `/admin/contacts` - Contact form submissions

---

## Important Notes

- Payment system is **demo mode** - backend integration needed for real payments
- When backend is ready, uncomment the PaymentIntent code in PaymentModal.jsx
- Currency automatically detects European users for EUR pricing
- All payment-related code has detailed comments explaining the flow