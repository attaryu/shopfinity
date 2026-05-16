import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
	// Public routes with Navbar and Footer layout
	layout('shared/layouts/public-layout.tsx', [
		index('features/product/pages/product-list.tsx'),
		route('login', 'features/auth/pages/login.tsx'),
		route('sign-up', 'features/auth/pages/sign-up.tsx'),
		route('product/:idOrSlug', 'features/product/pages/product-detail.tsx'),
		route('cart', 'features/cart/pages/cart.tsx'),
		route('checkout', 'features/checkout/pages/checkout.tsx'),
		route('checkout/success', 'features/checkout/pages/checkout-success.tsx'),
		route('*', 'pages/not-found.tsx'),
	]),

	// Admin routes with admin layout
	layout('shared/layouts/admin-layout.tsx', [
		route('admin', 'features/admin/pages/admin-home.tsx'),
		route('admin/products', 'features/admin/pages/product-management.tsx'),
		route('admin/categories', 'features/admin/pages/category-management.tsx'),
		route('admin/brands', 'features/admin/pages/brand-management.tsx'),
		route('admin/orders', 'features/admin/pages/order-management.tsx'),
		route('admin/payments', 'features/admin/pages/payment-verification.tsx'),
		route('admin/cash-flow', 'features/admin/pages/cash-flow.tsx'),
	]),
] satisfies RouteConfig;
