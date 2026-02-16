# Payment Gateway Integration - Developer Guide

**Last Updated:** February 16, 2026

## Overview

Your Nomnotho Beauty Studio website has been configured to accept payments through three payment gateways:

1. **Yoco** - Credit/Debit Card payments
2. **Payfast** - Multiple payment methods (Cards, EFT, Wallets)
3. **Ozow** - EFT & Card payments

This guide explains how the system works and how to complete the setup.

---

## Architecture

### Frontend (HTML/JavaScript)
- **checkout.html** - Updated checkout page with payment method selection
- **payments.js** - Payment handler logic (routes to correct gateway)
- **script.js** - Updated with form submission handling

### Backend (PHP APIs)
- **/api/yoco-charge.php** - Processes Yoco credit card charges
- **/api/payfast-prepare.php** - Prepares Payfast hosted payment
- **/api/ozow-prepare.php** - Prepares Ozow payment request
- **/api/payfast-notify.php** - Receives Payfast payment notifications

---

## How It Works

### Payment Flow

```
User fills checkout form
    ↓
Selects payment gateway
    ↓
Frontend sends to appropriate backend API
    ↓
Backend API creates request to payment gateway
    ↓
User redirected to payment gateway (Payfast/Ozow) OR direct charge (Yoco)
    ↓
Payment gateway handles payment securely
    ↓
User redirected back to confirmation page
    ↓
Backend receives notification (webhook)
    ↓
Order updated with payment status
```

---

## Setup Instructions by Gateway

### YOCO Setup

#### 1. Get Credentials
- Create account at https://dashboard.yoco.com
- Navigate to Settings → API Keys
- Copy Public Key and Secret Key
- Start with **Test Keys** for development

#### 2. Install Dependencies
```bash
# On your server, in the project root:
composer require yocowallet/sdk
```

#### 3. Configure Backend
Edit `/api/yoco-charge.php`:
```php
define('YOCO_SECRET_KEY', 'sk_live_YOUR_KEY_HERE');
define('YOCO_MODE', 'live'); // Use 'test' for development
```

#### 4. Configure Frontend
Edit `payments.js`:
```javascript
const PAYMENT_CONFIG = {
  yoco: {
    publicKey: 'pk_live_YOUR_KEY_HERE',
    mode: 'live'
  }
  // ...
};
```

#### 5. Enable Yoco.js Library
Uncomment in `checkout.html`:
```html
<script src="https://js.yoco.com/releases/latest/yoco.js"></script>
```

#### 6. Test
- Use Yoco test cards
- Verify transaction appears in Yoco dashboard
- Check /api/yoco-charge.php returns success

---

### PAYFAST Setup

#### 1. Get Credentials
- Create merchant account at https://www.payfast.co.za
- Go to Settings → Business ID
- Copy Merchant ID and Merchant Key
- Set return/callback URLs:
  - Return URL: `https://yourdomain.com/order-confirmation.html`
  - Notify URL: `https://yourdomain.com/api/payfast-notify.php`
- Set optional Passphrase (recommended for security)

#### 2. Configure Backend
Edit `/api/payfast-prepare.php`:
```php
define('PAYFAST_MERCHANT_ID', 'YOUR_MERCHANT_ID');
define('PAYFAST_MERCHANT_KEY', 'YOUR_MERCHANT_KEY');
define('PAYFAST_PASSPHRASE', 'YOUR_PASSPHRASE'); // Optional
define('PAYFAST_MODE', 'test'); // Use 'live' for production
```

Also update `/api/payfast-notify.php` with same credentials.

#### 3. Configure Frontend
Edit `payments.js`:
```javascript
const PAYMENT_CONFIG = {
  payfast: {
    merchantId: 'YOUR_MERCHANT_ID',
    merchantKey: 'YOUR_MERCHANT_KEY',
    returnUrl: 'https://yourdomain.com/order-confirmation.html',
    notifyUrl: 'https://yourdomain.com/api/payfast-notify.php',
    mode: 'test'
  }
  // ...
};
```

#### 4. Test
- Use Payfast test cards on sandbox
- Verify payment status updates are received at notify URL
- Check logs in `/api/payfast_notifications.log`

---

### OZOW Setup

#### 1. Get Credentials
- Create merchant account at https://www.ozow.com
- Access Developer Console
- Copy API Key, Merchant ID (Site Code), Account ID
- Set success/fail URLs:
  - Success: `https://yourdomain.com/order-confirmation.html?status=success`
  - Fail: `https://yourdomain.com/checkout.html`

#### 2. Configure Backend
Edit `/api/ozow-prepare.php`:
```php
define('OZOW_API_KEY', 'YOUR_API_KEY');
define('OZOW_MERCHANT_ID', 'YOUR_MERCHANT_ID');
define('OZOW_ACCOUNT_ID', 'YOUR_ACCOUNT_ID');
define('OZOW_MODE', 'test'); // Use 'live' for production
```

