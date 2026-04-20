import { SidebarTrigger } from '~/shared/components/shadcn/ui/sidebar';
import { Separator } from '~/shared/components/shadcn/ui/separator';

interface AdminTopbarProps {
	title: string;
	description?: string;
	children?: React.ReactNode;
}

export function AdminTopbar({ title, description, children }: AdminTopbarProps) {
	return (
		<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-6 gap-4">
			<SidebarTrigger className="-ml-1 hover:bg-zinc-100 transition-colors" />
			<Separator orientation="vertical" className="h-5" />

			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col">
					<h1 className="text-lg font-bold tracking-tight leading-tight">{title}</h1>
					{description && (
						<p className="text-xs text-muted-foreground leading-tight">{description}</p>
					)}
				</div>
				{children && <div className="flex items-center gap-3">{children}</div>}
			</div>
		</header>
	);
}
