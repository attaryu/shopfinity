import { useEffect, useState } from 'react';
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
import { useAdminStore, slugify } from '../store/admin-store';
import type { AdminProduct, ProductFormData } from '../types/admin-types';

interface ProductFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: AdminProduct | null;
}

const emptyForm: ProductFormData = {
	name: '',
	slug: '',
	description: '',
	price: 0,
	stock: 0,
	image: '',
	categoryId: '',
	brandId: '',
};

export function ProductFormDialog({
	open,
	onOpenChange,
	product,
}: ProductFormDialogProps) {
	const { categories, brands, addProduct, updateProduct } = useAdminStore();
	const [form, setForm] = useState<ProductFormData>(emptyForm);
	const isEditing = !!product;

	useEffect(() => {
		if (product) {
			setForm({
				name: product.name,
				slug: product.slug,
				description: product.description,
				price: product.price,
				stock: product.stock,
				image: product.image,
				categoryId: product.categoryId,
				brandId: product.brandId,
			});
		} else {
			setForm(emptyForm);
		}
	}, [product, open]);

	function handleNameChange(name: string) {
		setForm((prev) => ({
			...prev,
			name,
			slug: slugify(name),
		}));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isEditing && product) {
			updateProduct(product.id, form);
		} else {
			addProduct(form);
		}
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-lg">
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
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select category" />
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
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select brand" />
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
							<FieldLabel htmlFor="product-image">Image URL</FieldLabel>
							<Input
								id="product-image"
								value={form.image}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, image: e.target.value }))
								}
								placeholder="https://example.com/image.jpg"
							/>
							{form.image && (
								<div className="mt-2 flex items-center gap-3">
									<img
										src={form.image}
										alt="Product preview"
										className="size-16 rounded-lg object-cover border border-zinc-200"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = 'none';
										}}
									/>
									<span className="text-xs text-muted-foreground">Image preview</span>
								</div>
							)}
						</Field>
					</FieldSet>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" className="shadow-sm">
							{isEditing ? 'Update Product' : 'Add Product'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
