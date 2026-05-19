import { useQuery } from '@tanstack/react-query';
import { isApiAvailable } from '~/shared/utils/local-data';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '~/features/checkout/services/orders-api';
import { useOrderStore } from '../../store/order-store';

export function useGetCashFlowTransactions() {
	return useQuery({
		queryKey: ['cash-flow', 'transactions'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				const orders = useOrderStore.getState().orders;
				return [...orders]
					.filter((o) => o.status !== 'CANCELLED')
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.slice(0, 10);
			}

			const response = await ordersApi.getCashFlowTransactions();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
	});
}
