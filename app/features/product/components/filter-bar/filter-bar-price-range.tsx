import lodash from 'lodash';
import { useSearchParams } from 'react-router';

import { Input } from '~/shared/components/shadcn/ui/input';

export function FilterBarPriceRange({}) {
	const [searchParams, setSearchParams] = useSearchParams();

	function setParam(key: string, value: string | null) {
		setSearchParams(
			(params) => {
				if (!value) {
					params.delete(key);
				} else {
					params.set(key, value);
				}

				return params;
			},
			{ preventScrollReset: true },
		);
	}

	const minPrice = lodash.debounce(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			setParam('minPrice', e.target.value),
		300,
	);

	const maxPrice = lodash.debounce(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			setParam('maxPrice', e.target.value),
		300,
	);

	return (
		<div className="space-y-2">
			<p className="text-sm text-zinc-600">Price range</p>

			<Input
				type="number"
				placeholder="Min"
				className="bg-white"
				onChange={minPrice}
				defaultValue={searchParams.get('minPrice') ?? ''}
			/>
			<Input
				type="number"
				placeholder="Max"
				className="bg-white"
				onChange={maxPrice}
				defaultValue={searchParams.get('maxPrice') ?? ''}
			/>
		</div>
	);
}
