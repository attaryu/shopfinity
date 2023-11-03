import Carousel from './Carousel';

export default function Home() {
  const ImageSliderLinks = ['/slider/1.avif', '/slider/2.avif', '/slider/3.avif', '/slider/4.avif', '/slider/5.avif'];
  
  return (
    <div className="p-10 h-screen">
      <header className="px-5">
        <Carousel dots arrows>
          {ImageSliderLinks.map((url) => (
            <div key={url} className="px-1 pb-2 h-96 w-full">
              <img src={url} alt="" className="h-full w-full object-cover rounded-lg" />
            </div>
          ))}
        </Carousel>
      </header>
      <main>
      </main>
    </div>
  );
}