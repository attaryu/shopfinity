import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { isApiAvailable, getLocalCategoriesList } from '~/shared/utils/local-data';
import type { CategoryListItem } from '../../types/admin-types';

export function useGetCategoriesList() {
	return useQuery({
		queryKey: ['categories', 'list'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				return getLocalCategoriesList();
			}

			try {
				const response = await http
					.get('categories/list')
					.json<ApiResponse<{ categories: CategoryListItem[] }>>();

				if (!response.success) {
					throw new Error(response.message || 'Failed to fetch categories list');
				}

				return response.data?.categories || [];
			} catch {
				return getLocalCategoriesList();
			}
		},
	});
}
