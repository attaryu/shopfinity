import type { Product } from '~/data/index';
import { Tag } from 'lucide-react';

import { Link } from 'react-router';

export function Card({
	id,
	name,
	price,
	image,
	isDiscount,
	discount,
	discountPrice,
}: Readonly<Product>) {
	return (
		<li className="w-full">
			<img
				src={image}
				alt={name}
				className="object-cover w-full h-64 relative before:content-['Image_not_found'] before:absolute before:w-full before:h-full before:bg-zinc-200 before:top-0 before:left-0 before:grid before:place-items-center before:text-zinc-500 before:text-sm rounded-lg"
				loading="lazy"
			/>

			<div className="flex flex-col mt-5 h-fit">
				<h2
					className={`font-bold w-52 leading-5 hover:underline ${name.length > 22 && 'h-10 relative overflow-hidden before:absolute before:bottom-0 before:right-0 before:bg-linear-to-l before:from-white before:to-white/0 before:w-1/4 before:h-4'}`}
				>
					<Link to={`/product/${id}`}>{name}</Link>
				</h2>

				<div className="mt-3 flex w-full justify-between items-center">
					{isDiscount && (
						<div className="flex gap-1 items-center border border-red-600 text-red-600 rounded-lg w-fit px-1.5 py-0.5">
							<Tag className="" size={14} />
							<p className="font-medium text-sm">
								{discountPrice!.toLocaleString('id')}
							</p>
						</div>
					)}

					<p
						className={
							isDiscount ? 'line-through text-xs text-zinc-500' : 'font-medium'
						}
					>
						Rp {price.toLocaleString('id')}
					</p>

					{isDiscount && <p>{discount}%</p>}
				</div>
			</div>
		</li>
	);
}
