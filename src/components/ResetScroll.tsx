import { ComponentChild } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'react-router-dom';

export default function ResetScroll({ children }: { children: ComponentChild }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return <>{children}</>;
}
