import type { JSX } from 'preact';

import { useId } from 'preact/compat';


interface Props extends JSX.HTMLAttributes<HTMLInputElement> {
  label: string,
}

export default function Input({ label, ...rest }: Props) {
  const id = useId();

  return (
    <label htmlFor={id}>
      <p className="font-medium">{label}</p>

      <input
        id={id}
        className="mt-2 outline-1 outline-zinc-950 outline rounded-sm w-full px-2.5 py-1 invalid:outline-red-600 invalid:bg-red-100 invalid:shadow-md transition-colors duration-300"
        {...rest}
      />
    </label>
  )
}