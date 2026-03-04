import { Outlet, redirect } from 'react-router';
import { userQueryOption } from '~/features/auth/hooks/api/use-user';
import { queryClient } from '../utils/query-client';

export default function AdminLayout() {
	return <Outlet />;
}

export async function clientLoader() {
	const user = await queryClient.ensureQueryData(userQueryOption);

	if (!user) {
		throw redirect('/login');
	} else if (user.role === 'USER') {
		throw redirect('/');
	}
}
