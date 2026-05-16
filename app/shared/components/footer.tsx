import { Instagram, Linkedin, MapPin, Twitter } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
	return (
		<footer className="bg-linear-to-br from-zinc-800 via-zinc-950 to-zinc-900 text-white">
			<div className="flex flex-col md:flex-row justify-between items-start p-6 sm:p-10 md:p-14 gap-8 md:gap-0">
				<div>
					<div className="flex gap-4 sm:gap-9 items-center">
						<img
							src="/logo/shopfinity-dark.svg"
							alt=""
							className="w-12 sm:w-[4.6rem]"
						/>

						<div>
							<p className="text-xl sm:text-2xl font-bold">Shopfinity</p>
							<small className="text-xs sm:text-base">Discover Your Own Style.</small>
						</div>
					</div>

					<div className="mt-8 sm:mt-12 flex max-w-80 items-center gap-4">
						<MapPin className="shrink-0" size={20} />

						<address className="w-full text-xs sm:text-sm">
							Jl. Keputih Tegal Tim. II No.5, Keputih, Kec. Sukolilo, Surabaya,
							Jawa Timur 60111
						</address>
					</div>
				</div>

				<ul className="flex flex-wrap gap-x-12 sm:gap-x-24 gap-y-6 font-medium">
					<div>
						<li className="mb-2.5">
							<Link to="/">Home</Link>
						</li>
						<li className="mb-2.5">
							<Link to="/cart">My Cart</Link>
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
					<h3 className="text-lg sm:text-xl font-medium">Get in Touch</h3>

					<div className="mt-4 sm:mt-5 flex gap-6 text-3xl">
						<Link to="https://instagram.com">
							<Instagram className="text-white" size={24} />
						</Link>
						<Link to="https://linkedin.com">
							<Linkedin className="text-white" size={24} />
						</Link>
						<Link to="https://twitter.com">
							<Twitter className="text-white" size={24} />
						</Link>
					</div>
				</div>
			</div>

			<p className="text-xs sm:text-sm text-center py-5 sm:py-7">
				&copy; 2026 Shopfinity, Inc. All Rights Reserved
			</p>
		</footer>
	);
}
