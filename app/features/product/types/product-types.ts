export interface ClientCategory {
	id: string;
	name: string;
	slug: string;
}

export interface ClientBrand {
	id: string;
	name: string;
	slug: string;
	logoUrl: string;
}

export interface ClientProduct {
	id: string;
	name: string;
	slug: string;
	imageUrl: string;
	price: number;
	category: ClientCategory;
	brand: ClientBrand;
}

export interface GetClientProductsParams {
	search?: string;
	category?: string; // category slug
	brand?: string; // brand slug
	minPrice?: number;
	maxPrice?: number;
	offset?: number;
	limit?: number;
}

export interface ClientProductListResponse {
	products: ClientProduct[];
}
