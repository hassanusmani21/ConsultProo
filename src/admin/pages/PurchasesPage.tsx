import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, ReceiptText, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type PurchaseStatus = 'ALL' | 'PAID' | 'PENDING_PAYMENT';

interface PurchaseCustomer {
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  country_code?: string;
}

interface PurchaseRow {
  id: string;
  status: 'PENDING_PAYMENT' | 'PAID';
  product_name: string;
  product_price: number | string;
  product_currency: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
  created_at: string;
  customer?: PurchaseCustomer | PurchaseCustomer[] | null;
}

const statusFilters: { label: string; value: PurchaseStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Pending', value: 'PENDING_PAYMENT' },
];

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const formatAmount = (amount: number | string, currency: string) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return `${currency} ${amount}`;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const getCustomer = (row: PurchaseRow) => {
  if (Array.isArray(row.customer)) return row.customer[0] || {};
  return row.customer || {};
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPurchases = async () => {
    setIsLoading(true);
    setError('');

    if (!supabase) {
      setPurchases([]);
      setError('Supabase is not configured for this deployment.');
      setIsLoading(false);
      return;
    }

    const { data, error: purchaseError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        product_name,
        product_price,
        product_currency,
        razorpay_order_id,
        razorpay_payment_id,
        paid_at,
        created_at,
        customer:customers (
          full_name,
          email,
          phone,
          country,
          country_code
        )
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (purchaseError) {
      setPurchases([]);
      setError(purchaseError.message);
    } else {
      setPurchases((data || []) as PurchaseRow[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void loadPurchases();
  }, []);

  const filteredPurchases = useMemo(() => (
    statusFilter === 'ALL'
      ? purchases
      : purchases.filter((purchase) => purchase.status === statusFilter)
  ), [purchases, statusFilter]);

  const paidCount = purchases.filter((purchase) => purchase.status === 'PAID').length;
  const pendingCount = purchases.filter((purchase) => purchase.status === 'PENDING_PAYMENT').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="mt-1 text-sm text-[#9a9da8]">Customer details and payment records from checkout.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadPurchases()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#14161f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#bfa37c]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#14161f] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Total Orders</span>
            <ReceiptText className="h-5 w-5 text-[#bfa37c]" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{purchases.length}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#14161f] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Paid</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{paidCount}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#14161f] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Pending</span>
            <Clock3 className="h-5 w-5 text-amber-300" />
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{pendingCount}</div>
        </div>
      </div>

      <div className="flex rounded-lg border border-white/10 bg-[#14161f] p-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === filter.value
                ? 'bg-[#bfa37c] text-[#0e1015]'
                : 'text-[#9a9da8] hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#14161f]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-[#181a24] text-xs uppercase tracking-wider text-[#9a9da8]">
              <tr>
                <th className="px-4 py-3 font-bold">Customer</th>
                <th className="px-4 py-3 font-bold">Country</th>
                <th className="px-4 py-3 font-bold">Phone</th>
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Amount</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Payment</th>
                <th className="px-4 py-3 font-bold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[#9a9da8]">Loading purchases...</td>
                </tr>
              )}
              {!isLoading && filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[#9a9da8]">No purchase records found.</td>
                </tr>
              )}
              {!isLoading && filteredPurchases.map((purchase) => {
                const customer = getCustomer(purchase);
                return (
                  <tr key={purchase.id} className="align-top text-[#d8d9df]">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white">{customer.full_name || '-'}</div>
                      <div className="mt-1 break-all text-xs text-[#9a9da8]">{customer.email || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{customer.country || '-'}</div>
                      <div className="mt-1 text-xs uppercase text-[#9a9da8]">{customer.country_code || ''}</div>
                    </td>
                    <td className="break-all px-4 py-4">{customer.phone || '-'}</td>
                    <td className="px-4 py-4">{purchase.product_name}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-white">{formatAmount(purchase.product_price, purchase.product_currency)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        purchase.status === 'PAID'
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-amber-300/10 text-amber-200'
                      }`}>
                        {purchase.status === 'PAID' ? 'Paid' : 'Pending'}
                      </span>
                      {purchase.paid_at && <div className="mt-2 whitespace-nowrap text-xs text-[#9a9da8]">{formatDate(purchase.paid_at)}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="break-all text-xs text-[#9a9da8]">Order: {purchase.razorpay_order_id || '-'}</div>
                      <div className="mt-1 break-all text-xs text-[#9a9da8]">Payment: {purchase.razorpay_payment_id || '-'}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#9a9da8]">{formatDate(purchase.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
