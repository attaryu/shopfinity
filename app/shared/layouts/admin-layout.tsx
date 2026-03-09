import { Outlet, redirect } from 'react-router';
import { userQueryOption } from '~/features/auth/hooks/api/use-user';
import { queryClient } from '../utils/query-client';

export default function AdminLayout() {
	return <Outlet />;
}

export async function clientLoader() {
	try {
		const user = await queryClient.fetchQuery(userQueryOption);

		if (!user) {
			throw redirect('/login');
		}

		if (user.role === 'USER') {
			throw redirect('/');
		}

		return { user };
	} catch (error) {
		if (error instanceof Response) {
			if (error.status >= 300 && error.status < 400) {
				throw error;
			}
		}

		throw redirect('/login');
	}
}
