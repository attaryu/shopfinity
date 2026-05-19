import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Loader2,
	QrCode,
	ShoppingBag,
} from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Label } from '~/shared/components/shadcn/ui/label';
import { Separator } from '~/shared/components/shadcn/ui/separator';
import { Textarea } from '~/shared/components/shadcn/ui/textarea';
import { useUser } from '~/features/auth/hooks/api/use-user';
import { useCartQuery, useCartTotal, useClearCartMutation } from '~/features/cart/hooks/use-cart';
import { useCheckoutStore } from '../store/checkout-store';
import { getShippingMethods, getCities } from '../data/shipping-methods';
import { getPaymentMethods } from '../data/payment-methods';
import { useCreateOrder } from '../hooks/api/use-create-order';
import type { Address, ShippingMethod, PaymentMethod } from '../types/checkout-types';

const steps = [
	{ key: 'address', label: 'Address' },
	{ key: 'shipping', label: 'Shipping' },
	{ key: 'payment', label: 'Payment' },
	{ key: 'confirmation', label: 'Confirmation' },
] as const;

const PROVINCES = [
	'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
	'DI Yogyakarta', 'Banten', 'Bali', 'Sumatera Utara',
	'Sumatera Barat', 'Sumatera Selatan', 'Riau', 'Kepulauan Riau',
	'Kalimantan Timur', 'Kalimantan Selatan', 'Kalimantan Barat',
	'Sulawesi Selatan', 'Sulawesi Utara', 'Papua',
];

