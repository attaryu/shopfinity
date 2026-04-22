import { useState } from 'react';
import { ImageOff, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { BrandFormDialog } from '../components/brand-form-dialog';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { useAdminStore } from '../store/admin-store';
import { MediaStorage } from '~/shared/lib/media-storage';
import type { AdminBrand } from '../types/admin-types';

export default function BrandManagement() {
	const { brands, deleteBrand, getBrandProductCount } = useAdminStore();

	const [formOpen, setFormOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<AdminBrand | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminBrand | null>(null);

	function handleEdit(brand: AdminBrand) {
		setEditingBrand(brand);
		setFormOpen(true);
	}

	function handleAdd() {
		setEditingBrand(null);
		setFormOpen(true);
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			const count = getBrandProductCount(deleteTarget.id);
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
				description={`${brands.length} total brands`}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Brand
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Table */}
				<div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-200/80">
								<TableHead className="w-20 pl-6">Logo</TableHead>
								<TableHead className="min-w-[180px]">Name</TableHead>
								<TableHead className="min-w-[180px]">Slug</TableHead>
								<TableHead className="text-center w-32">Product Count</TableHead>
								<TableHead className="text-right w-24 pr-6">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{brands.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-16"
									>
										<div className="flex flex-col items-center gap-3">
											<div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-100 text-zinc-400">
												<ImageOff className="size-7" />
											</div>
											<div>
												<p className="font-medium text-sm text-foreground">No brands yet</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													Click "Add Brand" to get started.
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								brands.map((brand) => {
									const count = getBrandProductCount(brand.id);
									return (
										<TableRow
											key={brand.id}
											className="group hover:bg-zinc-50/60 transition-colors duration-150"
										>
											<TableCell className="pl-6">
												<div className="size-10 rounded-full overflow-hidden border-2 border-zinc-100 bg-zinc-50 flex items-center justify-center shadow-sm">
													{brand.logo ? (
														<img
															src={MediaStorage.getUrl(brand.logo)}
															alt={brand.name}
															className="size-full object-cover"
															onError={(e) => {
																(e.target as HTMLImageElement).style.display = 'none';
																((e.target as HTMLImageElement).parentElement as HTMLElement).innerHTML = `<span class="text-sm font-bold text-zinc-400">${brand.name.charAt(0).toUpperCase()}</span>`;
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
				</div>

				<p className="text-sm text-muted-foreground">
					Showing {brands.length} brands
				</p>
			</div>

			{/* Dialogs */}
			<BrandFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				brand={editingBrand}
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
