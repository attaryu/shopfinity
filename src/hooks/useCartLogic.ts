import { useEffect, useState } from 'preact/hooks';

import { useStore } from '@/stores/index';
import { Product } from '@/data/index';

export default function useCartLogic(
  {
    id,
    isDiscount,
    discountPrice,
    price,
  }: Pick<Product, 'id' | 'isDiscount' | 'discountPrice' | 'price'>
) {
  const { cart, addProduct, removeProduct } = useStore((item) => item);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const idInCart = cart.data.map((item) => item.id);

    setInCart(idInCart.includes(id));
  }, [...cart.data]);
  
  function cartHandler() {
    if (inCart)
      removeProduct(id);
    else
      addProduct(id, isDiscount ? discountPrice! : price);
  }

  return { inCart, cartHandler };
}