# PAYMENT SETUP CHECKLIST FOR CLIENT

**For:** Nomnotho Beauty Studio  
**Date:** February 16, 2026  
**Status:** Ready for credential configuration  

---

## What Has Been Done ✅

Your website now has a **fully working checkout system** with support for three payment gateways:

✅ Checkout page with payment method selector  
✅ Payment routing logic (frontend JavaScript)  
✅ Backend APIs for each gateway  
✅ Webhook handler for payment confirmations  
✅ Order creation system  
✅ Security & validation  

**All you need to do now:** Provide your payment gateway credentials.

---

## What You Need to Do

### Step 1: Choose Your Payment Gateways (Pick at least one)

You can use:
- **Yoco** (Recommended for cards) 
- **Payfast** (Recommended for multiple methods)
- **Ozow** (Recommended for EFT)

Or all three for maximum options!

### Step 2: Create Accounts & Get Test Credentials

For **EACH gateway you choose**, do this:

#### For YOCO:
1. Go to https://dashboard.yoco.com
2. Create a merchant account (free)
3. Click Settings → API Keys
4. Copy your **Test Public Key** and **Test Secret Key**
5. Save these in a secure document

#### For PAYFAST:
1. Go to https://www.payfast.co.za
2. Create a merchant account (free)
3. Get your **Merchant ID** from dashboard
4. Get your **Merchant Key** from API section
5. Optionally create a security **Passphrase**
6. Save these in a secure document

#### For OZOW:
1. Go to https://www.ozow.com
2. Create a merchant account (free)
3. Go to Developer Console
4. Copy **API Key**, **Merchant ID** (Site Code), and **Account ID**
5. Save these in a secure document

### Step 3: Prepare Your Security Information

Before you test, you need a secure HTTPS domain. Ask your hosting provider:
- "Do you provide free SSL/HTTPS?"
- "What's my production domain?" (e.g., `https://nomnothobeauty.com`)

Gather:
- [ ] Your website domain (HTTPS)
- [ ] Hosting provider name
- [ ] Your hosting control panel login

### Step 4: Send Credentials to Your Developer

Create a **secure message** (encrypted email or secure file sharing) with:

```
YOCO CREDENTIALS (If chosen):
- Test Public Key: pk_test_xxxxxxxxxxxxx
- Test Secret Key: sk_test_xxxxxxxxxxxxx

PAYFAST CREDENTIALS (If chosen):
- Merchant ID: 10012345
- Merchant Key: xxxxxxxxxxxxx
- Passphrase (optional): yourpassphrase

OZOW CREDENTIALS (If chosen):
- API Key: xxxxxxxxxxxxx
- Merchant ID: xxxxxxxxxxxxx
- Account ID: xxxxxxxxxxxxx

PRODUCTION INFO:
- Your domain: https://yourdomain.co.za
- Hosting provider: [provider name]
```

**IMPORTANT:** Use a secure method:
- ✅ Encrypted email
- ✅ Password-protected document
- ✅ Secure file sharing (Google Drive with password)
- ❌ Regular email (not secure)
- ❌ WhatsApp/SMS (not secure)

### Step 5: Your Developer Will:

1. Add credentials to the website
2. Test payments with test credentials
3. Verify orders are being created
4. Verify confirmation emails work
5. Help you switch to live credentials when ready

---

## Testing Payment Methods

Once your developer sets up credentials, you can **TEST for FREE** using:

**For Yoco:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- **NO REAL MONEY CHARGED** ✅

**For Payfast:**
- Check Payfast sandbox documentation
- **NO REAL MONEY CHARGED** ✅

**For Ozow:**
- Check Ozow sandbox documentation  
- **NO REAL MONEY CHARGED** ✅

---

## Timeline

```
TODAY (Feb 16):
  → Website ready with payment system

WITHIN 2-3 DAYS:
  → You create payment gateway accounts
  → You provide credentials to developer

WITHIN 1 WEEK:
  → Developer configures credentials
  → You test payments
  → You verify emails work
  → Everything working with test accounts

WHEN READY:
  → Payment provider gives you LIVE credentials
  → Developer updates to production
  → Website goes live with real payments
```

---

