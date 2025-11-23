const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const APP_ID = "chai_pos_v1";

/**
 * Creates a Razorpay Order
 * Note: onCall handles CORS and Authentication automatically.
 */
exports.createRazorpayOrder = functions
    .runWith({ secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"] })
    .https.onCall(async (data, context) => {

        // 1. Check Authentication
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "You must be logged in to create an order."
            );
        }

        // 2. Initialize Razorpay (inside the function to access secrets)
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { amount, currency = "INR", plan } = data;

        const options = {
            amount: amount * 100, // Convert to paise
            currency: currency,
            receipt: `receipt_${context.auth.uid}_${new Date().getTime()}`,
            notes: {
                firebase_uid: context.auth.uid,
                plan: plan,
            },
        };

        try {
            const order = await razorpay.orders.create(options);
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            };
        } catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw new functions.https.HttpsError(
                "internal",
                "Failed to create Razorpay order."
            );
        }
    });

/**
 * Verifies a Razorpay payment
 */
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
    // 1. Check Authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in."
        );
    }

    const {
        razorpay_order_id,
        razorpay_payment_id,
        plan,
    } = data;

    const uid = context.auth.uid;

    try {
        // 2. Save payment record
        await db.collection(`artifacts/${APP_ID}/users/${uid}/payments`).add({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            plan: plan,
            status: "success",
            createdAt: new Date(),
        });

        // 3. Update user plan
        const settingsRef = db.doc(`artifacts/${APP_ID}/users/${uid}/settings/config`);
        await settingsRef.set({ plan: plan }, { merge: true });

        return { status: "success", plan: plan };

    } catch (error) {
        console.error("Payment verification failed:", error);
        throw new functions.https.HttpsError("internal", "Payment verification failed.");
    }
});
