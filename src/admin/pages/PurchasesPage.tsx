import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, Download, Printer, ReceiptText, RefreshCw, Search, X } from 'lucide-react';
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
  product_id: string;
  product_name: string;
  product_price: number | string;
  product_currency: string;
  customer_id: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
  client_order_id?: string | null;
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

const csvValue = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPurchases = async (syncRazorpay = false) => {
    setIsLoading(true);
    setError('');
    setNotice('');

    if (!supabase) {
      setPurchases([]);
      setError('Supabase is not configured for this deployment.');
      setIsLoading(false);
      return;
    }

    if (syncRazorpay) setIsSyncing(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.access_token) {
        throw new Error('Your admin session has expired. Please sign in again.');
      }

      const endpoint = `/api/admin-purchases${syncRazorpay ? '?sync=1' : ''}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Purchases could not be loaded.');

      setPurchases((result.purchases || []) as PurchaseRow[]);
      if (syncRazorpay) {
        const synced = Number(result.synced || 0);
        const warnings = Array.isArray(result.warnings) ? result.warnings : [];
        setNotice(synced > 0 ? `${synced} Razorpay payment${synced === 1 ? '' : 's'} synchronized.` : 'No new captured Razorpay payments were found.');
        if (warnings.length > 0) setError(warnings.join(' '));
      }
    } catch (loadError) {
      setPurchases([]);
      setError(loadError instanceof Error ? loadError.message : 'Purchases could not be loaded.');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    void loadPurchases();
  }, []);

  const filteredPurchases = useMemo(() => purchases.filter((purchase) => {
    const customer = getCustomer(purchase);
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = !search || [
      purchase.id,
      purchase.product_id,
      purchase.product_name,
      purchase.customer_id,
      purchase.razorpay_order_id,
      purchase.razorpay_payment_id,
      purchase.client_order_id,
      customer.full_name,
      customer.email,
      customer.phone,
    ].some((value) => String(value || '').toLowerCase().includes(search));
    const createdAt = new Date(purchase.created_at).getTime();
    const startsAfter = !fromDate || createdAt >= new Date(`${fromDate}T00:00:00`).getTime();
    const endsBefore = !toDate || createdAt <= new Date(`${toDate}T23:59:59.999`).getTime();
    const matchesStatus = statusFilter === 'ALL' || purchase.status === statusFilter;
    return matchesSearch && startsAfter && endsBefore && matchesStatus;
  }), [purchases, searchTerm, fromDate, toDate, statusFilter]);

  const paidCount = purchases.filter((purchase) => purchase.status === 'PAID').length;
  const pendingCount = purchases.filter((purchase) => purchase.status === 'PENDING_PAYMENT').length;

  const clearFilters = () => {
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setStatusFilter('ALL');
  };

  const exportCsv = () => {
    const header = ['Customer ID', 'Customer Name', 'Email', 'Country', 'Phone', 'Product ID', 'Product', 'Amount', 'Currency', 'Status', 'Razorpay Order ID', 'Razorpay Payment ID', 'Created At', 'Paid At'];
    const rows = filteredPurchases.map((purchase) => {
      const customer = getCustomer(purchase);
      return [
        purchase.customer_id,
        customer.full_name,
        customer.email,
        `${customer.country || ''} (${customer.country_code || ''})`,
        customer.phone,
        purchase.product_id,
        purchase.product_name,
        purchase.product_price,
        purchase.product_currency,
        purchase.status,
        purchase.razorpay_order_id,
        purchase.razorpay_payment_id,
        formatDate(purchase.created_at),
        formatDate(purchase.paid_at),
      ].map(csvValue).join(',');
    });
    const csv = [header.map(csvValue).join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    link.download = `purchases-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <div className="print-report space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="mt-1 text-sm text-[#9a9da8]">Customer details and payment records from checkout.</p>
        </div>
        <div className="print:hidden flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadPurchases(true)} disabled={isSyncing || isLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#bfa37c]/40 bg-[#bfa37c]/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d6be9c] transition-colors hover:border-[#bfa37c] disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Razorpay
          </button>
          <button type="button" onClick={() => void loadPurchases()} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#14161f] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#bfa37c] disabled:opacity-60">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {notice && <div className="print:hidden rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{notice}</div>}

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

      <div className="print:hidden grid gap-3 rounded-xl border border-white/10 bg-[#14161f] p-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label className="relative block">
          <span className="sr-only">Search purchases</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9da8]" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, email, phone, product, order or customer ID" className="w-full rounded-lg border border-white/10 bg-[#0e1015] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#6f7280] focus:border-[#bfa37c]" />
        </label>
        <label className="relative block">
          <span className="sr-only">From date</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9da8]" />
          <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0e1015] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#bfa37c]" />
        </label>
        <label className="relative block">
          <span className="sr-only">To date</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9da8]" />
          <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0e1015] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#bfa37c]" />
        </label>
        <button type="button" onClick={clearFilters} title="Clear filters" aria-label="Clear filters" className="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 text-[#9a9da8] hover:bg-[#181a24] hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="print:hidden flex rounded-lg border border-white/10 bg-[#14161f] p-1">
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

      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 text-xs text-[#9a9da8]">
        <span>Showing {filteredPurchases.length} of {purchases.length} records</span>
        <div className="flex gap-2">
          <button type="button" onClick={exportCsv} disabled={filteredPurchases.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#14161f] px-3 py-2 font-bold uppercase tracking-wider text-white hover:border-[#bfa37c] disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" />
            Excel CSV
          </button>
          <button type="button" onClick={() => window.print()} disabled={filteredPurchases.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#14161f] px-3 py-2 font-bold uppercase tracking-wider text-white hover:border-[#bfa37c] disabled:cursor-not-allowed disabled:opacity-50">
            <Printer className="h-4 w-4" />
            PDF / Print
          </button>
        </div>
      </div>

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
                      <div className="mt-1 break-all text-[10px] text-[#6f7280]">ID: {purchase.customer_id || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{customer.country || '-'}</div>
                      <div className="mt-1 text-xs uppercase text-[#9a9da8]">{customer.country_code || ''}</div>
                    </td>
                    <td className="break-all px-4 py-4">{customer.phone || '-'}</td>
                    <td className="px-4 py-4"><div>{purchase.product_name}</div><div className="mt-1 break-all text-[10px] text-[#6f7280]">{purchase.product_id || '-'}</div></td>
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
                      <div className="mt-1 break-all text-[10px] text-[#6f7280]">Internal: {purchase.id}</div>
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
