# Vercel purchase delivery setup

The application now handles Razorpay payment verification, protected product access, and purchase confirmation email delivery. Complete these deployment settings once in Vercel.

## 1. Run the database schema

In Supabase, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. The schema creates the private `product-files` bucket and stores a copy of each purchased file path in the order, so taking a product off sale does not remove access for previous buyers.

Upload each paid file to the private `product-files` bucket using the exact `storage_path` value configured for that product, for example `ebooks/midjourney-for-architects.pdf`.

## 2. Add Vercel environment variables

Add these in **Vercel Project Settings -> Environment Variables** for Production, Preview, and Development where appropriate:

```text
APP_URL=https://your-production-domain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-service-role-key
ACCESS_TOKEN_SECRET=long-random-server-only-secret
RAZORPAY_KEY_ID=rzp_live_or_test_key_id
RAZORPAY_KEY_SECRET=server-only-razorpay-secret
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
PRODUCT_STORAGE_BUCKET=product-files
RESEND_API_KEY=server-only-resend-api-key
EMAIL_FROM=Ar. Ahmed Usmani <orders@your-verified-domain.com>
SUPPORT_EMAIL=ar.ahmedusmani@gmail.com
```

`EMAIL_FROM` must use a sender domain verified in Resend. Keep `SUPABASE_SERVICE_ROLE_KEY`, `ACCESS_TOKEN_SECRET`, `RAZORPAY_KEY_SECRET`, and `RESEND_API_KEY` server-only. Do not prefix those values with `VITE_`.

## 3. Redeploy and test

Redeploy after saving the variables. Make one small Razorpay test purchase and confirm that:

- the success page shows the protected access button, product ID, order ID, and payment ID;
- the access button redirects to the private Supabase file;
- the buyer receives the branded confirmation email with the same IDs and access link.

The email is sent through Resend after the payment is marked `PAID`. If Resend is temporarily unavailable, the payment still succeeds and the customer can use the access link shown on the success page.

## 4. Manage purchases

Open **Admin -> Purchases** after signing in. The page loads orders through a protected server endpoint, so the admin view is not blocked by browser RLS filtering. Use **Sync Razorpay** to import captured payments from the currently configured Razorpay account, including test payments made before the local order record was available. The page supports filtering by status, date range, name, email, phone, product, customer ID, order ID, and payment ID. **Excel CSV** downloads the filtered rows, and **PDF / Print** opens the browser print dialog where you can choose Save to PDF.
