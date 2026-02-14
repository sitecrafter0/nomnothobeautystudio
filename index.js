require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(bodyParser.json());

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeKey ? require('stripe')(stripeKey) : null;

const ORDERS_FILE = path.join(__dirname, 'orders.json');
function readOrders(){
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE)); } catch(e){ return []; }
}
function saveOrders(orders){ fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2)); }

function createOrderRecord(order){
  const orders = readOrders();
  orders.push(order);
  saveOrders(orders);
}

// Create order (frontend posts cart and billing)
app.post('/api/create-order', (req, res) => {
  const { items = [], billing = {}, metadata = {} } = req.body || {};
  if(!Array.isArray(items) || items.length === 0){ return res.status(400).json({ error: 'No items' }); }
  const amount = items.reduce((s,i)=> s + ((i.price||0) * (i.qty||1)), 0);
  const orderId = 'NB' + Date.now();
  const order = { id: orderId, items, billing, amount, metadata, status: 'created', createdAt: new Date().toISOString() };
  createOrderRecord(order);
  res.json({ orderId, amount });
});

// Create Stripe PaymentIntent and return client_secret
app.post('/api/pay/stripe', async (req, res) => {
  if(!stripe) return res.status(500).json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY in .env' });
  const { orderId } = req.body || {};
  if(!orderId) return res.status(400).json({ error: 'orderId required' });
  const orders = readOrders();
  const order = orders.find(o=> o.id === orderId);
  if(!order) return res.status(404).json({ error: 'Order not found' });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100), // cents
      currency: 'zar',
      metadata: { orderId: order.id }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe error' });
  }
});

// Demo PayFast flow: build a redirect URL (sandbox/demo)
app.post('/api/pay/payfast', (req, res) => {
  const { orderId } = req.body || {};
  if(!orderId) return res.status(400).json({ error: 'orderId required' });
  const orders = readOrders();
  const order = orders.find(o=> o.id === orderId);
  if(!order) return res.status(404).json({ error: 'Order not found' });

  // In production you'd build a signed POST/redirect to PayFast. Here we return a fake sandbox URL
  const base = process.env.PAYFAST_SANDBOX || 'https://www.payfast.co.za/eng/process';
  const params = new URLSearchParams();
  params.set('merchant_id', process.env.PAYFAST_MERCHANT_ID || '10000100');
  params.set('merchant_key', process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a');
  params.set('amount', order.amount.toFixed(2));
  params.set('item_name', `Order ${order.id}`);
  params.set('return_url', (process.env.BASE_URL || 'http://localhost:8080') + '/order-confirmation.html');
  params.set('cancel_url', (process.env.BASE_URL || 'http://localhost:8080') + '/checkout.html');
  // NOTE: In a real integration you must calculate a signature/hash (passphrase) and post the fields to PayFast.

  const redirectUrl = base + '?' + params.toString();
  res.json({ redirectUrl });
});

// Stripe webhook endpoint (requires STRIPE_WEBHOOK_SECRET and public URL)
app.post('/api/webhook/stripe', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if(!stripe || !webhookSecret){
    // If no webhook secret we accept and parse generically
    try{
      const event = JSON.parse(req.body.toString());
      console.log('Received event (no verify):', event.type);
    }catch(e){ console.error('Webhook parse error', e); }
    return res.status(200).send('ok');
  }
  const sig = req.headers['stripe-signature'];
  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  }catch(err){
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the event
  if(event.type === 'payment_intent.succeeded'){
    const pi = event.data.object;
    console.log('PaymentIntent succeeded for', pi.metadata.orderId);
    // Update order status in our orders.json
    const orders = readOrders();
    const o = orders.find(x=>x.id === pi.metadata.orderId);
    if(o){ o.status = 'paid'; o.paidAt = new Date().toISOString(); saveOrders(orders); }
  }
  res.json({received: true});
});

app.get('/api/orders', (req,res) => { res.json(readOrders()); });

app.listen(PORT, () => console.log(`Payments server running on http://localhost:${PORT}`));
