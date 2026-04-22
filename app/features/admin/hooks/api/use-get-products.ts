import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import type { GetProductsParams, ProductListResponse } from '../../types/admin-types';

export function useGetProducts(params: GetProductsParams) {
	return useQuery({
		queryKey: ['products', params],
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			if (params.page) searchParams.set('page', params.page.toString());
			if (params.limit) searchParams.set('limit', params.limit.toString());
			if (params.search) searchParams.set('search', params.search);
			if (params.categoryId && params.categoryId !== 'all') {
				searchParams.set('categoryId', params.categoryId);
			}
			if (params.brandId && params.brandId !== 'all') {
				searchParams.set('brandId', params.brandId);
			}
			if (params.sortBy) searchParams.set('sortBy', params.sortBy);
			if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

			const response = await http
				.get('products', { searchParams })
				.json<ApiResponse<ProductListResponse>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response;
		},
		placeholderData: keepPreviousData,
	});
}
