import { useQuery } from '@tanstack/react-query';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '../../../checkout/services/orders-api';

export function useGetOrder(id: string) {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: async () => {
			const response = await ordersApi.getById(id);

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response;
		},
		enabled: Boolean(id),
	});
}
