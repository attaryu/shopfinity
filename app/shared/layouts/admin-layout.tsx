import { Outlet, redirect, useLoaderData } from 'react-router';

import { AdminSidebar } from '~/features/admin/components/admin-sidebar';
import { userQueryOption } from '~/features/auth/hooks/api/use-user';

import {
	SidebarInset,
	SidebarProvider,
} from '../components/shadcn/ui/sidebar';
import { TooltipProvider } from '../components/shadcn/ui/tooltip';
import { queryClient } from '../utils/query-client';

export async function clientLoader() {
	try {
		const user = await queryClient.ensureQueryData(userQueryOption);

		if (!user) {
			return redirect('/login');
		}

		if (user.role !== 'ADMIN') {
			return redirect('/');
		}

		return { user };
	} catch {
		return redirect('/login');
	}
}

export default function AdminLayout() {
	const { user } = useLoaderData<typeof clientLoader>();

	return (
		<TooltipProvider>
			<SidebarProvider>
				<AdminSidebar user={user} />
				<SidebarInset className="bg-zinc-50/50 min-h-screen">
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
