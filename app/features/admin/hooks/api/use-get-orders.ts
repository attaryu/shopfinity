import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { isApiAvailable } from '~/shared/utils/local-data';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '~/features/checkout/services/orders-api';
import type { ListOrdersParams } from '~/features/checkout/types/checkout-types';

export function useGetOrders(params: ListOrdersParams) {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: async () => {
			if (!isApiAvailable()) {
				// Return empty list when offline – admin always needs real data
				return {
					success: true as const,
					statusCode: 200,
					message: 'OK',
					data: { orders: [] },
					error: null,
					meta: {
						timestamp: new Date().toISOString(),
						totalItems: 0,
						itemCount: 0,
						itemsPerPage: params.limit || 10,
						totalPages: 1,
						currentPage: params.page || 1,
					},
				};
			}

			const response = await ordersApi.list(params);

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response;
		},
		placeholderData: keepPreviousData,
	});
}
