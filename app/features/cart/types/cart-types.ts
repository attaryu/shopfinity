import type { ClientProduct } from '../../product/types/product-types';

export interface CartItem {
	id: string;
	productId: string;
	quantity: number;
	product: ClientProduct;
}

export interface Cart {
	id: string;
	userId: string;
	items: CartItem[];
}
