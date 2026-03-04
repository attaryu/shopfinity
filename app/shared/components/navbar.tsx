import { useMutation } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '~/features/auth/hooks/api/use-user';
import { http } from '../utils/http';
import { clearSession } from '../utils/session-management';
import { Button } from './shadcn/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './shadcn/ui/dropdown-menu';

export function Navbar() {
	const user = useUser();
	const navigate = useNavigate();

	const { mutate: logout } = useMutation({
		mutationFn: () => http.delete('auth/logout', { credentials: 'include' }),
		onSuccess: () => {
			clearSession();
			navigate('/login');
		},
	});

	return (
		<nav className="bg-white w-full px-14 py-3.5 flex items-center sticky top-0 left-0 z-10">
			<div className="flex gap-5">
				<img src="/logo/shopfinity-light.svg" alt="" className="w-8  " />
				<p className="text-xl font-bold">Shopfinity</p>
			</div>

			<ul className="flex gap-8 ml-16">
				<li>
					<Link
						to="/"
						className="text-zinc-600 hover:text-zinc-900 transition-colors"
					>
						Home
					</Link>
				</li>
			</ul>

			{user.data ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="ml-auto flex items-center gap-2">
						<Button variant="ghost">
							<User />
							<span>{user.data.fullname}</span>
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="bg-white rounded-md border border-zinc-300 p-2">
						<DropdownMenuItem>
							<Button variant="ghost" onClick={() => logout()}>
								Logout
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className="ml-auto flex gap-2">
					<Button variant="secondary" asChild>
						<Link to="/login">Login</Link>
					</Button>

					<Button asChild>
						<Link to="/sign-up">Sign up</Link>
					</Button>
				</div>
			)}
		</nav>
	);
}
