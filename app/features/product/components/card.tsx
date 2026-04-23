import { MediaStorage } from '~/shared/lib/media-storage';
import type { ClientProduct } from '../types/product-types';

import { Link } from 'react-router';

export function Card({
	slug,
	name,
	price,
	imageUrl,
	category,
	brand,
}: Readonly<ClientProduct>) {
	return (
		<li className="w-full group">
			<div className="relative overflow-hidden rounded-lg">
				<img
					src={MediaStorage.getUrl(imageUrl)}
					alt={name}
					className="object-cover w-full h-64 relative before:content-['Image_not_found'] before:absolute before:w-full before:h-full before:bg-zinc-200 before:top-0 before:left-0 before:grid before:place-items-center before:text-zinc-500 before:text-sm transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute top-2 left-2 flex flex-col gap-1">
					<span className="bg-white/90 backdrop-blur-xs text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
						{category.name}
					</span>
				</div>
			</div>

			<div className="flex flex-col mt-4 h-fit">
				<div className="flex items-center gap-2 mb-1">
					{brand.logoUrl && (
						<img
							src={MediaStorage.getUrl(brand.logoUrl)}
							alt={brand.name}
							className="w-4 h-4 object-contain grayscale opacity-70"
						/>
					)}
					<span className="text-zinc-500 text-xs font-medium">
						{brand.name}
					</span>
				</div>

				<h2
					className={`font-bold w-full leading-5 hover:underline text-zinc-900 ${name.length > 22 && 'h-10 relative overflow-hidden'}`}
				>
					<Link to={`/product/${slug}`}>{name}</Link>
				</h2>

				<div className="mt-2 flex w-full justify-between items-center">
					<p className="font-bold text-lg text-zinc-900">
						Rp {price.toLocaleString('id')}
					</p>
				</div>
			</div>
		</li>
	);
}
