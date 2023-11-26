import { useEffect } from 'preact/hooks';
import { useParams } from 'react-router-dom';

import NotFound from '@/pages/NotFound';

import useCartLogic from '@/hooks/useCartLogic';
import { getAllCategory, getProducts } from '@/utils/dataFetching';

export default function Product() {
  const { productId } = useParams();
  const data = getProducts(1, (item) => item.id === Number(productId))[0];

  if (!data) {
    return <NotFound />
  }
  
  const { inCart, cartHandler } = useCartLogic(data);
  const categories = getAllCategory();

  useEffect(() => {
    document.title = `Detail Product - ${data.name}`;
  }, []);

  return (
    <main className="flex gap-14 items-center">
      <img src={data.image} alt={data.name} className="w-1/3 h-[75vh] object-cover rounded-md overflow-clip relative before:content-['Image_not_found'] before:absolute before:w-full before:h-full before:bg-zinc-200 before:top-0 before:left-0 before:grid before:place-items-center before:text-zinc-500 before:text-sm" />

      <div className="w-full">
        <div className="flex gap-4">
          {data.category.map((id) => (
            <button key={id} className="px-3 py-1 font-semibold outline outline-1 outline-zinc-900 rounded-md">
              {categories.find((item) => item.id === id)!.name}
            </button>
          ))}
        </div>
        
        <h1 className="text-3xl font-bold mt-5">{data.name}</h1>

        <p className="mt-6 flex items-center gap-3">
          <i className="fi fi-rs-shop grid place-items-center p-2 text-xl bg-zinc-900 text-white rounded-full" />
          <span className="text-lg font-semibold text-zinc-900">{data.shop}</span>
        </p>

        <p className="border-[1px] rounded-md border-zinc-900 p-2.5 my-8">{data.description}</p>

        <div className="flex gap-4 items-center">
          {data.isDiscount && (
            <div className="flex gap-3 items-center border-2 border-red-600 text-red-600 rounded-md w-fit px-3 py-2">
              <i className="fi fi-rs-tags text-2xl grid place-items-center" />
              <p className="font-semibold text-xl">Rp. {data.discountPrice!.toLocaleString('id')}</p>
            </div>
          )}

          <p className={`${data.isDiscount ? 'text-lg line-through text-zinc-600' : 'text-2xl font-semibold'}`}>
            Rp. {data.price.toLocaleString('id')}
          </p>

          {data.isDiscount && (
            <p className="text-2xl">-{data.discount}%</p>
          )}
        </div>

        <div className="w-1/2 flex gap-4 mt-14">
          <button className="w-full bg-zinc-900 text-white rounded-md py-2 text-xl">Beli</button>

          <button
            className="grid place-items-center px-3 border-[1px] rounded-md border-zinc-900"
            onClick={cartHandler}
          >
            <i className={`fi ${inCart ? 'fi-ss-shopping-cart-check' : 'fi-rs-shopping-cart-add'} grid place-items-center`} />
          </button>
        </div>
      </div>
    </main>
  )
}