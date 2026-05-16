export interface Address {
	fullName: string;
	phone: string;
	street: string;
	city: string;
	province: string;
	postalCode: string;
}

export interface ShippingMethod {
	id: string;
	courier: string;
	service: string;
	estimatedDays: string;
	cost: number;
}

export interface PaymentMethod {
	id: string;
	type: 'qris' | 'bank_transfer' | 'ewallet' | 'card';
	name: string;
	accountNumber?: string;
	accountName?: string;
}

export type CheckoutStep = 'address' | 'shipping' | 'payment' | 'confirmation';

export type OrderStatus =
	| 'PENDING_PAYMENT'
	| 'PAID'
	| 'PROCESSING'
	| 'SHIPPED'
	| 'DELIVERED'
	| 'CANCELLED';

export interface OrderItem {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

export interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	address: Address;
	items: OrderItem[];
	subtotal: number;
	shippingCost: number;
	tax: number;
	total: number;
	shippingMethod: ShippingMethod;
	paymentMethod: PaymentMethod;
	status: OrderStatus;
	paymentProofUrl?: string;
	createdAt: string;
	updatedAt: string;
}
