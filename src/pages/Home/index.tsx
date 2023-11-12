import { Link } from 'react-router-dom';

import Carousel from './Carousel';
import CategoryTag from './CategoryTag';
import Section from './Section';

import { getAllCategory, getProducts } from '@/utils/dataFetching';

export default function Home() {
  const ImageSliderLinks = ['/slider/1.avif', '/slider/2.avif', '/slider/3.avif', '/slider/4.avif', '/slider/5.avif'];
  const categories = getAllCategory();
  
  return (
    <>
      <header>
        <Carousel dots>
          {ImageSliderLinks.map((url) => (
            <div key={url} className="px-1 pb-2 h-[28rem] w-full">
              <img src={url} alt="" className="h-full w-full object-cover rounded-lg" />
            </div>
          ))}
        </Carousel>

        <div className="mt-14 w-full flex justify-center gap-4">
          {categories.map((category) => <CategoryTag key={category.id} {...category} />)}
        </div>
      </header>

      <main className="mt-28 flex flex-col gap-32">
        <Section title="Hot Sale" data={getProducts(10)} />

        <section>
          <h1 className="text-center text-4xl mb-14 font-bold">Fashion Pilihan</h1>

          <Carousel dots>
            {getProducts(5).map((item) => (
              <div key={item.id} className="w-full">
                <div className="flex h-80 w-2/3 m-auto p-10 rounded-md bg-zinc-200 gap-10">
                  <div className="w-full flex flex-col">
                    <h2 className="text-3xl font-bold">{item.name}</h2>

                    <p className="mt-5 text-xl font-semibold text-zinc-800">Rp {item.price.toLocaleString('id')}</p>

                    <div className="mt-auto flex gap-3 h-9">
                      <Link
                        to={`/product/${item.id}`}
                        className="bg-zinc-950 text-white grid place-items-center w-1/2 rounded-md "
                      >
                        Lebih Lengkap
                      </Link>
                      <button className="h-full aspect-square border-[1px] border-zinc-950 grid place-items-center rounded-md">
                        <i className="fi fi-rs-shopping-cart-add grid place-items-center" />
                      </button>
                    </div>
                  </div>

                  <img src={item.image} alt={item.name} className="w-1/2 h-full object-cover rounded-lg" />
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        <Section title="Sepatu Terlaris" data={getProducts(10, (item) => item.category.includes(4))} />
        <Section title="Tas Terbaru" data={getProducts(10, (item) => item.category.includes(5))} />
      </main>
    </>
  );
}