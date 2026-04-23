import { useEffect, useState } from 'react';

export default function useResize(size: number) {
	const [offside, setOffside] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${size}px)`);
		setOffside(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setOffside(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);

		// Cleanup
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [size]);

	return offside;
}
