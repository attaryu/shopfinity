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
						src="https://images.unsplash.com/photo-1559697242-fb2caa00d26d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt=""
						className="w-full h-full object-[25%_40%] object-cover saturate-0 brightness-[0.3]"
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
