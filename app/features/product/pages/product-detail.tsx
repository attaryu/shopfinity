import { Link } from 'react-router';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Skeleton } from '~/shared/components/shadcn/ui/skeleton';
import { MediaStorage } from '~/shared/lib/media-storage';
import { useGetProduct } from '../hooks/api/use-get-product';
import type { Route } from './+types/product-detail';

export default function ProductDetail({ params }: Route.ComponentProps) {
	const { idOrSlug } = params;
	const { data: product, isLoading, isError, error } = useGetProduct(idOrSlug);

	if (isLoading) {
		return (
			<main className="flex flex-col lg:flex-row gap-14 items-center p-8 lg:p-14 animate-pulse">
				<Skeleton className="w-full lg:w-1/3 h-[50vh] lg:h-[75vh] rounded-xl" />
				<div className="w-full space-y-6">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-12 w-3/4" />
					<Skeleton className="h-6 w-1/4" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-12 w-1/2 mt-10" />
				</div>
			</main>
		);
	}

	if (isError || !product) {
		return (
			<>
				<title>Product Not Found - Shopfinity</title>
				<main className="h-[90vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
					<div className="bg-zinc-100 p-6 rounded-full">
						<i className="fi fi-rs-search text-5xl text-zinc-400" />
					</div>
					<div className="space-y-2">
						<h1 className="text-4xl font-bold text-zinc-900">
							Product Not Found
						</h1>
						<p className="text-zinc-600 max-w-md mx-auto">
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

			<main className="flex flex-col lg:flex-row gap-14 items-start p-8 lg:p-14 max-w-7xl mx-auto">
				<div className="w-full lg:w-5/12 sticky top-24">
					<div className="relative group overflow-hidden rounded-2xl bg-zinc-100 aspect-[3/4]">
						<img
							src={MediaStorage.getUrl(product.imageUrl)}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
				</div>

				<div className="w-full lg:w-7/12 py-4">
					<div className="flex flex-wrap gap-2 mb-6">
						<span className="px-4 py-1.5 text-sm font-semibold bg-zinc-100 text-zinc-900 rounded-full border border-zinc-200">
							{product.category.name}
						</span>
					</div>

					<h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 leading-tight">
						{product.name}
					</h1>

					<div className="flex items-center gap-3 mb-8">
						<div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
							{product.brand.logoUrl && (
								<img
									src={MediaStorage.getUrl(product.brand.logoUrl)}
									alt={product.brand.name}
									className="size-6 rounded-md object-contain"
								/>
							)}
							<span className="text-md font-semibold text-zinc-900">
								{product.brand.name}
							</span>
						</div>
						<span className="text-zinc-300">|</span>
						<span className="text-zinc-500 font-medium">
							Stock: <span className="text-zinc-900">{product.stock}</span>
						</span>
					</div>

					<div className="mb-10">
						<h3 className="text-lg font-bold text-zinc-900 mb-3">
							Description
						</h3>
						<p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap">
							{product.description}
						</p>
					</div>

					<div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 mb-10">
						<p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-2">
							Price
						</p>
						<p className="text-4xl font-black text-zinc-900">
							Rp {product.price.toLocaleString('id')}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						<Button
							size="lg"
							className="flex-1 h-16 text-xl rounded-2xl font-bold bg-zinc-900 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
						>
							Add to Cart
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="flex-1 h-16 text-xl rounded-2xl font-bold border-2 border-zinc-200 hover:bg-zinc-50 transition-all"
						>
							Buy Now
						</Button>
					</div>

					<p className="mt-8 text-center text-zinc-400 text-sm">
						Free shipping on orders over Rp 500.000 • 30-day return policy
					</p>
				</div>
			</main>
		</>
	);
}
