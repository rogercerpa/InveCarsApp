import Stripe from "stripe";
import { IPlan, IUser } from "@/types";
import { appUrl } from "@/config";

interface IProps {
  planId: IPlan["PLAN_ID"];
  stripeCustomerId: string;
  user: IUser;
}

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}
const STRIPE_SECRET_KEY = getEnvVariable('STRIPE_SECRET_KEY');

export default async function createCheckoutSession({
  planId,
  stripeCustomerId,
  user,
}: IProps) {
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    allow_promotion_codes: true,
    customer: stripeCustomerId,
    customer_update: {
      address: "auto",
    },
    line_items: [
      {
        price: planId,
        quantity: 1,
      },
    ],
    success_url: appUrl,
    cancel_url: appUrl,
    subscription_data: {
      metadata: {
        payingUserId: user?.pk,
      },
    },
  });

  return checkoutSession.url;
}