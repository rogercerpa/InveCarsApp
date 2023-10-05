import Stripe from "stripe";
import getCurrentUser from "../db/get-current-user";
import { appUrl } from "@/config";


function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

// Usage
const STRIPE_SECRET_KEY = getEnvVariable('STRIPE_SECRET_KEY');

export default async function createCustomerPortalSession() {
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId || "",
    return_url: appUrl,
  });

  return portalSession.url;
}