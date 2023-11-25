import { useEffect, useId, useState } from 'preact/hooks';

import Link from '@/components/Link';
import Card from './Card';
import Label from './Label';

import { useStore } from '@/stores/index';

export default function MyCart() {
  const [coupon, setCoupon] = useState(0);
  const id = useId();

  const { cart, removeAllProduct, calculate } = useStore((item) => item);
  const [totalWithCoupon, setTotalWithCoupon] = useState(cart.total);
  const cartLength = cart.data.length;
  const { total } = cart;

  setTotalWithCoupon(total - coupon * total);

  useEffect(() => {
    document.title = 'My Cart';
  }, []);

  useEffect(() => {
    calculate();
  }, [...cart.data]);

  return (
    <main>
      <h1 className="text-4xl font-bold">Cart</h1>

      {cartLength ? (
        <div className="w-full flex gap-14 mt-2">
          <section className="w-3/4">
            <div className="flex justify-between">
              <p className="text-lg text-zinc-700">
                Ada {cartLength} produk di keranjang kamu, jangan lupa checkout ya!
              </p>

              <button className="text-red-600" onClick={removeAllProduct}>Delete All</button>
            </div>

            <ul className="flex flex-col gap-5 mt-6">
              {cart.data.map((item) => <Card key={item.id} {...item} />)}
            </ul>
          </section>

          <div className="w-1/4">
            <section className="w-full sticky top-36 border-[1px] border-zinc-900 rounded-lg p-5 h-fit">
              <Label title="Total" label="Rp" content={total.toLocaleString('id')} />

              <label htmlFor={id} className="my-5 block">
                <p className="font-semibold text-lg">Kupon</p>

                <select
                  id={id}
                  onChange={(e) => setCoupon(parseFloat((e.target as HTMLInputElement).value))}
                  value={coupon}
                  className="w-full outline outline-1 outline-zinc-900 p-2 mt-2 rounded-md"
                >
                  <option value="0" selected>Pilih Kupon</option>
                  <option value="0.1">Hemat 10%</option>
                  <option value="0.2">Hemat 20%</option>
                  <option value="0.35">Hemat 35%</option>
                  <option value="0.05">Hemat 5%</option>
                </select>
              </label>

              <Label title="Bayar" label="Rp" content={totalWithCoupon.toLocaleString('id')} />
              <button className="bg-zinc-900 text-white w-full py-2.5 rounded-md mt-10">Checkout</button>
            </section>
          </div>
        </div>
      ) : (
        <p className="mt-2 h-[5.15rem]">
          Tidak ada barang apapun di keranjangmu,{' '}
          <Link to="/">belanja sekarang!</Link>
        </p>
      )}
    </main>
  );
}