export default function CheckoutPage() {
	const { data: cart } = useCartQuery();
	const items = cart?.items || [];
	const cartTotal = useCartTotal();
	const clearCartMutation = useClearCartMutation();
	const navigate = useNavigate();
	const user = useUser();
	const createOrder = useCreateOrder();

	// Redirect guest
	useEffect(() => {
		if (!user.isLoading && !user.data) {
			navigate('/login');
		}
	}, [user.isLoading, user.data, navigate]);

	const {
		step,
		address,
		shippingMethod,
		paymentMethod,
		setStep,
		setAddress,
		setShippingMethod,
		setPaymentMethod,
		reset: resetCheckout,
	} = useCheckoutStore();

	const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(
		shippingMethod,
	);
	const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
		paymentMethod,
	);
	const [selectedCity, setSelectedCity] = useState(address?.city || '');
	const [customerEmail, setCustomerEmail] = useState('');

	const shippingOptions = selectedCity ? getShippingMethods(selectedCity) : [];
	const paymentOptions = getPaymentMethods();
	const cities = getCities();

	if (user.isLoading || !user.data) {
		return (
			<main className="min-h-[70vh] flex items-center justify-center">
				<Loader2 className="size-8 animate-spin text-zinc-400" />
			</main>
		);
	}

	if (items.length === 0 && step === 'address') {
		return (
			<main className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
				<ShoppingBag className="size-12 text-zinc-300" />
				<h1 className="text-xl font-bold text-zinc-900">Your cart is empty</h1>
				<p className="text-zinc-500">Add items to your cart before checking out.</p>
				<Link to="/"><Button>Start Shopping</Button></Link>
			</main>
		);
	}

	const grandTotal = cartTotal + (shippingMethod?.cost || 0);

	function handleAddressSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const addr: Address = {
			fullName: fd.get('fullName') as string,
			phone: fd.get('phone') as string,
			street: fd.get('street') as string,
			city: fd.get('city') as string,
			province: fd.get('province') as string,
			postalCode: fd.get('postalCode') as string,
		};
		setAddress(addr);
		setSelectedCity(addr.city);
	}

	function handleShippingNext() {
		if (!selectedShipping) return;
		setShippingMethod(selectedShipping);
	}

	function handlePaymentNext() {
		if (!selectedPayment) return;
		setPaymentMethod(selectedPayment);
	}

	async function handlePlaceOrder() {
		if (!address || !shippingMethod || !paymentMethod) return;

		const subtotal = cartTotal;

		try {
			const order = await createOrder.mutateAsync({
				customerName: address.fullName,
				customerEmail: customerEmail || undefined,
				address,
				items: items.map((i) => ({
					productId: i.productId,
					name: i.product.name,
					price: i.product.price,
					quantity: i.quantity,
					imageUrl: i.product.imageUrl || null,
				})),
				subtotal,
				shippingMethod,
				paymentMethod,
			});

			clearCartMutation.mutate();
			resetCheckout();

			toast.success('Order berhasil dibuat!', {
				description: `Order #${order.orderNumber} telah dibuat. Silakan lakukan pembayaran.`,
			});

			navigate(`/orders/${order.id}`);
		} catch {
			// Error handled by the hook's onError
		}
	}

	const currentStepIndex = steps.findIndex((s) => s.key === step);

	return (
		<>
			<title>Checkout - Shopfinity</title>

			<main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
				{/* Step indicator */}
				<div className="flex items-center justify-center gap-2 mb-8 sm:mb-12">
					{steps.map((s, i) => (
						<div key={s.key} className="flex items-center gap-2">
							<div
								className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
									i <= currentStepIndex
										? 'bg-zinc-900 text-white'
										: 'bg-zinc-100 text-zinc-400'
								}`}
							>
								{i < currentStepIndex ? (
									<Check className="size-4" />
								) : (
									i + 1
								)}
							</div>
							<span
								className={`hidden sm:inline text-sm font-medium ${
									i <= currentStepIndex ? 'text-zinc-900' : 'text-zinc-400'
								}`}
							>
								{s.label}
							</span>
							{i < steps.length - 1 && (
								<div
									className={`w-6 sm:w-10 h-0.5 ${
										i < currentStepIndex ? 'bg-zinc-900' : 'bg-zinc-200'
									}`}
								/>
							)}
						</div>
					))}
				</div>

				{/* Step 1: Address */}
				{step === 'address' && (
					<form onSubmit={handleAddressSubmit} className="space-y-6">
						<h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
							Shipping Address
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="fullName">Full Name *</Label>
								<Input
									id="fullName"
									name="fullName"
									defaultValue={address?.fullName || ''}
									required
									placeholder="John Doe"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="phone">Phone *</Label>
								<Input
									id="phone"
									name="phone"
									defaultValue={address?.phone || ''}
									required
									placeholder="08123456789"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="email">Email (opsional)</Label>
							<Input
								id="email"
								type="email"
								value={customerEmail}
								onChange={(e) => setCustomerEmail(e.target.value)}
								placeholder="email@example.com"
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="street">Street Address *</Label>
							<Textarea
								id="street"
								name="street"
								defaultValue={address?.street || ''}
								required
								placeholder="Jl. Example No. 123, RT/RW"
								rows={2}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="province">Province *</Label>
								<select
									id="province"
									name="province"
									defaultValue={address?.province || ''}
									required
									className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
								>
									<option value="" disabled>Select province</option>
									{PROVINCES.map((p) => (
										<option key={p} value={p}>{p}</option>
									))}
								</select>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="city">City *</Label>
								<select
									id="city"
									name="city"
									value={selectedCity}
									onChange={(e) => setSelectedCity(e.target.value)}
									required
									className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
								>
									<option value="" disabled>Select city</option>
									{cities.map((c) => (
										<option key={c} value={c}>{c}</option>
									))}
								</select>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="postalCode">Postal Code *</Label>
								<Input
									id="postalCode"
									name="postalCode"
									defaultValue={address?.postalCode || ''}
									required
									placeholder="12345"
								/>
							</div>
						</div>

						<Button type="submit" className="w-full h-12 text-base rounded-xl gap-2">
							Continue to Shipping
							<ChevronRight className="size-4" />
						</Button>
					</form>
				)}

				{/* Step 2: Shipping */}
				{step === 'shipping' && (
					<div className="space-y-6">
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
								Shipping Method
							</h2>
							<p className="text-zinc-500 text-sm mt-1">
								Delivery to <span className="font-medium text-zinc-900">{address?.city}</span> from Surabaya
							</p>
						</div>

						<div className="space-y-3">
							{shippingOptions.map((opt) => (
								<label
									key={opt.id}
									className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
										selectedShipping?.id === opt.id
											? 'border-zinc-900 bg-zinc-50'
											: 'border-zinc-200 hover:border-zinc-300'
									}`}
								>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="shipping"
											className="accent-zinc-900 size-4"
											checked={selectedShipping?.id === opt.id}
											onChange={() => setSelectedShipping(opt)}
										/>
										<div>
											<p className="font-semibold text-zinc-900">
												{opt.courier} - {opt.service}
											</p>
											<p className="text-xs text-zinc-500">
												Est. {opt.estimatedDays}
											</p>
										</div>
									</div>
									<p className="font-bold text-zinc-900 shrink-0">
										Rp {opt.cost.toLocaleString('id')}
									</p>
								</label>
							))}

							{shippingOptions.length === 0 && (
								<p className="text-center text-zinc-400 py-8">
									Please select a city in the previous step to see shipping options.
								</p>
							)}
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 h-12 rounded-xl gap-2"
								onClick={() => setStep('address')}
							>
								<ChevronLeft className="size-4" />
								Back
							</Button>
							<Button
								className="flex-1 h-12 rounded-xl gap-2"
								disabled={!selectedShipping}
								onClick={handleShippingNext}
							>
								Continue to Payment
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				)}

				{/* Step 3: Payment */}
				{step === 'payment' && (
					<div className="space-y-6">
						<h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
							Payment Method
						</h2>

						<div className="bg-zinc-50 rounded-xl p-5 space-y-2 text-sm">
							<div className="flex justify-between text-zinc-600">
								<span>Subtotal</span>
								<span>Rp {cartTotal.toLocaleString('id')}</span>
							</div>
							<div className="flex justify-between text-zinc-600">
								<span>Shipping ({shippingMethod?.courier})</span>
								<span>
									Rp {shippingMethod?.cost.toLocaleString('id') || '—'}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between font-bold text-zinc-900 text-base">
								<span>Total</span>
								<span>Rp {grandTotal.toLocaleString('id')}</span>
							</div>
						</div>

						<div className="space-y-3">
							{paymentOptions.map((opt) => (
								<label
									key={opt.id}
									className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
										selectedPayment?.id === opt.id
											? 'border-zinc-900 bg-zinc-50'
											: 'border-zinc-200 hover:border-zinc-300'
									}`}
								>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											name="payment"
											className="accent-zinc-900 size-4"
											checked={selectedPayment?.id === opt.id}
											onChange={() => setSelectedPayment(opt)}
										/>
										<div>
											<p className="font-semibold text-zinc-900">
												{opt.name}
											</p>
											{opt.accountNumber && (
												<p className="text-xs text-zinc-500">
													{opt.accountNumber} a.n. {opt.accountName}
												</p>
											)}
										</div>
									</div>
									<span className="text-xs font-medium text-zinc-400 uppercase">
										{opt.type === 'qris' ? <QrCode className="size-4" /> : 'Bank'}
									</span>
								</label>
							))}
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 h-12 rounded-xl gap-2"
								onClick={() => setStep('shipping')}
							>
								<ChevronLeft className="size-4" />
								Back
							</Button>
							<Button
								className="flex-1 h-12 rounded-xl gap-2"
								disabled={!selectedPayment}
								onClick={handlePaymentNext}
							>
								Review Order
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				)}

				{/* Step 4: Confirmation */}
				{step === 'confirmation' && (
					<div className="space-y-6">
						<h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
							Order Confirmation
						</h2>

						{/* Address summary */}
						<div className="bg-zinc-50 rounded-xl p-5">
							<h3 className="font-semibold text-zinc-900 mb-2">
								Shipping Address
							</h3>
							<p className="text-sm text-zinc-600">
								{address?.fullName} &middot; {address?.phone}
							</p>
							<p className="text-sm text-zinc-600">
								{address?.street}, {address?.city}, {address?.province}{' '}
								{address?.postalCode}
							</p>
						</div>

						{/* Items */}
						<div className="space-y-3">
							<h3 className="font-semibold text-zinc-900">Order Items</h3>
							{items.map((item) => (
								<div
									key={item.productId}
									className="flex justify-between items-center text-sm"
								>
									<span className="text-zinc-600">
										{item.product.name} x{item.quantity}
									</span>
									<span className="font-medium text-zinc-900">
										Rp {(item.product.price * item.quantity).toLocaleString('id')}
									</span>
								</div>
							))}
						</div>

						<Separator />

						{/* Total */}
						<div className="space-y-1 text-sm">
							<div className="flex justify-between text-zinc-600">
								<span>Subtotal</span>
								<span>Rp {cartTotal.toLocaleString('id')}</span>
							</div>
							<div className="flex justify-between text-zinc-600">
								<span>
									Shipping ({shippingMethod?.courier} - {shippingMethod?.service})
								</span>
								<span>
									Rp {shippingMethod?.cost.toLocaleString('id')}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between font-bold text-zinc-900 text-lg">
								<span>Total</span>
								<span>Rp {grandTotal.toLocaleString('id')}</span>
							</div>
						</div>

						{/* Payment method summary */}
						{paymentMethod && (
							<div className="bg-zinc-50 rounded-xl p-5">
								<h3 className="font-semibold text-zinc-900 mb-2">Payment Method</h3>
								<p className="text-sm text-zinc-700 font-medium">{paymentMethod.name}</p>
								{paymentMethod.accountNumber && (
									<p className="text-sm text-zinc-500 mt-1">
										No. Rek: <span className="font-mono font-semibold">{paymentMethod.accountNumber}</span>{' '}
										a.n. {paymentMethod.accountName}
									</p>
								)}
								{paymentMethod.type === 'qris' && (
									<p className="text-sm text-zinc-500 mt-1">
										Scan QR menggunakan e-wallet atau mobile banking
									</p>
								)}
								<p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3 mt-3 border border-amber-200">
									💡 Setelah order dibuat, Anda dapat mengupload bukti pembayaran di halaman detail order.
								</p>
							</div>
						)}

						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 h-12 rounded-xl gap-2"
								onClick={() => setStep('payment')}
								disabled={createOrder.isPending}
							>
								<ChevronLeft className="size-4" />
								Back
							</Button>
							<Button
								className="flex-1 h-12 rounded-xl gap-2 bg-green-600 hover:bg-green-700"
								onClick={handlePlaceOrder}
								disabled={createOrder.isPending}
							>
								{createOrder.isPending ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Memproses...
									</>
								) : (
									<>
										<Check className="size-4" />
										Place Order
									</>
								)}
							</Button>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
