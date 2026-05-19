import { useMutation } from '@tanstack/react-query';
import {
	Banknote,
	CheckCircle,
	ChevronUp,
	Home,
	Layers,
	LogOut,
	Package,
	ShoppingBag,
	Store,
	Tags,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar,
} from '~/shared/components/shadcn/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/shared/components/shadcn/ui/dropdown-menu';
import type { User } from '~/shared/types/user';
import { http } from '~/shared/utils/http';
import { clearSession } from '~/shared/utils/session-management';

const managementItems = [
	{ title: 'Dashboard', icon: Home, href: '/admin' },
	{ title: 'Products', icon: Package, href: '/admin/products' },
	{ title: 'Categories', icon: Tags, href: '/admin/categories' },
	{ title: 'Brands', icon: Layers, href: '/admin/brands' },
];

const orderItems = [
	{ title: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
	{ title: 'Payment Verification', icon: CheckCircle, href: '/admin/payments' },
	{ title: 'Cash Flow', icon: Banknote, href: '/admin/cash-flow' },
];

interface AdminSidebarProps {
	user: User;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';

	const { mutate: logout } = useMutation({
		mutationFn: () => http.delete('auth/logout'),
		onSuccess: () => {
			clearSession();
			navigate('/login');
		},
	});

	return (
		<Sidebar
			collapsible="icon"
			className="border-r border-zinc-200"
		>
			{/* Header - Logo */}
			<SidebarHeader className={isCollapsed ? 'p-2' : 'p-4'}>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							tooltip="Shopfinity Admin"
							className="hover:bg-transparent active:bg-transparent"
						>
							<Link to="/admin" className="flex items-center gap-3">
								<div className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-zinc-900 text-white transition-all duration-200">
									<ShoppingBag className="size-4" />
								</div>
								<div className="flex flex-col leading-tight overflow-hidden">
									<span className="text-sm font-bold tracking-tight truncate">Shopfinity</span>
									<span className="text-xs text-muted-foreground truncate">Admin Panel</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator />

			{/* Navigation */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
						Management
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{managementItems.map((item) => {
								const isActive =
									item.href === '/admin'
										? location.pathname === '/admin'
										: location.pathname.startsWith(item.href);

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
											className="transition-all duration-200"
										>
											<Link to={item.href}>
												<item.icon className="size-4 shrink-0" />
												<span className="truncate">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
						Orders & Finance
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{orderItems.map((item) => {
								const isActive = location.pathname.startsWith(item.href);

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
											className="transition-all duration-200"
										>
											<Link to={item.href}>
												<item.icon className="size-4 shrink-0" />
												<span className="truncate">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip="Back to Store">
									<Link to="/" className="text-muted-foreground hover:text-foreground">
										<Store className="size-4 shrink-0" />
										<span className="truncate">Back to Store</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer - User */}
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									tooltip={user.fullname}
									className="data-[state=open]:bg-sidebar-accent"
								>
									<div className="flex items-center justify-center size-8 shrink-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white text-xs font-bold shadow-sm uppercase">
										{user.fullname.charAt(0)}
									</div>
									<div className="flex flex-col leading-tight text-left overflow-hidden">
										<span className="text-sm font-medium truncate">
											{user.fullname}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											{user.email}
										</span>
									</div>
									<ChevronUp className="ml-auto size-4 shrink-0" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem
									className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
									onClick={() => logout()}
								>
									<LogOut className="size-4 mr-2" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
