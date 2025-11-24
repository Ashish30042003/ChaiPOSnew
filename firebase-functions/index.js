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

        const { amount, currency = "INR", plan, couponCode } = data;
        let finalAmount = amount;
        let discountApplied = 0;

        // 3. Coupon Logic
        if (couponCode) {
            const couponRef = db.collection(`artifacts/${APP_ID}/coupons`).doc(couponCode.toUpperCase());
            const couponSnap = await couponRef.get();

            if (couponSnap.exists) {
                const coupon = couponSnap.data();
                const now = admin.firestore.Timestamp.now();

                if (coupon.validUntil && coupon.validUntil > now && (coupon.maxUses === undefined || coupon.usedCount < coupon.maxUses)) {
                    if (coupon.discountType === 'percentage') {
                        discountApplied = (amount * coupon.value) / 100;
                    } else if (coupon.discountType === 'flat') {
                        discountApplied = coupon.value;
                    }
                    finalAmount = Math.max(0, amount - discountApplied);
                    console.log(`Coupon ${couponCode} applied. Discount: ${discountApplied}, Final: ${finalAmount}`);
                } else {
                    console.warn(`Coupon ${couponCode} is invalid or expired.`);
                }
            }
        }

        const options = {
            amount: Math.round(finalAmount * 100), // Convert to paise
            currency: currency,
            receipt: `rcpt_${Date.now().toString().slice(-10)}`,
            notes: {
                firebase_uid: context.auth.uid,
                plan: plan,
                couponCode: couponCode || '',
                originalAmount: amount
            },
        };

        console.log("createRazorpayOrder called with:", { amount, finalAmount, currency, plan, couponCode });
        console.log("Secrets check:", {
            hasKeyId: !!process.env.RAZORPAY_KEY_ID,
            hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
        });

        try {
            const order = await razorpay.orders.create(options);
            console.log("Razorpay order created successfully:", order.id);
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                discount: discountApplied
            };
        } catch (error) {
            console.error("Razorpay order creation failed. Error details:", JSON.stringify(error, null, 2));
            throw new functions.https.HttpsError(
                "internal",
                "Failed to create Razorpay order: " + (error.description || error.message)
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

    console.log("verifyRazorpayPayment called:", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        plan: plan,
        uid: uid
    });

    // Validate plan exists
    const validPlans = ['Free', 'Test', 'Basic', 'Pro', 'Enterprise'];
    if (!validPlans.includes(plan)) {
        console.error("Invalid plan:", plan);
        throw new functions.https.HttpsError("invalid-argument", "Invalid plan specified.");
    }

    try {
        // 2. Calculate Expiry (Add 30 days to current expiry or now)
        const settingsRef = db.doc(`artifacts/${APP_ID}/users/${uid}/settings/config`);
        const settingsSnap = await settingsRef.get();
        const currentSettings = settingsSnap.exists ? settingsSnap.data() : {};

        let currentExpiry = currentSettings.planExpiresAt ? new Date(currentSettings.planExpiresAt) : new Date();
        if (currentExpiry < new Date()) currentExpiry = new Date(); // If expired, start from now

        const newExpiry = new Date(currentExpiry);
        newExpiry.setDate(newExpiry.getDate() + 30); // Add 30 days

        // 3. Save payment record
        await db.collection(`artifacts/${APP_ID}/users/${uid}/payments`).add({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            plan: plan,
            status: "success",
            createdAt: new Date().toISOString(),
            validUntil: newExpiry.toISOString()
        });

        console.log("Payment record saved successfully");

        // 4. Update user plan
        await settingsRef.set({
            plan: plan,
            planExpiresAt: newExpiry.toISOString(),
            isTrial: false // Paid plan is not a trial
        }, { merge: true });

        console.log("User plan updated to:", plan, "Expires:", newExpiry);

        return { status: "success", plan: plan, message: `Successfully upgraded to ${plan} plan. Valid until ${newExpiry.toDateString()}` };

    } catch (error) {
        console.error("Payment verification failed:", error);
        throw new functions.https.HttpsError("internal", "Payment verification failed: " + error.message);
    }
});
