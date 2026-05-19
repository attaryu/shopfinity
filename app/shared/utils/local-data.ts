import type { ApiResponse } from '../types/api-response';

// ─── Raw Seed Data (mirrors admin-store.ts) ──────────────────────────

interface SeedCategory {
	id: string;
	name: string;
	slug: string;
}

interface SeedBrand {
	id: string;
	name: string;
	slug: string;
	logoUrl: string;
}

interface SeedProduct {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	stock: number;
	imageUrl: string;
	categoryId: string;
	brandId: string;
	createdAt: string;
}

const seedCategories: SeedCategory[] = [
	{ id: 'cat-1', name: 'Celana', slug: 'celana' },
	{ id: 'cat-2', name: 'Kemeja', slug: 'kemeja' },
	{ id: 'cat-3', name: 'Jaket', slug: 'jaket' },
	{ id: 'cat-4', name: 'Sepatu', slug: 'sepatu' },
	{ id: 'cat-5', name: 'Tas', slug: 'tas' },
	{ id: 'cat-6', name: 'Jam Tangan', slug: 'jam-tangan' },
	{ id: 'cat-7', name: 'Kaos', slug: 'kaos' },
];

const seedBrands: SeedBrand[] = [
	{ id: 'brand-1', name: 'Erigo', slug: 'erigo', logoUrl: 'https://down-id.img.susercontent.com/file/id-11134207-7r98v-ln9iblbq261xb7' },
	{ id: 'brand-2', name: 'Aerostreet', slug: 'aerostreet', logoUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7r992-llemy453lax0a4' },
	{ id: 'brand-3', name: 'Ventela', slug: 'ventela', logoUrl: 'https://down-id.img.susercontent.com/file/0059714f49b1113a336e911c00b0a1aa' },
	{ id: 'brand-4', name: 'Surfinclo', slug: 'surfinclo', logoUrl: 'https://down-id.img.susercontent.com/file/sg-11134201-22120-zu9ynzjsdlkv70' },
	{ id: 'brand-5', name: 'Eiger', slug: 'eiger', logoUrl: 'https://down-id.img.susercontent.com/file/a5aa3574d75bf0f2eecbb88c112e19c1' },
];

const seedProducts: SeedProduct[] = [
	{ id: 'prod-1', name: 'RocketRebels Cargo Fleece Short Pants', slug: 'rocketrebels-cargo-fleece-short-pants', description: 'RocketRebels Cargo Fleece Short Pants Street Style yang nyaman dan stylish untuk keseharian.', price: 250000, stock: 45, imageUrl: 'https://down-id.img.susercontent.com/file/id-11134207-7qul5-lh8stiphfcqrce', categoryId: 'cat-1', brandId: 'brand-4', createdAt: '2026-03-15T10:30:00Z' },
	{ id: 'prod-2', name: 'Erigo Hoodie Barnet Black Unisex', slug: 'erigo-hoodie-barnet-black-unisex', description: 'Hoodie premium unisex dari Erigo dengan bahan cotton fleece berkualitas tinggi.', price: 600000, stock: 12, imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7r98v-ln9iblbq261xb7', categoryId: 'cat-3', brandId: 'brand-1', createdAt: '2026-03-18T14:00:00Z' },
	{ id: 'prod-3', name: 'Aerostreet T Shirt Morpho Menelaus', slug: 'aerostreet-t-shirt-morpho-menelaus', description: 'Kaos streetwear keren dari Aerostreet dengan desain Morpho Menelaus yang unik.', price: 384000, stock: 3, imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7r992-llemy453lax0a4', categoryId: 'cat-7', brandId: 'brand-2', createdAt: '2026-03-20T09:15:00Z' },
	{ id: 'prod-4', name: 'Ventela Basic Low Black Natural', slug: 'ventela-basic-low-black-natural', description: 'Sepatu canvas klasik dari Ventela yang cocok untuk berbagai gaya.', price: 500000, stock: 28, imageUrl: 'https://down-id.img.susercontent.com/file/0059714f49b1113a336e911c00b0a1aa', categoryId: 'cat-4', brandId: 'brand-3', createdAt: '2026-04-01T11:00:00Z' },
	{ id: 'prod-5', name: 'Surfinclo Sweatshirt Crewneck Anime Series', slug: 'surfinclo-sweatshirt-crewneck-anime', description: 'Sweater crewneck dengan desain anime series, bahan cotton fleece premium.', price: 365000, stock: 0, imageUrl: 'https://down-id.img.susercontent.com/file/aab0df9c373103ecfb8c15704d19aa38', categoryId: 'cat-3', brandId: 'brand-4', createdAt: '2026-04-05T16:45:00Z' },
	{ id: 'prod-6', name: 'Eiger Provo Watch', slug: 'eiger-provo-watch', description: 'Jam tangan outdoor dari Eiger dengan desain sporty dan tahan air.', price: 500000, stock: 7, imageUrl: 'https://down-id.img.susercontent.com/file/a5aa3574d75bf0f2eecbb88c112e19c1', categoryId: 'cat-6', brandId: 'brand-5', createdAt: '2026-04-10T08:20:00Z' },
	{ id: 'prod-7', name: 'Aerostreet T Shirt Be Valuable', slug: 'aerostreet-t-shirt-be-valuable', description: 'Kaos streetwear motivasi dari Aerostreet. Desain minimalis dan nyaman.', price: 403000, stock: 2, imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7r991-llen0201d07rd4', categoryId: 'cat-7', brandId: 'brand-2', createdAt: '2026-04-12T13:30:00Z' },
	{ id: 'prod-8', name: 'Ventela 70s Ethnic High Black Natural', slug: 'ventela-70s-ethnic-high-black', description: 'Sepatu vintage ethnic dari Ventela dengan motif tradisional yang modern.', price: 500000, stock: 15, imageUrl: 'https://down-id.img.susercontent.com/file/id-11134207-23020-4j5hmmh0dwnv6b', categoryId: 'cat-4', brandId: 'brand-3', createdAt: '2026-04-15T07:00:00Z' },
];

const getCategory = (id: string) => seedCategories.find((c) => c.id === id);
const getBrand = (id: string) => seedBrands.find((b) => b.id === id);

export function isApiAvailable(): boolean {
	return Boolean(import.meta.env.VITE_API_URL);
}

// ─── Client-facing data ─────────────────────────────────────────────

export function getLocalClientProducts(params: {
	search?: string;
	category?: string;
	brand?: string;
	minPrice?: number;
	maxPrice?: number;
	offset?: number;
	limit?: number;
}) {
	let filtered = [...seedProducts];

	if (params.search) {
		const q = params.search.toLowerCase();
		filtered = filtered.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				p.description.toLowerCase().includes(q),
		);
	}
	if (params.category) {
		const cat = seedCategories.find((c) => c.slug === params.category);
		if (cat) filtered = filtered.filter((p) => p.categoryId === cat.id);
	}
	if (params.brand) {
		const brand = seedBrands.find((b) => b.slug === params.brand);
		if (brand) filtered = filtered.filter((p) => p.brandId === brand.id);
	}
	if (params.minPrice !== undefined) {
		filtered = filtered.filter((p) => p.price >= params.minPrice!);
	}
	if (params.maxPrice !== undefined) {
		filtered = filtered.filter((p) => p.price <= params.maxPrice!);
	}

	const totalItems = filtered.length;
	const offset = params.offset || 0;
	const limit = params.limit || totalItems;
	const paged = filtered.slice(offset, offset + limit);

	const products = paged.map((p) => ({
		id: p.id,
		name: p.name,
		slug: p.slug,
		imageUrl: p.imageUrl,
		price: p.price,
		category: getCategory(p.categoryId)!,
		brand: getBrand(p.brandId)!,
	}));

	return { products, meta: { totalItems } };
}

export function getLocalProduct(idOrSlug: string) {
	const product =
		seedProducts.find((p) => p.id === idOrSlug) ||
		seedProducts.find((p) => p.slug === idOrSlug);
	if (!product) return undefined;

	return {
		...product,
		category: getCategory(product.categoryId)!,
		brand: getBrand(product.brandId)!,
		updatedAt: product.createdAt,
	};
}

export function getLocalClientCategories() {
	return seedCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export function getLocalClientBrands() {
	return seedBrands.map((b) => ({
		id: b.id,
		name: b.name,
		slug: b.slug,
		logoUrl: b.logoUrl,
	}));
}

// ─── Admin data ─────────────────────────────────────────────────────

export function getLocalAdminProducts(params: {
	page?: number;
	limit?: number;
	search?: string;
	categoryId?: string;
	brandId?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}): ApiResponse<{ products: (SeedProduct & { category?: SeedCategory; brand?: SeedBrand })[]; meta: { totalItems: number; totalPages: number; page: number; limit: number } }> {
	let filtered = [...seedProducts];

	if (params.search) {
		const q = params.search.toLowerCase();
		filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
	}
	if (params.categoryId && params.categoryId !== 'all') {
		filtered = filtered.filter((p) => p.categoryId === params.categoryId);
	}
	if (params.brandId && params.brandId !== 'all') {
		filtered = filtered.filter((p) => p.brandId === params.brandId);
	}

	if (params.sortBy === 'createdAt') {
		filtered.sort((a, b) =>
			params.sortOrder === 'asc'
				? a.createdAt.localeCompare(b.createdAt)
				: b.createdAt.localeCompare(a.createdAt),
		);
	} else if (params.sortBy === 'price') {
		filtered.sort((a, b) =>
			params.sortOrder === 'asc' ? a.price - b.price : b.price - a.price,
		);
	} else if (params.sortBy === 'name') {
		filtered.sort((a, b) =>
			params.sortOrder === 'asc'
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name),
		);
	}

	const totalItems = filtered.length;
	const page = params.page || 1;
	const limit = params.limit || 10;
	const totalPages = Math.ceil(totalItems / limit) || 1;
	const start = (page - 1) * limit;
	const paged = filtered.slice(start, start + limit);

	const products = paged.map((p) => ({
		...p,
		category: getCategory(p.categoryId),
		brand: getBrand(p.brandId),
	}));

	return {
		success: true,
		statusCode: 200,
		message: 'OK',
		data: { products, meta: { totalItems, totalPages, page, limit } },
		error: null,
	};
}

export function getLocalAdminCategories(params: {
	page?: number;
	limit?: number;
	search?: string;
}): ApiResponse<{ categories: (SeedCategory & { productCount?: number })[]; meta: { totalItems: number; totalPages: number; page: number; limit: number } }> {
	let filtered = [...seedCategories];

	if (params.search) {
		const q = params.search.toLowerCase();
		filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
	}

	const totalItems = filtered.length;
	const page = params.page || 1;
	const limit = params.limit || 10;
	const totalPages = Math.ceil(totalItems / limit) || 1;
	const start = (page - 1) * limit;
	const paged = filtered.slice(start, start + limit);

	return {
		success: true,
		statusCode: 200,
		message: 'OK',
		data: { categories: paged, meta: { totalItems, totalPages, page, limit } },
		error: null,
	};
}

export function getLocalAdminBrands(params: {
	page?: number;
	limit?: number;
	search?: string;
}): ApiResponse<{ brands: (SeedBrand & { productCount?: number })[]; meta: { totalItems: number; totalPages: number; page: number; limit: number } }> {
	let filtered = [...seedBrands];

	if (params.search) {
		const q = params.search.toLowerCase();
		filtered = filtered.filter((b) => b.name.toLowerCase().includes(q));
	}

	const totalItems = filtered.length;
	const page = params.page || 1;
	const limit = params.limit || 10;
	const totalPages = Math.ceil(totalItems / limit) || 1;
	const start = (page - 1) * limit;
	const paged = filtered.slice(start, start + limit);

	return {
		success: true,
		statusCode: 200,
		message: 'OK',
		data: { brands: paged, meta: { totalItems, totalPages, page, limit } },
		error: null,
	};
}

export function getLocalCategoriesList() {
	return seedCategories.map((c) => ({ id: c.id, name: c.name }));
}

export function getLocalBrandsList() {
	return seedBrands.map((b) => ({ id: b.id, name: b.name }));
}

export function getLocalDashboard() {
	const allStock = seedProducts.reduce((sum, p) => sum + p.stock, 0);
	const lowStockProducts = seedProducts
		.filter((p) => p.stock <= 5)
		.map((p) => ({
			id: p.id,
			name: p.name,
			slug: p.slug,
			stock: p.stock,
			imageUrl: p.imageUrl,
		}));

	return {
		total: {
			product: seedProducts.length,
			category: seedCategories.length,
			brand: seedBrands.length,
		},
		allStock,
		productStockAverate: Math.round(allStock / seedProducts.length),
		lowStockProducts,
	};
}
