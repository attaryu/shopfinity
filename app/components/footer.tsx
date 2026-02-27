import { Link as LinkReactRouter } from 'react-router';
import { MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

import { Link } from '~/components/link';
import { NavbarLink } from './navbar/navbar-link';

export function Footer() {
	return (
		<footer className="bg-linear-to-br from-zinc-800 via-zinc-950 to-zinc-900 text-white">
			<div className="flex justify-between items-start p-14">
				<div>
					<div className="flex gap-9 items-center">
						<img src="/logo/shopfinity.svg" alt="" className="w-[4.6rem]" />

						<div>
							<p className="text-2xl font-bold">Shopfinity</p>
							<small className="text-base">
								Everthing your needs.
							</small>
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
							<NavbarLink to="/">Home</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/product">Product</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/my-cart">My Cart</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/about">About</NavbarLink>
						</li>
					</div>
					<div>
						<li className="mb-2.5">
							<NavbarLink to="/community">Community</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/news">News</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/sales">Sales</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/api">Api</NavbarLink>
						</li>
					</div>
					<div>
						<li className="mb-2.5">
							<NavbarLink to="/guides">Guides</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/term-of-use">Term of Use</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/term-of-sale">Term of Sale</NavbarLink>
						</li>
						<li className="mb-2.5">
							<NavbarLink to="/privacy-policy">Privacy Policy</NavbarLink>
						</li>
					</div>
				</ul>

				<div>
					<h3 className="text-xl font-medium">Get in Touch</h3>

					<div className="mt-5 flex gap-6 text-3xl">
						<LinkReactRouter to="https://instagram.com">
						<Instagram className="text-white" size={30} />
					</LinkReactRouter>
					<LinkReactRouter to="https://linkedin.com">
						<Linkedin className="text-white" size={30} />
					</LinkReactRouter>
					<LinkReactRouter to="https://twitter.com">
						<Twitter className="text-white" size={30} />
						</LinkReactRouter>
					</div>
				</div>
			</div>

			<p className="text-sm text-center py-7">
				&copy; 2023 Shopfinity, Inc. All Rights Reserved
			</p>
		</footer>
	);
}
