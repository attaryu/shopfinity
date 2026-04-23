import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { ClientCategory } from '../../types/product-types';

export function useGetClientCategories() {
	return useQuery({
		queryKey: ['categories', 'list'],
		queryFn: async () => {
			const response = await http
				.get('categories/list')
				.json<ApiResponse<{ categories: ClientCategory[] }>>();

			if (!response.success) {
				throw new Error(response.message || 'Failed to fetch categories list');
			}

			return response.data?.categories || [];
		},
	});
}
