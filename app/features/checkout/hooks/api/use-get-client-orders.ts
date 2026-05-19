import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { isApiAvailable } from '~/shared/utils/local-data';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '../../services/orders-api';

export function useGetClientOrders() {
	return useQuery({
		queryKey: ['orders', 'client'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				// Fallback to empty for local testing of logged-in user without backend
				return {
					success: true as const,
					statusCode: 200,
					message: 'OK',
					data: { orders: [] },
					error: null,
				};
			}

			const response = await ordersApi.getClientOrders();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response;
		},
		placeholderData: keepPreviousData,
	});
}
