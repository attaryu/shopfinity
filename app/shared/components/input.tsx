import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export function Input({ label, ...rest }: Props) {
	const id = useId();

	return (
		<label htmlFor={id}>
			<p className="font-medium">{label}</p>

			<input
				id={id}
				className="mt-2 outline-1 outline-zinc-950 rounded-sm w-full px-2.5 py-1 invalid:outline-red-600 invalid:bg-red-100 invalid:shadow-md transition-colors duration-300"
				{...rest}
			/>
		</label>
	);
}
