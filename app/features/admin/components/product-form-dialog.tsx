import { useEffect, useState, useRef } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/shared/components/shadcn/ui/dialog';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Textarea } from '~/shared/components/shadcn/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/shared/components/shadcn/ui/select';
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { slugify } from '../utils/slugify';
import type { AdminProduct, ProductFormData } from '../types/admin-types';
import { useGetCategoriesList } from '../hooks/api/use-get-categories-list';
import { useGetBrandsList } from '../hooks/api/use-get-brands-list';
import { useCreateProduct } from '../hooks/api/use-create-product';
import { useUpdateProduct } from '../hooks/api/use-update-product';
import { MediaStorage } from '~/shared/lib/media-storage';

interface ProductFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: AdminProduct | null;
	onSuccess?: () => void;
}

const emptyForm: ProductFormData = {
	name: '',
	slug: '',
	description: '',
	price: 0,
	stock: 0,
	imageUrl: '',
	categoryId: '',
	brandId: '',
};

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function ProductFormDialog({
	open,
	onOpenChange,
	product,
	onSuccess,
}: ProductFormDialogProps) {
	const [form, setForm] = useState<ProductFormData>(emptyForm);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { data: categories = [], isLoading: isLoadingCats } = useGetCategoriesList();
	const { data: brands = [], isLoading: isLoadingBrands } = useGetBrandsList();

	const createMutation = useCreateProduct();
	const updateMutation = useUpdateProduct(product?.id || '');

	const isEditing = !!product;
	const isPending = createMutation.isPending || updateMutation.isPending;

	useEffect(() => {
		if (product) {
			setForm({
				name: product.name,
				slug: product.slug,
				description: product.description,
				price: product.price,
				stock: product.stock,
				imageUrl: product.imageUrl,
				categoryId: product.categoryId,
				brandId: product.brandId,
			});
			setPreviewUrl(MediaStorage.getUrl(product.imageUrl));
		} else {
			setForm(emptyForm);
			setPreviewUrl(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	}, [product, open]);

	useEffect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	function handleNameChange(name: string) {
		setForm((prev) => ({
			...prev,
			name,
			slug: slugify(name),
		}));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			toast.error('Invalid file type. Please upload PNG, JPEG, or WebP.');
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}

		setForm((prev) => ({ ...prev, imageFile: file }));
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);
	}

	function removeFile() {
		setForm((prev) => {
			const { imageFile, ...rest } = prev;
			return { ...rest, imageUrl: isEditing ? product?.imageUrl || '' : '' };
		});
		setPreviewUrl(isEditing ? MediaStorage.getUrl(product?.imageUrl || '') : null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		try {
			if (isEditing && product) {
				await updateMutation.mutateAsync(form);
			} else {
				await createMutation.mutateAsync(form);
			}
			onSuccess?.();
			onOpenChange(false);
		} catch (error) {
			// Error is handled by mutation's onError
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Product' : 'Add New Product'}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Update the product information below.'
							: 'Fill in the details to create a new product.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<FieldSet className="py-4">
						<Field>
							<FieldLabel htmlFor="product-name">Product Name</FieldLabel>
							<Input
								id="product-name"
								value={form.name}
								onChange={(e) => handleNameChange(e.target.value)}
								placeholder="Enter product name"
								disabled={isPending}
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="product-slug">Slug</FieldLabel>
							<Input
								id="product-slug"
								value={form.slug}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, slug: e.target.value }))
								}
								placeholder="auto-generated-slug"
								className="text-muted-foreground font-mono text-sm"
								disabled={isPending}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="product-description">Description</FieldLabel>
							<Textarea
								id="product-description"
								value={form.description}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, description: e.target.value }))
								}
								placeholder="Describe the product..."
								rows={3}
								disabled={isPending}
								required
							/>
						</Field>

						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor="product-price">Price (IDR)</FieldLabel>
								<Input
									id="product-price"
									type="number"
									min={0}
									value={form.price}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											price: Number(e.target.value),
										}))
									}
									placeholder="0"
									className="tabular-nums"
									disabled={isPending}
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="product-stock">Stock</FieldLabel>
								<Input
									id="product-stock"
									type="number"
									min={0}
									value={form.stock}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											stock: Number(e.target.value),
										}))
									}
									placeholder="0"
									className="tabular-nums"
									disabled={isPending}
									required
								/>
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel>Category</FieldLabel>
								<Select
									value={form.categoryId}
									onValueChange={(value) =>
										setForm((prev) => ({ ...prev, categoryId: value }))
									}
									disabled={isPending || isLoadingCats}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={isLoadingCats ? "Loading..." : "Select category"} />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>

							<Field>
								<FieldLabel>Brand</FieldLabel>
								<Select
									value={form.brandId}
									onValueChange={(value) =>
										setForm((prev) => ({ ...prev, brandId: value }))
									}
									disabled={isPending || isLoadingBrands}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={isLoadingBrands ? "Loading..." : "Select brand"} />
									</SelectTrigger>
									<SelectContent>
										{brands.map((brand) => (
											<SelectItem key={brand.id} value={brand.id}>
												{brand.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						</div>

						<Field>
							<FieldLabel>Product Image</FieldLabel>
							<div className="space-y-3">
								<div
									className={`
										relative flex flex-col items-center justify-center gap-3 py-8 px-4 
										border-2 border-dashed rounded-xl transition-all duration-200
										${previewUrl ? 'border-zinc-200 bg-zinc-50/50' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80'}
									`}
								>
									{previewUrl ? (
										<div className="relative group">
											<div className="size-32 rounded-lg overflow-hidden border border-zinc-200 bg-white ring-4 ring-white shadow-sm">
												<img
													src={previewUrl}
													alt="Preview"
													className="size-full object-cover"
												/>
											</div>
											<button
												type="button"
												onClick={removeFile}
												disabled={isPending}
												className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
											>
												<X className="size-3.5" />
											</button>
										</div>
									) : (
										<>
											<div className="flex items-center justify-center size-12 rounded-2xl bg-zinc-100 text-zinc-400">
												<ImageIcon className="size-6" />
											</div>
											<div className="text-center">
												<p className="text-sm font-medium text-foreground">Click to upload image</p>
												<p className="text-xs text-muted-foreground mt-0.5">PNG, JPG or WEBP up to 2MB</p>
											</div>
										</>
									)}
									<input
										type="file"
										ref={fileInputRef}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
										onChange={handleFileChange}
										accept="image/*"
										disabled={isPending}
									/>
								</div>
							</div>
						</Field>
					</FieldSet>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" className="shadow-sm min-w-[120px]" disabled={isPending}>
							{isPending && (
								<Loader2 className="mr-2 size-4 animate-spin" />
							)}
							{isEditing ? (isPending ? 'Updating...' : 'Update Product') : (isPending ? 'Adding...' : 'Add Product')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
