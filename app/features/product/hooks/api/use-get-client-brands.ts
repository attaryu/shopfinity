import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { isApiAvailable, getLocalClientBrands } from '~/shared/utils/local-data';
import type { ClientBrand } from '../../types/product-types';

export function useGetClientBrands() {
	return useQuery({
		queryKey: ['brands', 'list'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				return getLocalClientBrands();
			}

			try {
				const response = await http
					.get('brands/list')
					.json<ApiResponse<{ brands: ClientBrand[] }>>();

				if (!response.success) {
					throw new Error(response.message || 'Failed to fetch brands list');
				}

				return response.data?.brands || [];
			} catch {
				return getLocalClientBrands();
			}
		},
	});
}
