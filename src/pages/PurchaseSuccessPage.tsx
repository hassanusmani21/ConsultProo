import React from 'react';
import { ArrowLeft, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PurchaseSuccessState {
  orderId?: string;
  customerName?: string;
  productName?: string;
  accessUrl?: string;
  deliveryType?: 'pdf' | 'video' | 'course';
  localMode?: boolean;
  paymentId?: string;
}

const isProtectedAccessUrl = (value: unknown): value is string => (
  typeof value === 'string' && value.startsWith('/api/access?token=')
);

export default function PurchaseSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as PurchaseSuccessState;
  const hasOrderDetails = Boolean(state.orderId && state.customerName && state.productName);
  const hasAccess = isProtectedAccessUrl(state.accessUrl);
  const isPdf = state.deliveryType === 'pdf' || !state.deliveryType;

  if (!hasOrderDetails) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 text-[#12141a]">
        <section className="w-full max-w-md rounded-2xl border border-[#12141a]/10 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold">Purchase details unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4a4d57]">This page is available after a payment has been verified.</p>
          <button type="button" onClick={() => navigate('/#shop')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#12141a] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#9e825d]">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-8 text-[#12141a] sm:px-6 sm:py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-[#12141a]/10 bg-white p-6 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9e825d]">Order confirmed</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">Payment Successful</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#4a4d57]">Thank you for your purchase, <strong className="text-[#12141a]">{state.customerName}</strong>.</p>
        </div>

        <dl className="mt-8 divide-y divide-[#12141a]/10 rounded-xl border border-[#12141a]/10 bg-[#faf8f5]">
          <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#747783]">Product</dt>
            <dd className="text-sm font-bold sm:text-right">{state.productName}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#747783]">Order ID</dt>
            <dd className="break-all text-sm font-semibold sm:text-right">{state.orderId}</dd>
          </div>
        </dl>

        <div className="mt-8 text-center">
          {hasAccess ? (
            <a href={state.accessUrl} target="_blank" rel="noopener noreferrer" download={isPdf ? true : undefined} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12141a] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#9e825d] sm:w-auto">
              {isPdf ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              Access Your Product
            </a>
          ) : (
            <div className="rounded-xl border border-[#9e825d]/30 bg-[#faf8f5] px-4 py-3 text-sm leading-relaxed text-[#4a4d57]">
              {state.localMode
                ? 'Payment verified in local test mode. Secure product delivery will be enabled when product storage is configured.'
                : 'Payment was verified, but secure product access could not be generated. Please contact support with your order ID.'}
            </div>
          )}
          {state.paymentId && <p className="mt-3 break-all text-xs text-[#747783]">Payment ID: {state.paymentId}</p>}
          <p className="mt-4 text-xs leading-relaxed text-[#747783]">Your access is protected and linked to this paid order.</p>
        </div>
      </section>
    </main>
  );
}
