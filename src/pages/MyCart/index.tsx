import { useId } from 'preact/hooks';

import { Product } from '@/data/index';
import { getProducts } from '@/utils/dataFetching';

export default function MyCart() {
  const data = getProducts(5);
  const id = useId();
  
  return (
    <main>
      <h1 className="text-4xl font-bold">Cart</h1>

      <div className="w-full flex gap-14 mt-2">
        <section className="w-3/4">
          <div className="flex justify-between">
            <p className="text-lg text-zinc-700">
              Ada {data.length} produk di keranjang kamu, jangan lupa checkout ya!
            </p>

            <button className="text-red-600">Delete All</button>
          </div>

          <ul className="flex flex-col gap-5 mt-6">
            {data.map((item) => <Card key={item.id} {...item} />)}
          </ul>
        </section>

        <section className="w-1/4 border-[1px] border-zinc-900 rounded-lg p-5 h-fit">
         <Label title="Total" label="Rp" content="300.000" />

          <label htmlFor={id} className="my-5 block">
            <p className="font-semibold text-lg">Kupon</p>
            <select className="w-full outline outline-1 outline-zinc-900 p-2 mt-2 rounded-md">
              <option selected disabled>Pilih Kupon</option>
              <option value="10">K13PO</option>
              <option value="20">Q09XP</option>
              <option value="40">CS98Y</option>
              <option value="5">5R35S</option>
            </select>
          </label>

         <Label title="Bayar" label="Rp" content="300.000" />

         <button className="bg-zinc-900 text-white w-full py-2.5 rounded-md mt-10">Checkout</button>
        </section>
      </div>
    </main>
  )
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
  )
}

function Card({ id, name, image, price, discount, discountPrice, isDiscount }: Readonly<Product>) {
  return (
    <li className="w-full flex p-3 bg-zinc-100 rounded-lg">
      <img src={image} alt={name} className="w-24 overflow-clip aspect-square rounded-lg" />

      <div className="ml-5 flex flex-col justify-center gap-3 w-full">
        <h2 className="font-semibold text-xl overflow-hidden leading-6 h-6 w-full before:w-1/5 before:h-6 before:bg-gradient-to-l before:from-zinc-100 before:to-transparent relative before:bottom-0 before:right-0 before:absolute">{name}</h2>

        <div className="flex gap-4 items-center">
          {isDiscount && <p className="py-0.5 px-1.5 border-2 font-semibold text-red-500 border-red-500 rounded-md">Rp. {discountPrice}</p>}
          <p className={isDiscount ? 'text-sm line-through text-zinc-500' : 'font-medium' }>Rp. {price}</p>
          {isDiscount && <p className="font-semibold">{discount}%</p>}
        </div>
      </div>

      <div className="mr-2.5 flex items-center gap-5">
        <div className="h-12 flex items-center gap-5">
          <button className="h-full text-xl px-3 rounded-tl-lg rounded-bl-lg bg-zinc-900 text-white">-</button>

          <span className="text-lg">0</span>

          <button className="h-full text-xl px-3 rounded-tr-lg rounded-br-lg bg-zinc-900 text-white">+</button>
        </div>

        <button className="border-[1px] border-red-500 h-12 aspect-square rounded-md">
          <i className="fi fi-rs-trash text-red-500 grid place-items-center text-xl" />
        </button>
      </div>
    </li>
  )
}
