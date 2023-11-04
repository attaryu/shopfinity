import { Link as LinkReactRouter, useLocation } from 'react-router-dom';

import type { ComponentChildren } from 'preact';

type Props = Readonly<{
  to: string,
  type?: 'normal' | 'navbar' | 'button primary' | 'button secondary',
  size?: 'sm' | 'normal',
  children: string | ComponentChildren,
}>;

export default function Link({ to, type = 'normal', size = 'normal', children }: Props) {  
  if (type === 'navbar') {
    const location = useLocation().pathname;
    const current = location == to && 'before:scale-x-100';

    return (
      <LinkReactRouter
        to={to}
        className={`relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:origin-right before:w-full before:h-0.5 before:bg-red-500 before:scale-x-0 before:transition-transform hover:before:origin-left hover:before:scale-x-100 before:duration-300 before:ease-in-out before:-z-10 -z-0 ${current}`}
      >
        {children}
      </LinkReactRouter>
    );
  } else if (type.includes('button')) {
    const isPrimary = type.includes('primary');
    const bg = isPrimary ? 'bg-zinc-900' : 'bg-white';
    const text = isPrimary ? 'text-white' : 'text-zinc-900';
    const linkSize = size == 'sm' ? 'px-3.5 py-1.5' : 'text-lg px-4 py-2'
    
    return (
      <LinkReactRouter
        to={to}
        className={`font-bold grid place-items-center rounded-md ${bg} ${text} ${linkSize}`}
      >
        {children}
      </LinkReactRouter>
    );
  }

  return (
    <LinkReactRouter
      to={to}
      className="text-inherit font-medium underline-offset-3"
    >
      {children}
    </LinkReactRouter>
  );
}
  