import type { ReactNode } from 'react';

import { Link as LinkReactRouter, useLocation } from 'react-router';

type Props = Readonly<{
	to: string;
	type?: 'normal' | 'button primary' | 'button secondary';
	size?: 'sm' | 'normal';
	children: string | ReactNode;
}>;

export function Link({
	to,
	type = 'normal',
	size = 'normal',
	children,
}: Props) {
	if (type.includes('button')) {
		const isPrimary = type.includes('primary');
		const bg = isPrimary ? 'bg-zinc-900' : 'bg-white';
		const text = isPrimary ? 'text-white' : 'text-zinc-900';
		const linkSize = size == 'sm' ? 'px-3.5 py-1.5' : 'text-lg px-4 py-2';

		return (
			<LinkReactRouter
				to={to}
				className={`font-bold grid place-items-center rounded-md ${bg} ${text} ${linkSize}`}
			>
				{children}
			</LinkReactRouter>
		);
	}

	return (
		<LinkReactRouter
			to={to}
			className="text-inherit font-medium underline underline-offset-3"
		>
			{children}
		</LinkReactRouter>
	);
}
