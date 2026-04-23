import lodash from 'lodash';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router';

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '~/shared/components/shadcn/ui/input-group';

export function FilterBarSearch({}) {
	const [param, setParam] = useSearchParams();

	const handleSearch = lodash.debounce(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const searchQuery = e.target.value;

			setParam(
				(params) => {
					if (!searchQuery) {
						params.delete('search');
					} else {
						params.set('search', searchQuery);
					}

					return params;
				},
				{ preventScrollReset: true },
			);
		},
		300,
	);

	return (
		<InputGroup className="bg-white">
			<InputGroupInput
				placeholder="Search products..."
				name="search"
				defaultValue={param.get('search') ?? ''}
				onChange={handleSearch}
			/>

			<InputGroupButton className="h-full bg-zinc-800 hover:bg-zinc-700 hover:text-white text-white aspect-square rounded-l-none">
				<Search />
			</InputGroupButton>
		</InputGroup>
	);
}
