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
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { useAdminStore, slugify } from '../store/admin-store';
import type { AdminBrand, BrandFormData } from '../types/admin-types';

interface BrandFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: AdminBrand | null;
}

const emptyForm: BrandFormData = {
	name: '',
	slug: '',
	logo: '',
};

export function BrandFormDialog({
	open,
	onOpenChange,
	brand,
}: BrandFormDialogProps) {
	const { addBrand, updateBrand } = useAdminStore();
	const [form, setForm] = useState<BrandFormData>(emptyForm);
	const isEditing = !!brand;

	useEffect(() => {
		if (brand) {
			setForm({ name: brand.name, slug: brand.slug, logo: brand.logo });
		} else {
			setForm(emptyForm);
		}
	}, [brand, open]);

	function handleNameChange(name: string) {
		setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isEditing && brand) {
			updateBrand(brand.id, form);
		} else {
			addBrand(form);
		}
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Brand' : 'Add New Brand'}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Update the brand information below.'
							: 'Fill in the details to create a new brand.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<FieldSet className="py-4">
						<Field>
							<FieldLabel htmlFor="brand-name">Brand Name</FieldLabel>
							<Input
								id="brand-name"
								value={form.name}
								onChange={(e) => handleNameChange(e.target.value)}
								placeholder="Enter brand name"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="brand-slug">Slug</FieldLabel>
							<Input
								id="brand-slug"
								value={form.slug}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, slug: e.target.value }))
								}
								placeholder="auto-generated-slug"
								className="text-muted-foreground"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="brand-logo">Logo URL</FieldLabel>
							<Input
								id="brand-logo"
								value={form.logo}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, logo: e.target.value }))
								}
								placeholder="https://example.com/logo.png"
							/>
							{form.logo && (
								<div className="mt-2 flex items-center gap-3">
									<img
										src={form.logo}
										alt="Logo preview"
										className="size-10 rounded-full object-cover border border-zinc-200"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = 'none';
										}}
									/>
									<span className="text-xs text-muted-foreground">Preview</span>
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
						<Button type="submit">
							{isEditing ? 'Update Brand' : 'Add Brand'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
