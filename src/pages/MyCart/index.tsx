import { useEffect, useId, useState } from 'preact/hooks';

import Link from '@/components/Link';
import { getProducts } from '@/utils/dataFetching';
import { useStore, Cart } from '@/stores/index';
import { useNavigate } from 'react-router-dom';

export default function MyCart() {
  const [coupon, setCoupon] = useState(0);
  const id = useId();

  const { cart, removeAllProduct, calculate } = useStore((item) => item);
  const [totalWithCoupon, setTotalWithCoupon] = useState(cart.total);
  const cartLength = cart.data.length;
  const { total } = cart;

  useEffect(() => {
    calculate();
    setTotalWithCoupon(total - coupon * total);
  }, [coupon, cartLength, total, ...cart.data]);

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

          <section className="w-1/4 border-[1px] border-zinc-900 rounded-lg p-5 h-fit">
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
      ) : (
        <p className="mt-2 h-[5.15rem]">
          Tidak ada barang apapun di keranjangmu,{' '}
          <Link to="/">belanja sekarang!</Link>
        </p>
      )}
    </main>
  );
}

function Label({
  title,
  content,
  label
}: Readonly<{
  title: string,
  label: string,
  content: string,
}>) {
  return (
    <div className="w-full">
      <p className="font-semibold text-lg">{title}</p>

      <div className="flex items-center border-[1px] border-zinc-900 rounded-md overflow-clip mt-1.5">
        <span className="p-2 bg-zinc-900 text-white font-medium">{label}</span>
        <p className="px-2">{content}</p>
      </div>
    </div>
  );
}

function Card({ id, quantity }: Readonly<Omit<Cart, 'price'>>) {
  const {
    image,
    price,
    name,
    isDiscount,
    discount,
    discountPrice,
  } = getProducts(1, (item) => item.id === id)[0];
  const {
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
  } = useStore();
  const navigate = useNavigate();

  return (
    <li className="w-full flex p-3 bg-zinc-100 rounded-lg">
      <img src={image} alt={name} className="w-24 overflow-clip aspect-square rounded-lg" />

      <div className="ml-5 flex flex-col justify-center gap-3 w-full">
        <h2 className="font-semibold text-xl overflow-hidden leading-6 h-6 w-full before:w-1/5 before:h-6 before:bg-gradient-to-l before:from-zinc-100 before:to-transparent relative before:bottom-0 before:right-0 before:absolute cursor-pointer" onClick={() => navigate(`/product/${id}`)}>{name}</h2>

        <div className="flex gap-4 items-center">
          {isDiscount && <p className="py-0.5 px-1.5 border-2 font-semibold text-red-500 border-red-500 rounded-md">Rp. {discountPrice!.toLocaleString('id')}</p>}
          <p className={isDiscount ? 'text-sm line-through text-zinc-500' : 'font-medium' }>Rp. {price.toLocaleString('id')}</p>
          {isDiscount && <p className="font-semibold">{discount}%</p>}
        </div>
      </div>

      <div className="mr-2.5 flex items-center gap-5">
        <div className="h-12 flex items-center gap-5">
          <button
            className="h-full text-xl px-3 rounded-tl-lg rounded-bl-lg bg-zinc-900 text-white"
            onClick={() => decreaseQuantity(id)}
          >
            -
          </button>

          <span className="text-lg">{quantity}</span>

          <button
            className="h-full text-xl px-3 rounded-tr-lg rounded-br-lg bg-zinc-900 text-white"
            onClick={() => increaseQuantity(id)}
          >
            +
          </button>
        </div>

        <button
          className="border-[1px] border-red-500 h-12 aspect-square rounded-md"
          onClick={() => removeProduct(id)}
        >
          <i className="fi fi-rs-trash text-red-500 grid place-items-center text-xl" />
        </button>
      </div>
    </li>
  );
}
