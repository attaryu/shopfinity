import { useEffect, useState } from 'preact/hooks';

export default function useResize(size: number) {
  const [offside, setOffside] = useState(false);
  
  function resizeHandler() {
    const { matches } = matchMedia(`(max-width: ${size}px)`);

    if (matches)
      setOffside(true);
    else
      setOffside(false);
  }
  
  useEffect(() => {
    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    return window.removeEventListener('resize', resizeHandler);
  }, []);

  return offside;
}