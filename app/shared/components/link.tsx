import type { ReactNode } from 'react';

import { Link as ReactRouterLink } from 'react-router';

type Props = Readonly<{
	to: string;
	children: string | ReactNode;
}>;

export function Link({
	to,
	children,
}: Props) {
	return (
		<ReactRouterLink
			to={to}
			className="text-inherit font-medium underline underline-offset-3"
		>
			{children}
		</ReactRouterLink>
	);
}
