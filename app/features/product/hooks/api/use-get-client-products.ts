import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { isApiAvailable, getLocalClientProducts } from '~/shared/utils/local-data';
import type {
	ClientProduct,
	GetClientProductsParams,
} from '../../types/product-types';

export function useGetClientProducts(params: GetClientProductsParams) {
	return useQuery({
		queryKey: ['products', 'client', params],
		queryFn: async () => {
			if (!isApiAvailable()) {
				return getLocalClientProducts(params);
			}

			try {
				const searchParams = new URLSearchParams();

				if (params.search) searchParams.set('search', params.search);
				if (params.category) searchParams.set('category', params.category);
				if (params.brand) searchParams.set('brand', params.brand);
				if (params.minPrice !== undefined)
					searchParams.set('minPrice', params.minPrice.toString());
				if (params.maxPrice !== undefined)
					searchParams.set('maxPrice', params.maxPrice.toString());
				if (params.offset !== undefined)
					searchParams.set('offset', params.offset.toString());

				const response = await http
					.get('products/client', {
						searchParams,
					})
					.json<ApiResponse<{ products: ClientProduct[] }>>();

				if (!response.success) {
					throw new Error(response.message || 'Failed to fetch products');
				}

				return {
					products: response.data?.products || [],
					meta: response.meta,
				};
			} catch {
				return getLocalClientProducts(params);
			}
		},
	});
}
