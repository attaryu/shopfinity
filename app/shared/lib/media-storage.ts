import { getSupabase } from './supabase';

const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

function requireSupabase() {
	const client = getSupabase();
	if (!client) {
		throw new Error(
			'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.',
		);
	}
	return client;
}

export const MediaStorage = {
	getUrl(path: string | null | undefined): string {
		if (!path) return '';
		if (path.startsWith('http')) return path;

		const client = getSupabase();
		if (!client) return path;

		return client.storage.from(supabaseBucket).getPublicUrl(path).data
			.publicUrl;
	},

	async uploadToSignedUrl(
		path: string,
		token: string,
		file: File,
	): Promise<void> {
		const client = requireSupabase();
		const { error } = await client.storage
			.from(supabaseBucket)
			.uploadToSignedUrl(path, token, file);

		if (error) {
			throw new Error(`Failed to upload to MediaStorage: ${error.message}`);
		}
	},
};
