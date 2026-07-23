import Stripe from "stripe"
import UserModel from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config()

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

export const createCreditsOrder = async (req,res) => {
    try {
        const userId = req.userId
        const {amount} = req.body;

         if (!CREDIT_MAP[amount]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${CREDIT_MAP[amount]} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: CREDIT_MAP[amount],
      },
    })

    res.status(200).json({ url: session.url });
    } catch (error) {
         res.status(500).json({ message: "Stripe error" });
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({ message: "Payment session not found" });
        }

        if (session.payment_status === "paid") {
            const userId = session.metadata?.userId || req.userId;
            const creditsToAdd = Number(session.metadata?.credits);

            if (!userId || !creditsToAdd) {
                return res.status(400).json({ message: "Invalid session metadata" });
            }

            if (session.metadata?.processed === "true") {
                const user = await UserModel.findById(userId);
                return res.status(200).json({ message: "Payment already processed", user });
            }

            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $inc: { credits: creditsToAdd },
                    $set: { isCreditAvailable: true }
                },
                { new: true }
            );

            try {
                await stripe.checkout.sessions.update(session_id, {
                    metadata: { ...session.metadata, processed: "true" }
                });
            } catch (err) {
                console.log("Could not update session metadata:", err.message);
            }

            return res.status(200).json({ message: "Credits added successfully", user });
        } else {
            return res.status(400).json({ message: "Payment not completed" });
        }
    } catch (error) {
        console.error("verifyPayment error:", error);
        return res.status(500).json({ message: "Failed to verify payment" });
    }
}


export const stripeWebhook = async (req,res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )   
    } catch (error) {
         console.log("❌ Webhook signature error:", error.message);
    return res.status(400).send("Webhook Error");
    }

  if(event.type === "checkout.session.completed"){
    const session = event.data.object;

    const userId = session.metadata.userId;
    const creditsToAdd = Number(session.metadata.credits);

    if (!userId || !creditsToAdd) {
    return res.status(400).json({ message: "Invalid metadata" });
  }

  const user = await UserModel.findByIdAndUpdate(userId , {
    $inc: { credits: creditsToAdd },
      $set: { isCreditAvailable: true },
  },{new:true})

  }

   res.json({ received: true });
}