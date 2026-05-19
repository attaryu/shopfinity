import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { isApiAvailable } from '~/shared/utils/local-data';
import { useOrderStore } from '~/features/admin/store/order-store';
import { ordersApi } from '../../services/orders-api';
import type { CreateOrderPayload, Order } from '../../types/checkout-types';

export function useCreateOrder() {
	return useMutation({
		mutationFn: async (payload: CreateOrderPayload): Promise<Order> => {
			if (!isApiAvailable()) {
				// Offline fallback: use local Zustand store
				const order = useOrderStore.getState().placeOrder({
					items: payload.items.map((i) => ({
						productId: i.productId,
						name: i.name,
						price: i.price,
						quantity: i.quantity,
						imageUrl: i.imageUrl || '',
					})),
					subtotal: payload.subtotal,
					shippingMethod: payload.shippingMethod,
					paymentMethod: payload.paymentMethod,
					address: payload.address,
					customerName: payload.customerName,
					customerEmail: payload.customerEmail || '',
				});
				return order;
			}

			const response = await ordersApi.create(payload);

			if (!response.success || !response.data) {
				throw new Error(transformApiError(response));
			}

			return response.data.order;
		},
		onSuccess: () => {
			// Success handled by page redirect
		},
		onError: async (error: Error) => {
			if (error instanceof HTTPError) {
				const response = (await error.response.json()) as ApiResponse;
				toast.error(transformApiError(response));
			} else {
				toast.error(error.message || 'Gagal membuat order');
			}
		},
	});
}

