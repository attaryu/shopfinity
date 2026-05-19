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
import type { OrderStatus } from '../../checkout/types/checkout-types';
import { useGetCashFlowSummary } from '../hooks/api/use-get-cash-flow-summary';
import { useGetCashFlowTransactions } from '../hooks/api/use-get-cash-flow-transactions';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
	PENDING_PAYMENT: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
	PAID: { label: 'Paid', className: 'bg-blue-100 text-blue-800 border-blue-200' },
	PROCESSING: { label: 'Processing', className: 'bg-purple-100 text-purple-800 border-purple-200' },
	SHIPPED: { label: 'Shipped', className: 'bg-orange-100 text-orange-800 border-orange-200' },
	DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
	CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function CashFlow() {
	const { data: stats, isLoading: isLoadingSummary } = useGetCashFlowSummary();
	const { data: recentTransactions, isLoading: isLoadingTransactions } = useGetCashFlowTransactions();

	const statsLoading = isLoadingSummary || !stats;
	const transactionsLoading = isLoadingTransactions || !recentTransactions;

	const statCards = [
		{
			label: 'Total Revenue',
			value: statsLoading ? 'Loading...' : `Rp ${stats.totalRevenue.toLocaleString('id')}`,
			icon: DollarSign,
			color: 'bg-green-50 border-green-200 text-green-800',
		},
		{
			label: 'Total Orders',
			value: statsLoading ? 'Loading...' : `${stats.totalOrders} orders`,
			icon: ShoppingBag,
			color: 'bg-blue-50 border-blue-200 text-blue-800',
		},
		{
			label: 'Avg Order Value',
			value: statsLoading ? 'Loading...' : `Rp ${Math.round(stats.avgOrderValue).toLocaleString('id')}`,
			icon: TrendingUp,
			color: 'bg-purple-50 border-purple-200 text-purple-800',
		},
		{
			label: 'Pending Payments',
			value: statsLoading ? 'Loading...' : `Rp ${stats.pendingPaymentTotal.toLocaleString('id')}`,
			icon: Banknote,
			color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		},
	];

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

				{/* Transaction Table */}
				<h2 className="text-lg font-bold text-zinc-900 mb-4">
					Recent Transactions
				</h2>

				{transactionsLoading ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 animate-pulse">
						<Banknote className="size-10 text-zinc-300 mx-auto mb-3" />
						<p className="text-zinc-500 font-medium">Loading transactions...</p>
					</div>
				) : recentTransactions.length === 0 ? (
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
								{recentTransactions.map((order) => (
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
												className={statusConfig[order.status]?.className || ''}
											>
												{statusConfig[order.status]?.label || order.status}
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
