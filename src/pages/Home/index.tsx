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
        <Carousel dots arrows>
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

      <main className="mt-28 flex flex-col gap-28">
        <Section title="Hot Sale" data={getProducts(10)} />
        <Section title="Sepatu Terlaris" data={getProducts(10, 4)} />
        <Section title="Tas Terbaru" data={getProducts(10, 5)} />
      </main>
    </>
  );
}