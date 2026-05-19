import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transformApiError } from '~/shared/utils/api-error';
import { ordersApi } from '../../services/orders-api';

export function useUploadPaymentProof(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			// Step 1: Get presigned upload URL from backend
			const urlRes = await ordersApi.getUploadUrl(file.name);

			if (!urlRes.success || !urlRes.data) {
				throw new Error(transformApiError(urlRes));
			}

			const { signUrl, path } = urlRes.data;

			// Step 2: Upload file directly to Supabase Storage via presigned URL
			const uploadRes = await fetch(signUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file,
			});

			if (!uploadRes.ok) {
				throw new Error('Gagal mengupload file ke storage. Silakan coba lagi.');
			}

			// Step 3: Notify backend of the storage path
			const proofRes = await ordersApi.setPaymentProof(orderId, path);

			if (!proofRes.success || !proofRes.data) {
				throw new Error(transformApiError(proofRes));
			}

			return proofRes.data.order;
		},
		onSuccess: () => {
			toast.success('Bukti pembayaran berhasil diupload');
			queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Gagal mengupload bukti pembayaran');
		},
	});
}
