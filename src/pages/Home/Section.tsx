import { Link } from 'react-router-dom';

import type { Product } from '@/data/index';
import useCartLogic from '@/hooks/useCartLogic';

type Props = Readonly<{
  title: string,
  data: Array<Product>,
}>;

export default function Section({ title, data }: Props) {  
  return (
    <section>
      <h1 className="text-4xl font-bold">{title}</h1>

      <ul className="mt-9 w-full overflow-x-scroll pb-12 grid grid-flow-col gap-10">
        {data.map((item) => <Card key={item.id} {...item} />)}
      </ul>
    </section>
  )
}

function Card({
  id,
  name,
  price,
  image,
  isDiscount,
  discount,
  discountPrice,
}: Readonly<Product>) {
  const { inCart, cartHandler } = useCartLogic({ id, isDiscount, price, discountPrice });

  return (
    <li className="w-52">
      <img src={image} alt={name} className="object-cover h-56" />

      <div className="flex flex-col mt-5 h-36">
        <h2
          className={`font-bold w-52 leading-5 ${name.length > 22 && 'h-10 relative overflow-hidden before:absolute before:bottom-0 before:right-0 before:bg-gradient-to-l before:from-white before:to-white/0 before:w-1/4 before:h-4'}`}
        >
          {name}
        </h2>

        <div className="mt-3 flex w-full justify-between items-center">
          {isDiscount && (
            <div className="flex gap-1 items-center border-[1px] border-red-600 text-red-600 rounded-lg w-fit px-1.5 py-0.5">
              <i className="fi fi-rs-tags text-sm grid place-items-center" />
              <p className="font-medium text-sm">{discountPrice!.toLocaleString('id')}</p>
            </div>
          )}

          <p className={isDiscount ? 'line-through text-xs text-zinc-500' : 'font-medium'}>Rp {price.toLocaleString('id')}</p>

          {isDiscount && <p>{discount}%</p>}
        </div>


        <div className="mt-auto flex gap-2">
          <Link
            to={`/product/${id}`}
            className="w-full grid place-items-center py-1.5 bg-zinc-950 text-white rounded-md"
          >
            Lebih Lengkap
          </Link>
          <button
            className="py-1.5 px-2 border-[1px] border-zinc-950 grid place-items-center rounded-md"
            onClick={cartHandler}
          >
            <i className={`fi ${inCart ? 'fi-ss-shopping-cart-check' : 'fi-rs-shopping-cart-add'} grid place-items-center`} />
          </button>
        </div>
      </div>
    </li>
  );
}
