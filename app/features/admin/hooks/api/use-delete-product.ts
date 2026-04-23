import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { http } from '~/shared/utils/http';

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await http
				.delete(`products/${id}`)
				.json<ApiResponse>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response;
		},
		onSuccess: () => {
			toast.success('Product deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to delete product');
		},
	});
}
