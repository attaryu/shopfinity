import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Skeleton } from '~/shared/components/shadcn/ui/skeleton';
import { MediaStorage } from '~/shared/lib/media-storage';
import { useCartStore } from '~/features/cart/store/cart-store';
import { getSession } from '~/shared/utils/session-management';
import { useGetProduct } from '../hooks/api/use-get-product';
import type { Route } from './+types/product-detail';

export default function ProductDetail({ params }: Route.ComponentProps) {
	const { idOrSlug } = params;
	const { data: product, isLoading, isError, error } = useGetProduct(idOrSlug);
	const addItem = useCartStore((s) => s.addItem);
	const navigate = useNavigate();

	function requireAuth() {
		if (!getSession()) {
			toast.error('Please login first to continue', {
				description: 'You need to authenticate before adding items to cart.',
				action: {
					label: 'Login',
					onClick: () => navigate('/login'),
				},
				duration: 5000,
			});
			return false;
		}
		return true;
	}

	function handleAddToCart() {
		if (!product || !requireAuth()) return;

		addItem({
			productId: product.id,
			slug: product.slug,
			name: product.name,
			price: product.price,
			imageUrl: product.imageUrl,
			brandName: product.brand.name,
			categoryName: product.category.name,
		});

		toast.success('Added to cart', {
			description: `${product.name} has been added to your cart.`,
			action: {
				label: 'View Cart',
				onClick: () => navigate('/cart'),
			},
			duration: 4000,
		});
	}

	function handleBuyNow() {
		if (!product || !requireAuth()) return;

		addItem({
			productId: product.id,
			slug: product.slug,
			name: product.name,
			price: product.price,
			imageUrl: product.imageUrl,
			brandName: product.brand.name,
			categoryName: product.category.name,
		});

		navigate('/cart');
	}

	if (isLoading) {
		return (
			<main className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center p-4 sm:p-8 lg:p-14 animate-pulse max-w-7xl mx-auto">
				<Skeleton className="w-full lg:w-5/12 aspect-[3/4] rounded-xl" />
				<div className="w-full lg:w-7/12 space-y-4 sm:space-y-6">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-10 sm:h-12 w-3/4" />
					<Skeleton className="h-5 w-1/4" />
					<Skeleton className="h-28 sm:h-32 w-full" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-12 sm:h-16 w-full mt-8" />
				</div>
			</main>
		);
	}

	if (isError || !product) {
		return (
			<>
				<title>Product Not Found - Shopfinity</title>
				<main className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
					<div className="bg-zinc-100 p-6 rounded-full">
						<i className="fi fi-rs-search text-5xl text-zinc-400" />
					</div>
					<div className="space-y-2">
						<h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
							Product Not Found
						</h1>
						<p className="text-zinc-600 max-w-md mx-auto text-sm sm:text-base">
							{error instanceof Error
								? error.message
								: 'Maaf, produk yang kamu cari tidak ditemukan atau telah dihapus.'}
						</p>
					</div>
					<Link to="/">
						<Button size="lg" className="rounded-full px-8">
							Back to Shopping
						</Button>
					</Link>
				</main>
			</>
		);
	}

	return (
		<>
			<title>{product.name} - Shopfinity</title>

			<main className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start p-4 sm:p-8 lg:p-14 max-w-7xl mx-auto">
				<div className="w-full lg:w-5/12 lg:sticky lg:top-24">
					<div className="relative group overflow-hidden rounded-2xl bg-zinc-100 aspect-[4/3] sm:aspect-[3/4]">
						<img
							src={MediaStorage.getUrl(product.imageUrl)}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
				</div>

				<div className="w-full lg:w-7/12 py-2 sm:py-4">
					<div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
						<span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-zinc-100 text-zinc-900 rounded-full border border-zinc-200">
							{product.category.name}
						</span>
					</div>

					<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-zinc-900 mb-4 leading-tight">
						{product.name}
					</h1>

					<div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
						<div className="flex items-center gap-2 bg-zinc-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-zinc-100">
							{product.brand.logoUrl && (
								<img
									src={MediaStorage.getUrl(product.brand.logoUrl)}
									alt={product.brand.name}
									className="size-5 sm:size-6 rounded-md object-contain"
								/>
							)}
							<span className="text-sm sm:text-md font-semibold text-zinc-900">
								{product.brand.name}
							</span>
						</div>
						<span className="text-zinc-300 hidden sm:inline">|</span>
						<span className="text-sm text-zinc-500 font-medium">
							Stock: <span className="text-zinc-900">{product.stock}</span>
						</span>
					</div>

					<div className="mb-8 sm:mb-10">
						<h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2 sm:mb-3">
							Description
						</h3>
						<p className="text-zinc-600 leading-relaxed text-sm sm:text-base lg:text-lg whitespace-pre-wrap">
							{product.description}
						</p>
					</div>

					<div className="bg-zinc-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100 mb-8 sm:mb-10">
						<p className="text-xs sm:text-sm text-zinc-500 font-bold uppercase tracking-wider mb-1 sm:mb-2">
							Price
						</p>
						<p className="text-3xl sm:text-4xl font-black text-zinc-900">
							Rp {product.price.toLocaleString('id')}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
						<Button
							size="lg"
							onClick={handleAddToCart}
							className="flex-1 h-14 sm:h-16 text-base sm:text-xl rounded-2xl font-bold bg-zinc-900 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
						>
							Add to Cart
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={handleBuyNow}
							className="flex-1 h-14 sm:h-16 text-base sm:text-xl rounded-2xl font-bold border-2 border-zinc-200 hover:bg-zinc-50 transition-all"
						>
							Buy Now
						</Button>
					</div>

					<p className="mt-6 sm:mt-8 text-center text-zinc-400 text-xs sm:text-sm">
						Free shipping on orders over Rp 500.000 &bull; 30-day return policy
					</p>
				</div>
			</main>
		</>
	);
}
