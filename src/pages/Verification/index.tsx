import { useLocation, Link } from 'react-router-dom';

import Input from './Input';

export default function Verification() {
  const isSignIn = useLocation().pathname === '/sign-in';

  return (
    <main className="grid place-items-center h-[80vh]">
      <form className="flex flex-col gap-8 rounded-lg" onSubmit={(e) => e.preventDefault()}>
        <div>
          <legend className="font-bold text-4xl">{isSignIn ? 'Sign In' : 'Sign Up'}</legend>
          <p className="mt-2 text-zinc-700">Kami ingin lebih banyak tentang kamu, Ayo {isSignIn ? 'Masuk' : 'Daftar'}!</p>
        </div>

        <div className="flex flex-col gap-3">
          <Input label="Email" type="email" name="email" />
          <Input label="Password" type="password" name="password" />
          {isSignIn ? (
            <p className="underline underline-offset-2 text-sm cursor-pointer">Lupa kata sandi?</p>
          ) : (
            <Input label="Repeat Password" type="password" name="repeatPassword" />
          )}
        </div>

        <div>
          <button type="submit" className="w-full py-2 bg-zinc-900 text-white rounded-md text-lg">Submit</button>

          <div className="mt-4 flex w-full gap-4">
            {['google', 'facebook'].map((item) => (
              <button className="w-full outline outline-1 rounded-md outline-zinc-900 py-2.5 flex items-center justify-center gap-2.5 font-medium">
                <img src={`/logo/${item}.png`} alt="" className="w-6 aspect-square"/>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm">
          {isSignIn ? 'Belum' : 'Sudah'} punya akun?{' '}
          <Link to={`/${isSignIn ? 'sign-up' : 'sign-in'}`} className="underline">
            {isSignIn ? 'Daftar' : 'Masuk'} Sekarang!
          </Link>
        </p>
      </form>
    </main>
  )
}
