import { Link } from 'react-router';

import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { Input } from '~/shared/components/shadcn/ui/input';

export default function Login() {
	return (
		<>
			<title>Login - Shopfinity</title>

			<main className="grid grid-cols-2 grid-rows-1 h-[85vh] mx-52 mt-2 mb-14 rounded-xl overflow-hidden">
				<div className="w-full h-full bg-zinc-900">
					<img
						src="/images/login-image.jpg"
						alt=""
						className="w-full h-full object-cover saturate-0 brightness-75"
					/>
				</div>

				<div className="w-full h-full bg-zinc-100 p-14 flex flex-col justify-center">
					<h1 className="text-3xl font-bold text-center">
						Login to your account
					</h1>
					<p className=" mt-2 text-zinc-600 text-center">
						Enter your credentials to access your account
					</p>

					<form action="" className="mt-8">
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									className="bg-white"
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									className="bg-white"
								/>
							</Field>

							<Button type="submit" className="mt-4">
								Login
							</Button>
						</FieldSet>

						<p className="mt-4 text-sm text-zinc-600 text-center">
							Don't have an account?{' '}
							<Link
								to="/sign-up"
								className="text-zinc-900 font-medium hover:underline"
							>
								sign up here
							</Link>
						</p>
					</form>
				</div>
			</main>
		</>
	);
}
