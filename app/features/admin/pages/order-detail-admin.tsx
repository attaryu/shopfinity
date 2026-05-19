import { ArrowLeft, ExternalLink, Loader2, Package } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/shared/components/shadcn/ui/dialog';
import { Separator } from '~/shared/components/shadcn/ui/separator';
import { MediaStorage } from '~/shared/lib/media-storage';
import type { OrderStatus } from '../../checkout/types/checkout-types';
import { useGetOrder } from '../hooks/api/use-get-order';
import { useUpdateOrderStatus } from '../hooks/api/use-update-order-status';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET as string;

const formatRupiah = (n: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(n);

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
	{
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

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
	PENDING_PAYMENT: ['PAID', 'CANCELLED'],
	PAID: ['PROCESSING', 'CANCELLED'],
	PROCESSING: ['SHIPPED'],
	SHIPPED: ['DELIVERED'],
};

export default function OrderDetailAdmin() {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError } = useGetOrder(id!);
	const updateStatus = useUpdateOrderStatus();

	const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null);

	const order = data?.data?.order;

	async function handleUpdateStatus() {
		if (!order || !confirmStatus) return;
		try {
			await updateStatus.mutateAsync({ id: order.id, status: confirmStatus });
			setConfirmStatus(null);
		} catch {
			// handled by hook onError
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-zinc-400" />
			</div>
		);
	}

	if (isError || !order) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
				<Package className="size-12 text-zinc-300 mb-4" />
				<h1 className="text-xl font-bold text-zinc-900 mb-2">
					Order tidak ditemukan
				</h1>
				<p className="text-zinc-500 mb-6">
					Order yang Anda cari mungkin sudah dihapus atau ID salah.
				</p>
				<Link to="/admin/orders">
					<Button variant="outline">Kembali ke Daftar Order</Button>
				</Link>
			</div>
		);
	}

	const statusCfg = STATUS_CONFIG[order.status];
	const proofUrl = order.paymentProofUrl
		? MediaStorage.getUrl(order.paymentProofUrl)
		: null;

	const availableNextStatuses = NEXT_STATUS[order.status] ?? [];

	return (
		<>
			<title>Admin Detail Order {order.orderNumber}</title>
			<div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
				{/* Back */}
				<Link
					to="/admin/orders"
					className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
				>
					<ArrowLeft className="size-4" />
					Kembali ke Daftar Order
				</Link>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Left Column: Detail Order */}
					<div className="flex-1 space-y-6">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-2xl font-bold text-zinc-900">
									{order.orderNumber}
								</h1>
								<p className="text-sm text-zinc-500 mt-1">
									Tanggal: {new Date(order.createdAt).toLocaleString('id-ID')}
								</p>
							</div>
							<Badge variant="outline" className={statusCfg.className}>
								{statusCfg.label}
							</Badge>
						</div>

						{/* Info Pelanggan & Alamat */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="bg-white border border-zinc-200 rounded-xl p-4">
								<h3 className="font-semibold text-zinc-900 mb-2">
									Info Pelanggan
								</h3>
								<div className="text-sm text-zinc-600 space-y-1">
									<p>
										<span className="text-zinc-400">Nama:</span>{' '}
										{order.customerName}
									</p>
									{order.customerEmail && (
										<p>
											<span className="text-zinc-400">Email:</span>{' '}
											{order.customerEmail}
										</p>
									)}
									<p>
										<span className="text-zinc-400">Telp:</span>{' '}
										{order.address.phone}
									</p>
								</div>
							</div>
							<div className="bg-white border border-zinc-200 rounded-xl p-4">
								<h3 className="font-semibold text-zinc-900 mb-2">
									Alamat Pengiriman
								</h3>
								<div className="text-sm text-zinc-600 space-y-1">
									<p className="font-medium text-zinc-900">
										{order.address.fullName}
									</p>
									<p>{order.address.street}</p>
									<p>
										{order.address.city}, {order.address.province}{' '}
										{order.address.postalCode}
									</p>
								</div>
							</div>
						</div>

						{/* Info Pembayaran & Kurir */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="bg-white border border-zinc-200 rounded-xl p-4">
								<h3 className="font-semibold text-zinc-900 mb-2">Pengiriman</h3>
								<div className="text-sm text-zinc-600 space-y-1">
									<p>
										<span className="text-zinc-400">Kurir:</span>{' '}
										{order.shippingMethod.courier} -{' '}
										{order.shippingMethod.service}
									</p>
									<p>
										<span className="text-zinc-400">Estimasi:</span>{' '}
										{order.shippingMethod.estimatedDays}
									</p>
								</div>
							</div>
							<div className="bg-white border border-zinc-200 rounded-xl p-4">
								<h3 className="font-semibold text-zinc-900 mb-2">Pembayaran</h3>
								<div className="text-sm text-zinc-600 space-y-1">
									<p>
										<span className="text-zinc-400">Metode:</span>{' '}
										{order.paymentMethod.name}
									</p>
									{order.paymentMethod.accountNumber && (
										<p>
											<span className="text-zinc-400">Rekening:</span>{' '}
											{order.paymentMethod.accountNumber}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Item Pesanan */}
						<div className="bg-white border border-zinc-200 rounded-xl p-4">
							<h3 className="font-semibold text-zinc-900 mb-3">Item Pesanan</h3>
							<div className="space-y-3">
								{order.items.map((item, i) => (
									<div
										key={item.id ?? i}
										className="flex justify-between items-center text-sm"
									>
										<div className="flex items-center gap-3">
											{item.imageUrl ? (
												<img
													src={MediaStorage.getUrl(item.imageUrl)}
													alt={item.productName ?? item.name}
													className="w-10 h-10 rounded-md object-cover border border-zinc-200"
												/>
											) : (
												<div className="w-10 h-10 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center">
													<Package className="w-5 h-5 text-zinc-400" />
												</div>
											)}
											<div>
												<p className="font-medium text-zinc-900">
													{item.productName ?? item.name}
												</p>
												<p className="text-zinc-500">
													{formatRupiah(item.price)} x {item.quantity}
												</p>
											</div>
										</div>
										<p className="font-medium text-zinc-900">
											{formatRupiah(item.price * item.quantity)}
										</p>
									</div>
								))}
							</div>
							<Separator className="my-3" />
							<div className="space-y-1.5 text-sm">
								<div className="flex justify-between text-zinc-500">
									<span>Subtotal</span>
									<span>{formatRupiah(order.subtotal)}</span>
								</div>
								<div className="flex justify-between text-zinc-500">
									<span>Ongkos Kirim</span>
									<span>{formatRupiah(order.shippingCost)}</span>
								</div>
								<div className="flex justify-between font-bold text-zinc-900 pt-1">
									<span>Total</span>
									<span>{formatRupiah(order.total)}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Actions & Evidence */}
					<div className="w-full md:w-72 space-y-4 shrink-0">
						{/* Update Status Box */}
						<div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
							<h3 className="font-semibold text-zinc-900 mb-3">
								Update Status
							</h3>
							{availableNextStatuses.length > 0 ? (
								<div className="flex flex-col gap-2">
									{availableNextStatuses.map((nextStatus) => (
										<Button
											key={nextStatus}
											variant={
												nextStatus === 'CANCELLED' ? 'destructive' : 'default'
											}
											className="w-full justify-start"
											onClick={() => setConfirmStatus(nextStatus)}
										>
											Ubah ke {STATUS_CONFIG[nextStatus].label}
										</Button>
									))}
								</div>
							) : (
								<p className="text-sm text-zinc-500 italic">
									Order sudah berada di status akhir.
								</p>
							)}
						</div>

						{/* Bukti Pembayaran */}
						<div className="bg-white border border-zinc-200 rounded-xl p-4">
							<h3 className="font-semibold text-zinc-900 mb-3">
								Bukti Pembayaran
							</h3>
							{proofUrl ? (
								<a
									href={proofUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="block group"
								>
									<div className="relative rounded-lg overflow-hidden border border-zinc-200 aspect-[3/4]">
										<img
											src={proofUrl}
											alt="Bukti pembayaran"
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<ExternalLink className="text-white w-6 h-6" />
										</div>
									</div>
								</a>
							) : (
								<div className="border border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
									<ExternalLink className="w-8 h-8 text-zinc-300 mb-2" />
									<p className="text-sm text-zinc-500 font-medium">
										Belum ada bukti pembayaran
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Confirm Dialog */}
			<Dialog
				open={!!confirmStatus}
				onOpenChange={(open) => !open && setConfirmStatus(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Konfirmasi Update Status</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin mengubah status order ini menjadi{' '}
							<span className="font-bold text-zinc-900">
								{confirmStatus && STATUS_CONFIG[confirmStatus].label}
							</span>
							?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button
							variant="outline"
							onClick={() => setConfirmStatus(null)}
							disabled={updateStatus.isPending}
						>
							Batal
						</Button>
						<Button
							variant={
								confirmStatus === 'CANCELLED' ? 'destructive' : 'default'
							}
							onClick={handleUpdateStatus}
							disabled={updateStatus.isPending}
						>
							{updateStatus.isPending ? (
								<>
									<Loader2 className="size-4 animate-spin mr-2" /> Menyimpan...
								</>
							) : (
								'Ya, Ubah Status'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
