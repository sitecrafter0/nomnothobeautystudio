# Payment Gateway Setup Guide

## For: Nomnotho Beauty Studio
**Date:** February 16, 2026

---

## Overview
Your website has been configured to accept payments through **three payment gateways:**
- **Yoco** (Credit/Debit Cards)
- **Payfast** (Multiple payment methods)
- **Ozow** (EFT & Cards)

To activate payments, provide the credentials below.

---

## YOCO Setup

### What You Need:
1. **Public Key** (starts with `pk_`)
2. **Secret Key** (starts with `sk_`)

### How to Get These:
1. Go to https://dashboard.yoco.com
2. Log in to your Yoco account
3. Navigate to **Settings → API Keys**
4. Copy your **Public Key** and **Secret Key**
5. You can use **Test Keys** for development, **Live Keys** for real transactions

### Where These Go:
Send the keys to your developer with:
```
YOCO_PUBLIC_KEY = pk_xxxxxxxxxxxxx
YOCO_SECRET_KEY = sk_xxxxxxxxxxxxx
```

---

## PAYFAST Setup

### What You Need:
1. **Merchant ID** (numeric, e.g., `10012345`)
2. **Merchant Key** (alphanumeric string)
3. **API Username**
4. **API Password**

### How to Get These:
1. Go to https://www.payfast.co.za
2. Create/Log into your merchant account
3. Navigate to **Settings → API**
4. Copy your **Merchant ID** and **Merchant Key**
5. For API credentials, go to **Settings → Business ID and Credentials**

### Where These Go:
Send the keys to your developer with:
```
PAYFAST_MERCHANT_ID = 10012345
PAYFAST_MERCHANT_KEY = xxxxxxxxxxxxx
PAYFAST_API_USERNAME = yourname
PAYFAST_API_PASSWORD = xxxxxxxxxxxxx
```

---

## OZOW Setup

### What You Need:
1. **API Key**
2. **Merchant ID** (Site Code)
3. **Account ID**

### How to Get These:
1. Go to https://www.ozow.com
2. Create/Log into your merchant account
3. Navigate to **Settings → API Keys** or **Developer Console**
4. Copy your **API Key**, **Merchant ID**, and **Account ID**

### Where These Go:
Send the keys to your developer with:
```
OZOW_API_KEY = xxxxxxxxxxxxx
OZOW_MERCHANT_ID = xxxxxxxxxxxxx
OZOW_ACCOUNT_ID = xxxxxxxxxxxxx
```

---

## What To Do Now

1. **Set up accounts** with whichever gateways you want to use
2. **Get test keys first** to test the checkout
3. **Send your developer** the keys above in a **secure email** or message
4. They will configure them in the website
5. **Test with real transactions** before going live
6. **Switch to live keys** when ready

---

## FAQ

**Q: Do I need all three?**  
A: No. You can start with one and add others later.

**Q: Can I use test and live keys at the same time?**  
A: Yes, but they must match (all test or all live). Don't mix.

**Q: What are test keys?**  
A: Fake payment credentials for testing. No real money is charged.

**Q: When should I switch to live keys?**  
A: After testing thoroughly. Use live keys only when ready for real customers.

**Q: Where do I send the keys?**  
A: Send them **securely** to your developer (encrypted email/message).

**Q: Is it safe to share API keys?**  
A: Only with your trusted developer. Never share publicly or on unsecured channels.

---

## Support

- **Yoco Support:** https://support.yoco.com
- **Payfast Support:** https://support.payfast.co.za
- **Ozow Support:** https://support.ozow.com

Contact your developer if you have issues with the payment setup.
