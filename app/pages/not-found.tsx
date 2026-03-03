import { useNavigate } from 'react-router';

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<main className="h-[70vh] grid place-items-center">
			<div className="flex justify-center items-center gap-14 h-36">
				<p className="font-bold text-8xl">404</p>

				<hr className="bg-zinc-900 h-full w-1.5 rounded-full block " />

				<div className="w-1/3">
					<h1 className="font-bold text-3xl">
						Page <br />
						Not Found.
					</h1>

					<p className="mt-4">
						Halaman tidak ditemukan. Kembali ke halaman{' '}
						<span
							className="underline cursor-pointer"
							onClick={() => navigate(-1)}
						>
							sebelumnya.
						</span>
					</p>
				</div>
			</div>
		</main>
	);
}
