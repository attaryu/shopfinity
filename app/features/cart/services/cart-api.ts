import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { Cart } from '../types/cart-types';

export const cartApi = {
	/** Get current user's cart */
	getCart: () =>
		http
			.get('cart')
			.json<ApiResponse<{ cart: Cart }>>(),

	/** Add item to cart */
	addItem: (payload: { productId: string; quantity: number }) =>
		http
			.post('cart/items', { json: payload })
			.json<ApiResponse<{ cart: Cart }>>(),

	/** Update item quantity in cart */
	updateItem: (id: string, payload: { quantity: number }) =>
		http
			.put(`cart/items/${id}`, { json: payload })
			.json<ApiResponse<{ cart: Cart }>>(),

	/** Remove item from cart */
	removeItem: (id: string) =>
		http
			.delete(`cart/items/${id}`)
			.json<ApiResponse<{ cart: Cart }>>(),

	/** Clear the entire cart */
	clearCart: () =>
		http
			.delete('cart')
			.json<ApiResponse<void>>(),
};
