import { useSearchParams } from 'react-router';
import { useState, useMemo } from 'react';
import { Card } from '../components/card';
import { FilterBar } from '../components/filter-bar';
import { useGetClientProducts } from '../hooks/api/use-get-client-products';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Skeleton } from '~/shared/components/shadcn/ui/skeleton';

export default function ProductList() {
	const [searchParams] = useSearchParams();
	const [limit, setLimit] = useState(12);

	const params = useMemo(() => {
		return {
			search: searchParams.get('search') || undefined,
			category: searchParams.get('category') || undefined,
			brand: searchParams.get('brand') || undefined,
			minPrice: searchParams.get('minPrice')
				? Number(searchParams.get('minPrice'))
				: undefined,
			maxPrice: searchParams.get('maxPrice')
				? Number(searchParams.get('maxPrice'))
				: undefined,
			limit,
		};
	}, [searchParams, limit]);

	const { data, isLoading, isFetching, isError } = useGetClientProducts(params);

	const products = data?.products || [];
	const totalItems = data?.meta?.totalItems || 0;
	const hasMore = products.length < totalItems;

	const handleLoadMore = () => {
		setLimit((prev) => prev + 12);
	};

	return (
		<>
			<title>Shopfinity - Home</title>

			<main>
				<section className="h-[50vh] bg-zinc-900 w-full relative">
					<img
						src="/images/hero-image.jpg"
						alt=""
						className="w-full h-full object-[25%_35%] object-cover saturate-0 brightness-[0.3]"
					/>

					<div className="absolute inset-0 flex flex-col justify-center items-center gap-5">
						<h1 className="text-white font-bold text-7xl">
							Discover Your Own Style.
						</h1>
						<p className="text-white text-lg">
							Find the perfect look for every occasion
						</p>
					</div>
				</section>

				<section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
					<FilterBar />

					<div className="flex flex-col gap-8 w-full">
						<div className="border-b border-zinc-200 pb-5 flex justify-between items-center">
							<div className="space-y-1">
								<h2 className="text-2xl font-bold text-zinc-900">
									All Products
								</h2>
								<p className="text-zinc-500 text-sm font-medium">
									{isLoading ? (
										'Searching products...'
									) : (
										<>
											Showing{' '}
											<span className="text-zinc-900">{products.length}</span>{' '}
											of <span className="text-zinc-900">{totalItems}</span>{' '}
											products
										</>
									)}
								</p>
							</div>
						</div>

						{isError ? (
							<div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
								<p className="text-zinc-500 font-medium">
									Something went wrong. Please try again.
								</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => window.location.reload()}
								>
									Retry
								</Button>
							</div>
						) : isLoading ? (
							<ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
								{Array.from({ length: 8 }).map((_, i) => (
									<li key={i} className="space-y-4">
										<Skeleton className="h-64 w-full rounded-xl" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-4 w-1/2" />
									</li>
								))}
							</ul>
						) : products.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
								<p className="text-zinc-500 font-medium">No products found.</p>
								<p className="text-zinc-400 text-sm mt-1">
									Try adjusting your filters or search terms.
								</p>
							</div>
						) : (
							<ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 h-fit">
								{products.map((item) => (
									<Card key={item.id} {...item} />
								))}
							</ul>
						)}

						{hasMore && !isLoading && (
							<div className="mt-12 flex justify-center">
								<Button
									variant="outline"
									size="lg"
									className="px-12 py-6 rounded-full border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-all duration-300"
									onClick={handleLoadMore}
									disabled={isFetching}
								>
									{isFetching ? 'Loading...' : 'LOAD MORE PRODUCTS'}
								</Button>
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	);
}
