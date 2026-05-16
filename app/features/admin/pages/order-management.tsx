import { useState } from 'react';
import { Eye, Package, Search } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/shared/components/shadcn/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';
import { useOrderStore } from '../store/order-store';
import type { Order, OrderStatus } from '../../checkout/types/checkout-types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
	PENDING_PAYMENT: { label: 'Pending Payment', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
	PAID: { label: 'Paid', className: 'bg-blue-100 text-blue-800 border-blue-200' },
	PROCESSING: { label: 'Processing', className: 'bg-purple-100 text-purple-800 border-purple-200' },
	SHIPPED: { label: 'Shipped', className: 'bg-orange-100 text-orange-800 border-orange-200' },
	DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
	CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
};

const filterTabs: { label: string; value: OrderStatus | 'ALL' }[] = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Pending', value: 'PENDING_PAYMENT' },
	{ label: 'Paid', value: 'PAID' },
	{ label: 'Processing', value: 'PROCESSING' },
	{ label: 'Shipped', value: 'SHIPPED' },
	{ label: 'Delivered', value: 'DELIVERED' },
];

export default function OrderManagement() {
	const orders = useOrderStore((s) => s.orders);
	const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
	const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
	const [search, setSearch] = useState('');
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const filtered = orders
		.filter((o) => filter === 'ALL' || o.status === filter)
		.filter(
			(o) =>
				!search ||
				o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
				o.customerName.toLowerCase().includes(search.toLowerCase()),
		)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

	return (
		<>
			<title>Order Management - Shopfinity Admin</title>

			<div className="p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
						<p className="text-sm text-zinc-500 mt-1">
							Manage and track customer orders
						</p>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 mb-6">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							placeholder="Search orders..."
							className="pl-9"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						{filterTabs.map((tab) => (
							<Button
								key={tab.value}
								variant={filter === tab.value ? 'default' : 'outline'}
								size="sm"
								onClick={() => setFilter(tab.value)}
							>
								{tab.label}
							</Button>
						))}
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
						<Package className="size-10 text-zinc-300 mx-auto mb-3" />
						<p className="text-zinc-500 font-medium">No orders found</p>
						<p className="text-zinc-400 text-sm mt-1">
							{orders.length === 0
								? 'Orders will appear here once customers place them.'
								: 'Try adjusting your filters.'}
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-zinc-200 overflow-hidden overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead className="hidden md:table-cell">Date</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-10"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-mono text-xs font-medium">
											{order.orderNumber}
										</TableCell>
										<TableCell className="font-medium">
											{order.customerName}
										</TableCell>
										<TableCell className="hidden md:table-cell text-zinc-500 text-sm">
											{new Date(order.createdAt).toLocaleDateString(
												'id',
												{ day: 'numeric', month: 'short', year: 'numeric' },
											)}
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
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setSelectedOrder(order)}
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

				{/* Order Detail Dialog */}
				<Dialog
					open={!!selectedOrder}
					onOpenChange={() => setSelectedOrder(null)}
				>
					<DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle>
						</DialogHeader>

						{selectedOrder && (
							<div className="space-y-5">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-zinc-500">Customer</p>
										<p className="font-medium">{selectedOrder.customerName}</p>
									</div>
									<div>
										<p className="text-zinc-500">Date</p>
										<p className="font-medium">
											{new Date(selectedOrder.createdAt).toLocaleString('id')}
										</p>
									</div>
									<div>
										<p className="text-zinc-500">Status</p>
										<Badge
											variant="outline"
											className={statusConfig[selectedOrder.status].className}
										>
											{statusConfig[selectedOrder.status].label}
										</Badge>
									</div>
									<div>
										<p className="text-zinc-500">Payment</p>
										<p className="font-medium">{selectedOrder.paymentMethod.name}</p>
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-zinc-900 mb-2">Items</h4>
									<div className="space-y-2">
										{selectedOrder.items.map((item, i) => (
											<div key={i} className="flex justify-between text-sm">
												<span className="text-zinc-600">
													{item.name} x{item.quantity}
												</span>
												<span className="font-medium">
													Rp {(item.price * item.quantity).toLocaleString('id')}
												</span>
											</div>
										))}
									</div>
								</div>

								<div className="bg-zinc-50 rounded-lg p-4 space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-zinc-500">Subtotal</span>
										<span>Rp {selectedOrder.subtotal.toLocaleString('id')}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-500">Shipping</span>
										<span>Rp {selectedOrder.shippingCost.toLocaleString('id')}</span>
									</div>
									<div className="flex justify-between font-bold pt-1 border-t border-zinc-200">
										<span>Total</span>
										<span>Rp {selectedOrder.total.toLocaleString('id')}</span>
									</div>
								</div>

									{selectedOrder.paymentProofUrl && (
									<div>
										<h4 className="font-semibold text-zinc-900 mb-2">
											Payment Proof
										</h4>
										<img
											src={selectedOrder.paymentProofUrl}
											alt="Payment proof"
											className="w-full rounded-lg border border-zinc-200"
										/>
									</div>
								)}

								<div>
									<h4 className="font-semibold text-zinc-900 mb-2">
										Update Status
									</h4>
									<div className="flex flex-wrap gap-2">
										{(
											Object.keys(statusConfig) as OrderStatus[]
										).map((status) => (
											<Button
												key={status}
												variant={
													selectedOrder.status === status
														? 'default'
														: 'outline'
												}
												size="sm"
												onClick={() => {
													updateOrderStatus(selectedOrder.id, status);
													setSelectedOrder({
														...selectedOrder,
														status,
													});
												}}
											>
												{statusConfig[status].label}
											</Button>
										))}
									</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
