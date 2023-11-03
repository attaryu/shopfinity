import Link from '@/components/Link';

export default function Footer() {  
  return (
    <footer className="bg-gradient-to-br from-zinc-800 via-zinc-950 to-zinc-900 text-white">
      <div className="flex justify-between items-start p-14">
        <div>
          <div className="flex gap-9 items-center">
            <img src="/logo.svg" alt="" className="w-20"/>

            <div>
              <p className="text-3xl font-bold">Shopfinity</p>
              <small className="text-lg font-extralight">Everthing your needs.</small>
            </div>
          </div>

          <div className="mt-12 flex w-96 items-center gap-4">
            <i className="fi fi-ss-marker text-xl" />

            <address className="w-full font-light text-sm">
              Jl. Keputih Tegal Tim. II No.5, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60111
            </address>
          </div>
        </div>

        <ul className="flex gap-x-24 font-semibold">
          <div>
            <li className="mb-2.5"><Link to="/" type="navbar">Home</Link></li>
            <li className="mb-2.5"><Link to="/product" type="navbar">Product</Link></li>
            <li className="mb-2.5"><Link to="/my-cart" type="navbar">My Cart</Link></li>
            <li className="mb-2.5"><Link to="/about" type="navbar">About</Link></li>
          </div>
          <div>
            <li className="mb-2.5"><Link to="/community" type="navbar">Community</Link></li>
            <li className="mb-2.5"><Link to="/news" type="navbar">News</Link></li>
            <li className="mb-2.5"><Link to="/sales" type="navbar">Sales</Link></li>
            <li className="mb-2.5"><Link to="/api" type="navbar">Api</Link></li>
          </div>
          <div>
            <li className="mb-2.5"><Link to="/guides" type="navbar">Guides</Link></li>
            <li className="mb-2.5"><Link to="/term-of-use" type="navbar">Term of Use</Link></li>
            <li className="mb-2.5"><Link to="/term-of-sale" type="navbar">Term of Sale</Link></li>
            <li className="mb-2.5"><Link to="/privacy-policy" type="navbar">Privacy Policy</Link></li>
          </div>
        </ul>

        <div>
          <h3 className="text-xl font-semibold">Get in Touch</h3>

          <div className="mt-5 flex gap-6 text-3xl">
            <Link to="https://instagram.com">
              <i className="fi fi-brands-instagram text-white" /> 
            </Link>
            <Link to="https://linkedin.com">
              <i className="fi fi-brands-linkedin text-white" /> 
            </Link>
            <Link to="https://twitter.com">
              <i className="fi fi-brands-twitter-alt-square text-white" />
            </Link>
          </div>
        </div>
      </div>

      <p className="font-light text-sm text-center py-7">&copy; 2023 Shopfinity, Inc. All Rights Reserved</p>
    </footer>
  );
}