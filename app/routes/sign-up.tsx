import { Link } from 'react-router';

import { Input } from '~/components/input';

export default function SignUp() {
	return (
		<>
			<title>Sign Up - Shopfinity</title>

			<main className="grid place-items-center h-[80vh]">
				<form
					className="flex flex-col gap-8 rounded-lg"
					onSubmit={(e) => e.preventDefault()}
				>
					<div>
						<legend className="font-bold text-4xl">Sign Up</legend>
						<p className="mt-2 text-zinc-700">
							Kami ingin lebih banyak tentang kamu, Ayo Daftar!
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<Input label="Email" type="email" name="email" />
						<Input label="Password" type="password" name="password" />
						<Input
							label="Repeat Password"
							type="password"
							name="repeatPassword"
						/>
					</div>

					<div>
						<button
							type="submit"
							className="w-full py-2 bg-zinc-900 text-white rounded-md text-lg"
						>
							Submit
						</button>

						<div className="mt-4 flex w-full gap-4">
							{['google', 'facebook'].map((item) => (
								<button
									key={item}
									className="w-full outline rounded-md outline-zinc-900 py-2.5 flex items-center justify-center gap-2.5 font-medium"
								>
									<img
										src={`/logo/${item}.png`}
										alt=""
										className="w-6 aspect-square"
									/>
									{item.charAt(0).toUpperCase() + item.slice(1)}
								</button>
							))}
						</div>
					</div>

					<p className="text-center text-sm">
						Sudah punya akun?{' '}
						<Link to="/login" className="underline">
							Masuk Sekarang!
						</Link>
					</p>
				</form>
			</main>
		</>
	);
}
