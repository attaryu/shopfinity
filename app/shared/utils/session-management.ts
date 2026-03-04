import type { User } from '../types/user';
import { queryClient } from './query-client';

export const ACCESS_TOKEN_KEY = 'shopfinity-access-token';

export function setSession(token: string, user: User) {
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
	queryClient.setQueryData<User>(['user'], user);
}

export function getSession() {
	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearSession() {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	queryClient.clear();
}
