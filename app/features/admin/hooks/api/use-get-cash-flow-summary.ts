import { useQuery } from '@tanstack/react-query';
import { isApiAvailable } from '~/shared/utils/local-data';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '~/features/checkout/services/orders-api';
import { useOrderStore } from '../../store/order-store';

export function useGetCashFlowSummary() {
	return useQuery({
		queryKey: ['cash-flow', 'summary'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				const orders = useOrderStore.getState().orders;
				const revenueOrders = orders.filter(
					(o) => o.status === 'PROCESSING' || o.status === 'DELIVERED',
				);
				const totalRevenue = revenueOrders.reduce(
					(sum, o) => sum + o.items.reduce((s, item) => s + item.price * item.quantity, 0),
					0,
				);
				const totalOrders = orders.length;
				const nonCancelledOrders = orders.filter((o) => o.status !== 'CANCELLED');
				const avgOrderValue =
					nonCancelledOrders.length > 0
						? nonCancelledOrders.reduce((sum, o) => sum + o.total, 0) / nonCancelledOrders.length
						: 0;
				const pendingPaymentTotal = orders
					.filter((o) => o.status === 'PENDING_PAYMENT')
					.reduce((sum, o) => sum + o.total, 0);

				return {
					totalRevenue,
					totalOrders,
					avgOrderValue,
					pendingPaymentTotal,
				};
			}

			const response = await ordersApi.getCashFlowSummary();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
	});
}
