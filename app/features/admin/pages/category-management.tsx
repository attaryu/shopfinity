import { useState } from 'react';
import { FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { useAdminStore } from '../store/admin-store';
import type { AdminCategory } from '../types/admin-types';

export default function CategoryManagement() {
	const { categories, deleteCategory, getCategoryProductCount } =
		useAdminStore();

	const [formOpen, setFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] =
		useState<AdminCategory | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

	function handleEdit(category: AdminCategory) {
		setEditingCategory(category);
		setFormOpen(true);
	}

	function handleAdd() {
		setEditingCategory(null);
		setFormOpen(true);
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			const count = getCategoryProductCount(deleteTarget.id);
			if (count > 0) {
				toast.error(
					`Cannot delete "${deleteTarget.name}" — ${count} product(s) are using this category.`,
				);
				setDeleteTarget(null);
				return;
			}
			deleteCategory(deleteTarget.id);
			toast.success(`"${deleteTarget.name}" has been deleted.`);
			setDeleteTarget(null);
		}
	}

	return (
		<>
			<title>Categories - Admin Shopfinity</title>

			<AdminTopbar
				title="Categories"
				description={`${categories.length} total categories`}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Category
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Table */}
				<div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-200/80">
								<TableHead className="w-20 pl-6">ID</TableHead>
								<TableHead className="min-w-[180px]">Name</TableHead>
								<TableHead className="min-w-[180px]">Slug</TableHead>
								<TableHead className="text-center w-32">Product Count</TableHead>
								<TableHead className="text-right w-24 pr-6">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categories.length === 0 ? (
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
												<p className="font-medium text-sm text-foreground">No categories yet</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													Click "Add Category" to get started.
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								categories.map((category, index) => {
									const count = getCategoryProductCount(category.id);
									return (
										<TableRow
											key={category.id}
											className="group hover:bg-zinc-50/60 transition-colors duration-150"
										>
											<TableCell className="text-sm text-muted-foreground font-mono tabular-nums pl-6">
												{index + 1}
											</TableCell>
											<TableCell className="font-medium text-sm">
												{category.name}
											</TableCell>
											<TableCell className="text-sm text-muted-foreground font-mono">
												{category.slug}
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
				</div>

				<p className="text-sm text-muted-foreground">
					Showing {categories.length} categories
				</p>
			</div>

			{/* Dialogs */}
			<CategoryFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				category={editingCategory}
			/>

			<DeleteConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
				title="Delete Category"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
			/>
		</>
	);
}
