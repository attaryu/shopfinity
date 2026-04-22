import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import type { DashboardData } from '../../types/admin-types';

export function useGetDashboard() {
	return useQuery({
		queryKey: ['dashboard'],
		queryFn: async () => {
			const response = await http
				.get('dashboard')
				.json<ApiResponse<DashboardData>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
	});
}
