import { AlertTriangle, ArrowRight, Layers, Package, Tags, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { useAdminStore } from '../store/admin-store';
import { AdminTopbar } from '../components/admin-topbar';
import { StatCard } from '../components/stat-card';
import { Badge } from '~/shared/components/shadcn/ui/badge';

export default function AdminHomePage() {
	const { products, categories, brands } = useAdminStore();
	const lowStockCount = products.filter((p) => p.stock < 5).length;
	const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

	return (
		<>
			<title>Dashboard - Admin Shopfinity</title>

			<AdminTopbar
				title="Dashboard"
				description="Welcome back! Here's an overview of your store."
			/>

			<div className="flex-1 p-6 space-y-8">
				{/* Stat Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
					<StatCard
						title="Total Products"
						value={products.length}
						subtitle="Active in catalog"
						icon={Package}
					/>
					<StatCard
						title="Categories"
						value={categories.length}
						subtitle="Product classifications"
						icon={Tags}
					/>
					<StatCard
						title="Brands"
						value={brands.length}
						subtitle="Registered brands"
						icon={Layers}
					/>
					<StatCard
						title="Low Stock"
						value={lowStockCount}
						subtitle={lowStockCount > 0 ? 'Items need restocking' : 'All items well-stocked'}
						icon={AlertTriangle}
						className={lowStockCount > 0 ? 'border-red-200/80' : ''}
						iconClassName={lowStockCount > 0 ? 'bg-red-500 shadow-red-500/20' : ''}
					/>
				</div>

				{/* Summary Row */}
				<div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-zinc-200/80">
					<div className="flex items-center justify-center size-10 rounded-lg bg-emerald-50 text-emerald-600">
						<TrendingUp className="size-5" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium">Store Inventory</p>
						<p className="text-xs text-muted-foreground">
							{totalStock} total units across {products.length} products
						</p>
					</div>
					<Badge variant="secondary" className="text-xs font-mono px-3">
						{products.length > 0 ? Math.round(totalStock / products.length) : 0} avg/product
					</Badge>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="text-base font-bold tracking-tight mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link
							to="/admin/products"
							className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-0.5 hover:border-zinc-300/80 transition-all duration-300"
						>
							<div className="flex items-center justify-center size-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 group-hover:shadow-md group-hover:shadow-zinc-900/20">
								<Package className="size-5" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-sm">Manage Products</p>
								<p className="text-xs text-muted-foreground">
									{products.length} products
								</p>
							</div>
							<ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
						</Link>

						<Link
							to="/admin/categories"
							className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-0.5 hover:border-zinc-300/80 transition-all duration-300"
						>
							<div className="flex items-center justify-center size-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 group-hover:shadow-md group-hover:shadow-zinc-900/20">
								<Tags className="size-5" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-sm">Manage Categories</p>
								<p className="text-xs text-muted-foreground">
									{categories.length} categories
								</p>
							</div>
							<ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
						</Link>

						<Link
							to="/admin/brands"
							className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-0.5 hover:border-zinc-300/80 transition-all duration-300"
						>
							<div className="flex items-center justify-center size-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 group-hover:shadow-md group-hover:shadow-zinc-900/20">
								<Layers className="size-5" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-sm">Manage Brands</p>
								<p className="text-xs text-muted-foreground">
									{brands.length} brands
								</p>
							</div>
							<ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
						</Link>
					</div>
				</div>

				{/* Low Stock Alert */}
				{lowStockCount > 0 && (
					<div>
						<h2 className="text-base font-bold tracking-tight mb-4">Low Stock Alert</h2>
						<div className="rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50/80 to-white p-5">
							<div className="flex items-center gap-3 mb-4">
								<div className="flex items-center justify-center size-9 rounded-lg bg-red-100 text-red-600">
									<AlertTriangle className="size-4" />
								</div>
								<div>
									<p className="font-semibold text-red-700 text-sm">
										{lowStockCount} product{lowStockCount > 1 ? 's' : ''} with low stock
									</p>
									<p className="text-xs text-red-500/80">Products with less than 5 items in stock</p>
								</div>
							</div>
							<div className="space-y-2">
								{products
									.filter((p) => p.stock < 5)
									.map((p) => (
										<div
											key={p.id}
											className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-red-100/80 hover:border-red-200 transition-colors"
										>
											<div className="flex items-center gap-3">
												<img
													src={p.image}
													alt={p.name}
													className="size-9 rounded-lg object-cover border border-zinc-100"
													onError={(e) => {
														(e.target as HTMLImageElement).src =
															'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><rect width="24" height="24" rx="4" fill="%23f4f4f5"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="%23a1a1aa">?</text></svg>';
													}}
												/>
												<div>
													<span className="text-sm font-medium block leading-tight">{p.name}</span>
													<span className="text-xs text-muted-foreground">{p.slug}</span>
												</div>
											</div>
											<Badge variant="destructive" className="text-xs font-mono tabular-nums px-2.5">
												{p.stock} left
											</Badge>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
