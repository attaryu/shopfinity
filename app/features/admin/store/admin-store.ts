import { create } from 'zustand';
import type {
	AdminBrand,
	AdminCategory,
	AdminProduct,
	BrandFormData,
	CategoryFormData,
	ProductFormData,
} from '../types/admin-types';
import { slugify } from '../utils/slugify';

function generateId(): string {
	return crypto.randomUUID();
}


// ─── Seed Data ────────────────────────────────────────────────────────
const seedCategories: AdminCategory[] = [
	{ id: 'cat-1', name: 'Celana', slug: 'celana' },
	{ id: 'cat-2', name: 'Kemeja', slug: 'kemeja' },
	{ id: 'cat-3', name: 'Jaket', slug: 'jaket' },
	{ id: 'cat-4', name: 'Sepatu', slug: 'sepatu' },
	{ id: 'cat-5', name: 'Tas', slug: 'tas' },
	{ id: 'cat-6', name: 'Jam Tangan', slug: 'jam-tangan' },
	{ id: 'cat-7', name: 'Kaos', slug: 'kaos' },
];

const seedBrands: AdminBrand[] = [
	{ id: 'brand-1', name: 'Erigo', slug: 'erigo', logoUrl: 'https://down-id.img.susercontent.com/file/id-11134207-7r98v-ln9iblbq261xb7' },
	{ id: 'brand-2', name: 'Aerostreet', slug: 'aerostreet', logoUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7r992-llemy453lax0a4' },
	{ id: 'brand-3', name: 'Ventela', slug: 'ventela', logoUrl: 'https://down-id.img.susercontent.com/file/0059714f49b1113a336e911c00b0a1aa' },
	{ id: 'brand-4', name: 'Surfinclo', slug: 'surfinclo', logoUrl: 'https://down-id.img.susercontent.com/file/sg-11134201-22120-zu9ynzjsdlkv70' },
	{ id: 'brand-5', name: 'Eiger', slug: 'eiger', logoUrl: 'https://down-id.img.susercontent.com/file/a5aa3574d75bf0f2eecbb88c112e19c1' },
];

const seedProducts: AdminProduct[] = [
	{
		id: 'prod-1',
		name: 'RocketRebels Cargo Fleece Short Pants',
		slug: 'rocketrebels-cargo-fleece-short-pants',
		description: 'RocketRebels Cargo Fleece Short Pants Street Style yang nyaman dan stylish untuk keseharian.',
		price: 250000,
		stock: 45,
		image: 'https://down-id.img.susercontent.com/file/id-11134207-7qul5-lh8stiphfcqrce',
		categoryId: 'cat-1',
		brandId: 'brand-4',
		createdAt: '2026-03-15T10:30:00Z',
	},
	{
		id: 'prod-2',
		name: 'Erigo Hoodie Barnet Black Unisex',
		slug: 'erigo-hoodie-barnet-black-unisex',
		description: 'Hoodie premium unisex dari Erigo dengan bahan cotton fleece berkualitas tinggi.',
		price: 600000,
		stock: 12,
		image: 'https://down-id.img.susercontent.com/file/id-11134201-7r98v-ln9iblbq261xb7',
		categoryId: 'cat-3',
		brandId: 'brand-1',
		createdAt: '2026-03-18T14:00:00Z',
	},
	{
		id: 'prod-3',
		name: 'Aerostreet T Shirt Morpho Menelaus',
		slug: 'aerostreet-t-shirt-morpho-menelaus',
		description: 'Kaos streetwear keren dari Aerostreet dengan desain Morpho Menelaus yang unik.',
		price: 384000,
		stock: 3,
		image: 'https://down-id.img.susercontent.com/file/id-11134201-7r992-llemy453lax0a4',
		categoryId: 'cat-7',
		brandId: 'brand-2',
		createdAt: '2026-03-20T09:15:00Z',
	},
	{
		id: 'prod-4',
		name: 'Ventela Basic Low Black Natural',
		slug: 'ventela-basic-low-black-natural',
		description: 'Sepatu canvas klasik dari Ventela yang cocok untuk berbagai gaya.',
		price: 500000,
		stock: 28,
		image: 'https://down-id.img.susercontent.com/file/0059714f49b1113a336e911c00b0a1aa',
		categoryId: 'cat-4',
		brandId: 'brand-3',
		createdAt: '2026-04-01T11:00:00Z',
	},
	{
		id: 'prod-5',
		name: 'Surfinclo Sweatshirt Crewneck Anime Series',
		slug: 'surfinclo-sweatshirt-crewneck-anime',
		description: 'Sweater crewneck dengan desain anime series, bahan cotton fleece premium.',
		price: 365000,
		stock: 0,
		image: 'https://down-id.img.susercontent.com/file/aab0df9c373103ecfb8c15704d19aa38',
		categoryId: 'cat-3',
		brandId: 'brand-4',
		createdAt: '2026-04-05T16:45:00Z',
	},
	{
		id: 'prod-6',
		name: 'Eiger Provo Watch',
		slug: 'eiger-provo-watch',
		description: 'Jam tangan outdoor dari Eiger dengan desain sporty dan tahan air.',
		price: 500000,
		stock: 7,
		image: 'https://down-id.img.susercontent.com/file/a5aa3574d75bf0f2eecbb88c112e19c1',
		categoryId: 'cat-6',
		brandId: 'brand-5',
		createdAt: '2026-04-10T08:20:00Z',
	},
	{
		id: 'prod-7',
		name: 'Aerostreet T Shirt Be Valuable',
		slug: 'aerostreet-t-shirt-be-valuable',
		description: 'Kaos streetwear motivasi dari Aerostreet. Desain minimalis dan nyaman.',
		price: 403000,
		stock: 2,
		image: 'https://down-id.img.susercontent.com/file/id-11134201-7r991-llen0201d07rd4',
		categoryId: 'cat-7',
		brandId: 'brand-2',
		createdAt: '2026-04-12T13:30:00Z',
	},
	{
		id: 'prod-8',
		name: 'Ventela 70s Ethnic High Black Natural',
		slug: 'ventela-70s-ethnic-high-black',
		description: 'Sepatu vintage ethnic dari Ventela dengan motif tradisional yang modern.',
		price: 500000,
		stock: 15,
		image: 'https://down-id.img.susercontent.com/file/id-11134207-23020-4j5hmmh0dwnv6b',
		categoryId: 'cat-4',
		brandId: 'brand-3',
		createdAt: '2026-04-15T07:00:00Z',
	},
];

// ─── Store Interface ──────────────────────────────────────────────────
interface AdminStore {
	products: AdminProduct[];
	categories: AdminCategory[];
	brands: AdminBrand[];

	// Product CRUD
	addProduct: (data: ProductFormData) => AdminProduct;
	updateProduct: (id: string, data: ProductFormData) => void;
	deleteProduct: (id: string) => void;

	// Category CRUD
	addCategory: (data: CategoryFormData) => AdminCategory;
	updateCategory: (id: string, data: CategoryFormData) => void;
	deleteCategory: (id: string) => void;

	// Brand CRUD
	addBrand: (data: BrandFormData) => AdminBrand;
	updateBrand: (id: string, data: BrandFormData) => void;
	deleteBrand: (id: string) => void;

	// Helpers
	getProductsWithRelations: () => AdminProduct[];
	getCategoryProductCount: (categoryId: string) => number;
	getBrandProductCount: (brandId: string) => number;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
	products: seedProducts,
	categories: seedCategories,
	brands: seedBrands,

	// ─── Product CRUD ───────────────────────────────────────────
	addProduct: (data) => {
		const newProduct: AdminProduct = {
			...data,
			id: generateId(),
			slug: data.slug || slugify(data.name),
			createdAt: new Date().toISOString(),
		};
		set((state) => ({ products: [...state.products, newProduct] }));
		return newProduct;
	},

	updateProduct: (id, data) => {
		set((state) => ({
			products: state.products.map((p) =>
				p.id === id
					? { ...p, ...data, slug: data.slug || slugify(data.name) }
					: p,
			),
		}));
	},

	deleteProduct: (id) => {
		set((state) => ({
			products: state.products.filter((p) => p.id !== id),
		}));
	},

	// ─── Category CRUD ──────────────────────────────────────────
	addCategory: (data) => {
		const newCategory: AdminCategory = {
			...data,
			id: generateId(),
			slug: data.slug || slugify(data.name),
		};
		set((state) => ({ categories: [...state.categories, newCategory] }));
		return newCategory;
	},

	updateCategory: (id, data) => {
		set((state) => ({
			categories: state.categories.map((c) =>
				c.id === id
					? { ...c, ...data, slug: data.slug || slugify(data.name) }
					: c,
			),
		}));
	},

	deleteCategory: (id) => {
		set((state) => ({
			categories: state.categories.filter((c) => c.id !== id),
		}));
	},

	// ─── Brand CRUD ─────────────────────────────────────────────
	addBrand: (data) => {
		const newBrand: AdminBrand = {
			...data,
			id: generateId(),
			slug: data.slug || slugify(data.name),
		};
		set((state) => ({ brands: [...state.brands, newBrand] }));
		return newBrand;
	},

	updateBrand: (id, data) => {
		set((state) => ({
			brands: state.brands.map((b) =>
				b.id === id
					? { ...b, ...data, slug: data.slug || slugify(data.name) }
					: b,
			),
		}));
	},

	deleteBrand: (id) => {
		set((state) => ({
			brands: state.brands.filter((b) => b.id !== id),
		}));
	},

	// ─── Helpers ────────────────────────────────────────────────
	getProductsWithRelations: () => {
		const { products, categories, brands } = get();
		return products.map((p) => ({
			...p,
			category: categories.find((c) => c.id === p.categoryId),
			brand: brands.find((b) => b.id === p.brandId),
		}));
	},

	getCategoryProductCount: (categoryId) => {
		return get().products.filter((p) => p.categoryId === categoryId).length;
	},

	getBrandProductCount: (brandId) => {
		return get().products.filter((p) => p.brandId === brandId).length;
	},
}));

export { slugify };
