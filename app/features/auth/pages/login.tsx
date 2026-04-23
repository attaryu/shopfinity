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
import { setSession } from '~/shared/utils/session-management';
import type { LoginResponse } from '../types/api/login-response';

export default function Login() {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation({
		mutationFn: (data: { email: string; password: string }) =>
			http
				.post('auth/login', { json: data })
				.json<ApiResponse<LoginResponse>>(),
		onSuccess: (data) => {
			if (data.success) {
				toast.success('Login successful!');

				setSession(data.data!.accessToken, data.data!.user);

				if (data.data!.user.role === 'ADMIN') {
					navigate('/admin');
				} else {
					navigate('/');
				}
			}
		},
		onError: async (error) => {
			console.error('Login error: ', error);

			if (error instanceof HTTPError) {
				const response = (await error.response.json()) as ApiResponse;
				toast.error(transformApiError(response));
			} else {
				toast.error('An unexpected error occurred. Please try again later.');
			}
		},
	});

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isPending) return;

		mutate({
			email: e.currentTarget.email.value,
			password: e.currentTarget.password.value,
		});
	}

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

					<form action="" className="mt-8" onSubmit={handleSubmit}>
						<FieldSet>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									name="email"
									autoComplete="email"
									placeholder="Enter your email"
									className="bg-white"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									type="password"
									name="password"
									placeholder="Enter your password"
									className="bg-white"
									required
								/>
							</Field>

							<Button type="submit" className="mt-4" disabled={isPending}>
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
