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
import type { AdminCategory, CategoryFormData } from '../types/admin-types';

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: AdminCategory | null;
}

const emptyForm: CategoryFormData = {
	name: '',
	slug: '',
};

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
}: CategoryFormDialogProps) {
	const { addCategory, updateCategory } = useAdminStore();
	const [form, setForm] = useState<CategoryFormData>(emptyForm);
	const isEditing = !!category;

	useEffect(() => {
		if (category) {
			setForm({ name: category.name, slug: category.slug });
		} else {
			setForm(emptyForm);
		}
	}, [category, open]);

	function handleNameChange(name: string) {
		setForm({ name, slug: slugify(name) });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isEditing && category) {
			updateCategory(category.id, form);
		} else {
			addCategory(form);
		}
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Category' : 'Add New Category'}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Update the category information below.'
							: 'Fill in the details to create a new category.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<FieldSet className="py-4">
						<Field>
							<FieldLabel htmlFor="category-name">Category Name</FieldLabel>
							<Input
								id="category-name"
								value={form.name}
								onChange={(e) => handleNameChange(e.target.value)}
								placeholder="Enter category name"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="category-slug">Slug</FieldLabel>
							<Input
								id="category-slug"
								value={form.slug}
								onChange={(e) =>
									setForm((prev) => ({ ...prev, slug: e.target.value }))
								}
								placeholder="auto-generated-slug"
								className="text-muted-foreground"
							/>
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
							{isEditing ? 'Update Category' : 'Add Category'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
