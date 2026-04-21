import { useState } from 'react';
import { FolderOpen, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/components/shadcn/ui/button';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';

import { AdminTopbar } from '../components/admin-topbar';
import { CategoryFormDialog } from '../components/category-form-dialog';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { AdminSearch } from '../components/admin-search';
import { AdminPagination } from '../components/admin-pagination';
import { useGetCategories } from '../hooks/api/use-get-categories';
import { useDeleteCategory } from '../hooks/api/use-delete-category';
import type { AdminCategory } from '../types/admin-types';

export default function CategoryManagement() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState('');

	const [formOpen, setFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] =
		useState<AdminCategory | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

	const { data: response, isLoading, isError, error, refetch } = useGetCategories({
		page,
		limit,
		search,
	});

	const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

	const categories = response?.data?.categories || [];
	const metadata = response?.meta;

	function handleEdit(category: AdminCategory) {
		setEditingCategory(category);
		setFormOpen(true);
	}

	function handleAdd() {
		setEditingCategory(null);
		setFormOpen(true);
	}

	function handleSearch(value: string) {
		setSearch(value);
		setPage(1); // Reset to first page on search
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			const count = deleteTarget.productCount || 0;
			if (count > 0) {
				toast.error(
					`Cannot delete "${deleteTarget.name}" — ${count} product(s) are using this category.`,
				);
				setDeleteTarget(null);
				return;
			}
			
			deleteCategory(deleteTarget.id, {
				onSuccess: () => {
					setDeleteTarget(null);
					// If we are on a page where there were items before delete but none after, go back 1 page if possible
					if (categories.length === 1 && page > 1) {
						setPage(page - 1);
					}
				},
			});
		}
	}

	return (
		<>
			<title>Categories - Admin Shopfinity</title>

			<AdminTopbar
				title="Categories"
				description={metadata ? `${metadata.totalItems} total categories` : 'Manage your product categories'}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Category
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Filters */}
				<div className="flex items-center gap-3 flex-wrap">
					<AdminSearch 
						value={search} 
						onChange={handleSearch} 
						placeholder="Search categories..." 
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
								<TableHead className="w-20 pl-6 text-xs uppercase tracking-wider">No</TableHead>
								<TableHead className="min-w-[180px] text-xs uppercase tracking-wider">Name</TableHead>
								<TableHead className="min-w-[180px] text-xs uppercase tracking-wider">Slug</TableHead>
								<TableHead className="text-center w-32 text-xs uppercase tracking-wider">Product Count</TableHead>
								<TableHead className="text-right w-24 pr-6 text-xs uppercase tracking-wider">Actions</TableHead>
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
											<p className="text-sm text-red-500">{error?.message || 'Failed to load categories'}</p>
											<Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
												<RefreshCw className="size-4" />
												Retry
											</Button>
										</div>
									</TableCell>
								</TableRow>
							) : categories.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-16"
									>
										<div className="flex flex-col items-center gap-3">
											<div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-100 text-zinc-400">
												<FolderOpen className="size-7" />
											</div>
											<div>
												<p className="font-medium text-sm text-foreground">No categories found</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{search ? 'Try adjusting your search' : 'Click "Add Category" to get started.'}
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								categories.map((category, index) => {
									const displayIndex = (page - 1) * limit + index + 1;
									return (
										<TableRow
											key={category.id}
											className="group hover:bg-zinc-50/60 transition-colors duration-150"
										>
											<TableCell className="text-sm text-muted-foreground font-mono tabular-nums pl-6">
												{displayIndex}
											</TableCell>
											<TableCell className="font-medium text-sm">
												{category.name}
											</TableCell>
											<TableCell className="text-sm text-muted-foreground font-mono">
												{category.slug}
											</TableCell>
											<TableCell className="text-center">
												<Badge
													variant={(category.productCount || 0) > 0 ? 'secondary' : 'outline'}
													className="text-xs font-mono tabular-nums min-w-[2rem] justify-center"
												>
													{category.productCount || 0}
												</Badge>
											</TableCell>
											<TableCell className="text-right pr-6">
												<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => handleEdit(category)}
														className="hover:bg-zinc-100"
													>
														<Pencil className="size-3.5" />
													</Button>
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => setDeleteTarget(category)}
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

					{!isLoading && !isError && categories.length > 0 && metadata && (
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
			<CategoryFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				category={editingCategory}
				onSuccess={() => refetch()}
			/>

			<DeleteConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
				title="Delete Category"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
			/>
		</>
	);
}

