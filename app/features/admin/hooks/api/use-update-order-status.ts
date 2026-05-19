import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '../../../checkout/services/orders-api';
import type { OrderStatus } from '../../../checkout/types/checkout-types';

export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
			const response = await ordersApi.updateStatus(id, status);

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
		onSuccess: (_data, { id }) => {
			toast.success('Status order berhasil diperbarui');
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
		},
		onError: async (error: Error) => {
			if (error instanceof HTTPError) {
				const response = (await error.response.json()) as ApiResponse;
				toast.error(transformApiError(response));
			} else {
				toast.error(error.message || 'Gagal memperbarui status order');
			}
		},
	});
}
