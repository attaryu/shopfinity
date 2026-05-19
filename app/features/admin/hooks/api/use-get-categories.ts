import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import { isApiAvailable, getLocalAdminCategories } from '~/shared/utils/local-data';
import type { CategoryListResponse, GetCategoriesParams } from '../../types/admin-types';

export function useGetCategories(params: GetCategoriesParams) {
	return useQuery({
		queryKey: ['categories', params],
		queryFn: async () => {
			if (!isApiAvailable()) {
				return getLocalAdminCategories(params);
			}

			try {
				const searchParams = new URLSearchParams();
				if (params.page) searchParams.set('page', params.page.toString());
				if (params.limit) searchParams.set('limit', params.limit.toString());
				if (params.search) searchParams.set('search', params.search);

				const response = await http
					.get('categories', {
						searchParams,
					})
					.json<ApiResponse<CategoryListResponse>>();

				if (!response.success) {
					throw new Error(transformApiError(response));
				}

				return response;
			} catch {
				return getLocalAdminCategories(params);
			}
		},
		placeholderData: keepPreviousData,
	});
}
