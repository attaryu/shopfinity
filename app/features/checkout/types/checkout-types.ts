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
	type: 'qris' | 'bank_transfer';
	name: string;
	accountNumber: string | null;
	accountName: string | null;
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
	id?: string;
	orderId?: string;
	productId: string;
	productName?: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string | null;
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
	paymentProofUrl: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateOrderPayload {
	customerName: string;
	customerEmail?: string;
	address: Address;
	items: Array<{
		productId: string;
		name: string;
		price: number;
		quantity: number;
		imageUrl?: string | null;
	}>;
	subtotal: number;
	shippingMethod: ShippingMethod;
	paymentMethod: PaymentMethod;
}

export interface ListOrdersParams {
	page?: number;
	limit?: number;
	status?: OrderStatus | '';
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}
