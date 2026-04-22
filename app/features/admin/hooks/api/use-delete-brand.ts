import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { http } from '~/shared/utils/http';

export function useDeleteBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await http
				.delete(`brands/${id}`)
				.json<ApiResponse<void>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
		onSuccess: () => {
			toast.success('Brand deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['brands'] });
		},
		onError: async (error: Error) => {
			if (error instanceof HTTPError) {
				const response = (await error.response.json()) as ApiResponse;
				toast.error(transformApiError(response));
			} else {
				toast.error(error.message || 'An unexpected error occurred');
			}
		},
	});
}
