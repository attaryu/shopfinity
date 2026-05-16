import { useCartStore } from '../store/cart-store';

export function useCart() {
	return useCartStore((state) => state.items);
}

export function useCartCount() {
	return useCartStore((state) =>
		state.items.reduce((sum, i) => sum + i.quantity, 0),
	);
}

export function useCartTotal() {
	return useCartStore((state) =>
		state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
	);
}
