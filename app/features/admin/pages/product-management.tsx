import {
	Loader2,
	Package,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '~/shared/components/shadcn/ui/badge';
import { Button } from '~/shared/components/shadcn/ui/button';
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

import { AdminPagination } from '../components/admin-pagination';
import { AdminSearch } from '../components/admin-search';
import { AdminTopbar } from '../components/admin-topbar';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { ProductFormDialog } from '../components/product-form-dialog';
import { useDeleteProduct } from '../hooks/api/use-delete-product';
import { useGetBrandsList } from '../hooks/api/use-get-brands-list';
import { useGetCategoriesList } from '../hooks/api/use-get-categories-list';
import { useGetProducts } from '../hooks/api/use-get-products';
import type { AdminProduct } from '../types/admin-types';
import { MediaStorage } from '~/shared/lib/media-storage';

export default function ProductManagement() {
	// State
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [brandFilter, setBrandFilter] = useState<string>('all');
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [formOpen, setFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
		null,
	);
	const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

	// Queries
	const {
		data: response,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetProducts({
		page,
		limit,
		search,
		categoryId: categoryFilter,
		brandId: brandFilter,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	});

	const { data: categories = [], isLoading: isLoadingCats } =
		useGetCategoriesList();
	const { data: brands = [], isLoading: isLoadingBrands } = useGetBrandsList();

	const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

	const products = response?.data?.products || [];
	const metadata = response?.meta;

	// Select all
	const allSelected =
		products.length > 0 && products.every((p) => selectedIds.has(p.id));

	function toggleAll() {
		if (allSelected) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(products.map((p) => p.id)));
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

	function handleSearch(value: string) {
		setSearch(value);
		setPage(1);
	}

	function handleConfirmDelete() {
		if (deleteTarget) {
			deleteProduct(deleteTarget.id, {
				onSuccess: () => {
					setDeleteTarget(null);
					if (products.length === 1 && page > 1) {
						setPage(page - 1);
					}
				},
			});
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

	const hasActiveFilters =
		search || categoryFilter !== 'all' || brandFilter !== 'all';

	return (
		<>
			<title>Products - Admin Shopfinity</title>

			<AdminTopbar
				title="Products"
				description={
					metadata
						? `${metadata.totalItems} total products`
						: 'Manage your products'
				}
			>
				<Button onClick={handleAdd} className="gap-2 shadow-sm">
					<Plus className="size-4" />
					Add Product
				</Button>
			</AdminTopbar>

			<div className="flex-1 p-6 space-y-5">
				{/* Filters */}
				<div className="flex items-center gap-3 flex-wrap">
					<AdminSearch
						placeholder="Search products..."
						value={search}
						onChange={handleSearch}
					/>

					<Select
						value={categoryFilter}
						onValueChange={(val) => {
							setCategoryFilter(val);
							setPage(1);
						}}
						disabled={isLoadingCats}
					>
						<SelectTrigger className="w-[180px] bg-white">
							<SelectValue
								placeholder={isLoadingCats ? 'Loading...' : 'All Categories'}
							/>
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

					<Select
						value={brandFilter}
						onValueChange={(val) => {
							setBrandFilter(val);
							setPage(1);
						}}
						disabled={isLoadingBrands}
					>
						<SelectTrigger className="w-[180px] bg-white">
							<SelectValue
								placeholder={isLoadingBrands ? 'Loading...' : 'All Brands'}
							/>
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
						<Badge
							variant="secondary"
							className="text-xs font-medium px-3 py-1.5"
						>
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
								setPage(1);
							}}
							className="text-xs text-muted-foreground hover:text-foreground"
						>
							Clear filters
						</Button>
					)}
				</div>

				{/* Table */}
				<div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm relative">
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
								<TableHead className="w-12 text-xs uppercase tracking-wider">
									No
								</TableHead>
								<TableHead className="w-16 text-xs uppercase tracking-wider">
									Image
								</TableHead>
								<TableHead className="min-w-[200px] text-xs uppercase tracking-wider">
									Name
								</TableHead>
								<TableHead className="text-xs uppercase tracking-wider">
									Category
								</TableHead>
								<TableHead className="text-xs uppercase tracking-wider">
									Brand
								</TableHead>
								<TableHead className="text-right text-xs uppercase tracking-wider">
									Price
								</TableHead>
								<TableHead className="text-center w-20 text-xs uppercase tracking-wider">
									Stock
								</TableHead>
								<TableHead className="text-xs uppercase tracking-wider">
									Created At
								</TableHead>
								<TableHead className="text-right w-24 pr-4 text-xs uppercase tracking-wider">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell colSpan={10} className="py-4">
											<div className="h-10 w-full bg-zinc-50 animate-pulse rounded-md" />
										</TableCell>
									</TableRow>
								))
							) : isError ? (
								<TableRow>
									<TableCell colSpan={10} className="text-center py-16">
										<div className="flex flex-col items-center gap-3">
											<p className="text-sm text-red-500">
												{error?.message || 'Failed to load products'}
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
							) : products.length === 0 ? (
								<TableRow>
									<TableCell colSpan={10} className="text-center py-16">
										<div className="flex flex-col items-center gap-3">
											<div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-100 text-zinc-400">
												{search ? (
													<Search className="size-7" />
												) : (
													<Package className="size-7" />
												)}
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
								products.map((product, index) => {
									const displayIndex = (page - 1) * limit + index + 1;
									return (
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
											<TableCell className="text-sm text-muted-foreground font-mono tabular-nums">
												{displayIndex}
											</TableCell>
											<TableCell>
												<div className="size-10 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
													<img
														src={MediaStorage.getUrl(product.imageUrl)}
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
												<Badge
													variant="secondary"
													className="text-xs font-normal whitespace-nowrap"
												>
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
													variant={
														product.stock < 5 ? 'destructive' : 'secondary'
													}
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
														disabled={isDeleting}
													>
														{isDeleting && deleteTarget?.id === product.id ? (
															<Loader2 className="size-3.5 animate-spin" />
														) : (
															<Trash2 className="size-3.5" />
														)}
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>

					{!isLoading && !isError && products.length > 0 && metadata && (
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
			<ProductFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				product={editingProduct}
				onSuccess={() => refetch()}
			/>

			<DeleteConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
				title="Delete Product"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
			/>
		</>
	);
}
