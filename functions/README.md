# Firebase Cloud Functions - Chai POS

This directory contains Firebase Cloud Functions for secure server-side payment processing.

## Functions

### 1. `createRazorpayOrder`
Creates a Razorpay order before opening the payment checkout.

**Input:**
```javascript
{
  amount: 999,        // Amount in rupees
  currency: 'INR',    // Currency code
  planName: 'Pro'     // Plan name
}
```

**Output:**
```javascript
{
  orderId: 'order_xxx',
  amount: 99900,      // Amount in paise
  currency: 'INR'
}
```

### 2. `verifyRazorpayPayment`
Verifies payment signature and updates user's plan in Firestore.

**Input:**
```javascript
{
  orderId: 'order_xxx',
  paymentId: 'pay_xxx',
  signature: 'signature_xxx',
  planName: 'Pro'
}
```

**Output:**
```javascript
{
  success: true,
  message: 'Successfully upgraded to Pro plan!',
  planName: 'Pro'
}
```

## Setup

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Configure Razorpay Credentials

**Option A: Environment Variables (Development)**
```bash
cp .env.example .env
# Edit .env and add your Razorpay credentials
```

**Option B: Firebase Config (Production)**
```bash
firebase functions:config:set razorpay.key_id="YOUR_KEY_ID"
firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET"
```

### 3. Deploy Functions
```bash
firebase deploy --only functions
```

## Testing Locally

### Start Emulator
```bash
cd functions
npm run serve
```

### Test with Frontend
Update frontend to point to emulator:
```javascript
// In development
connectFunctionsEmulator(functions, "localhost", 5001);
```

## Security

- ✅ Razorpay secrets stored server-side only
- ✅ Signature verification prevents tampering
- ✅ Authentication required for all function calls
- ✅ User ID validation
- ✅ Comprehensive logging

## Deployment

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:createRazorpayOrder
```

## Monitoring

View logs in Firebase Console or via CLI:
```bash
firebase functions:log
```

## Troubleshooting

### "Missing Razorpay credentials"
Make sure you've set the environment variables or Firebase config.

### "Invalid signature"
Check that the Razorpay Key Secret matches between frontend and backend.

### "Permission denied"
Ensure user is authenticated before calling functions.
