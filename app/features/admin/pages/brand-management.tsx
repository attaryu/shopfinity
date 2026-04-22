import {
	ImageOff,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '~/shared/components/shadcn/ui/badge';
import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';

import { MediaStorage } from '~/shared/lib/media-storage';
import { AdminPagination } from '../components/admin-pagination';
import { AdminSearch } from '../components/admin-search';
import { AdminTopbar } from '../components/admin-topbar';
import { BrandFormDialog } from '../components/brand-form-dialog';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { useGetBrands } from '../hooks/api/use-get-brands';
import { useAdminStore } from '../store/admin-store';
import type { AdminBrand } from '../types/admin-types';

export default function BrandManagement() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState('');

	const { deleteBrand, getBrandProductCount } = useAdminStore();

	const [formOpen, setFormOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<AdminBrand | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminBrand | null>(null);

	const {
		data: response,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetBrands({
		page,
		limit,
		search,
	});

	const brands = response?.data?.brands || [];
	const metadata = response?.meta;

	function handleEdit(brand: AdminBrand) {
		setEditingBrand(brand);
		setFormOpen(true);
	}

	function handleAdd() {
		setEditingBrand(null);
		setFormOpen(true);
	}

	function handleSearch(value: string) {
		setSearch(value);
		setPage(1); // Reset to first page on search
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			// Prefer API productCount, fallback to store if needed
			const count =
				deleteTarget.productCount ?? getBrandProductCount(deleteTarget.id);
			if (count > 0) {
				toast.error(
					`Cannot delete "${deleteTarget.name}" — ${count} product(s) are using this brand.`,
				);
				setDeleteTarget(null);
				return;
			}
			deleteBrand(deleteTarget.id);
			toast.success(`"${deleteTarget.name}" has been deleted.`);
			setDeleteTarget(null);
		}
	}

	return (
		<>
			<title>Brands - Admin Shopfinity</title>

			<AdminTopbar
				title="Brands"
				description={
					metadata
						? `${metadata.totalItems} total brands`
						: 'Manage your product brands'
				}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Brand
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Filters */}
				<div className="flex items-center gap-3 flex-wrap">
					<AdminSearch
						value={search}
						onChange={handleSearch}
						placeholder="Search brands..."
					/>

					{search && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleSearch('')}
							className="text-xs text-muted-foreground hover:text-foreground"
						>
							Clear filters
						</Button>
					)}
				</div>

				{/* Table */}
				<div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-200/80">
								<TableHead className="w-20 pl-6">Logo</TableHead>
								<TableHead className="min-w-[180px]">Name</TableHead>
								<TableHead className="min-w-[180px]">Slug</TableHead>
								<TableHead className="text-center w-32">
									Product Count
								</TableHead>
								<TableHead className="text-right w-24 pr-6">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell colSpan={5} className="py-4">
											<div className="h-8 w-full bg-zinc-100 animate-pulse rounded-md" />
										</TableCell>
									</TableRow>
								))
							) : isError ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-16">
										<div className="flex flex-col items-center gap-3">
											<p className="text-sm text-red-500">
												{error?.message || 'Failed to load brands'}
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => refetch()}
												className="gap-2"
											>
												<RefreshCw className="size-4" />
												Retry
											</Button>
										</div>
									</TableCell>
								</TableRow>
							) : brands.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-16">
										<div className="flex flex-col items-center gap-3">
											<div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-100 text-zinc-400">
												{search ? (
													<Search className="size-7" />
												) : (
													<ImageOff className="size-7" />
												)}
											</div>
											<div>
												<p className="font-medium text-sm text-foreground">
													{search
														? 'No brands match your search'
														: 'No brands yet'}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{search
														? 'Try adjusting your search'
														: 'Click "Add Brand" to get started.'}
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								brands.map((brand, index) => {
									const displayIndex = (page - 1) * limit + index + 1;
									const count =
										brand.productCount ?? getBrandProductCount(brand.id);
									return (
										<TableRow
											key={brand.id}
											className="group hover:bg-zinc-50/60 transition-colors duration-150"
										>
											<TableCell className="pl-6">
												<div className="size-10 rounded-full overflow-hidden border-2 border-zinc-100 bg-zinc-50 flex items-center justify-center shadow-sm">
													{brand.logoUrl ? (
														<img
															src={MediaStorage.getUrl(brand.logoUrl)}
															alt={brand.name}
															className="size-full object-cover"
															onError={(e) => {
																(e.target as HTMLImageElement).style.display =
																	'none';
																(
																	(e.target as HTMLImageElement)
																		.parentElement as HTMLElement
																).innerHTML =
																	`<span class="text-sm font-bold text-zinc-400">${brand.name.charAt(0).toUpperCase()}</span>`;
															}}
														/>
													) : (
														<span className="text-sm font-bold text-zinc-400">
															{brand.name.charAt(0).toUpperCase()}
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="font-medium text-sm">
												{brand.name}
											</TableCell>
											<TableCell className="text-sm text-muted-foreground font-mono">
												{brand.slug}
											</TableCell>
											<TableCell className="text-center">
												<Badge
													variant={count > 0 ? 'secondary' : 'outline'}
													className="text-xs font-mono tabular-nums min-w-[2rem] justify-center"
												>
													{count}
												</Badge>
											</TableCell>
											<TableCell className="text-right pr-6">
												<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => handleEdit(brand)}
														className="hover:bg-zinc-100"
													>
														<Pencil className="size-3.5" />
													</Button>
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => setDeleteTarget(brand)}
														className="hover:bg-red-50 hover:text-red-600"
													>
														<Trash2 className="size-3.5" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>

					{!isLoading && !isError && brands.length > 0 && metadata && (
						<AdminPagination
							currentPage={page}
							totalPages={metadata.totalPages || 1}
							totalItems={metadata.totalItems || 0}
							itemsPerPage={limit}
							onPageChange={setPage}
							onLimitChange={(newLimit) => {
								setLimit(newLimit);
								setPage(1);
							}}
						/>
					)}
				</div>
			</div>

			{/* Dialogs */}
			<BrandFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				brand={editingBrand}
				onSuccess={() => refetch()}
			/>

			<DeleteConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
				title="Delete Brand"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
			/>
		</>
	);
}