#### 3. Configure Frontend
Edit `payments.js`:
```javascript
const PAYMENT_CONFIG = {
  ozow: {
    apiKey: 'YOUR_API_KEY',
    merchantId: 'YOUR_MERCHANT_ID',
    accountId: 'YOUR_ACCOUNT_ID',
    redirectUrl: 'https://yourdomain.com/order-confirmation.html',
    mode: 'test'
  }
  // ...
};
```

#### 4. Test
- Use Ozow test environment
- Verify redirect URLs work correctly
- Test both card and EFT payment methods

---

## Testing

### Test Credit Cards

**Yoco:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

**Payfast:**
- Check Payfast documentation for test cards
- Use sandbox mode (set PAYFAST_MODE to 'test')

**Ozow:**
- Check Ozow documentation for test cards
- Use sandbox URLs

### Test Checklist
- [ ] Can reach checkout page
- [ ] Can select each payment method
- [ ] Form validation works
- [ ] Payment gateways respond
- [ ] Logging shows transactions
- [ ] Orders are created in system
- [ ] Confirmation emails send (if configured)

---

## Production Deployment

### Before Going Live

1. **Get Live Credentials**
   - Each payment provider has live/production keys
   - These are different from test keys

2. **Update Configuration Files**
   ```
   payments.js → mode: 'live' and live keys
   /api/*.php → mode: 'live' and live keys
   ```

3. **Enable HTTPS**
   - All payment gateways require HTTPS
   - Get SSL certificate (Let's Encrypt is free)

4. **Update URLs**
   - Return URLs should use production domain
   - Notify URLs should use production domain

5. **Test with Real Amounts**
   - Process small test transactions
   - Verify orders in your system
   - Verify payment confirmations arrive

6. **Set Up Monitoring**
   - Monitor /api logs for errors
   - Set up alerts for failed payments
   - Check gateway dashboards regularly

---

## Security Best Practices

### Do's ✅
- Store credentials in environment variables or secure config
- Always use HTTPS in production
- Validate all inputs on backend
- Log transactions for audit trail
- Verify payment amounts before accepting
- Implement rate limiting on API endpoints
- Keep SDK libraries updated

### Don'ts ❌
- Never commit credentials to version control
- Don't store raw credit card data
- Don't expose API keys in frontend code
- Don't skip SSL/HTTPS
- Don't trust client-side validation alone
- Don't ignore payment notifications

---

## Troubleshooting

### "Credentials not configured"
- Check credentials are entered in both frontend and backend
- Ensure you're using correct keys (test vs live should match)
- Verify no typos in keys

### "Payment gateway not responding"
- Check HTTPS is enabled
- Verify return/notify URLs are correct
- Check firewall isn't blocking requests to gateway
- Enable curl_exec in PHP.ini if needed

### "Orders not being created"
- Check `/api/payfast_notifications.log` for errors
- Verify webhook/notify URLs are correct
- Check server is receiving notifications
- Ensure localStorage is working on client

### "Customer not redirected to payment gateway"
- Check browser console for JavaScript errors
- Verify API endpoint URLs are correct
- Check backend API response
- Ensure redirect URLs in config are correct

---

## File Reference

### Frontend Files
| File | Purpose |
|------|---------|
| checkout.html | Checkout form with payment method selection |
| payments.js | Payment handler logic and gateway routing |
| script.js | Form submission and order creation |
| styles.css | Styling for checkout page |

### Backend Files
| File | Purpose |
|------|---------|
| /api/yoco-charge.php | Yoco credit card processing |
| /api/payfast-prepare.php | Payfast hosted payment prep |
| /api/payfast-notify.php | Payfast IPN webhook handler |
| /api/ozow-prepare.php | Ozow payment request prep |

---

## Support Resources

### Official Documentation
- **Yoco:** https://developer.yoco.com
- **Payfast:** https://support.payfast.co.za/article/25-how-to-integrate-payfast
- **Ozow:** https://developer.ozow.com

### Getting Help
1. Check payment gateway documentation
2. Review error logs in /api/
3. Check browser console for frontend errors
4. Contact payment gateway support
5. Review this guide for common issues

---

## Maintenance

### Periodic Tasks
- Review transaction logs monthly
- Test payment links quarterly
- Update SDK libraries (Yoco)
- Monitor for deprecated APIs
- Review security practices annually

### Monitoring
Set up alerts for:
- Failed payment transactions
- API errors (500+ errors)
- Unusual transaction amounts
- Webhook delivery failures

---

## Frequently Asked Questions

**Q: Can I use all three payment methods?**
A: Yes! Customers will see all three options on checkout.

**Q: Do I need all three in production?**
A: Start with one, add others as needed.

**Q: Can I test with real money?**
A: Use test credentials first. Only switch to live keys when confident.

**Q: What happens if payment fails?**
A: Customer stays on checkout page with error message. They can retry.

**Q: How do customers know payment succeeded?**
A: They're redirected to order-confirmation.html after successful payment.

**Q: Are credit cards stored?**
A: No. Payment gateways tokenize cards - your system never sees card details.

---

## Version History

| Date | Changes |
|------|---------|
| Feb 16, 2026 | Initial setup - All three gateways configured |

---

**Questions?** Contact your developer or payment gateway support.
