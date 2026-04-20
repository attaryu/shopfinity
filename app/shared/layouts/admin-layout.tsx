import { Outlet } from 'react-router';
import {
	SidebarInset,
	SidebarProvider,
} from '../components/shadcn/ui/sidebar';
import { TooltipProvider } from '../components/shadcn/ui/tooltip';
import { AdminSidebar } from '~/features/admin/components/admin-sidebar';

export default function AdminLayout() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AdminSidebar />
				<SidebarInset className="bg-zinc-50/50 min-h-screen">
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
