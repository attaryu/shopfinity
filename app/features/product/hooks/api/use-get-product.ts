import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { ClientProduct } from '../../types/product-types';

export interface FullProduct extends ClientProduct {
	description: string;
	stock: number;
	createdAt: string;
	updatedAt: string;
}

export function useGetProduct(idOrSlug: string) {
	return useQuery({
		queryKey: ['products', idOrSlug],
		queryFn: async () => {
			const response = await http
				.get(`products/${idOrSlug}`)
				.json<ApiResponse<{ product: FullProduct }>>();

			if (!response.success) {
				throw new Error(response.message || 'Failed to fetch product');
			}

			return response.data?.product;
		},
		enabled: !!idOrSlug,
	});
}
