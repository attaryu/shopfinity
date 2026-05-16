import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Download,
	QrCode,
	ShoppingBag,
	Upload,
	X,
} from 'lucide-react';
import { Button } from '~/shared/components/shadcn/ui/button';
import { Input } from '~/shared/components/shadcn/ui/input';
import { Label } from '~/shared/components/shadcn/ui/label';
import { Separator } from '~/shared/components/shadcn/ui/separator';
import { Textarea } from '~/shared/components/shadcn/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '~/shared/components/shadcn/ui/dialog';
import { useCart, useCartTotal } from '~/features/cart/hooks/use-cart';
import { useCartStore } from '~/features/cart/store/cart-store';
import { useOrderStore } from '~/features/admin/store/order-store';
import { useCheckoutStore } from '../store/checkout-store';
import { getCities, getShippingMethods } from '../data/shipping-methods';
import { getPaymentMethods } from '../data/payment-methods';
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
	const items = useCart();
	const cartTotal = useCartTotal();
	const clearCart = useCartStore((s) => s.clearCart);
	const navigate = useNavigate();

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

	const placeOrder = useOrderStore((s) => s.placeOrder);

	const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(
		shippingMethod,
	);
	const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
		paymentMethod,
	);
	const [selectedCity, setSelectedCity] = useState(address?.city || '');
	const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
	const [proofPreview, setProofPreview] = useState<string | null>(null);
	const [qrisDialogOpen, setQrisDialogOpen] = useState(false);
	const [missingProof, setMissingProof] = useState(false);
	const proofSectionRef = useRef<HTMLDivElement>(null);

	const shippingOptions = selectedCity
		? getShippingMethods(selectedCity)
		: [];
	const paymentOptions = getPaymentMethods();
	const cities = getCities();

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

	function handleProofUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPaymentProofFile(file);
			setProofPreview(URL.createObjectURL(file));
			setMissingProof(false);
		}
	}

	function clearProof() {
		setPaymentProofFile(null);
		if (proofPreview) URL.revokeObjectURL(proofPreview);
		setProofPreview(null);
	}

	function handlePlaceOrder() {
		if (!address || !shippingMethod || !paymentMethod) return;

		if (!proofPreview && !paymentProofFile) {
			setMissingProof(true);
			toast.error('Please upload your payment proof first', {
				description: 'Payment proof is required to complete your order.',
			});
			proofSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		const order = placeOrder({
			items: items.map((i) => ({
				productId: i.productId,
				name: i.name,
				price: i.price,
				quantity: i.quantity,
				imageUrl: i.imageUrl,
			})),
			subtotal: cartTotal,
			shippingMethod,
			paymentMethod,
			address,
			customerName: address.fullName,
			customerEmail: '',
		});

		if (proofPreview) {
			useOrderStore.getState().setPaymentProof(order.id, proofPreview);
		}

		clearCart();
		resetCheckout();

		toast.success('Order placed successfully!', {
			description: `Your order #${order.orderNumber} has been placed. Please complete payment.`,
		});

		navigate(`/checkout/success?order=${order.id}`);
	}

	function handleDownloadQR() {
		const link = document.createElement('a');
		link.href = '/images/qris.png';
		link.download = 'qris-shopfinity.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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
										{opt.type === 'qris' ? 'QRIS' : 'Bank'}
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
										{item.name} x{item.quantity}
									</span>
									<span className="font-medium text-zinc-900">
										Rp {(item.price * item.quantity).toLocaleString('id')}
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

						{/* QRIS Payment Instructions */}
						{paymentMethod?.type === 'qris' && (
							<div className="bg-white border-2 border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-5">
								<div className="flex items-center gap-2.5">
									<div className="size-10 rounded-xl bg-zinc-900 flex items-center justify-center">
										<QrCode className="size-5 text-white" />
									</div>
									<div>
										<h3 className="font-bold text-zinc-900 text-lg">
											QRIS Payment
										</h3>
										<p className="text-xs text-zinc-500">
											Scan menggunakan e-wallet atau mobile banking
										</p>
									</div>
								</div>

								<ol className="space-y-3 text-sm text-zinc-700">
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">1</span>
										<span>Buka aplikasi <strong>e-wallet</strong> (GoPay, OVO, DANA, ShopeePay) atau <strong>mobile banking</strong> yang mendukung QRIS.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">2</span>
										<span>Pilih menu <strong>Scan QR</strong> atau <strong>Bayar</strong>.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">3</span>
										<span>Scan QR code di bawah ini.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">4</span>
										<span>Verifikasi nominal pembayaran: <strong>Rp {grandTotal.toLocaleString('id')}</strong>.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">5</span>
										<span>Konfirmasi pembayaran dan <strong>simpan bukti pembayaran</strong>.</span>
									</li>
								</ol>

								<div className="flex flex-col items-center gap-3 pt-2">
									<button
										type="button"
										onClick={() => setQrisDialogOpen(true)}
										className="cursor-pointer group"
									>
										<img
											src="/images/qris.png"
											alt="QRIS QR Code"
											className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl border-2 border-zinc-200 group-hover:border-zinc-400 transition-colors"
										/>
										<p className="text-xs text-zinc-400 mt-1.5 group-hover:text-zinc-600 transition-colors">
											Click to enlarge
										</p>
									</button>

									<Button
										variant="outline"
										size="sm"
										className="gap-2"
										onClick={handleDownloadQR}
									>
										<Download className="size-4" />
										Download QR
									</Button>
								</div>

								{/* QR Enlarge Dialog */}
								<Dialog open={qrisDialogOpen} onOpenChange={setQrisDialogOpen}>
									<DialogContent className="sm:max-w-md p-6">
										<DialogTitle className="text-center">
											Scan QRIS
										</DialogTitle>
										<div className="flex flex-col items-center gap-4">
											<img
												src="/images/qris.png"
												alt="QRIS QR Code"
												className="w-full max-w-xs rounded-xl"
											/>
											<p className="text-sm text-zinc-500 text-center">
												Scan menggunakan e-wallet atau mobile banking Anda
											</p>
											<Button
												variant="outline"
												size="sm"
												className="gap-2"
												onClick={handleDownloadQR}
											>
												<Download className="size-4" />
												Download QR
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						)}

						{/* Bank Transfer Instructions */}
						{paymentMethod?.type === 'bank_transfer' && (
							<div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 space-y-4">
								<div className="flex items-center gap-2.5">
									<div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center">
										<svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-blue-900 text-lg">
											{paymentMethod.name} Transfer
										</h3>
										<p className="text-xs text-blue-600">
											Transfer antar bank atau sesama bank
										</p>
									</div>
								</div>

								<ol className="space-y-3 text-sm text-blue-800">
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">1</span>
										<span>Buka aplikasi <strong>mobile banking</strong> atau kunjungi <strong>ATM</strong> terdekat.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">2</span>
										<span>Pilih menu <strong>Transfer</strong> &rarr; masukkan nomor rekening tujuan.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">3</span>
										<span>Masukkan nominal transfer: <strong>Rp {grandTotal.toLocaleString('id')}</strong>.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">4</span>
										<span>Periksa kembali detail dan <strong>konfirmasi pembayaran</strong>.</span>
									</li>
									<li className="flex gap-3">
										<span className="flex-shrink-0 size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">5</span>
										<span>
											<strong>Simpan bukti transfer</strong> dan unggah di bawah ini.
										</span>
									</li>
								</ol>

								<div className="bg-white rounded-xl p-4 border border-blue-200">
									<p className="text-sm font-semibold text-blue-900 mb-2">
										Rekening Tujuan
									</p>
									<div className="space-y-1.5 text-sm">
										<div className="flex justify-between">
											<span className="text-blue-600">Bank</span>
											<span className="font-medium text-blue-900">{paymentMethod.name}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-blue-600">No. Rekening</span>
											<span className="font-bold text-blue-900 font-mono">{paymentMethod.accountNumber}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-blue-600">Atas Nama</span>
											<span className="font-medium text-blue-900">{paymentMethod.accountName}</span>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Payment proof upload */}
						<div ref={proofSectionRef} className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-zinc-900">
									Upload Payment Proof *
								</h3>
								{proofPreview && (
									<Button
										variant="ghost"
										size="sm"
										className="text-xs text-zinc-500 hover:text-red-500"
										onClick={clearProof}
									>
										<X className="size-3 mr-1" />
										Remove
									</Button>
								)}
							</div>
							<div
								className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
									missingProof
										? 'border-red-300 bg-red-50'
										: 'border-zinc-300 hover:border-zinc-400'
								}`}
							>
								<input
									type="file"
									id="paymentProof"
									accept="image/*"
									className="hidden"
									onChange={handleProofUpload}
								/>
								<label
									htmlFor="paymentProof"
									className="cursor-pointer flex flex-col items-center gap-2"
								>
									{proofPreview ? (
										<img
											src={proofPreview}
											alt="Payment proof preview"
											className="max-h-48 rounded-lg object-contain"
										/>
									) : (
										<>
											<Upload className={`size-8 ${missingProof ? 'text-red-400' : 'text-zinc-400'}`} />
											<p className={`text-sm ${missingProof ? 'text-red-500 font-medium' : 'text-zinc-500'}`}>
												{missingProof
													? 'Please upload your payment proof!'
													: 'Click to upload payment receipt'}
											</p>
											<p className="text-xs text-zinc-400">
												JPG, PNG (max 5MB)
											</p>
										</>
									)}
								</label>
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 h-12 rounded-xl gap-2"
								onClick={() => setStep('payment')}
							>
								<ChevronLeft className="size-4" />
								Back
							</Button>
							<Button
								className="flex-1 h-12 rounded-xl gap-2 bg-green-600 hover:bg-green-700"
								onClick={handlePlaceOrder}
							>
								<Check className="size-4" />
								Place Order
							</Button>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
