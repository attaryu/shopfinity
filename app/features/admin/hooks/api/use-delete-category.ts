import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HTTPError } from 'ky';

import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await http
				.delete(`categories/${id}`)
				.json<ApiResponse<void>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
		onSuccess: (_, id) => {
			toast.success('Category deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['categories'] });
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
