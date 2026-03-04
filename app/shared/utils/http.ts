import ky from 'ky';
import { redirect } from 'react-router';

import type { ApiResponse } from '../types/api-response';
import type { User } from '../types/user';
import { clearSession, getSession, setSession } from './session-management';

let isRefreshing = false;

let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else if (token) {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

export const http = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL + '/',
	hooks: {
		beforeRequest: [
			(request) => {
				const token = getSession();

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`);
				}
			},
		],
		afterResponse: [
			async (request, options, response) => {
				if (response.status === 401) {
					if (isRefreshing) {
						return new Promise((resolve, reject) => {
							failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								options.headers = {
									...options.headers,
									Authorization: `Bearer ${token}`,
								};

								return ky(request, options);
							})
							.catch((err) => Promise.reject(err));
					}

					isRefreshing = true;

					try {
						const { data } = await ky
							.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
								credentials: 'include',
							})
							.json<ApiResponse<{ accessToken: string; user: User }>>();

						processQueue(null, data!.accessToken);
						setSession(data!.accessToken, data!.user);

						options.headers = {
							...options.headers,
							Authorization: `Bearer ${data!.accessToken}`,
						};

						return ky(request, options);
					} catch (refreshError) {
						processQueue(refreshError, null);

						clearSession();
						redirect('/login');

						throw refreshError;
					} finally {
						isRefreshing = false;
					}
				}

				return response;
			},
		],
	},
});
