import { useState } from 'react';
import { Check, CheckCircle, X, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '~/shared/components/shadcn/ui/button';
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
import type { Order } from '../../checkout/types/checkout-types';

export default function PaymentVerification() {
	const orders = useOrderStore((s) => s.orders);
	const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
	const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const pendingOrders = orders
		.filter((o) => o.status === 'PENDING_PAYMENT')
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

	function handleVerify(orderId: string) {
		updateOrderStatus(orderId, 'PAID');
		toast.success('Payment verified. Order is now paid.');
		setPreviewOrder(null);
	}

	function handleReject(orderId: string) {
		updateOrderStatus(orderId, 'CANCELLED');
		toast.error('Payment rejected. Order has been cancelled.');
		setPreviewOrder(null);
	}

	return (
		<>
			<title>Payment Verification - Shopfinity Admin</title>

			<div className="p-4 sm:p-6 lg:p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-zinc-900">
						Payment Verification
					</h1>
					<p className="text-sm text-zinc-500 mt-1">
						Review and verify customer payment proofs
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
					<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
						<p className="text-yellow-800 text-2xl font-bold">
							{pendingOrders.length}
						</p>
						<p className="text-yellow-600 text-sm">Pending</p>
					</div>
					<div className="bg-green-50 border border-green-200 rounded-xl p-4">
						<p className="text-green-800 text-2xl font-bold">
							{orders.filter((o) => o.status === 'PAID' || o.status === 'PROCESSING' || o.status === 'SHIPPED' || o.status === 'DELIVERED').length}
						</p>
						<p className="text-green-600 text-sm">Verified</p>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-xl p-4">
						<p className="text-red-800 text-2xl font-bold">
							{orders.filter((o) => o.status === 'CANCELLED').length}
						</p>
						<p className="text-red-600 text-sm">Rejected</p>
					</div>
				</div>

				{pendingOrders.length === 0 ? (
					<div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
						<CheckCircle className="size-10 text-zinc-300 mx-auto mb-3" />
						<p className="text-zinc-500 font-medium">No pending payments</p>
						<p className="text-zinc-400 text-sm mt-1">
							All payment proofs have been reviewed.
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-zinc-200 overflow-hidden overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Payment Method</TableHead>
									<TableHead className="hidden sm:table-cell">Date</TableHead>
									<TableHead>Proof</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pendingOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-mono text-xs font-medium">
											{order.orderNumber}
										</TableCell>
										<TableCell className="font-medium">
											{order.customerName}
										</TableCell>
										<TableCell className="font-semibold">
											Rp {order.total.toLocaleString('id')}
										</TableCell>
										<TableCell className="text-sm text-zinc-600">
											{order.paymentMethod.name}
										</TableCell>
										<TableCell className="hidden sm:table-cell text-zinc-500 text-sm">
											{new Date(order.createdAt).toLocaleDateString('id', {
												day: 'numeric',
												month: 'short',
											})}
										</TableCell>
										<TableCell>
											{order.paymentProofUrl ? (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setPreviewOrder(order);
														setPreviewImage(order.paymentProofUrl || null);
													}}
												>
													<ZoomIn className="size-4" />
												</Button>
											) : (
												<span className="text-xs text-zinc-400">
													No proof
												</span>
											)}
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button
													size="icon"
													variant="ghost"
													className="text-green-600 hover:bg-green-50 size-8"
													onClick={() => handleVerify(order.id)}
													title="Verify"
												>
													<Check className="size-4" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className="text-red-600 hover:bg-red-50 size-8"
													onClick={() => handleReject(order.id)}
													title="Reject"
												>
													<X className="size-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Preview Dialog */}
				<Dialog
					open={!!previewOrder}
					onOpenChange={() => {
						setPreviewOrder(null);
						setPreviewImage(null);
					}}
				>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>
								Payment Proof - {previewOrder?.orderNumber}
							</DialogTitle>
						</DialogHeader>

						{previewImage && (
							<div className="space-y-4">
								<img
									src={previewImage}
									alt="Payment proof"
									className="w-full rounded-lg border border-zinc-200"
								/>
								<div className="flex gap-3 justify-end">
									<Button
										variant="outline"
										onClick={() => {
											setPreviewOrder(null);
											setPreviewImage(null);
										}}
									>
										Close
									</Button>
									<Button
										variant="destructive"
										onClick={() => handleReject(previewOrder!.id)}
									>
										<X className="size-4 mr-1" /> Reject
									</Button>
									<Button
										className="bg-green-600 hover:bg-green-700"
										onClick={() => handleVerify(previewOrder!.id)}
									>
										<Check className="size-4 mr-1" /> Verify & Confirm
									</Button>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
