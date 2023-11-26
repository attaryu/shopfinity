import { useNavigate } from 'react-router-dom';

import { Cart, useStore } from '@/stores/index';
import { getProducts } from '@/utils/dataFetching';

export default function Card({ id, quantity }: Readonly<Omit<Cart, 'price'>>) {
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

  const detailProductHandler = () => navigate(`/product/${id}`);

  return (
    <li className="w-full flex p-3 bg-zinc-100 rounded-lg">
      <img src={image} alt={name} className="w-24 overflow-clip aspect-square rounded-lg relative before:content-['Image_not_found'] before:absolute before:w-full before:h-full before:bg-zinc-200 before:top-0 before:left-0 before:grid before:place-items-center before:text-zinc-500 before:text-xs before:p-2.5" />

      <div className="ml-5 flex flex-col justify-center gap-3 w-full">
        <h2 className="font-semibold text-xl overflow-hidden leading-6 h-6 w-full before:w-1/5 before:h-6 before:bg-gradient-to-l before:from-zinc-100 before:to-transparent relative before:bottom-0 before:right-0 before:absolute cursor-pointer" tabIndex={0} onClick={detailProductHandler} onKeyPress={detailProductHandler}>{name}</h2>

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
