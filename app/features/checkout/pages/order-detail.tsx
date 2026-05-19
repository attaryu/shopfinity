import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
	ArrowLeft,
	ExternalLink,
	Loader2,
	Package,
	Upload,
	X,
} from 'lucide-react';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Separator } from '~/shared/components/shadcn/ui/separator';
import { useUser } from '~/features/auth/hooks/api/use-user';
import { useGetOrder } from '~/features/admin/hooks/api/use-get-order';
import { useUploadPaymentProof } from '../hooks/api/use-upload-payment-proof';
import type { Order, OrderStatus } from '../types/checkout-types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET as string;

const formatRupiah = (n: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(n);

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
	PENDING_PAYMENT: {
		label: 'Menunggu Pembayaran',
		className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	},
	PAID: {
		label: 'Sudah Dibayar',
		className: 'bg-blue-100 text-blue-800 border-blue-200',
	},
	PROCESSING: {
		label: 'Diproses',
		className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
	},
	SHIPPED: {
		label: 'Dikirim',
		className: 'bg-purple-100 text-purple-800 border-purple-200',
	},
	DELIVERED: {
		label: 'Selesai',
		className: 'bg-green-100 text-green-800 border-green-200',
	},
	CANCELLED: {
		label: 'Dibatalkan',
		className: 'bg-red-100 text-red-800 border-red-200',
	},
};

