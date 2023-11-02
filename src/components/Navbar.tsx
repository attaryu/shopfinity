import Link from '@/components/Link';

export default function Navbar() {
  return (
    <nav className="bg-zinc-900 text-white w-full px-5 py-3.5 flex items-center">
      <div className="flex gap-5">
        <img src="/logo.svg" alt="" className="w-8  " />
        <p className="text-xl font-bold">Shopfinity</p>
      </div>

      <ul className="flex justify-between w-1/4 ml-16 font-semibold">
        <li>
          <Link to="/" type="navbar">Home</Link>
        </li>
        <li>
          <Link to="#" type="navbar">Product</Link>
        </li>
        <li>
          <Link to="/my-cart" type="navbar">My Cart</Link>
        </li>
        <li>
          <Link to="#" type="navbar">About</Link>
        </li>
      </ul>

      <div className="ml-auto flex gap-5">
        <Link to="sign-in" type="button secondary" size="sm">Sign In</Link>
        <Link to="sign-up" type="button primary" size="sm">Sign Up</Link>
      </div>
    </nav>
  );
}