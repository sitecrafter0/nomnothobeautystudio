# PHP FILES - ROOT LEVEL SETUP

**Updated:** February 16, 2026

## Change Summary

All PHP payment processor files have been moved from `/api/` folder to the **root directory** (same level as `index.html`).

This allows the system to work on traditional web servers where the website root is the main directory.

---

## File Locations

**Old Location (deprecated):**
```
/api/yoco-charge.php
/api/payfast-prepare.php
/api/payfast-notify.php
/api/ozow-prepare.php
```

**New Location (active):**
```
yoco-charge.php          (in root)
payfast-prepare.php      (in root)
payfast-notify.php       (in root)
ozow-prepare.php         (in root)
```

---

## What Changed

✅ **All PHP files moved to website root**
✅ **payments.js updated** to reference root files
✅ **Payfast notify URL updated** to point to root

---

## File Structure

```
Your Website Root/
├── index.html
├── checkout.html
├── order-confirmation.html
├── payfast-notify.php ..................... NEW LOCATION
├── payfast-prepare.php .................... NEW LOCATION
├── yoco-charge.php ........................ NEW LOCATION
├── ozow-prepare.php ....................... NEW LOCATION
├── payments.js ............................ (UPDATED)
├── script.js
├── styles.css
│
├── shop.html
├── cart.html
├── ... (other HTML files)
│
└── /api/ (old location - can be deleted)
    ├── yoco-charge.php (old - not used)
    ├── payfast-prepare.php (old - not used)
    ├── payfast-notify.php (old - not used)
    └── ozow-prepare.php (old - not used)
```

---

## Why This Change?

✅ **Works with standard web hosting** - No special configuration needed  
✅ **Works with GitHub integration** - Simple file structure  
✅ **Easier to understand** - All files in one place  
✅ **Better for production** - Standard web server layout  

---

## For Your Hosting Provider

When setting up on your web server:

1. **DO:** Upload all PHP files to website root
2. **DO:** Ensure PHP execution is enabled in root
3. **DO:** Use HTTPS (required by payment providers)
4. **DON'T:** Move PHP files to subdirectories

---

## Updating Credentials

When your client provides payment credentials, add them to:

```
Root directory:
- yoco-charge.php (line 16-17)
- payfast-prepare.php (line 20-22)
- payfast-notify.php (line 19-20)
- ozow-prepare.php (line 20-22)

Also update:
- payments.js (PAYMENT_CONFIG section, lines 5-20)
```

---

## Testing

The system works exactly the same - just files are in different location.

Test by:
1. Going to checkout page
2. Selecting payment method
3. Submitting form
4. Verify PHP file processes the request

---

## Migration from /api/ (if you had old setup)

If you were using the `/api/` folder:

1. Delete `/api/` folder (optional, just for cleanup)
2. Use new root-level PHP files instead
3. No code changes needed (already updated in payments.js)

---

## Server Requirements

✅ PHP 7.0+  
✅ HTTPS enabled  
✅ HTTP POST requests allowed  
✅ JSON encoding/decoding support  
✅ cURL enabled (for Ozow)  
✅ File write permissions (for logging)  

---

**Status:** ✅ Ready for deployment to any web server  
**Note:** Files are optimized for standard web hosting setup
