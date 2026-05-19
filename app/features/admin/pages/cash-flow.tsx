import { useMemo } from 'react';
import { Banknote, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import { useOrderStore } from '../store/order-store';
import type { OrderStatus } from '../../checkout/types/checkout-types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
	PENDING_PAYMENT: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
	PAID: { label: 'Paid', className: 'bg-blue-100 text-blue-800 border-blue-200' },
	PROCESSING: { label: 'Processing', className: 'bg-purple-100 text-purple-800 border-purple-200' },
	SHIPPED: { label: 'Shipped', className: 'bg-orange-100 text-orange-800 border-orange-200' },
	DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
	CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function CashFlow() {
	const orders = useOrderStore((s) => s.orders);

	const stats = useMemo(() => {
		const completed = orders.filter(
			(o) => o.status !== 'PENDING_PAYMENT' && o.status !== 'CANCELLED',
		);
		const totalRevenue = completed.reduce((sum, o) => sum + o.total, 0);
		const totalShipping = completed.reduce((sum, o) => sum + o.shippingCost, 0);
		const avgOrderValue =
			completed.length > 0 ? totalRevenue / completed.length : 0;
		const pendingTotal = orders
			.filter((o) => o.status === 'PENDING_PAYMENT')
			.reduce((sum, o) => sum + o.total, 0);

		return {
			totalRevenue,
			totalShipping,
			avgOrderValue,
			pendingTotal,
			completedCount: completed.length,
			totalCount: orders.length,
		};
	}, [orders]);

	const statCards = [
		{
			label: 'Total Revenue',
			value: `Rp ${stats.totalRevenue.toLocaleString('id')}`,
			icon: DollarSign,
			color: 'bg-green-50 border-green-200 text-green-800',
		},
		{
			label: 'Total Orders',
			value: `${stats.completedCount} completed`,
			icon: ShoppingBag,
			color: 'bg-blue-50 border-blue-200 text-blue-800',
		},
		{
			label: 'Avg Order Value',
			value: `Rp ${Math.round(stats.avgOrderValue).toLocaleString('id')}`,
			icon: TrendingUp,
			color: 'bg-purple-50 border-purple-200 text-purple-800',
		},
		{
			label: 'Pending Payments',
			value: `Rp ${stats.pendingTotal.toLocaleString('id')}`,
			icon: Banknote,
			color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		},
	];

	const allOrders = [...orders].sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return (
		<>
			<title>Cash Flow - Shopfinity Admin</title>

			<div className="p-4 sm:p-6 lg:p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-zinc-900">
						Cash Flow Ledger
					</h1>
					<p className="text-sm text-zinc-500 mt-1">
						Financial summary and order revenue tracking
					</p>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
					{statCards.map((card) => (
						<div
							key={card.label}
							className={`${card.color} border rounded-xl p-4`}
						>
							<div className="flex items-center gap-2 mb-2">
								<card.icon className="size-5 opacity-70" />
								<p className="text-sm font-medium opacity-70">
									{card.label}
								</p>
							</div>
							<p className="text-xl font-bold">{card.value}</p>
						</div>
					))}
				</div>

				{/* Revenue Breakdown */}
				{stats.totalRevenue > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
						<div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
							<p className="text-sm text-zinc-500">Product Revenue</p>
							<p className="text-xl font-bold text-zinc-900">
								Rp {(stats.totalRevenue - stats.totalShipping).toLocaleString('id')}
							</p>
						</div>
						<div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
							<p className="text-sm text-zinc-500">Total Shipping</p>
							<p className="text-xl font-bold text-zinc-900">
								Rp {stats.totalShipping.toLocaleString('id')}
							</p>
						</div>
					</div>
				)}

				{/* Transaction Table */}
				<h2 className="text-lg font-bold text-zinc-900 mb-4">
					All Transactions
				</h2>

				{allOrders.length === 0 ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
						<Banknote className="size-10 text-zinc-300 mx-auto mb-3" />
						<p className="text-zinc-500 font-medium">No transactions yet</p>
						<p className="text-zinc-400 text-sm mt-1">
							Transaction data will appear when orders are placed.
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-zinc-200 overflow-hidden overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead className="hidden sm:table-cell">Date</TableHead>
									<TableHead>Subtotal</TableHead>
									<TableHead className="hidden md:table-cell">Shipping</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{allOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-mono text-xs font-medium">
											{order.orderNumber}
										</TableCell>
										<TableCell className="hidden sm:table-cell text-zinc-500 text-sm">
											{new Date(order.createdAt).toLocaleDateString(
												'id',
												{
													day: 'numeric',
													month: 'short',
												},
											)}
										</TableCell>
										<TableCell>
											Rp {order.subtotal.toLocaleString('id')}
										</TableCell>
										<TableCell className="hidden md:table-cell">
											Rp {order.shippingCost.toLocaleString('id')}
										</TableCell>
										<TableCell className="font-semibold">
											Rp {order.total.toLocaleString('id')}
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={statusConfig[order.status].className}
											>
												{statusConfig[order.status].label}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</>
	);
}
