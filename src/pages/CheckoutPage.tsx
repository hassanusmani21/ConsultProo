import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Globe2, Mail, Phone, User } from 'lucide-react';
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min/es6';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../data/DataContext';
import { PriceDisplay } from '../components/PriceDisplay';
import { countryOptions, defaultCountryCode, getCountryByCode } from '../data/countryOptions';

interface CheckoutForm {
  fullName: string;
  email: string;
  countryCode: string;
  mobile: string;
}

type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

interface PaymentOrderDetails {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  productName?: string;
}

const getAmountInPaise = (price: string | number | undefined) => {
  const numericValue = Number(String(price ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numericValue) ? Math.round(numericValue * 100) : 0;
};

const getProductDetails = (product: any) => {
  if (!product) return null;

  return {
    id: product.id,
    title: product.title || product.name || 'Selected product',
    image: product.coverImage || product.previewImage || product.thumbnail || product.resultImage || product.image,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    amountInPaise: getAmountInPaise(product.price),
    currency: product.currency || 'INR',
  };
};

const loadRazorpayScript = () => new Promise<void>((resolve, reject) => {
  if ((window as any).Razorpay) {
    resolve();
    return;
  }

  const existingScript = document.querySelector('script[data-razorpay-checkout]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(), { once: true });
    existingScript.addEventListener('error', () => reject(new Error('Payment interface could not be loaded.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.razorpayCheckout = 'true';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Payment interface could not be loaded.'));
  document.body.appendChild(script);
});

const normalizeInternationalPhone = (value: string, dialCode: string) => {
  let phone = value.trim().replace(/[()\s.-]/g, '');
  const dialDigits = dialCode.replace(/\D/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (!phone.startsWith('+') && dialCode) {
    phone = phone.startsWith(dialDigits) ? `+${phone}` : `${dialCode}${phone.replace(/^0+/, '')}`;
  }
  return phone;
};

const validatePhoneForCountry = (value: string, countryCode: string, dialCode: string) => {
  const normalizedInput = normalizeInternationalPhone(value, dialCode);
  const phoneNumber = countryCode === 'OTHER'
    ? parsePhoneNumberFromString(normalizedInput)
    : parsePhoneNumberFromString(normalizedInput, countryCode as CountryCode);

  if (!phoneNumber?.isValid()) return null;
  if (countryCode !== 'OTHER' && phoneNumber.country && phoneNumber.country !== countryCode) return null;
  return phoneNumber.number;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { collection, productId } = useParams<{ collection: string; productId: string }>();
  const { data } = useData();
  const [form, setForm] = useState<CheckoutForm>({ fullName: '', email: '', countryCode: defaultCountryCode, mobile: '' });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrderDetails | null>(null);
  const [paymentOpened, setPaymentOpened] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'PENDING_PAYMENT' | 'PAID' | null>(null);
  const [checkoutStorageHydrated, setCheckoutStorageHydrated] = useState(false);
  const submitLockRef = useRef(false);
  const checkoutAttemptIdRef = useRef<string | null>(null);

  const checkoutStorageKey = `checkout:${collection || 'unknown'}:${productId || 'unknown'}`;

  const clearSavedCheckout = () => {
    try {
      window.sessionStorage.removeItem(checkoutStorageKey);
    } catch {
      // Session storage can be unavailable in privacy-restricted browsers.
    }
  };

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(checkoutStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.form && parsed?.paymentOrder) {
          setForm({
            fullName: parsed.form.fullName || '',
            email: parsed.form.email || '',
            countryCode: parsed.form.countryCode || defaultCountryCode,
            mobile: parsed.form.mobile || '',
          });
          setPaymentOrder(parsed.paymentOrder);
          setOrderStatus('PENDING_PAYMENT');
          checkoutAttemptIdRef.current = parsed.checkoutAttemptId || null;
        }
      }
    } catch {
      clearSavedCheckout();
    } finally {
      setCheckoutStorageHydrated(true);
    }
  }, [checkoutStorageKey]);

  useEffect(() => {
    if (!checkoutStorageHydrated || !paymentOrder) return;

    try {
      window.sessionStorage.setItem(checkoutStorageKey, JSON.stringify({
        form,
        paymentOrder,
        checkoutAttemptId: checkoutAttemptIdRef.current,
      }));
    } catch {
      // Session storage is an enhancement; payment flow remains usable without it.
    }
  }, [checkoutStorageHydrated, checkoutStorageKey, form, paymentOrder]);

  const product = useMemo(() => {
    const collectionKey = collection === 'villa-plans'
      ? 'villaPlans'
      : collection === 'ai-prompts'
        ? 'aiPrompts'
        : collection === 'digital-products'
          ? 'digitalProducts'
        : collection;
    const records = data[collectionKey] || [];
    return records.find((item: any) => item.id === productId);
  }, [collection, data, productId]);

  const productDetails = getProductDetails(product);
  const selectedCountry = getCountryByCode(form.countryCode);
  const normalizedMobile = validatePhoneForCountry(form.mobile, selectedCountry.code, selectedCountry.dialCode) || normalizeInternationalPhone(form.mobile, selectedCountry.dialCode);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsValidated(false);
    setSubmitError('');
    setPaymentOrder(null);
    setPaymentOpened(false);
    setOrderStatus(null);
    checkoutAttemptIdRef.current = null;
    clearSavedCheckout();
  };

  const validateForm = () => {
    const nextErrors: CheckoutErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.countryCode.trim()) nextErrors.countryCode = 'Country is required.';
    if (!form.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required.';
    } else if (!validatePhoneForCountry(form.mobile, selectedCountry.code, selectedCountry.dialCode)) {
      nextErrors.mobile = selectedCountry.dialCode
        ? `Enter a valid mobile number for ${selectedCountry.name}.`
        : 'Enter a valid international number starting with + and the country code.';
    }

    setErrors(nextErrors);
    setIsValidated(Object.keys(nextErrors).length === 0);
    return Object.keys(nextErrors).length === 0;
  };

  const verifyPayment = async (details: PaymentOrderDetails, razorpayResponse: any) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: details.orderId,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.verified || result.status !== 'PAID') {
        throw new Error(result.error || 'Payment verification failed. The order remains PENDING_PAYMENT.');
      }

      setOrderStatus('PAID');
      setPaymentOpened(false);
      clearSavedCheckout();

      navigate('/purchase-success', {
        replace: true,
        state: {
          orderId: details.orderId,
          customerName: form.fullName.trim(),
          productName: result.productName || productDetails?.title || 'Purchased product',
          productId: result.productId || productDetails?.id,
          accessUrl: result.accessUrl,
          deliveryType: result.deliveryType || 'pdf',
          localMode: Boolean(result.localMode),
          paymentId: result.paymentId,
          emailSent: Boolean(result.emailSent),
        },
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Payment verification failed. The order remains PENDING_PAYMENT.');
      setOrderStatus('PENDING_PAYMENT');
      setPaymentOpened(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPayment = async (details: PaymentOrderDetails) => {
    if (paymentOpened || orderStatus === 'PAID') return;

    setIsSubmitting(true);
    try {
      await loadRazorpayScript();
      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) throw new Error('Payment interface could not be loaded.');
      let successCallbackReceived = false;
      let paymentFailureReceived = false;

      const checkout = new Razorpay({
        // The server-created order and this key must belong to the same Razorpay account.
        key: details.keyId,
        amount: details.amount,
        currency: details.currency,
        name: 'Ar. Ahmed Usmani',
        description: productDetails?.title,
        order_id: details.razorpayOrderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: normalizedMobile,
        },
        notes: { internalOrderId: details.orderId },
        theme: { color: '#bfa37c' },
        handler: (response: any) => {
          if (successCallbackReceived) return;
          successCallbackReceived = true;
          void verifyPayment(details, response);
        },
        modal: {
          ondismiss: () => {
            setPaymentOpened(false);
            setOrderStatus('PENDING_PAYMENT');
            if (!successCallbackReceived && !paymentFailureReceived) setSubmitError('Payment window closed. Your order remains PENDING_PAYMENT. You can try again.');
          },
        },
      });

      checkout.on('payment.failed', () => {
        if (successCallbackReceived) return;
        paymentFailureReceived = true;
        setPaymentOpened(false);
        setOrderStatus('PENDING_PAYMENT');
        setSubmitError('Payment was not completed. Your order remains PENDING_PAYMENT. You can try again.');
      });
      checkout.open();
      setPaymentOpened(true);
    } catch (error) {
      setIsValidated(false);
      setSubmitError(error instanceof Error ? error.message : 'Payment could not be opened. Please try again.');
      setPaymentOpened(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (submitLockRef.current || paymentOpened) return;
    submitLockRef.current = true;

    try {
      if (paymentOrder) {
        await openPayment(paymentOrder);
        return;
      }
      if (!validateForm() || !productDetails) return;

      setIsSubmitting(true);
      setSubmitError('');
      checkoutAttemptIdRef.current ||= window.crypto.randomUUID();

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: productDetails.amountInPaise,
          currency: productDetails.currency,
          receipt: `receipt_${productDetails.id}_${Date.now()}`.slice(0, 40),
          idempotencyKey: checkoutAttemptIdRef.current,
          customer: {
            fullName: form.fullName,
            email: form.email,
            countryCode: selectedCountry.code,
            country: selectedCountry.name,
            dialCode: selectedCountry.dialCode,
            mobile: normalizedMobile,
          },
          product: { id: productDetails.id },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Payment could not be initiated. Please try again.');
      if (!result.orderId || !result.razorpayOrderId || !result.keyId || !result.amount || !result.currency) {
        throw new Error('Payment order details were incomplete. Please try again.');
      }
      if (result.amount !== productDetails.amountInPaise || result.currency !== productDetails.currency) {
        throw new Error('The product price has changed. Please refresh the page and try again.');
      }

      const nextPaymentOrder: PaymentOrderDetails = {
        orderId: result.orderId,
        razorpayOrderId: result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
        keyId: result.keyId,
        productName: result.product?.name,
      };
      setPaymentOrder(nextPaymentOrder);
      setOrderStatus('PENDING_PAYMENT');
      await openPayment(nextPaymentOrder);
    } catch (error) {
      setIsValidated(false);
      setSubmitError(error instanceof Error ? error.message : 'We could not save your order. Please try again.');
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  if (!productDetails) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 text-[#12141a]">
        <div className="w-full max-w-md rounded-2xl border border-[#12141a]/10 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold">Product unavailable</h1>
          <p className="mt-3 text-sm text-[#4a4d57]">This product could not be found. Please return to the shop and try again.</p>
          <button type="button" onClick={() => navigate('/#shop')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#12141a] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] px-4 py-8 text-[#12141a] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#747783] transition-colors hover:text-[#12141a]">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9e825d]">Secure Checkout</div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Complete your details.</h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#4a4d57]">Enter your contact details to continue to the payment step.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-[#12141a]/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9e825d]">Your selection</div>
            {productDetails.image && <div className="mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-[#12141a]/10 bg-[#ebe7df]"><img src={productDetails.image} alt={productDetails.title} className="h-full w-full object-cover" /></div>}
            <h2 className="text-xl font-bold leading-snug">{productDetails.title}</h2>
            <div className="mt-4 flex items-center justify-between border-t border-[#12141a]/10 pt-4">
              <span className="text-xs uppercase tracking-wider text-[#747783]">Total</span>
              <PriceDisplay
                price={paymentOrder ? paymentOrder.amount / 100 : productDetails.price}
                compareAtPrice={productDetails.compareAtPrice}
                currency={paymentOrder?.currency || productDetails.currency}
                currentClassName="text-2xl font-extrabold"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#12141a]/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-[#12141a]/10 pb-4"><CreditCard className="h-4 w-4 text-[#9e825d]" /><h2 className="text-sm font-bold uppercase tracking-[0.14em]">Customer details</h2></div>
            <form onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }} className="space-y-5" noValidate>
              <div>
                <label htmlFor="checkout-full-name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#747783]">Full Name</label>
                <div className="relative"><User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e825d]" /><input id="checkout-full-name" type="text" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} aria-invalid={Boolean(errors.fullName)} className="w-full rounded-lg border border-[#12141a]/15 bg-[#faf8f5] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#9e825d] aria-[invalid=true]:border-red-500" placeholder="Your full name" /></div>
                {errors.fullName && <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="checkout-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#747783]">Email Address</label>
                <div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e825d]" /><input id="checkout-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} className="w-full rounded-lg border border-[#12141a]/15 bg-[#faf8f5] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#9e825d] aria-[invalid=true]:border-red-500" placeholder="you@example.com" /></div>
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="checkout-country" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#747783]">Country</label>
                <div className="relative">
                  <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e825d]" />
                  <select id="checkout-country" value={form.countryCode} onChange={(event) => updateField('countryCode', event.target.value)} aria-invalid={Boolean(errors.countryCode)} className="w-full appearance-none rounded-lg border border-[#12141a]/15 bg-[#faf8f5] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#9e825d] aria-[invalid=true]:border-red-500">
                    {countryOptions.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}{country.dialCode ? ` (${country.dialCode})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.countryCode && <p className="mt-1.5 text-xs text-red-600">{errors.countryCode}</p>}
              </div>
              <div>
                <label htmlFor="checkout-mobile" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#747783]">Mobile Number</label>
                <div className="relative"><Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e825d]" /><input id="checkout-mobile" type="tel" value={form.mobile} onChange={(event) => updateField('mobile', event.target.value)} aria-invalid={Boolean(errors.mobile)} inputMode="tel" className="w-full rounded-lg border border-[#12141a]/15 bg-[#faf8f5] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#9e825d] aria-[invalid=true]:border-red-500" placeholder={selectedCountry.dialCode ? `${selectedCountry.dialCode} mobile number` : '+1 555 123 4567'} /></div>
                {errors.mobile && <p className="mt-1.5 text-xs text-red-600">{errors.mobile}</p>}
              </div>
              <button type="submit" disabled={isSubmitting || paymentOpened || orderStatus === 'PAID'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12141a] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#9e825d] disabled:cursor-not-allowed disabled:opacity-70">
                {orderStatus === 'PAID' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <CreditCard className="h-4 w-4" />}
                {isSubmitting ? 'Verifying Payment...' : orderStatus === 'PAID' ? 'Payment Verified' : paymentOpened ? 'Payment Window Opened' : paymentOrder ? 'Open Payment Again' : 'Proceed to Payment'}
              </button>
              {submitError && <p className="rounded-lg border border-red-500/20 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-700">{submitError}</p>}
              {paymentOrder && orderStatus !== 'PAID' && <p className="text-center text-xs leading-relaxed text-[#4a4d57]">Order <strong>{paymentOrder.orderId}</strong> is <strong>PENDING_PAYMENT</strong>. Opening payment does not mark the order as paid.</p>}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
