import { getProducts } from '~/utils/dataFetching';
import { Card } from './components/card';
import { FilterBar } from './components/filter-bar';

const products = getProducts(14);

export default function Home() {
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

				<section className="flex p-14 gap-10">
					<FilterBar />

					<div className="flex flex-col gap-6 w-full">
						<div className="border-b border-zinc-300 pb-3 flex justify-between items-center">
							<p className="text-zinc-600 text-lg font-medium">
								{products.length} products
							</p>
						</div>

						<ul className="w-full grid grid-cols-4 gap-8 h-fit">
							{products.map((item) => (
								<Card key={item.id} {...item} />
							))}
						</ul>

						<button className="bg-zinc-900 ml-auto text-white px-6 py-3 rounded-lg mt-8">
							Load more products
						</button>
					</div>
				</section>
			</main>
		</>
	);
}
