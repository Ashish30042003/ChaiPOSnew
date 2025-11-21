const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

admin.initializeApp();

// Initialize Razorpay
// NOTE: Replace these with your actual Razorpay credentials
// For production, use Secret Manager or environment variables
const razorpay = new Razorpay({
    key_id: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
    key_secret: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay Order
 * Called from frontend before opening Razorpay checkout
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to create an order.'
        );
    }

    const { amount, currency = 'INR', planName } = data;

    // Validate input
    if (!amount || amount <= 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Amount must be a positive number.'
        );
    }

    if (!planName) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Plan name is required.'
        );
    }

    try {
        // Create order in Razorpay
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: currency,
            receipt: `receipt_${context.auth.uid}_${Date.now()}`,
            notes: {
                userId: context.auth.uid,
                planName: planName,
                email: context.auth.token.email || ''
            }
        });

        functions.logger.info('Order created:', {
            orderId: order.id,
            userId: context.auth.uid,
            planName: planName
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        };
    } catch (error) {
        functions.logger.error('Error creating Razorpay order:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to create payment order. Please try again.'
        );
    }
});

/**
 * Verify Razorpay Payment
 * Called after successful payment to verify signature and update user plan
 */
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to verify payment.'
        );
    }

    const { orderId, paymentId, signature, planName } = data;

    // Validate input
    if (!orderId || !paymentId || !signature || !planName) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required payment verification parameters.'
        );
    }

    try {
        // Verify signature
        const keySecret = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (generatedSignature !== signature) {
            functions.logger.warn('Invalid payment signature:', {
                userId: context.auth.uid,
                orderId: orderId
            });
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Payment verification failed. Invalid signature.'
            );
        }

        // Signature is valid - update user's plan in Firestore
        const userId = context.auth.uid;
        const appId = 'chai-pos-v1'; // Match your app ID

        await admin.firestore()
            .doc(`artifacts/${appId}/users/${userId}/settings/config`)
            .set({
                plan: planName,
                paymentId: paymentId,
                orderId: orderId,
                upgradedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        functions.logger.info('Payment verified and plan updated:', {
            userId: userId,
            planName: planName,
            paymentId: paymentId
        });

        return {
            success: true,
            message: `Successfully upgraded to ${planName} plan!`,
            planName: planName
        };
    } catch (error) {
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        functions.logger.error('Error verifying payment:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to verify payment. Please contact support.'
        );
    }
});
