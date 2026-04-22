import { Loader2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/shared/components/shadcn/ui/dialog';
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { Input } from '~/shared/components/shadcn/ui/input';
import { MediaStorage } from '~/shared/lib/media-storage';
import { useCreateBrand } from '../hooks/api/use-create-brand';
import { useUpdateBrand } from '../hooks/api/use-update-brand';
import { slugify } from '../store/admin-store';
import type { AdminBrand, BrandFormData } from '../types/admin-types';

const ALLOWED_MIME_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/avif',
];

interface BrandFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: AdminBrand | null;
	onSuccess?: () => void;
}

const emptyForm: BrandFormData = {
	name: '',
	slug: '',
	logoUrl: '',
};

export function BrandFormDialog({
	open,
	onOpenChange,
	brand,
	onSuccess,
}: BrandFormDialogProps) {
	const createBrand = useCreateBrand();
	const updateBrand = useUpdateBrand();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [form, setForm] = useState<BrandFormData>(emptyForm);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const isEditing = !!brand;

	useEffect(() => {
		if (brand) {
			setForm({ name: brand.name, slug: brand.slug, logoUrl: brand.logoUrl });
			setPreviewUrl(MediaStorage.getUrl(brand.logoUrl));
		} else {
			setForm(emptyForm);
			setPreviewUrl(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	}, [brand, open]);

	useEffect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	function handleNameChange(name: string) {
		setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			toast.error('Invalid file type. Please upload PNG, JPEG, WebP, or AVIF.');
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}

		setForm((prev) => ({ ...prev, logoFile: file }));

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		try {
			if (isEditing && brand) {
				await updateBrand.mutateAsync({ id: brand.id, data: form });
				onSuccess?.();
				onOpenChange(false);
			} else {
				await createBrand.mutateAsync(form);
				onSuccess?.();
				onOpenChange(false);
			}
		} catch (error) {
			// Errors are handled in the hook
		}
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
							<FieldLabel htmlFor="brand-logo">Brand Logo</FieldLabel>
							<div className="flex flex-col gap-4">
								<div
									onClick={() => fileInputRef.current?.click()}
									className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all cursor-pointer overflow-hidden"
								>
									{previewUrl ? (
										<img
											src={previewUrl}
											alt="Preview"
											className="w-full h-full object-contain p-2"
										/>
									) : (
										<>
											<div className="p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-200">
												<Upload className="size-5 text-zinc-500" />
											</div>
											<p className="mt-2 text-xs font-medium text-zinc-500">
												Click to upload (PNG, JPEG, WebP, AVIF)
											</p>
										</>
									)}
									<input
										ref={fileInputRef}
										type="file"
										accept={ALLOWED_MIME_TYPES.join(',')}
										onChange={handleFileChange}
										className="hidden"
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
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createBrand.isPending || updateBrand.isPending}
						>
							{(createBrand.isPending || updateBrand.isPending) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isEditing ? 'Update Brand' : 'Add Brand'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
