import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useData } from '../data/DataContext';
import { isCheckoutProduct, productCheckoutRoute } from '../utils/productLinks';

const purchasableCollections = ['ebooks', 'villaPlans', 'aiPrompts', 'digitalProducts'];

export default function DirectCheckoutPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data } = useData();
  const collection = purchasableCollections.find((key) => (
    (data[key] ?? []).some((item: any) => item.id === productId && isCheckoutProduct(key, item))
  ));

  if (!productId || !collection) return <Navigate to="/#shop" replace />;
  return <Navigate to={productCheckoutRoute(collection, productId)} replace />;
}
