import type { Category } from '@/data/index';
import { useEffect } from 'preact/hooks';

import { useSearchParams } from 'react-router-dom';

export default function CategoryTag({ id, name }: Category) {
  const [search, setSearch] = useSearchParams();
  
  function clickHandler() {
    setSearch({ categoryid: id.toString() });
  }
  
  return (
    <button
      className={`text-lg rounded-full px-4 py-1 ${Number(search.get('categoryid')) === id ? 'bg-white text-zinc-900 border-2 border-zinc-900' : 'bg-zinc-900 text-white hover:bg-zinc-700 transition-colors'}`}
      onClick={clickHandler}
    >
      {name}
    </button>
  );
}