import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
	if (supabaseClient) return supabaseClient;

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

	if (!supabaseUrl || !supabaseKey) {
		console.warn(
			'Supabase environment variables not set. Media storage features will be unavailable.',
		);
		return null;
	}

	supabaseClient = createClient(supabaseUrl, supabaseKey);
	return supabaseClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
	get(_, prop) {
		const client = getSupabase();
		if (!client) {
			throw new Error(
				'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.',
			);
		}
		return (client as any)[prop];
	},
});
