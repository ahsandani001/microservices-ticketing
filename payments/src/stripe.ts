const Stripe = require('stripe');

export const stripe = new Stripe(process.env.STRIP_KEY!, {
  apiVersion: '2025-06-30.basil',
});
