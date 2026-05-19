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
	path: string;
	token: string;
}

export function useUpdateBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: BrandFormData }) => {
			if (!isApiAvailable()) {
				useAdminStore.getState().updateBrand(id, data);
				return { id, ...data } as AdminBrand;
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
				const { path, token } = urlRes.data;
				await MediaStorage.uploadToSignedUrl(path, token, file);
				logoUrl = path;
			}

			const response = await http
				.put(`brands/${id}`, { json: { name: data.name, slug: data.slug, logoUrl } })
				.json<ApiResponse<AdminBrand>>();

			if (!response.success) throw new Error(transformApiError(response));
			return response.data;
		},
		onSuccess: () => {
			toast.success('Brand updated successfully');
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
