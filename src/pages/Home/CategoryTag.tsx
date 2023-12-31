import { useSearchParams } from 'react-router-dom';

import { Category } from '@/data/index';

export default function CategoryTag({ id, name }: Readonly<Category>) {
  const [search, setSearch] = useSearchParams();
  
  function clickHandler() {
    if (Number(search.get('categoryid')) === id) {
      setSearch();
      return;
    }

    setSearch({ categoryid: id.toString() });
  }
  
  return (
    <button
      className={`text-lg rounded-full px-4 py-1 ${Number(search.get('categoryid')) === id ? 'bg-white text-zinc-900 outline outline-2 outline-zinc-900' : 'bg-zinc-900 text-white hover:bg-zinc-700 transition-colors'}`}
      onClick={clickHandler}
    >
      {name}
    </button>
  );
}