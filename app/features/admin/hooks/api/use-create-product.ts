import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import { MediaStorage } from '~/shared/lib/media-storage';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { http } from '~/shared/utils/http';
import type { AdminProduct, ProductFormData } from '../../types/admin-types';

interface UploadUrlResponse {
	signUrl: string;
	path: string;
	token: string;
}

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: ProductFormData) => {
			let imageUrl = data.imageUrl;

			// 1. Upload if file exists
			if (data.imageFile) {
				const file = data.imageFile;

				// a. Get presigned URL from backend
				const urlRes = await http
					.post('products/upload-url', {
						json: {
							fileName: file.name,
							fileType: file.type,
						},
					})
					.json<ApiResponse<UploadUrlResponse>>();

				if (!urlRes.success || !urlRes.data) {
					throw new Error(transformApiError(urlRes));
				}

				const { path, token } = urlRes.data;

				// b. Upload to the presigned URL
				await MediaStorage.uploadToSignedUrl(path, token, file);

				imageUrl = path;
			}

			// 2. Call Backend API
			const response = await http
				.post('products', {
					json: {
						name: data.name,
						slug: data.slug,
						description: data.description,
						price: data.price,
						stock: data.stock,
						imageUrl: imageUrl,
						categoryId: data.categoryId,
						brandId: data.brandId,
					},
				})
				.json<ApiResponse<AdminProduct>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
		onSuccess: () => {
			toast.success('Product created successfully');
			queryClient.invalidateQueries({ queryKey: ['products'] });
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
