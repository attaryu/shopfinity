import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { BrandListItem } from '../../types/admin-types';

export function useGetBrandsList() {
	return useQuery({
		queryKey: ['brands', 'list'],
		queryFn: async () => {
			const response = await http
				.get('brands/list')
				.json<ApiResponse<{ brands: BrandListItem[] }>>();

			if (!response.success) {
				throw new Error(response.message || 'Failed to fetch brands list');
			}

			return response.data?.brands || [];
		},
	});
}
