import { Link, useNavigate } from 'react-router';
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Separator } from '~/shared/components/shadcn/ui/separator';
import { MediaStorage } from '~/shared/lib/media-storage';
import { useUser } from '~/features/auth/hooks/api/use-user';
import {
	useCartQuery,
	useUpdateCartItemMutation,
	useRemoveFromCartMutation,
	useClearCartMutation,
	useCartTotal,
} from '../hooks/use-cart';
import { useEffect } from 'react';

export default function CartPage() {
	const navigate = useNavigate();
	const { data: user, isLoading: isUserLoading } = useUser();
	const { data: cart, isLoading: isCartLoading } = useCartQuery();
	
	const updateQuantityMutation = useUpdateCartItemMutation();
	const removeItemMutation = useRemoveFromCartMutation();
	const clearCartMutation = useClearCartMutation();
	const total = useCartTotal();

	useEffect(() => {
		if (!isUserLoading && !user) {
			navigate('/login');
		}
	}, [user, isUserLoading, navigate]);

	if (isUserLoading || (user && isCartLoading)) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center">
				<Loader2 className="size-8 animate-spin text-zinc-400" />
			</div>
		);
	}

	const items = cart?.items || [];

	if (items.length === 0) {
		return (
			<>
				<title>Cart - Shopfinity</title>
				<main className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
					<div className="bg-zinc-100 p-6 rounded-full">
						<ShoppingCart className="size-12 text-zinc-400" />
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
							Your cart is empty
						</h1>
						<p className="text-zinc-500 text-sm sm:text-base max-w-md">
							Looks like you haven't added anything to your cart yet. Start
							shopping and find something you love!
						</p>
					</div>
					<Link to="/">
						<Button size="lg" className="rounded-full px-8">
							Start Shopping
						</Button>
					</Link>
				</main>
			</>
		);
	}

	return (
		<>
			<title>Cart - Shopfinity</title>

			<main className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
				<div className="flex items-center justify-between mb-6 sm:mb-8">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
							Shopping Cart
						</h1>
						<p className="text-zinc-500 text-sm mt-1">
							{items.length} {items.length === 1 ? 'item' : 'items'} in your
							cart
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="text-red-500 hover:text-red-600 hover:bg-red-50"
						onClick={() => clearCartMutation.mutate()}
						disabled={clearCartMutation.isPending}
					>
						{clearCartMutation.isPending ? 'Clearing...' : 'Clear Cart'}
					</Button>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Cart Items */}
					<ul className="flex-1 space-y-4">
						{items.map((item) => (
							<li
								key={item.id}
								className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-200"
							>
								<Link
									to={`/product/${item.product.slug}`}
									className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg bg-zinc-100 overflow-hidden"
								>
									<img
										src={MediaStorage.getUrl(item.product.imageUrl)}
										alt={item.product.name}
										className="w-full h-full object-cover"
									/>
								</Link>

								<div className="flex-1 min-w-0">
									<Link
										to={`/product/${item.product.slug}`}
										className="font-semibold text-zinc-900 hover:underline line-clamp-1"
									>
										{item.product.name}
									</Link>
									<p className="text-xs text-zinc-500 mt-0.5">
										{item.product.brand.name} &middot; {item.product.category.name}
									</p>

									<div className="flex items-center justify-between mt-3">
										<div className="flex items-center gap-1">
											<Button
												variant="outline"
												size="icon"
												className="size-8"
												disabled={updateQuantityMutation.isPending || item.quantity <= 1}
												onClick={() =>
													updateQuantityMutation.mutate({
														id: item.id,
														quantity: item.quantity - 1,
													})
												}
											>
												<Minus className="size-3" />
											</Button>
											<span className="w-8 text-center text-sm font-medium">
												{item.quantity}
											</span>
											<Button
												variant="outline"
												size="icon"
												className="size-8"
												disabled={updateQuantityMutation.isPending}
												onClick={() =>
													updateQuantityMutation.mutate({
														id: item.id,
														quantity: item.quantity + 1,
													})
												}
											>
												<Plus className="size-3" />
											</Button>
										</div>

										<div className="flex items-center gap-3">
											<p className="font-bold text-zinc-900 text-sm sm:text-base">
												Rp{' '}
												{(item.product.price * item.quantity).toLocaleString(
													'id',
												)}
											</p>
											<Button
												variant="ghost"
												size="icon"
												className="size-8 text-zinc-400 hover:text-red-500"
												disabled={removeItemMutation.isPending}
												onClick={() => removeItemMutation.mutate(item.id)}
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>

					{/* Order Summary */}
					<div className="lg:w-80 shrink-0">
						<div className="bg-zinc-50 rounded-xl border border-zinc-200 p-6 sticky top-24">
							<h2 className="text-lg font-bold text-zinc-900 mb-4">
								Order Summary
							</h2>

							<div className="space-y-2 text-sm">
								<div className="flex justify-between text-zinc-600">
									<span>Subtotal</span>
									<span>Rp {total.toLocaleString('id')}</span>
								</div>
								<div className="flex justify-between text-zinc-600">
									<span>Shipping</span>
									<span className="text-zinc-400">
										Calculated at checkout
									</span>
								</div>
							</div>

							<Separator className="my-4" />

							<div className="flex justify-between font-bold text-zinc-900">
								<span>Total</span>
								<span>Rp {total.toLocaleString('id')}</span>
							</div>

							<Button
								className="w-full mt-6 h-12 text-base rounded-xl font-bold bg-zinc-900 hover:bg-zinc-800"
								onClick={() => navigate('/checkout')}
							>
								Proceed to Checkout
							</Button>

							<Link
								to="/"
								className="block text-center text-sm text-zinc-500 hover:text-zinc-900 mt-4 transition-colors"
							>
								Continue Shopping
							</Link>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
