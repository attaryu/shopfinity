import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import { isApiAvailable, getLocalDashboard } from '~/shared/utils/local-data';
import type { DashboardData } from '../../types/admin-types';

export function useGetDashboard() {
	return useQuery({
		queryKey: ['dashboard'],
		queryFn: async () => {
			if (!isApiAvailable()) {
				return getLocalDashboard();
			}

			try {
				const response = await http
					.get('dashboard')
					.json<ApiResponse<DashboardData>>();

				if (!response.success) {
					throw new Error(transformApiError(response));
				}

				return response.data;
			} catch {
				return getLocalDashboard();
			}
		},
	});
}
