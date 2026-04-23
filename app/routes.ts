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
		route('product/:productId', 'features/product/pages/product-detail.tsx'),
		route('*', 'pages/not-found.tsx'),
	]),

	// Admin routes with admin layout
	layout('shared/layouts/admin-layout.tsx', [
		route('admin', 'features/admin/pages/admin-home.tsx'),
		route('admin/products', 'features/admin/pages/product-management.tsx'),
		route('admin/categories', 'features/admin/pages/category-management.tsx'),
		route('admin/brands', 'features/admin/pages/brand-management.tsx'),
	]),
] satisfies RouteConfig;
