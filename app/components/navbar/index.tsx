import { Link } from '~/components/link';
import { NavbarLink } from './navbar-link';

export function Navbar() {
	return (
		<nav className="bg-white w-full px-5 py-3.5 flex items-center sticky top-0 left-0 z-10">
			<div className="flex gap-5">
				<img src="/logo/shopfinity.svg" alt="" className="w-8  " />
				<p className="text-xl font-bold">Shopfinity</p>
			</div>

			<ul className="flex gap-8 ml-16">
				<li>
					<NavbarLink to="/">Home</NavbarLink>
				</li>
				<li>
					<NavbarLink to="#">About</NavbarLink>
				</li>
			</ul>

			<div className="ml-auto flex gap-5">
				<Link to="sign-in" type="button secondary" size="sm">
					Sign In
				</Link>
				<Link to="sign-up" type="button primary" size="sm">
					Sign Up
				</Link>
			</div>
		</nav>
	);
}
