import { useState, useMemo } from 'react';
import { PackageOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Badge } from '~/shared/components/shadcn/ui/badge';
import { Checkbox } from '~/shared/components/shadcn/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/shared/components/shadcn/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/shared/components/shadcn/ui/table';

import { AdminTopbar } from '../components/admin-topbar';
import { ProductFormDialog } from '../components/product-form-dialog';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { useAdminStore } from '../store/admin-store';
import type { AdminProduct } from '../types/admin-types';

export default function ProductManagement() {
	const {
		getProductsWithRelations,
		categories,
		brands,
		deleteProduct,
	} = useAdminStore();

	const products = getProductsWithRelations();

	// State
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [brandFilter, setBrandFilter] = useState<string>('all');
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [formOpen, setFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

	// Filtered products
	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const matchesSearch = product.name
				.toLowerCase()
				.includes(search.toLowerCase());
			const matchesCategory =
				categoryFilter === 'all' || product.categoryId === categoryFilter;
			const matchesBrand =
				brandFilter === 'all' || product.brandId === brandFilter;
			return matchesSearch && matchesCategory && matchesBrand;
		});
	}, [products, search, categoryFilter, brandFilter]);

	// Select all
	const allSelected =
		filteredProducts.length > 0 &&
		filteredProducts.every((p) => selectedIds.has(p.id));

	function toggleAll() {
		if (allSelected) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
		}
	}

	function toggleOne(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		setSelectedIds(next);
	}

	function handleEdit(product: AdminProduct) {
		setEditingProduct(product);
		setFormOpen(true);
	}

	function handleAdd() {
		setEditingProduct(null);
		setFormOpen(true);
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			deleteProduct(deleteTarget.id);
			toast.success(`"${deleteTarget.name}" has been deleted.`);
			setDeleteTarget(null);
		}
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(amount);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	}

	const hasActiveFilters = search || categoryFilter !== 'all' || brandFilter !== 'all';

	return (
		<>
			<title>Products - Admin Shopfinity</title>

			<AdminTopbar
				title="Products"
				description={`${products.length} total products`}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Product
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Filters */}
				<div className="flex items-center gap-3 flex-wrap">
					<div className="relative flex-1 min-w-[250px] max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
						<Input
							placeholder="Search products..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 bg-white"
						/>
					</div>

					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="w-[180px] bg-white">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={brandFilter} onValueChange={setBrandFilter}>
						<SelectTrigger className="w-[180px] bg-white">
							<SelectValue placeholder="All Brands" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Brands</SelectItem>
							{brands.map((brand) => (
								<SelectItem key={brand.id} value={brand.id}>
									{brand.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{selectedIds.size > 0 && (
						<Badge variant="secondary" className="text-xs font-medium px-3 py-1.5">
							{selectedIds.size} selected
						</Badge>
					)}

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearch('');
								setCategoryFilter('all');
								setBrandFilter('all');
							}}
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
								<TableHead className="w-12 pl-4">
									<Checkbox
										checked={allSelected}
										onCheckedChange={toggleAll}
										aria-label="Select all"
									/>
								</TableHead>
								<TableHead className="w-16">Image</TableHead>
								<TableHead className="min-w-[200px]">Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Brand</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-center w-20">Stock</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead className="text-right w-24 pr-4">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProducts.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={9}
										className="text-center py-16"
									>
										<div className="flex flex-col items-center gap-3">
											<div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-100 text-zinc-400">
												<PackageOpen className="size-7" />
											</div>
											<div>
												<p className="font-medium text-sm text-foreground">
													{hasActiveFilters
														? 'No products match your filters'
														: 'No products yet'}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{hasActiveFilters
														? 'Try adjusting your search or filter criteria.'
														: 'Click "Add Product" to get started.'}
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredProducts.map((product) => (
									<TableRow
										key={product.id}
										className="group hover:bg-zinc-50/60 transition-colors duration-150"
									>
										<TableCell className="pl-4">
											<Checkbox
												checked={selectedIds.has(product.id)}
												onCheckedChange={() => toggleOne(product.id)}
												aria-label={`Select ${product.name}`}
											/>
										</TableCell>
										<TableCell>
											<div className="size-10 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
												<img
													src={product.image}
													alt={product.name}
													className="size-full object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).src =
															'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%23f4f4f5"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="%23a1a1aa">?</text></svg>';
													}}
												/>
											</div>
										</TableCell>
										<TableCell>
											<div className="min-w-0">
												<p className="font-medium text-sm leading-tight line-clamp-1">
													{product.name}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
													{product.slug}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="text-xs font-normal whitespace-nowrap">
												{product.category?.name ?? '—'}
											</Badge>
										</TableCell>
										<TableCell>
											<span className="text-sm whitespace-nowrap">
												{product.brand?.name ?? '—'}
											</span>
										</TableCell>
										<TableCell className="text-right font-medium text-sm tabular-nums whitespace-nowrap">
											{formatCurrency(product.price)}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant={product.stock < 5 ? 'destructive' : 'secondary'}
												className="text-xs font-mono tabular-nums min-w-[2rem] justify-center"
											>
												{product.stock}
											</Badge>
										</TableCell>
										<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
											{formatDate(product.createdAt)}
										</TableCell>
										<TableCell className="text-right pr-4">
											<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
												<Button
													variant="ghost"
													size="icon-sm"
													onClick={() => handleEdit(product)}
													className="hover:bg-zinc-100"
												>
													<Pencil className="size-3.5" />
												</Button>
												<Button
													variant="ghost"
													size="icon-sm"
													onClick={() => setDeleteTarget(product)}
													className="hover:bg-red-50 hover:text-red-600"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Count */}
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {filteredProducts.length} of {products.length} products
					</p>
				</div>
			</div>

			{/* Dialogs */}
			<ProductFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				product={editingProduct}
			/>

			<DeleteConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
				title="Delete Product"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
			/>
		</>
	);
}
