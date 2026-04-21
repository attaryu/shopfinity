import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/shared/components/shadcn/ui/select';

interface AdminPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	limitOptions?: number[];
}

export function AdminPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onLimitChange,
	limitOptions = [10, 20, 50, 100],
}: AdminPaginationProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-zinc-100">
			<div className="flex items-center gap-4 order-2 sm:order-1">
				<div className="flex items-center gap-2">
					<p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
						Rows per page
					</p>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={(value) => onLimitChange(Number(value))}
					>
						<SelectTrigger size="sm" className="w-[70px] h-8 text-xs">
							<SelectValue placeholder={itemsPerPage.toString()} />
						</SelectTrigger>
						<SelectContent>
							{limitOptions.map((option) => (
								<SelectItem key={option} value={option.toString()} className="text-xs">
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="text-xs text-muted-foreground">
					Total <span className="font-semibold text-foreground">{totalItems}</span> items
				</p>
			</div>

			<div className="flex items-center gap-2 order-1 sm:order-2">
				<div className="flex items-center text-xs font-medium mr-2">
					Page {currentPage} of {totalPages || 1}
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="size-8 rounded-lg border-zinc-200"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage <= 1}
					>
						<ChevronLeft className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8 rounded-lg border-zinc-200"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages}
					>
						<ChevronRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
