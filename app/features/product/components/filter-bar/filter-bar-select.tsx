import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '~/shared/components/shadcn/ui/collapsible';
import { ScrollArea } from '~/shared/components/shadcn/ui/scroll-area';

type Props = Readonly<{
	defaultOpen?: boolean;
	triggerText: string;
	searchParamKey?: string;
	items: {
		id: string | number;
		name: string;
	}[];
}>;

export function FilterBarSelect({
	defaultOpen = false,
	triggerText,
	items,
	searchParamKey,
}: Props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selected, setSelected] = useState<string | number | null>(() => {
		if (!searchParamKey) {
			return null;
		}

		const paramValue = searchParams.get(searchParamKey)?.toLowerCase();

		return (
			items.find((item) => item.name.toLowerCase() === paramValue)?.id ?? null
		);
	});

	const selectedItemName = useMemo(
		() => items.find((item) => item.id === selected)?.name,
		[selected, items],
	);

	function handleSelect(id: string | number) {
		const isDeselecting = selected === id;
		const newSelected = isDeselecting ? null : id;

		setSelected(newSelected);

		if (searchParamKey) {
			setSearchParams(
				(params) => {
					if (isDeselecting) {
						params.delete(searchParamKey);
					} else {
						const selectedItem = items.find((item) => item.id === id);
						params.set(searchParamKey, selectedItem?.name.toLowerCase() ?? '');
					}
					return params;
				},
				{ preventScrollReset: true },
			);
		}
	}

	return (
		<Collapsible
			className="bg-zinc-800 p-1 rounded-lg"
			defaultOpen={defaultOpen}
		>
			<CollapsibleTrigger className="text-white p-2 rounded-lg w-full flex justify-between items-center text-sm cursor-pointer">
				{selectedItemName ?? triggerText}
				<ChevronsUpDown size={16} className="text-white" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<ScrollArea className="h-40 scroll-x-hidden bg-zinc-100 rounded-lg mt-3">
					<ul>
						{items.map(({ id, name }) => (
							<li key={id}>
								<button
									type="button"
									className={`text-sm p-2 hover:bg-zinc-200 focus-within:outline-zinc-500 text-start w-full cursor-pointer ${selected === id ? 'bg-zinc-300' : ''}`}
									onClick={() => handleSelect(id)}
								>
									{name}
								</button>
							</li>
						))}
					</ul>
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
