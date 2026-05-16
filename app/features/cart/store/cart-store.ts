import { create } from 'zustand';
import type { CartItem } from '../types/cart-types';

const CART_STORAGE_KEY = 'shopfinity-cart';

function loadCart(): CartItem[] {
	try {
		const stored = localStorage.getItem(CART_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function persistCart(items: CartItem[]) {
	localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

interface CartStore {
	items: CartItem[];
	addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	getCartTotal: () => number;
	getCartCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: loadCart(),

	addItem: (item) => {
		const { items } = get();
		const existing = items.find((i) => i.productId === item.productId);

		let updated: CartItem[];
		if (existing) {
			updated = items.map((i) =>
				i.productId === item.productId
					? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
					: i,
			);
		} else {
			updated = [...items, { ...item, quantity: item.quantity ?? 1 }];
		}

		persistCart(updated);
		set({ items: updated });
	},

	removeItem: (productId) => {
		const updated = get().items.filter((i) => i.productId !== productId);
		persistCart(updated);
		set({ items: updated });
	},

	updateQuantity: (productId, quantity) => {
		if (quantity <= 0) {
			get().removeItem(productId);
			return;
		}
		const updated = get().items.map((i) =>
			i.productId === productId ? { ...i, quantity } : i,
		);
		persistCart(updated);
		set({ items: updated });
	},

	clearCart: () => {
		localStorage.removeItem(CART_STORAGE_KEY);
		set({ items: [] });
	},

	getCartTotal: () => {
		return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	},

	getCartCount: () => {
		return get().items.reduce((sum, i) => sum + i.quantity, 0);
	},
}));
