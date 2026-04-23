import { Instagram, Linkedin, MapPin, Twitter } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
	return (
		<footer className="bg-linear-to-br from-zinc-800 via-zinc-950 to-zinc-900 text-white">
			<div className="flex justify-between items-start p-14">
				<div>
					<div className="flex gap-9 items-center">
						<img
							src="/logo/shopfinity-dark.svg"
							alt=""
							className="w-[4.6rem]"
						/>

						<div>
							<p className="text-2xl font-bold">Shopfinity</p>
							<small className="text-base">Discover Your Own Style.</small>
						</div>
					</div>

					<div className="mt-12 flex w-96 items-center gap-4">
						<MapPin className="" size={20} />

						<address className="w-full text-sm">
							Jl. Keputih Tegal Tim. II No.5, Keputih, Kec. Sukolilo, Surabaya,
							Jawa Timur 60111
						</address>
					</div>
				</div>

				<ul className="flex gap-x-24 font-medium">
					<div>
						<li className="mb-2.5">
							<Link to="/">Home</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">My Cart</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Wishlist</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">About Us</Link>
						</li>
					</div>

					<div>
						<li className="mb-2.5">
							<Link to="/#">Community</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">News</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Sales</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Api</Link>
						</li>
					</div>

					<div>
						<li className="mb-2.5">
							<Link to="/#">Guides</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Term of Use</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Term of Sale</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/#">Privacy Policy</Link>
						</li>
					</div>
				</ul>

				<div>
					<h3 className="text-xl font-medium">Get in Touch</h3>

					<div className="mt-5 flex gap-6 text-3xl">
						<Link to="https://instagram.com">
							<Instagram className="text-white" size={30} />
						</Link>
						<Link to="https://linkedin.com">
							<Linkedin className="text-white" size={30} />
						</Link>
						<Link to="https://twitter.com">
							<Twitter className="text-white" size={30} />
						</Link>
					</div>
				</div>
			</div>

			<p className="text-sm text-center py-7">
				&copy; 2023 Shopfinity, Inc. All Rights Reserved
			</p>
		</footer>
	);
}
