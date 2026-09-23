const collectionRoutes: Record<string, string> = {
  villaPlans: 'villa-plans',
  aiPrompts: 'ai-prompts',
  digitalProducts: 'digital-products',
};

const checkoutCollections = new Set(['ebooks', 'villaPlans', 'aiPrompts', 'digitalProducts']);

export const isCheckoutProduct = (collection: string, item: any) => (
  checkoutCollections.has(collection)
  && item?.published !== false
  && Number(item?.price) > 0
  && (collection !== 'aiPrompts' || String(item?.type).toUpperCase() === 'PREMIUM')
);

export const productCollectionRoute = (collection: string) => collectionRoutes[collection] || collection;

export const productCheckoutPath = (productId: string) => `/buy/${encodeURIComponent(productId)}`;

export const productCheckoutRoute = (collection: string, productId: string) => (
  `/checkout/${productCollectionRoute(collection)}/${encodeURIComponent(productId)}`
);
