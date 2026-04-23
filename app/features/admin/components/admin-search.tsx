import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '~/shared/components/shadcn/ui/input';

interface AdminSearchProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function AdminSearch({
	value,
	onChange,
	placeholder = 'Search...',
	className,
}: AdminSearchProps) {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, 400);

		return () => clearTimeout(handler);
	}, [localValue, onChange, value]);

	return (
		<div className={`relative flex-1 min-w-[250px] max-w-sm ${className}`}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
			<Input
				className="pl-9 bg-white border-zinc-200 shadow-sm"
				placeholder={placeholder}
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
			/>
		</div>
	);
}
