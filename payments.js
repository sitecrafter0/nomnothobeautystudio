// ========================================
// PAYMENT GATEWAY CONFIGURATION
// ========================================
// IMPORTANT: Replace the placeholder values below with actual credentials from your payment providers

const PAYMENT_CONFIG = {
  yoco: {
    publicKey: 'pk_test_REPLACE_WITH_YOUR_YOCO_PUBLIC_KEY', // Get from https://dashboard.yoco.com/settings/api
    mode: 'test' // Change to 'live' when ready for production
  },
  payfast: {
    merchantId: '10000000', // REPLACE_WITH_YOUR_MERCHANT_ID
    merchantKey: 'REPLACE_WITH_YOUR_MERCHANT_KEY', // Get from Payfast dashboard
    returnUrl: window.location.origin + '/order-confirmation.html',
    notifyUrl: window.location.origin + '/payfast-notify.php',
    mode: 'test' // Change to 'live' when ready
  },
  ozow: {
    apiKey: 'REPLACE_WITH_YOUR_OZOW_API_KEY', // Get from Ozow dashboard
    merchantId: 'REPLACE_WITH_YOUR_OZOW_MERCHANT_ID',
    accountId: 'REPLACE_WITH_YOUR_OZOW_ACCOUNT_ID',
    redirectUrl: window.location.origin + '/order-confirmation.html',
    mode: 'test' // Change to 'live' when ready
  }
};

// ========================================
// PAYMENT METHOD HANDLER
// ========================================

class PaymentHandler {
  constructor(config) {
    this.config = config;
  }

  // Main payment processing function
  async processPayment(paymentMethod, orderData, customerData) {
    try {
      // Validate order data
      if (!orderData || !orderData.amount || orderData.amount <= 0) {
        throw new Error('Invalid order amount');
      }

      // Validate customer data
      if (!customerData.name || !customerData.email) {
        throw new Error('Customer name and email are required');
      }

      // Route to appropriate payment gateway
      switch (paymentMethod) {
        case 'yoco':
          return await this.processYoco(orderData, customerData);
        case 'payfast':
          return await this.processPayfast(orderData, customerData);
        case 'ozow':
          return await this.processOzow(orderData, customerData);
        default:
          throw new Error('Unknown payment method');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // ========================================
  // YOCO PAYMENT PROCESSING
  // ========================================
  async processYoco(orderData, customerData) {
    if (this.config.yoco.publicKey.includes('REPLACE_WITH')) {
      throw new Error('Yoco API key not configured. Please contact support.');
    }

    // Create Yoco inline form reference
    // Note: This assumes Yoco script is loaded (add to checkout.html <head>)
    // <script src="https://js.yoco.com/releases/latest/yoco.js"></script>

    return new Promise((resolve, reject) => {
      try {
        // Yoco tokenization - creates a secure token without exposing card details
        const yocoForm = { /* Yoco form instance */ };
        
        // This is where Yoco.js would handle the payment
        // In production, you would use the Yoco SDK to tokenize the card
        
        const paymentData = {
          amount: Math.round(orderData.amount * 100), // Convert to cents
          currency: 'ZAR',
          metadata: {
            orderId: orderData.orderId,
            customerName: customerData.name,
            customerEmail: customerData.email
          }
        };

        // Send to your backend to process with Yoco API
        fetch('yoco-charge.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            resolve({
              success: true,
              transactionId: data.transactionId,
              gateway: 'yoco',
              amount: orderData.amount,
              status: 'completed'
            });
          } else {
            reject(new Error(data.message || 'Yoco payment failed'));
          }
        })
        .catch(err => reject(err));

      } catch (error) {
        reject(error);
      }
    });
  }

  // ========================================
  // PAYFAST PAYMENT PROCESSING
  // ========================================
  async processPayfast(orderData, customerData) {
    if (this.config.payfast.merchantId.includes('REPLACE_WITH')) {
      throw new Error('Payfast credentials not configured. Please contact support.');
    }

    try {
      // Create Payfast hosted payment form
      // User is redirected to Payfast to enter payment details securely
      
      const payfastData = {
        merchantId: this.config.payfast.merchantId,
        merchantKey: this.config.payfast.merchantKey,
        returnUrl: this.config.payfast.returnUrl,
        notifyUrl: this.config.payfast.notifyUrl,
        cancelUrl: window.location.href,
        amount: orderData.amount.toFixed(2),
        itemName: `Order #${orderData.orderId}`,
        itemDescription: `${orderData.items.length} items`,
        reference: orderData.orderId,
        firstName: customerData.name.split(' ')[0],
        lastName: customerData.name.split(' ').slice(1).join(' '),
        email: customerData.email,
        phone: customerData.phone,
        timestamp: new Date().toISOString()
      };

      // In production, send to backend to sign the request
      const response = await fetch('payfast-prepare.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payfastData)
      });

      const result = await response.json();
      
      if (result.checkoutUrl) {
        // Redirect to Payfast
        window.location.href = result.checkoutUrl;
        return { pending: true }; // Will be handled by return URL
      } else {
        throw new Error(result.error || 'Failed to initiate Payfast payment');
      }

    } catch (error) {
      throw error;
    }
  }

  // ========================================
  // OZOW PAYMENT PROCESSING
  // ========================================
  async processOzow(orderData, customerData) {
    if (this.config.ozow.apiKey.includes('REPLACE_WITH')) {
      throw new Error('Ozow credentials not configured. Please contact support.');
    }

    try {
      // Create Ozow EFT transaction
      const ozowData = {
        amount: (orderData.amount * 100).toFixed(0), // Amount in cents
        orderId: orderData.orderId,
        attemptLimit: 3,
        reference: orderData.orderId,
        firstName: customerData.name.split(' ')[0],
        lastName: customerData.name.split(' ').slice(1).join(' '),
        email: customerData.email,
        phone: customerData.phone,
        successUrl: this.config.ozow.redirectUrl + '?status=success&orderId=' + orderData.orderId,
        failUrl: window.location.href,
        isTest: this.config.ozow.mode === 'test'
      };

      // Send to backend to create Ozow request
      const response = await fetch('ozow-prepare.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ozowData)
      });

      const result = await response.json();
      
      if (result.redirectUrl) {
        // Redirect to Ozow payment page
        window.location.href = result.redirectUrl;
        return { pending: true }; // Will be handled by return URL
      } else {
        throw new Error(result.error || 'Failed to initiate Ozow payment');
      }

    } catch (error) {
      throw error;
    }
  }

  // ========================================
  // ORDER CREATION
  // ========================================
  async createOrder(customerData) {
    const orderId = 'ORD-' + Date.now();
    
    // Get cart items from localStorage (must match CART_KEY in script.js)
    const cart = JSON.parse(localStorage.getItem('nb_cart_v1') || '[]');
    
    // Calculate total - CRITICAL: must match item property names
    const total = cart.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQty = parseInt(item.qty) || 1;
      return sum + (itemPrice * itemQty);
    }, 0);

    // Validate total
    if (total <= 0) {
      throw new Error('Invalid cart total: ' + total);
    }

    const orderData = {
      orderId: orderId,
      items: cart,
      amount: parseFloat(total.toFixed(2)), // Ensure proper decimal precision
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '{}');
    if (!orders[customerData.email]) {
      orders[customerData.email] = [];
    }
    orders[customerData.email].push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    return orderData;
  }
}

// ========================================
// INITIALIZE PAYMENT HANDLER
// ========================================
const paymentHandler = new PaymentHandler(PAYMENT_CONFIG);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { paymentHandler, PAYMENT_CONFIG };
}
