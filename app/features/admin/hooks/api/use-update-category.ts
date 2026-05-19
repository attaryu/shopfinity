import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ky, { HTTPError } from 'ky';

import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import { transformApiError } from '~/shared/utils/api-error';
import { isApiAvailable } from '~/shared/utils/local-data';
import { useAdminStore } from '../../store/admin-store';
import type { AdminCategory } from '../../types/admin-types';

export interface UpdateCategoryRequest {
	id: string;
	data: {
		name: string;
		slug?: string;
	};
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: UpdateCategoryRequest) => {
			if (!isApiAvailable()) {
				useAdminStore.getState().updateCategory(id, { name: data.name, slug: data.slug || '' });
				return { id, name: data.name, slug: data.slug || '' } as AdminCategory;
			}

			const response = await http
				.put(`categories/${id}`, { json: data })
				.json<ApiResponse<AdminCategory>>();

			if (!response.success) throw new Error(transformApiError(response));
			return response.data;
		},
		onSuccess: () => {
			toast.success('Category updated successfully');
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
