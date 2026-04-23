import type { LucideIcon } from 'lucide-react';
import { cn } from '~/shared/lib/utils';

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: LucideIcon;
	iconClassName?: string;
	className?: string;
}

export function StatCard({
	title,
	value,
	subtitle,
	icon: Icon,
	iconClassName,
	className,
}: StatCardProps) {
	return (
		<div
			className={cn(
				'group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-0.5 hover:border-zinc-300/80',
				className,
			)}
		>
			{/* Subtle gradient accent */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-100/80 to-transparent rounded-bl-[100%] opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

			<div className="relative flex items-start justify-between">
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-muted-foreground tracking-wide">{title}</span>
					<span className="text-3xl font-bold tracking-tight tabular-nums">{value}</span>
					{subtitle && (
						<span className="text-xs text-muted-foreground mt-0.5">{subtitle}</span>
					)}
				</div>
				<div className={cn(
					'flex items-center justify-center size-11 rounded-xl bg-zinc-900 text-white shadow-md shadow-zinc-900/20 group-hover:scale-105 transition-transform duration-300',
					iconClassName,
				)}>
					<Icon className="size-5" />
				</div>
			</div>
		</div>
	);
}
