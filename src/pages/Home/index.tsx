import Carousel from './Carousel';

import { getAllCategory } from '@/utils/dataFetching';
import CategoryTag from './CategoryTag';

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

      <main>
        
      </main>
    </>
  );
}