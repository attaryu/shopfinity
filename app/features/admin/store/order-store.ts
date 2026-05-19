import { create } from 'zustand';
import type { Order, OrderItem, OrderStatus } from '../../checkout/types/checkout-types';
import type { Address, PaymentMethod, ShippingMethod } from '../../checkout/types/checkout-types';

interface OrderStore {
	orders: Order[];
	placeOrder: (params: {
		items: OrderItem[];
		subtotal: number;
		shippingMethod: ShippingMethod;
		paymentMethod: PaymentMethod;
		address: Address;
		customerName: string;
		customerEmail: string;
	}) => Order;
	updateOrderStatus: (orderId: string, status: OrderStatus) => void;
	setPaymentProof: (orderId: string, proofUrl: string) => void;
	getOrderById: (orderId: string) => Order | undefined;
	getOrdersByStatus: (status: OrderStatus) => Order[];
}

function generateOrderNumber(): string {
	const now = new Date();
	const y = now.getFullYear().toString().slice(-2);
	const m = (now.getMonth() + 1).toString().padStart(2, '0');
	const d = now.getDate().toString().padStart(2, '0');
	const rand = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, '0');
	return `INV/${y}${m}${d}/${rand}`;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
	orders: loadOrders(),

	placeOrder: ({ items, subtotal, shippingMethod, paymentMethod, address, customerName, customerEmail }) => {
		const shippingCost = shippingMethod.cost;
		const total = subtotal + shippingCost;

		const order: Order = {
			id: crypto.randomUUID(),
			orderNumber: generateOrderNumber(),
			customerName,
			customerEmail,
			address,
			items,
			subtotal,
			shippingCost,
			tax: 0,
			total,
			shippingMethod,
			paymentMethod,
			status: 'PENDING_PAYMENT',
			paymentProofUrl: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const orders = [...get().orders, order];
		persistOrders(orders);
		set({ orders });

		return order;
	},

	updateOrderStatus: (orderId, status) => {
		const orders = get().orders.map((o) =>
			o.id === orderId
				? { ...o, status, updatedAt: new Date().toISOString() }
				: o,
		);
		persistOrders(orders);
		set({ orders });
	},

	setPaymentProof: (orderId, proofUrl) => {
		const orders = get().orders.map((o) =>
			o.id === orderId
				? {
						...o,
						paymentProofUrl: proofUrl,
						status: 'PENDING_PAYMENT' as OrderStatus,
						updatedAt: new Date().toISOString(),
					}
				: o,
		);
		persistOrders(orders);
		set({ orders });
	},

	getOrderById: (orderId) => {
		return get().orders.find((o) => o.id === orderId);
	},

	getOrdersByStatus: (status) => {
		return get().orders.filter((o) => o.status === status);
	},
}));

const ORDERS_KEY = 'shopfinity-orders';

function loadOrders(): Order[] {
	try {
		const stored = localStorage.getItem(ORDERS_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function persistOrders(orders: Order[]) {
	localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
