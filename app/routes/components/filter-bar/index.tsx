import { category } from '~/data';
import { FilterBarSearch } from './filter-bar-search';
import { FilterBarSelect } from './filter-bar-select';
import { FilterBarPriceRange } from './filter-bar-price-range';

export function FilterBar() {
	return (
		<aside className="w-72 h-fit bg-zinc-100 p-5 rounded-xl space-y-5 sticky top-20">
			<p className="font-bold text-zinc-800">Filter</p>

			<FilterBarSearch />
			<FilterBarPriceRange />
			<FilterBarSelect
				triggerText="Choose brand"
				items={[
					'Erigo',
					'Otsky',
					'Breakside',
					'Ventela',
					'FNGEEN',
					'Adidas',
					'Nike',
					'Puma',
				].map((name, index) => ({ id: `brand-${index}`, name }))}
				searchParamKey="brand"
			/>
			<FilterBarSelect
				triggerText="Choose category"
				items={category}
				searchParamKey="category"
			/>
		</aside>
	);
}
