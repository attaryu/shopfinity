import { supabase } from './supabase';

const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

/**
 * MediaStorage abstraction to handle file operations across different providers.
 * Currently supports Supabase, but designed to be extendable to S3 or other storage.
 */
export const MediaStorage = {
	/**
	 * Resolves a storage path to a full public URL.
	 * @param path The storage path (e.g., 'brand/logo.png')
	 * @returns The full public URL
	 */
	getUrl(path: string | null | undefined): string {
		if (!path) return '';
		if (path.startsWith('http')) return path;

		return supabase.storage.from(supabaseBucket).getPublicUrl(path).data
			.publicUrl;
	},

	/**
	 * Performs a file upload using a presigned URL and token.
	 * @param path The destination storage path
	 * @param token The presigned upload token
	 * @param file The file object to upload
	 */
	async uploadToSignedUrl(
		path: string,
		token: string,
		file: File,
	): Promise<void> {
		const { error } = await supabase.storage
			.from(supabaseBucket)
			.uploadToSignedUrl(path, token, file);

		if (error) {
			throw new Error(`Failed to upload to MediaStorage: ${error.message}`);
		}
	},
};
