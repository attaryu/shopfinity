import type { Product } from '~/data/index';

import { useSearchParams } from 'react-router';

import { CategoryTag } from './_components/category-tag';
import { Section } from './_components/section';

import { getAllCategory, getProducts } from '~/utils/dataFetching';

export default function Home() {
	const categories = getAllCategory();
	const [parameter] = useSearchParams();
	const selectedCategory = parameter.get('categoryid');
	let query = undefined;

	if (selectedCategory) {
		query = (item: Product) => item.category.includes(Number(selectedCategory));
	}

	return (
		<>
			<header>
				<div className="w-full flex gap-4">
					{categories.map((category) => (
						<CategoryTag key={category.id} {...category} />
					))}
				</div>
			</header>

			<main className="mt-8 flex flex-col gap-32">
				<Section title="Hot Sale" data={getProducts(10, query)} />
				<Section
					title="Sepatu Terlaris"
					data={getProducts(10, (item) => item.category.includes(4))}
				/>
				<Section
					title="Tas Terbaru"
					data={getProducts(10, (item) => item.category.includes(5))}
				/>
			</main>
		</>
	);
}
