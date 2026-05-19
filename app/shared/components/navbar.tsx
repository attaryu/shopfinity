import { useMutation } from '@tanstack/react-query';
import {
	ChevronRight,
	LayoutDashboard,
	LogOut,
	Menu,
	Package,
	ShoppingCart,
	X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useUser } from '~/features/auth/hooks/api/use-user';
import { useCartCount } from '~/features/cart/hooks/use-cart';
import { http } from '../utils/http';
import { clearSession } from '../utils/session-management';
import { Button } from './shadcn/ui/button';
import { Separator } from './shadcn/ui/separator';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from './shadcn/ui/sheet';

const mainLinks = [{ label: 'Home', href: '/' }];

export function Navbar() {
	const user = useUser();
	const navigate = useNavigate();
	const location = useLocation();
	const cartCount = useCartCount();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const prevCartCount = useRef(cartCount);
	const [cartBump, setCartBump] = useState(false);

	useEffect(() => {
		if (cartCount > prevCartCount.current) {
			setCartBump(true);
			const timer = setTimeout(() => setCartBump(false), 400);
			prevCartCount.current = cartCount;
			return () => clearTimeout(timer);
		}
		prevCartCount.current = cartCount;
	}, [cartCount]);

	const { mutate: logout } = useMutation({
		mutationFn: () => http.delete('auth/logout', { credentials: 'include' }),
		onSuccess: () => {
			clearSession();
			navigate('/login');
		},
	});

	return (
		<>
			<nav className="sticky top-0 left-0 z-30 w-full bg-white border-b border-zinc-100">
				<div className="mx-auto max-w-[1400px] flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2.5 shrink-0 group">
						<img
							src="/logo/shopfinity-light.svg"
							alt="Shopfinity"
							className="w-8 sm:w-9 transition-transform duration-300 group-hover:scale-105"
						/>
						<span className="text-lg font-bold tracking-tight text-zinc-900">
							Shopfinity
						</span>
					</Link>

					{/* Desktop nav links */}
					<ul className="hidden lg:flex items-center gap-1 ml-4">
						{mainLinks.map((link) => {
							const isActive =
								link.href === '/'
									? location.pathname === '/' && !location.search
									: location.pathname + location.search === link.href;
							return (
								<li key={link.href}>
									<Link
										to={link.href}
										className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
											isActive
												? 'text-zinc-900 bg-zinc-100'
												: 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
										}`}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
					</ul>

					{/* Right actions */}
					<div className="flex items-center gap-1 ml-auto">
						{/* Desktop cart */}
						<Link
							to="/cart"
							className="hidden md:flex relative items-center justify-center size-10 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
						>
							<ShoppingCart
								className={`size-[18px] transition-transform duration-300 ${
									cartBump ? 'scale-125' : ''
								}`}
							/>
							{cartCount > 0 && (
								<span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
									{cartCount > 99 ? '99+' : cartCount}
								</span>
							)}
						</Link>

						{/* Desktop auth */}
						{user.data ? (
							<div className="hidden md:flex items-center gap-2">
								<Link
									to={user.data.role === 'ADMIN' ? '/admin/orders' : '/cart'}
									className="relative size-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
									title="Orders"
								>
									<Package className="size-[18px]" />
								</Link>

								<div className="relative group">
									<button
										type="button"
										className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-zinc-100 transition-all duration-200"
									>
										<div className="size-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
											{user.data.fullname.charAt(0).toUpperCase()}
										</div>
										<span className="text-sm font-medium text-zinc-700 hidden xl:block max-w-[120px] truncate">
											{user.data.fullname}
										</span>
									</button>

									{/* Custom dropdown */}
									<div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
										<div className="px-3 py-2.5">
											<p className="text-sm font-semibold text-zinc-900 truncate">
												{user.data.fullname}
											</p>
											<p className="text-xs text-zinc-500 truncate">
												{user.data.email}
											</p>
										</div>
										<Separator className="my-1" />
										<div className="py-1">
											{user.data.role === 'ADMIN' && (
												<Link
													to="/admin"
													className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
												>
													<LayoutDashboard className="size-4" />
													Dashboard
												</Link>
											)}
											<Link
												to="/cart"
												className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
											>
												<ShoppingCart className="size-4" />
												My Cart
											</Link>
											<button
												type="button"
												onClick={() => logout()}
												className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
											>
												<LogOut className="size-4" />
												Sign Out
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="hidden md:flex items-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									className="text-sm font-medium"
									asChild
								>
									<Link to="/login">Login</Link>
								</Button>
								<Button
									size="sm"
									className="text-sm font-medium bg-zinc-900 hover:bg-zinc-800"
									asChild
								>
									<Link to="/sign-up">Sign Up</Link>
								</Button>
							</div>
						)}

						{/* Mobile cart + hamburger */}
						<div className="flex md:hidden items-center gap-1">
							<Link
								to="/cart"
								className="relative flex items-center justify-center size-10 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
							>
								<ShoppingCart
									className={`size-[18px] transition-transform duration-300 ${
										cartBump ? 'scale-125' : ''
									}`}
								/>
								{cartCount > 0 && (
									<span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
										{cartCount > 99 ? '99+' : cartCount}
									</span>
								)}
							</Link>

							<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
								<SheetTrigger asChild>
									<Button
										variant="secondary"
										size="icon"
										className="size-10 rounded-xl"
									>
										<Menu className="size-[18px]" />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="right"
									className="w-full max-w-sm p-0 bg-white border-l border-zinc-200"
								>
									<div className="flex flex-col h-full">
										{/* Sheet header */}
										<div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100">
											<div className="flex items-center gap-2.5">
												<img
													src="/logo/shopfinity-light.svg"
													alt="Shopfinity"
													className="w-8"
												/>
												<span className="font-bold text-zinc-900">
													Shopfinity
												</span>
											</div>
											<SheetClose asChild>
												<Button
													variant="secondary"
													size="icon"
													className="size-8 rounded-lg"
												>
													<X className="size-4" />
												</Button>
											</SheetClose>
										</div>

										<Separator />

										{/* Mobile nav links */}
										<div className="flex-1 overflow-y-auto px-5 py-4">
											{user.data && (
												<div className="flex items-center gap-3 p-3 mb-4 bg-zinc-50 rounded-xl">
													<div className="size-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
														{user.data.fullname.charAt(0).toUpperCase()}
													</div>
													<div className="min-w-0">
														<p className="text-sm font-semibold text-zinc-900 truncate">
															{user.data.fullname}
														</p>
														<p className="text-xs text-zinc-500 truncate">
															{user.data.email}
														</p>
													</div>
												</div>
											)}

											<div className="space-y-0.5">
												{[...mainLinks, { label: 'Cart', href: '/cart' }].map(
													(link) => (
														<SheetClose key={link.href} asChild>
															<Link
																to={link.href}
																className="flex items-center justify-between px-3 py-3 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
															>
																<span className="font-medium">
																	{link.label}
																</span>
																<ChevronRight className="size-4 text-zinc-400" />
															</Link>
														</SheetClose>
													),
												)}

												{user.data?.role === 'ADMIN' && (
													<SheetClose asChild>
														<Link
															to="/admin"
															className="flex items-center justify-between px-3 py-3 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
														>
															<span className="font-medium">
																Admin Dashboard
															</span>
															<ChevronRight className="size-4 text-zinc-400" />
														</Link>
													</SheetClose>
												)}
											</div>
										</div>

										{/* Mobile auth footer */}
										<div className="p-5 border-t border-zinc-100">
											{user.data ? (
												<Button
													variant="secondary"
													className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
													onClick={() => {
														logout();
														setMobileOpen(false);
													}}
												>
													<LogOut className="size-4 mr-2" />
													Sign Out
												</Button>
											) : (
												<div className="flex flex-col gap-2.5">
													<Button
														variant="outline"
														className="w-full rounded-xl"
														asChild
													>
														<Link
															to="/login"
															onClick={() => setMobileOpen(false)}
														>
															Login
														</Link>
													</Button>
													<Button
														className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800"
														asChild
													>
														<Link
															to="/sign-up"
															onClick={() => setMobileOpen(false)}
														>
															Create Account
														</Link>
													</Button>
												</div>
											)}
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</nav>

			{/* Dummy spacer — navbar height */}
			<div className="h-16 hidden" />
		</>
	);
}
