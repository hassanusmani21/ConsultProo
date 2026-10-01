-- Keep database constraints aligned with the currencies accepted by checkout.
alter table public.products drop constraint if exists products_currency_check;
alter table public.products add constraint products_currency_check check (currency in ('INR', 'USD', 'AED', 'EUR', 'GBP', 'SGD'));
alter table public.orders drop constraint if exists orders_product_currency_check;
alter table public.orders add constraint orders_product_currency_check check (product_currency in ('INR', 'USD', 'AED', 'EUR', 'GBP', 'SGD'));
