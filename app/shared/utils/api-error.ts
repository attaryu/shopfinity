import type { ApiResponse } from '../types/api-response';

/**
 * Transforms an API response into a user-friendly error message.
 * 
 * Logic:
 * - If statusCode is 400 and error.details is an array, returns the last element.
 * - For all other cases, falls back to the response message.
 */
export function transformApiError(response: ApiResponse): string {
	if (response.statusCode === 400) {
		const details = response.error?.details;
		if (Array.isArray(details) && details.length > 0) {
			// Prioritize the last message in the details array
			return details[details.length - 1] as string;
		}
	}

	return response.message || 'An unexpected error occurred';
}
