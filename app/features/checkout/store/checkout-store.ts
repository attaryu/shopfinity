import { create } from 'zustand';
import type {
	Address,
	CheckoutStep,
	PaymentMethod,
	ShippingMethod,
} from '../types/checkout-types';

interface CheckoutStore {
	step: CheckoutStep;
	address: Address | null;
	shippingMethod: ShippingMethod | null;
	paymentMethod: PaymentMethod | null;
	paymentProof: File | null;
	paymentProofUrl: string | null;
	setStep: (step: CheckoutStep) => void;
	setAddress: (address: Address) => void;
	setShippingMethod: (method: ShippingMethod) => void;
	setPaymentMethod: (method: PaymentMethod) => void;
	setPaymentProof: (file: File | null) => void;
	setPaymentProofUrl: (url: string | null) => void;
	reset: () => void;
}

const initialState = {
	step: 'address' as CheckoutStep,
	address: null,
	shippingMethod: null,
	paymentMethod: null,
	paymentProof: null,
	paymentProofUrl: null,
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
	...initialState,

	setStep: (step) => set({ step }),

	setAddress: (address) => set({ address, step: 'shipping' }),

	setShippingMethod: (method) => set({ shippingMethod: method, step: 'payment' }),

	setPaymentMethod: (method) =>
		set({ paymentMethod: method, step: 'confirmation' }),

	setPaymentProof: (file) => set({ paymentProof: file }),

	setPaymentProofUrl: (url) => set({ paymentProofUrl: url }),

	reset: () => set(initialState),
}));
