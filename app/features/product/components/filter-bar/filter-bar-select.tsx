import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '~/shared/components/shadcn/ui/collapsible';
import { ScrollArea } from '~/shared/components/shadcn/ui/scroll-area';
import { MediaStorage } from '~/shared/lib/media-storage';

type Props = Readonly<{
	defaultOpen?: boolean;
	triggerText: string;
	searchParamKey?: string;
	items: {
		id: string | number;
		name: string;
		slug?: string;
		logoUrl?: string;
	}[];
	onClose?: () => void;
}>;

export function FilterBarSelect({
	defaultOpen = false,
	triggerText,
	items,
	searchParamKey,
	onClose,
}: Props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selected, setSelected] = useState<string | number | null>(() => {
		if (!searchParamKey) {
			return null;
		}

		const paramValue = searchParams.get(searchParamKey)?.toLowerCase();

		return (
			items.find(
				(item) => (item.slug ?? item.name.toLowerCase()) === paramValue,
			)?.id ?? null
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
						params.set(
							searchParamKey,
							selectedItem?.slug ?? selectedItem?.name.toLowerCase() ?? '',
						);
					}
					return params;
				},
				{ preventScrollReset: true },
			);
		}

		onClose?.();
	}

	return (
		<Collapsible
			className="bg-zinc-800 p-1 rounded-lg"
			defaultOpen={defaultOpen}
		>
			<CollapsibleTrigger className="text-white p-2 rounded-lg w-full flex justify-between items-center text-sm cursor-pointer">
				<span className="truncate pr-2">{selectedItemName ?? triggerText}</span>
				<ChevronsUpDown size={16} className="text-white shrink-0" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<ScrollArea className="h-44 scroll-x-hidden bg-zinc-100 rounded-lg mt-3">
					<ul className="py-1">
						{items.map(({ id, name, logoUrl }) => (
							<li key={id}>
								<button
									type="button"
									className={`text-sm px-3 py-2.5 hover:bg-zinc-200 focus-within:outline-zinc-500 text-start w-full cursor-pointer flex items-center gap-3 transition-colors ${selected === id ? 'bg-zinc-300 font-bold' : ''}`}
									onClick={() => handleSelect(id)}
								>
									{logoUrl && (
										<img
											src={MediaStorage.getUrl(logoUrl)}
											alt={name}
											className="w-5 h-5 object-contain bg-white rounded p-0.5"
										/>
									)}
									<span className="truncate">{name}</span>
								</button>
							</li>
						))}
					</ul>
				</ScrollArea>
			</CollapsibleContent>
		</Collapsible>
	);
}
