import { Link, useLocation } from 'react-router';

type Props = Readonly<{
	to: string;
	type?: 'normal' | 'button primary' | 'button secondary';
	size?: 'sm' | 'normal';
	children: string;
}>;

export function NavbarLink({ to, children }: Props) {
	const { pathname } = useLocation();

	return (
		<Link
			to={to}
			className={`font-medium relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:origin-right before:w-full before:h-0.5 before:bg-red-500 before:scale-x-0 before:transition-transform hover:before:origin-left hover:before:scale-x-100 before:duration-300 before:ease-in-out before:-z-10 z-0 ${pathname == to ? 'before:scale-x-100' : ''}`}
		>
			{children}
		</Link>
	);
}
