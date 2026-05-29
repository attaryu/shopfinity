import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import { MediaStorage } from '~/shared/lib/media-storage';
import type { ApiResponse } from '~/shared/types/api-response';
import { transformApiError } from '~/shared/utils/api-error';
import { http } from '~/shared/utils/http';
import { isApiAvailable } from '~/shared/utils/local-data';
import { useAdminStore } from '../../store/admin-store';
import type { AdminBrand, BrandFormData } from '../../types/admin-types';

interface UploadUrlResponse {
	signUrl: string;
	path: string;
}

export function useCreateBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BrandFormData) => {
			if (!isApiAvailable()) {
				const entry = useAdminStore.getState().addBrand({
					name: data.name,
					slug: data.slug,
					logoUrl: data.logoUrl,
				});
				return entry as AdminBrand;
			}

			let logoUrl = data.logoUrl;

			if (data.logoFile) {
				const file = data.logoFile;
				const urlRes = await http
					.post('brands/upload-url', {
						json: { fileName: file.name, fileType: file.type },
					})
					.json<ApiResponse<UploadUrlResponse>>();

				if (!urlRes.success || !urlRes.data) throw new Error(transformApiError(urlRes));
				const { signUrl, path } = urlRes.data;
				await MediaStorage.uploadToSignedUrl(signUrl, file);
				logoUrl = path;
			}

			const response = await http
				.post('brands', { json: { name: data.name, slug: data.slug, logoUrl } })
				.json<ApiResponse<AdminBrand>>();

			if (!response.success) throw new Error(transformApiError(response));
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
