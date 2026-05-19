import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/cart-api';
import { getSession } from '~/shared/utils/session-management';

export const cartQueryKeys = {
	all: ['cart'] as const,
};

export function useCartQuery() {
	return useQuery({
		queryKey: cartQueryKeys.all,
		queryFn: async () => {
			const res = await cartApi.getCart();
			return res.data?.cart ?? null;
		},
		enabled: !!getSession(),
	});
}

export function useAddToCartMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: { productId: string; quantity: number }) =>
			cartApi.addItem(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
		},
	});
}

export function useUpdateCartItemMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
			cartApi.updateItem(id, { quantity }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
		},
	});
}

export function useRemoveFromCartMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => cartApi.removeItem(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
		},
	});
}

export function useClearCartMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => cartApi.clearCart(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
		},
	});
}

export function useCartCount() {
	const { data: cart } = useCartQuery();
	if (!cart || !cart.items) return 0;
	return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function useCartTotal() {
	const { data: cart } = useCartQuery();
	if (!cart || !cart.items) return 0;
	return cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}
