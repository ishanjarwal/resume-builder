"use server";

import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { currentUser } from "@clerk/nextjs/server";

export const createCheckoutSession = async (priceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/plans/success?success_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/plans/failed`,
      customer_email: user.emailAddresses[0].emailAddress,
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read ResumeBuildr's [Terms of Service](${env.NEXT_PUBLIC_BASE_URL}/terms-of-service) and agree to them.`,
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
    });

    if (!session.url) {
      return { error: "Something went wrong" };
    }

    return { success: session.url };
  } catch (error) {
    console.log(error);
    return { error: "Unexpected error occurred" };
  }
};

export const retrieveCheckoutSession = async () => {
  try {
    // check if the session id is valid
    return { success: "12345678" };
  } catch (error) {
    console.log(error);
    return { error: "Unexpected error occurred" };
  }
};

export type SubscriptionLevel = "free" | "hobby" | "pro";
export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    try {
      const subscription = await prisma.subscriptions.findUnique({
        where: { userId },
      });
      if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
        return "free";
      }
      if (
        subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY
      ) {
        return "hobby";
      }
      if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) {
        return "pro";
      }
      return "free";
    } catch (error) {
      console.log(error);
      return "free";
    }
  },
);
