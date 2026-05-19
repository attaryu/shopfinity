import type { PaymentMethod } from '../types/checkout-types';

export function getPaymentMethods(): PaymentMethod[] {
	return [
		{
			id: 'qris',
			type: 'qris',
			name: 'QRIS',
			accountNumber: null,
			accountName: null,
		},
		{
			id: 'bca',
			type: 'bank_transfer',
			name: 'Bank BCA',
			accountNumber: '1234567890',
			accountName: 'Shopfinity Indonesia',
		},
		{
			id: 'mandiri',
			type: 'bank_transfer',
			name: 'Bank Mandiri',
			accountNumber: '0987654321',
			accountName: 'Shopfinity Indonesia',
		},
		{
			id: 'bni',
			type: 'bank_transfer',
			name: 'Bank BNI',
			accountNumber: '5678901234',
			accountName: 'Shopfinity Indonesia',
		},
		{
			id: 'bri',
			type: 'bank_transfer',
			name: 'Bank BRI',
			accountNumber: '4321098765',
			accountName: 'Shopfinity Indonesia',
		},
	];
}
