export default function Label({
  title,
  content,
  label
}: Readonly<{
  title: string,
  label: string,
  content: string,
}>) {
  return (
    <div className="w-full">
      <p className="font-semibold text-lg">{title}</p>

      <div className="flex items-center border-[1px] border-zinc-900 rounded-md overflow-clip mt-1.5">
        <span className="p-2 bg-zinc-900 text-white font-medium">{label}</span>
        <p className="px-2">{content}</p>
      </div>
    </div>
  );
}
