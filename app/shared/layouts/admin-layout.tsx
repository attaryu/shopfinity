import { Outlet } from 'react-router';

export default function AdminLayout() {
	return (
		<>
			<div className="admin-header">Admin Panel</div>
			<Outlet />
		</>
	);
}
