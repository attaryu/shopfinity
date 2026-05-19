import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ky, { HTTPError } from 'ky';

import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import { isApiAvailable } from '~/shared/utils/local-data';
import { useAdminStore } from '../../store/admin-store';
import type { AdminCategory } from '../../types/admin-types';

export interface CreateCategoryRequest {
	name: string;
	slug?: string;
}

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateCategoryRequest) => {
			if (!isApiAvailable()) {
				const entry = useAdminStore.getState().addCategory({
					name: data.name,
					slug: data.slug || '',
				});
				return entry as AdminCategory;
			}

			const response = await http
				.post('categories', { json: data })
				.json<ApiResponse<AdminCategory>>();

			if (!response.success) throw new Error(transformApiError(response));
			return response.data;
		},
		onSuccess: () => {
			toast.success('Category created successfully');
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
