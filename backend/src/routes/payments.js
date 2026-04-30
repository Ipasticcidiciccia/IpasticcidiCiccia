const express = require('express');
const router = express.Router();

let stripe;
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key');
} catch (err) {
  console.log('Stripe not configured, using mock mode');
}

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, orderId, email } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!stripe) {
      return res.status(400).json({ message: 'Stripe not configured' });
    }

    // Amount in cents
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        orderId: orderId
      },
      receipt_email: email
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!stripe) {
      return res.status(400).json({ message: 'Stripe not configured' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        message: 'Payment successful',
        paymentIntentId: paymentIntent.id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.json({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Payment successful:', event.data.object.id);
      // Update order status to confirmed
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id);
      // Update order status to failed
      break;
  }

  res.json({ received: true });
});

module.exports = router;
