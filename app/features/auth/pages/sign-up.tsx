import { Link } from 'react-router';

import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { Input } from '~/shared/components/shadcn/ui/input';

export default function Signup() {
	return (
		<>
			<title>sign-up - Shopfinity</title>

			<main className="grid grid-cols-2 grid-rows-1 h-[85vh] mx-52 mt-2 mb-14 rounded-xl overflow-hidden">
				<div className="w-full h-full bg-zinc-900">
					<img
						src="/images/sign-up-image.jpg"
						alt=""
						className="w-full h-full object-cover saturate-0 brightness-75"
					/>
				</div>

				<div className="w-full h-full bg-zinc-100 p-14 flex flex-col justify-center">
					<h1 className="text-3xl font-bold text-center">
						Sign up to your account
					</h1>
					<p className="mt-2 text-zinc-600 text-center">
						Enter your details to create a new account
					</p>

					<form action="" className="mt-8">
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="fullname">Fullname</FieldLabel>
								<Input
									id="fullname"
									type="text"
									placeholder="Enter your fullname"
									className="bg-white"
								/>
							</Field>

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

							<Button type="button" className="mt-4">
								Sign up
							</Button>
						</FieldSet>

						<p className="mt-4 text-sm text-zinc-600 text-center">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-zinc-900 font-medium hover:underline"
							>
								Login here
							</Link>
						</p>
					</form>
				</div>
			</main>
		</>
	);
}
