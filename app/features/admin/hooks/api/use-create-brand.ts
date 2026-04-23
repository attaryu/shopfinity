import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import { MediaStorage } from '~/shared/lib/media-storage';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { http } from '~/shared/utils/http';
import type { AdminBrand, BrandFormData } from '../../types/admin-types';

interface UploadUrlResponse {
	signUrl: string;
	path: string;
	token: string;
}

export function useCreateBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BrandFormData) => {
			let logoUrl = data.logoUrl;

			// 1. Upload if file exists
			if (data.logoFile) {
				const file = data.logoFile;

				// a. Get presigned URL from backend
				const urlRes = await http
					.post('brands/upload-url', {
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

				// b. Upload to the presigned URL using MediaStorage abstraction
				await MediaStorage.uploadToSignedUrl(path, token, file);

				logoUrl = path;
			}

			// 2. Call Backend API with the resulting path
			const response = await http
				.post('brands', {
					json: {
						name: data.name,
						slug: data.slug,
						logoUrl: logoUrl,
					},
				})
				.json<ApiResponse<AdminBrand>>();

			if (!response.success) {
				throw new Error(transformApiError(response));
			}

			return response.data;
		},
		onSuccess: () => {
			toast.success('Brand created successfully');
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
