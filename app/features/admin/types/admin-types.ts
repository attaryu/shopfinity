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
	createdAt?: string;
	updatedAt?: string;
}

export interface AdminBrand {
	id: string;
	name: string;
	slug: string;
	logo: string;
	productCount?: number;
	createdAt?: string;
	updatedAt?: string;
}

export type ProductFormData = Omit<AdminProduct, 'id' | 'category' | 'brand' | 'createdAt'>;
export type CategoryFormData = Omit<AdminCategory, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>;
export type BrandFormData = Omit<AdminBrand, 'id' | 'productCount' | 'createdAt' | 'updatedAt'> & {
	logoFile?: File;
};

export interface GetCategoriesParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface CategoryListResponse {
	categories: AdminCategory[];
}
