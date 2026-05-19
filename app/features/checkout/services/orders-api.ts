import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { Order, OrderStatus, CreateOrderPayload, ListOrdersParams } from '../types/checkout-types';

interface UploadUrlResponse {
	signUrl: string;
	path: string;
	token: string;
}

interface OrderListResponse {
	orders: Order[];
}

export const ordersApi = {
	/** Step 1 of payment proof upload: get a presigned URL from the backend */
	getUploadUrl: (fileName: string) =>
		http
			.post('orders/upload-url', { json: { fileName } })
			.json<ApiResponse<UploadUrlResponse>>(),

	/** Create a new order (requires auth) */
	create: (dto: CreateOrderPayload) =>
		http
			.post('orders', { json: dto })
			.json<ApiResponse<{ order: Order }>>(),

	/** List all orders – admin only */
	list: (params: ListOrdersParams) => {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.set('page', params.page.toString());
		if (params.limit) searchParams.set('limit', params.limit.toString());
		if (params.status) searchParams.set('status', params.status);
		if (params.search) searchParams.set('search', params.search);
		if (params.sortBy) searchParams.set('sortBy', params.sortBy);
		if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

		return http
			.get('orders', { searchParams })
			.json<ApiResponse<OrderListResponse>>();
	},

	/** Get orders for current logged-in customer */
	getClientOrders: () =>
		http
			.get('orders/client')
			.json<ApiResponse<OrderListResponse>>(),

	/** Get a single order by ID – requires auth token */
	getById: (id: string) =>
		http
			.get(`orders/${id}`)
			.json<ApiResponse<{ order: Order }>>(),

	/** Update order status – admin only */
	updateStatus: (id: string, status: OrderStatus) =>
		http
			.put(`orders/${id}/status`, { json: { status } })
			.json<ApiResponse<{ order: Order }>>(),

	/**
	 * Step 3 of payment proof upload: send the storage path back to backend
	 * after the file has already been PUT to the presigned URL.
	 */
	setPaymentProof: (id: string, path: string) =>
		http
			.post(`orders/${id}/payment-proof`, { json: { path } })
			.json<ApiResponse<{ order: Order }>>(),

	/** Get cash flow summary - admin only */
	getCashFlowSummary: () =>
		http
			.get('orders/cash-flow/summary')
			.json<ApiResponse<{
				totalRevenue: number;
				totalOrders: number;
				avgOrderValue: number;
				pendingPaymentTotal: number;
			}>>(),

	/** Get cash flow recent transactions - admin only */
	getCashFlowTransactions: () =>
		http
			.get('orders/cash-flow/transactions')
			.json<ApiResponse<Order[]>>(),
};
