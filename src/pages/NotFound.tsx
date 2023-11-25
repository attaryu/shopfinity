import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="h-[70vh] grid place-items-center">
      <div class="flex justify-center items-center gap-14 h-36">
        <p class="font-bold text-8xl">404</p>

        <hr class="bg-zinc-900 h-full w-[6px] rounded-full block " />

        <div class="w-1/3">
          <h1 class="font-bold text-3xl">
            Page <br />
            Not Found.
          </h1>

          <p class="mt-4">
            Halaman tidak ditemukan. Kembali ke halaman{' '}
            <span class="underline cursor-pointer" onClick={() => navigate(-1)}>sebelumnya.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