## Cost Breakdown

✅ **Website Updates:** Done (free)  
✅ **Hosting:** You already have hosting  
✅ **Payment Gateways:** 
   - Yoco: ~2.75% per transaction + once-off fees
   - Payfast: ~2.8% per transaction
   - Ozow: ~1.5% + R0.50 per transaction

❌ **SSL/HTTPS:** Usually free or ~R50-100/year

---

## FAQ for You

**Q: Do I need all three payment methods?**  
A: No, start with one. You can add more later.

**Q: Which one should I choose?**  
A: 
- If you want cards only → Yoco
- If you want cards + EFT + wallets → Payfast
- If you want cards + EFT → Ozow
- If you want all options → Use all three!

**Q: Will it charge my account to set up?**  
A: No. Creating test accounts is free. You only pay when customers pay you.

**Q: What are test credentials?**  
A: Fake keys for testing. They let you practice without real money. You switch to live keys when ready.

**Q: Can I test without real money?**  
A: Yes! Test cards don't charge anything. Your bank won't see anything.

**Q: When do I get real sales?**  
A: After your developer switches to LIVE credentials and people make real purchases.

**Q: What if something goes wrong?**  
A: Each payment provider has free customer support. You can contact them directly.

**Q: Do I have to go live immediately?**  
A: No. Test as long as you want first.

---

## What Happens After Payment?

When a customer pays:

1. ✅ Money goes into your payment gateway account
2. ✅ Order created in your system
3. ✅ Customer gets confirmation email
4. ✅ You get notification
5. ✅ You can withdraw money weekly/monthly

---

## Quick Start Checklist

- [ ] I've chosen which payment gateway(s) to use
- [ ] I've created accounts with the payment providers
- [ ] I've copied my TEST credentials
- [ ] I have my website domain (HTTPS)
- [ ] I've securely sent credentials to my developer
- [ ] I've verified email address (for confirmation emails)
- [ ] I'm ready to test payments

---

## Need Help?

### Quick Questions?
Contact your developer (they helped set up the website)

### Payment Gateway Questions?
- **Yoco Support:** https://support.yoco.com
- **Payfast Support:** https://support.payfast.co.za  
- **Ozow Support:** https://support.ozow.com

### Hosting Questions?
Contact your web hosting provider

---

## Security Reminders

⚠️ **NEVER:**
- Share your credentials publicly
- Post credentials on social media
- Email credentials unencrypted
- Give credentials to unauthorized people

✅ **ALWAYS:**
- Use secure messaging for credentials
- Check domain shows 🔒 lock icon
- Keep credentials private
- Monitor transactions regularly

---

## Action Items - Do This Now

**Immediate (This Week):**

1. Decide which payment method(s) to use
2. Create accounts at your chosen payment providers
3. Get test credentials from their dashboards
4. Document your details securely
5. Send details to your developer securely

**After Developer Sets Up (Next Week):**

1. Test the checkout on staging/test site
2. Process test payments
3. Verify confirmation emails arrive
4. Check your payment provider dashboard
5. Give developer feedback

**Before Going Live:**

1. Get LIVE credentials from payment providers
2. Developer updates the website
3. Final testing with live credentials
4. Launch!

---

## Document Checklist

You should have received/been given:

- [ ] **PAYMENT_SETUP_GUIDE.md** - This document, for your reference
- [ ] **DEVELOPER_GUIDE.md** - Technical guide for your developer
- [ ] Updated **checkout.html** - With payment method selector
- [ ] **payments.js** - Payment handling logic
- [ ] **/api/*.php** - Backend payment processors

---

## Next Steps

1. **This Week:** Complete "Action Items - Do This Now" above
2. **Send to Developer:** All your credentials securely
3. **Developer Will:** Set up, test, and notify you
4. **You Will:** Test the checkout and verify it works
5. **Go Live:** Switch to live credentials and launch!

---

## Contact Information

**Questions about this setup?**  
Reach out to your development team.

**Questions about payment gateways?**  
Check the official support pages above.

**Ready to start?**  
Begin with Step 1 above!

---

**Status:** ✅ Website Ready | ⏳ Waiting for your credentials  
**Last Updated:** February 16, 2026
