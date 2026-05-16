import { FilterBarSearch } from './filter-bar-search';
import { FilterBarSelect } from './filter-bar-select';
import { FilterBarPriceRange } from './filter-bar-price-range';
import { useGetClientCategories } from '../../hooks/api/use-get-client-categories';
import { useGetClientBrands } from '../../hooks/api/use-get-client-brands';

interface FilterBarProps {
	onClose?: () => void;
}

export function FilterBar({ onClose }: FilterBarProps = {}) {
	const { data: categories = [], isLoading: isLoadingCategories } =
		useGetClientCategories();
	const { data: brands = [], isLoading: isLoadingBrands } = useGetClientBrands();

	return (
		<aside className="w-full lg:w-72 h-fit bg-zinc-100 p-5 rounded-xl space-y-5 lg:sticky lg:top-20 border border-zinc-200">
			<p className="font-bold text-zinc-800 text-lg">Filter</p>

			<FilterBarSearch />
			<FilterBarPriceRange />

			<FilterBarSelect
				triggerText={isLoadingBrands ? 'Loading brands...' : 'Choose brand'}
				items={brands}
				searchParamKey="brand"
				onClose={onClose}
			/>

			<FilterBarSelect
				triggerText={
					isLoadingCategories ? 'Loading categories...' : 'Choose category'
				}
				items={categories}
				searchParamKey="category"
				onClose={onClose}
			/>
		</aside>
	);
}