function buildProofUrl(path: string) {
	return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function OrderDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const user = useUser();

	const { data: apiData, isLoading, isError } = useGetOrder(id!);
	const uploadProof = useUploadPaymentProof(id!);

	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Redirect guest
	useEffect(() => {
		if (!user.isLoading && !user.data) {
			navigate('/login');
		}
	}, [user.isLoading, user.data, navigate]);

	const order: Order | null = apiData?.data?.order ?? null;

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	}

	function clearPreview() {
		setPreviewFile(null);
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	}

	async function handleUpload() {
		if (!previewFile) return;
		await uploadProof.mutateAsync(previewFile);
		clearPreview();
	}

	if (user.isLoading || isLoading) {
		return (
			<main className="min-h-[60vh] flex items-center justify-center">
				<Loader2 className="size-8 animate-spin text-zinc-400" />
			</main>
		);
	}

	if (!user.data) return null; // Wait for redirect

	if (isError || !order) {
		return (
			<main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
				<Package className="size-12 text-zinc-300" />
				<h1 className="text-xl font-bold text-zinc-900">Order tidak ditemukan</h1>
				<p className="text-zinc-500">
					Order ini tidak tersedia atau Anda tidak memiliki akses.
				</p>
				<Link to="/">
					<Button variant="outline">Kembali ke Beranda</Button>
				</Link>
			</main>
		);
	}

	const statusCfg = STATUS_CONFIG[order.status];
	const proofUrl = order.paymentProofUrl
		? buildProofUrl(order.paymentProofUrl)
		: null;
	const canUploadProof =
		order.status === 'PENDING_PAYMENT' && !order.paymentProofUrl;

	return (
		<>
			<title>Order {order.orderNumber} - Shopfinity</title>

			<main className="container mx-auto px-4 py-8 max-w-2xl">
				{/* Back */}
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
				>
					<ArrowLeft className="size-4" />
					Lanjut Belanja
				</Link>

				{/* Header */}
				<div className="flex flex-wrap items-start justify-between gap-3 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900">{order.orderNumber}</h1>
						<p className="text-sm text-zinc-500 mt-1">
							{new Date(order.createdAt).toLocaleString('id-ID', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					</div>
					<Badge variant="outline" className={statusCfg.className}>
						{statusCfg.label}
					</Badge>
				</div>

				<div className="space-y-5">
					{/* Customer Info */}
					<section className="bg-zinc-50 rounded-xl p-5">
						<h2 className="font-semibold text-zinc-900 mb-3">Info Pemesan</h2>
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div>
								<p className="text-zinc-500">Nama</p>
								<p className="font-medium text-zinc-900">{order.customerName}</p>
							</div>
							{order.customerEmail && (
								<div>
									<p className="text-zinc-500">Email</p>
									<p className="font-medium text-zinc-900">{order.customerEmail}</p>
								</div>
							)}
							<div>
								<p className="text-zinc-500">No. Telepon</p>
								<p className="font-medium text-zinc-900">{order.address.phone}</p>
							</div>
						</div>
					</section>

					{/* Shipping Address */}
					<section className="bg-zinc-50 rounded-xl p-5">
						<h2 className="font-semibold text-zinc-900 mb-3">Alamat Pengiriman</h2>
						<div className="text-sm text-zinc-700 space-y-1">
							<p className="font-medium">{order.address.fullName}</p>
							<p>{order.address.street}</p>
							<p>
								{order.address.city}, {order.address.province} {order.address.postalCode}
							</p>
						</div>
					</section>

					{/* Order Items */}
					<section>
						<h2 className="font-semibold text-zinc-900 mb-3">Item Pesanan</h2>
						<div className="border border-zinc-200 rounded-xl overflow-hidden">
							<table className="w-full text-sm">
								<thead className="bg-zinc-50 border-b border-zinc-200">
									<tr>
										<th className="text-left px-4 py-3 font-medium text-zinc-600">Produk</th>
										<th className="text-right px-4 py-3 font-medium text-zinc-600">Harga</th>
										<th className="text-right px-4 py-3 font-medium text-zinc-600">Qty</th>
										<th className="text-right px-4 py-3 font-medium text-zinc-600">Subtotal</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-zinc-100">
									{order.items.map((item, i) => (
										<tr key={item.id ?? i}>
											<td className="px-4 py-3 font-medium text-zinc-900">
												{item.productName ?? item.name}
											</td>
											<td className="px-4 py-3 text-right text-zinc-600">
												{formatRupiah(item.price)}
											</td>
											<td className="px-4 py-3 text-right text-zinc-600">
												{item.quantity}
											</td>
											<td className="px-4 py-3 text-right font-medium text-zinc-900">
												{formatRupiah(item.price * item.quantity)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					{/* Price Summary */}
					<section className="bg-zinc-50 rounded-xl p-5 space-y-2 text-sm">
						<div className="flex justify-between text-zinc-600">
							<span>Subtotal</span>
							<span>{formatRupiah(order.subtotal)}</span>
						</div>
						<div className="flex justify-between text-zinc-600">
							<span>Ongkos Kirim ({order.shippingMethod.courier} {order.shippingMethod.service})</span>
							<span>{formatRupiah(order.shippingCost)}</span>
						</div>
						<Separator />
						<div className="flex justify-between font-bold text-zinc-900 text-base">
							<span>Total</span>
							<span>{formatRupiah(order.total)}</span>
						</div>
					</section>

					{/* Shipping & Payment Info */}
					<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-zinc-50 rounded-xl p-4">
							<p className="text-xs text-zinc-500 mb-1">Kurir</p>
							<p className="font-semibold text-zinc-900">
								{order.shippingMethod.courier} - {order.shippingMethod.service}
							</p>
							<p className="text-xs text-zinc-500 mt-1">
								Est. {order.shippingMethod.estimatedDays}
							</p>
						</div>
						<div className="bg-zinc-50 rounded-xl p-4">
							<p className="text-xs text-zinc-500 mb-1">Metode Pembayaran</p>
							<p className="font-semibold text-zinc-900">{order.paymentMethod.name}</p>
							{order.paymentMethod.accountNumber && (
								<p className="text-xs text-zinc-500 mt-1 font-mono">
									{order.paymentMethod.accountNumber}
								</p>
							)}
							{order.paymentMethod.accountName && (
								<p className="text-xs text-zinc-500">a.n. {order.paymentMethod.accountName}</p>
							)}
						</div>
					</section>

					{/* Payment Proof — display */}
					{proofUrl && (
						<section>
							<h2 className="font-semibold text-zinc-900 mb-3">Bukti Pembayaran</h2>
							<a href={proofUrl} target="_blank" rel="noopener noreferrer">
								<img
									src={proofUrl}
									alt="Bukti pembayaran"
									className="w-full max-w-sm rounded-xl border border-zinc-200 hover:opacity-90 transition-opacity cursor-pointer"
								/>
								<p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
									<ExternalLink className="size-3" />
									Klik untuk membuka fullscreen
								</p>
							</a>
						</section>
					)}

					{/* Payment Proof — upload */}
					{canUploadProof && (
						<section className="border-2 border-dashed border-zinc-300 rounded-xl p-6">
							<h2 className="font-semibold text-zinc-900 mb-1">Upload Bukti Pembayaran</h2>
							<p className="text-sm text-zinc-500 mb-4">
								Silakan transfer ke rekening yang tertera, kemudian upload bukti transfernya di sini.
							</p>

							{previewUrl ? (
								<div className="space-y-3">
									<img
										src={previewUrl}
										alt="Preview bukti pembayaran"
										className="max-h-48 rounded-lg object-contain border border-zinc-200"
									/>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											className="gap-1 text-red-500 hover:text-red-600"
											onClick={clearPreview}
										>
											<X className="size-3" />
											Hapus
										</Button>
										<Button
											size="sm"
											className="gap-2"
											onClick={handleUpload}
											disabled={uploadProof.isPending}
										>
											{uploadProof.isPending ? (
												<><Loader2 className="size-3 animate-spin" />Mengupload...</>
											) : (
												<><Upload className="size-3" />Upload Sekarang</>
											)}
										</Button>
									</div>
								</div>
							) : (
								<label
									htmlFor="proofFile"
									className="flex flex-col items-center gap-2 cursor-pointer py-4 text-center"
								>
									<Upload className="size-8 text-zinc-400" />
									<p className="text-sm text-zinc-500">Klik untuk pilih file</p>
									<p className="text-xs text-zinc-400">JPG, PNG, WebP (max 5MB)</p>
									<input
										ref={fileInputRef}
										id="proofFile"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleFileChange}
									/>
								</label>
							)}
						</section>
					)}
				</div>
			</main>
		</>
	);
}
