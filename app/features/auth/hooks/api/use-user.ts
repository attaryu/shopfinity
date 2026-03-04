import {
	useQuery,
	type UndefinedInitialDataOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import type { ApiResponse } from '~/shared/types/api-response';
import type { User } from '~/shared/types/user';
import { http } from '~/shared/utils/http';
import { getSession } from '~/shared/utils/session-management';

export const userQueryOption = {
	queryKey: ['user'],
	queryFn: async () => {
		const response = await http
			.get('users/me')
			.json<ApiResponse<{ user: User }>>();

		return response.data?.user;
	},
	staleTime: Infinity,
	gcTime: 1000 * 60 * 15, // 15 minutes
};

export function useUser() {
	return useQuery({
		...userQueryOption,
		enabled: !!getSession(),
		retry: (failureCount, error: HTTPError) => {
			if (error.response.status === 401) {
				return false;
			}

			return failureCount < 2;
		},
	});
}
