import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Check, Package } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { useOrderStore } from '~/features/admin/store/order-store';

export default function CheckoutSuccess() {
	const [searchParams] = useSearchParams();
	const orderId = searchParams.get('order');
	const order = orderId ? useOrderStore((s) => s.getOrderById(orderId)) : undefined;

	useEffect(() => {
		if (order) {
			document.title = `Order Placed - Shopfinity`;
		}
	}, [order]);

	return (
		<main className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
			<div className="bg-green-100 p-6 rounded-full">
				<Check className="size-12 text-green-600" />
			</div>
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
					Order Placed Successfully!
				</h1>
				<p className="text-zinc-500 max-w-md">
					Thank you for your purchase. Your order has been received and is
					pending payment verification.
				</p>
			</div>

			{order && (
				<div className="bg-zinc-50 rounded-xl p-6 space-y-3 text-left w-full max-w-md">
					<div className="flex items-center gap-2 text-zinc-900">
						<Package className="size-5" />
						<span className="font-bold">{order.orderNumber}</span>
					</div>
					<div className="text-sm text-zinc-600 space-y-1">
						<p>Total: Rp {order.total.toLocaleString('id')}</p>
						<p>Payment: {order.paymentMethod.name}</p>
						<p>Status: <span className="font-medium text-yellow-600">Pending Payment</span></p>
					</div>
				</div>
			)}

			<div className="flex gap-3">
				<Link to="/">
					<Button variant="outline" className="rounded-xl">
						Continue Shopping
					</Button>
				</Link>
				<Link to="/admin/orders">
					<Button className="rounded-xl">View Orders</Button>
				</Link>
			</div>
		</main>
	);
}
