import type { ShippingMethod } from '../types/checkout-types';

const SURABAYA_COORDINATES = { lat: -7.2575, lng: 112.7521 };

interface CityDistance {
	city: string;
	distanceKm: number;
}

const CITY_DISTANCES: CityDistance[] = [
	{ city: 'Surabaya', distanceKm: 0 },
	{ city: 'Jakarta', distanceKm: 780 },
	{ city: 'Bandung', distanceKm: 570 },
	{ city: 'Semarang', distanceKm: 310 },
	{ city: 'Yogyakarta', distanceKm: 280 },
	{ city: 'Malang', distanceKm: 90 },
	{ city: 'Denpasar', distanceKm: 350 },
	{ city: 'Medan', distanceKm: 2000 },
	{ city: 'Palembang', distanceKm: 1000 },
	{ city: 'Makassar', distanceKm: 820 },
	{ city: 'Balikpapan', distanceKm: 850 },
	{ city: 'Banjarmasin', distanceKm: 500 },
	{ city: 'Manado', distanceKm: 1450 },
	{ city: 'Pekanbaru', distanceKm: 1300 },
	{ city: 'Padang', distanceKm: 1400 },
	{ city: 'Pontianak', distanceKm: 950 },
	{ city: 'Samarinda', distanceKm: 900 },
	{ city: 'Tangerang', distanceKm: 800 },
	{ city: 'Depok', distanceKm: 770 },
	{ city: 'Bekasi', distanceKm: 760 },
];

export function getCities(): string[] {
	return CITY_DISTANCES.map((c) => c.city);
}

function getDistance(city: string): number {
	const found = CITY_DISTANCES.find(
		(c) => c.city.toLowerCase() === city.toLowerCase(),
	);
	return found?.distanceKm ?? 500;
}

function calculateCost(distanceKm: number, weightGrams: number = 1000): number {
	if (distanceKm === 0) return 10000;

	const basePerKg: Record<string, number> = {
		same_city: 10000,
		zone_1: 18000,
		zone_2: 24000,
		zone_3: 32000,
		zone_4: 40000,
	};

	let zone: string;
	if (distanceKm <= 100) zone = 'same_city';
	else if (distanceKm <= 400) zone = 'zone_1';
	else if (distanceKm <= 800) zone = 'zone_2';
	else if (distanceKm <= 1500) zone = 'zone_3';
	else zone = 'zone_4';

	return Math.ceil(basePerKg[zone] * (weightGrams / 1000));
}

export function getShippingMethods(city: string): ShippingMethod[] {
	const distance = getDistance(city);
	const baseCost = calculateCost(distance);

	return [
		{
			id: 'jne-reg',
			courier: 'JNE',
			service: 'REG (Reguler)',
			estimatedDays: distance <= 100 ? '1-2 days' : distance <= 400 ? '2-3 days' : distance <= 800 ? '3-5 days' : '5-7 days',
			cost: baseCost,
		},
		{
			id: 'jne-yes',
			courier: 'JNE',
			service: 'YES (Yakin Esok Sampai)',
			estimatedDays: distance <= 400 ? '1 day' : '1-2 days',
			cost: Math.ceil(baseCost * 1.8),
		},
		{
			id: 'jnt-ez',
			courier: 'J&T Express',
			service: 'EZ (Reguler)',
			estimatedDays: distance <= 100 ? '1-2 days' : distance <= 400 ? '2-3 days' : distance <= 800 ? '3-5 days' : '5-7 days',
			cost: Math.ceil(baseCost * 0.9),
		},
		{
			id: 'sicepat-reg',
			courier: 'SiCepat',
			service: 'REG (Reguler)',
			estimatedDays: distance <= 100 ? '1-2 days' : distance <= 400 ? '2-3 days' : distance <= 800 ? '3-4 days' : '4-7 days',
			cost: Math.ceil(baseCost * 0.85),
		},
		{
			id: 'pos-reg',
			courier: 'Pos Indonesia',
			service: 'Pos Reguler',
			estimatedDays: distance <= 100 ? '2-3 days' : distance <= 400 ? '3-5 days' : distance <= 800 ? '5-7 days' : '7-14 days',
			cost: Math.ceil(baseCost * 0.75),
		},
		{
			id: 'tiki-reg',
			courier: 'TIKI',
			service: 'REG (Reguler)',
			estimatedDays: distance <= 100 ? '1-2 days' : distance <= 400 ? '2-4 days' : distance <= 800 ? '4-6 days' : '6-8 days',
			cost: Math.ceil(baseCost * 1.1),
		},
	];
}
