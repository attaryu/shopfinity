import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { debounce } from 'lodash';
import { Eye, Package, Search } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/shared/components/shadcn/ui/select';
import { useGetOrders } from '../hooks/api/use-get-orders';
import type { OrderStatus } from '../../checkout/types/checkout-types';

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

const STATUS_OPTIONS: { label: string; value: OrderStatus | '' }[] = [
	{ label: 'Semua', value: '' },
	{ label: 'Menunggu Pembayaran', value: 'PENDING_PAYMENT' },
	{ label: 'Sudah Dibayar', value: 'PAID' },
	{ label: 'Diproses', value: 'PROCESSING' },
	{ label: 'Dikirim', value: 'SHIPPED' },
	{ label: 'Selesai', value: 'DELIVERED' },
	{ label: 'Dibatalkan', value: 'CANCELLED' },
];

export default function OrderManagement() {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

	const LIMIT = 10;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetSearch = useCallback(
		debounce((value: string) => {
			setDebouncedSearch(value);
			setPage(1);
		}, 300),
		[],
	);

	const { data, isLoading } = useGetOrders({
		page,
		limit: LIMIT,
		status: statusFilter || undefined,
		search: debouncedSearch || undefined,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	});

	const orders = data?.data?.orders ?? [];
	const meta = data?.meta;
	const totalPages = meta?.totalPages ?? 1;

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearch(e.target.value);
		debouncedSetSearch(e.target.value);
	}

	function handleStatusChange(value: string) {
		setStatusFilter(value as OrderStatus | '');
		setPage(1);
	}

	return (
		<>
			<title>Order Management - Shopfinity Admin</title>

			<div className="p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
						<p className="text-sm text-zinc-500 mt-1">
							Kelola dan lacak pesanan pelanggan
						</p>
					</div>
					{meta?.totalItems !== undefined && (
						<span className="text-sm text-zinc-500">
							Total: <span className="font-semibold text-zinc-900">{meta.totalItems}</span> order
						</span>
					)}
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-3 mb-6">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							placeholder="Cari order number atau nama..."
							className="pl-9"
							value={search}
							onChange={handleSearchChange}
						/>
					</div>
					<Select value={statusFilter || 'all'} onValueChange={(v) => handleStatusChange(v === 'all' ? '' : v)}>
						<SelectTrigger className="w-full sm:w-52">
							<SelectValue placeholder="Filter status" />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((opt) => (
								<SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Table */}
				{isLoading ? (
					<div className="text-center py-16">
						<div className="size-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
						<p className="text-zinc-500 mt-3 text-sm">Memuat data...</p>
					</div>
				) : orders.length === 0 ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
						<Package className="size-10 text-zinc-300 mx-auto mb-3" />
						<p className="text-zinc-500 font-medium">Tidak ada order</p>
						<p className="text-zinc-400 text-sm mt-1">
							{debouncedSearch || statusFilter
								? 'Coba ubah filter pencarian.'
								: 'Order akan muncul di sini saat pelanggan melakukan pembelian.'}
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-zinc-200 overflow-hidden overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>No. Order</TableHead>
									<TableHead>Pelanggan</TableHead>
									<TableHead className="hidden md:table-cell">Tanggal</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.map((order) => (
									<TableRow
										key={order.id}
										className="cursor-pointer hover:bg-zinc-50"
										onClick={() => navigate(`/admin/orders/${order.id}`)}
									>
										<TableCell className="font-mono text-xs font-medium">
											{order.orderNumber}
										</TableCell>
										<TableCell className="font-medium">
											{order.customerName}
										</TableCell>
										<TableCell className="hidden md:table-cell text-zinc-500 text-sm">
											{new Date(order.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</TableCell>
										<TableCell className="font-semibold">
											{formatRupiah(order.total)}
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={STATUS_CONFIG[order.status].className}
											>
												{STATUS_CONFIG[order.status].label}
											</Badge>
										</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/admin/orders/${order.id}`);
												}}
											>
												<Eye className="size-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between mt-4">
						<p className="text-sm text-zinc-500">
							Halaman {page} dari {totalPages}
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => setPage((p) => p - 1)}
							>
								Sebelumnya
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages}
								onClick={() => setPage((p) => p + 1)}
							>
								Berikutnya
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
