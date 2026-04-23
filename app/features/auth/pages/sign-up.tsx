import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { transformApiError } from '~/shared/utils/api-error';

import { Button } from '~/shared/components/shadcn/ui/button';
import {
	Field,
	FieldLabel,
	FieldSet,
} from '~/shared/components/shadcn/ui/field';
import { Input } from '~/shared/components/shadcn/ui/input';
import type { ApiResponse } from '~/shared/types/api-response';
import { http } from '~/shared/utils/http';
import type { SignUpResponse } from '../types/api/sign-up-response';

export default function Signup() {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation({
		mutationFn: (data: Record<string, string>) =>
			http
				.post('auth/sign-up', { json: data })
				.json<ApiResponse<SignUpResponse>>(),
		onSuccess: (data) => {
			if (data.success) {
				toast.success('User created successfully. Please login.');
				navigate('/login');
			}
		},
		onError: async (error) => {
			console.error('Signup error: ', error);

			if (error instanceof HTTPError) {
				const response = (await error.response.json()) as ApiResponse;
				toast.error(transformApiError(response));
			} else {
				toast.error('An unexpected error occurred. Please try again later.');
			}
		},
	});

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isPending) return;

		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries()) as Record<
			string,
			string
		>;

		mutate(data);
	}

	return (
		<>
			<title>Sign up - Shopfinity</title>

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

					<form className="mt-8" onSubmit={handleSubmit}>
						<FieldSet disabled={isPending}>
							<Field>
								<FieldLabel htmlFor="fullname">Fullname</FieldLabel>
								<Input
									id="fullname"
									name="fullname"
									type="text"
									placeholder="Enter your fullname"
									className="bg-white"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									className="bg-white"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter your password"
									className="bg-white"
									required
								/>
							</Field>

							<Button type="submit" className="mt-4" disabled={isPending}>
								{isPending ? 'Signing up...' : 'Sign up'}
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
