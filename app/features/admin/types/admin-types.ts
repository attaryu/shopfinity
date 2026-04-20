export interface AdminProduct {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	stock: number;
	image: string;
	categoryId: string;
	brandId: string;
	category?: AdminCategory;
	brand?: AdminBrand;
	createdAt: string;
}

export interface AdminCategory {
	id: string;
	name: string;
	slug: string;
	productCount?: number;
}

export interface AdminBrand {
	id: string;
	name: string;
	slug: string;
	logo: string;
	productCount?: number;
}

export type ProductFormData = Omit<AdminProduct, 'id' | 'category' | 'brand' | 'createdAt'>;
export type CategoryFormData = Omit<AdminCategory, 'id' | 'productCount'>;
export type BrandFormData = Omit<AdminBrand, 'id' | 'productCount'>;
