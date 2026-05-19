import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, Package, Eye } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import { useUser } from '~/features/auth/hooks/api/use-user';
import { useGetClientOrders } from '../hooks/api/use-get-client-orders';
import type { OrderStatus } from '../types/checkout-types';

const formatRupiah = (n: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(n);

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
	PENDING_PAYMENT: { label: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
	PAID: { label: 'Sudah Dibayar', className: 'bg-blue-100 text-blue-800 border-blue-200' },
	PROCESSING: { label: 'Diproses', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
	SHIPPED: { label: 'Dikirim', className: 'bg-purple-100 text-purple-800 border-purple-200' },
	DELIVERED: { label: 'Selesai', className: 'bg-green-100 text-green-800 border-green-200' },
	CANCELLED: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function OrderListPage() {
	const navigate = useNavigate();
	const user = useUser();
	const { data, isLoading, isError } = useGetClientOrders();

	// Redirect guest
	useEffect(() => {
		if (!user.isLoading && !user.data) {
			navigate('/login');
		}
	}, [user.isLoading, user.data, navigate]);

	if (user.isLoading || isLoading) {
		return (
			<main className="min-h-[60vh] flex items-center justify-center">
				<Loader2 className="size-8 animate-spin text-zinc-400" />
			</main>
		);
	}

	if (!user.data) return null;

	const orders = data?.data?.orders ?? [];

	return (
		<>
			<title>My Orders - Shopfinity</title>
			<main className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Pesanan Saya</h1>
					<p className="text-sm text-zinc-500 mt-1">Lacak dan lihat riwayat pesanan Anda.</p>
				</div>

				{isError ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border border-zinc-200">
						<p className="text-red-500">Gagal memuat pesanan. Silakan coba lagi nanti.</p>
					</div>
				) : orders.length === 0 ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
						<Package className="size-12 text-zinc-300 mx-auto mb-4" />
						<p className="text-zinc-900 font-medium text-lg">Belum ada pesanan</p>
						<p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto mb-6">
							Anda belum pernah melakukan pemesanan. Mulai belanja dan temukan barang favorit Anda!
						</p>
						<Link to="/">
							<Button>Mulai Belanja</Button>
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{orders.map((order) => {
							const statusCfg = STATUS_CONFIG[order.status];
							return (
								<div key={order.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors shadow-sm">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
										<div>
											<div className="flex items-center gap-3">
												<h3 className="font-semibold text-zinc-900">{order.orderNumber}</h3>
												<Badge variant="outline" className={statusCfg.className}>
													{statusCfg.label}
												</Badge>
											</div>
											<p className="text-xs text-zinc-500 mt-1">
												{new Date(order.createdAt).toLocaleDateString('id-ID', {
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												})}
											</p>
										</div>
										<div className="text-left sm:text-right">
											<p className="text-xs text-zinc-500 mb-0.5">Total Belanja</p>
											<p className="font-bold text-zinc-900">{formatRupiah(order.total)}</p>
										</div>
									</div>
									
									<div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4">
										<p className="text-sm text-zinc-600">
											{order.items.length > 0 ? (
												<>
													<span className="font-medium text-zinc-900">{order.items[0].productName ?? order.items[0].name}</span>
													{order.items.length > 1 && ` dan ${order.items.length - 1} barang lainnya`}
												</>
											) : (
												'Detail barang tidak tersedia'
											)}
										</p>
										<Button 
											variant="outline" 
											size="sm"
											className="gap-2"
											onClick={() => navigate(`/orders/${order.id}`)}
										>
											<Eye className="size-4" />
											<span className="hidden sm:inline">Lihat Detail</span>
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>
		</>
	);
}
