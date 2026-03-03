import { Link } from 'react-router';
import { Button } from './shadcn/ui/button';

export function Navbar() {
	return (
		<nav className="bg-white w-full px-14 py-3.5 flex items-center sticky top-0 left-0 z-10">
			<div className="flex gap-5">
				<img src="/logo/shopfinity-light.svg" alt="" className="w-8  " />
				<p className="text-xl font-bold">Shopfinity</p>
			</div>

			<ul className="flex gap-8 ml-16">
				<li>
					<Link to="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
						Home
					</Link>
				</li>
			</ul>

			<div className="ml-auto flex gap-2">
				<Button variant="secondary" asChild>
					<Link to="/login">Login</Link>
				</Button>

				<Button asChild>
					<Link to="/sign-up">Sign up</Link>
				</Button>
			</div>
		</nav>
	);
}
