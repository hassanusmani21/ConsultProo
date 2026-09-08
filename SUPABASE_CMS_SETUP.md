# Supabase CMS setup

The admin dashboard now uses Supabase Auth, the `cms_content` table, Supabase Storage, and the existing `products` table. Customers still do not need an account.

## One-time Supabase steps

1. Open the Supabase project SQL Editor and run the complete `supabase/schema.sql` file again. It is safe to run repeatedly and adds the CMS tables, policies, and storage buckets.
2. Open **Authentication → Users → Add user** and create the administrator email/password. Do not add a customer signup page.
3. Copy that user's UUID and run this query in SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('PASTE_ADMIN_USER_UUID_HERE')
on conflict (user_id) do nothing;
```

## Vercel variables

Add these to the environments where the site runs, then redeploy:

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Keep `SUPABASE_SERVICE_ROLE_KEY`, Razorpay secrets, Resend keys, and `ACCESS_TOKEN_SECRET` server-only. Only the `VITE_SUPABASE_*` values belong in the browser build.

## How publishing works

- The first approved admin login seeds the existing static catalog/content into Supabase when the CMS table is empty.
- Saving or deleting records from the admin dashboard writes to Supabase, so every browser sees the same result.
- Publishing or unpublishing an ebook, villa plan, or premium prompt also updates its `products.active` value and price. Checkout reads that table server-side.
- Paid PDF uploads go into the private `product-files` bucket. Public images go into the `cms-assets` bucket.
