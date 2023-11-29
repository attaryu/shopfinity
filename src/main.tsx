import { render } from 'preact';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/Home';
import MyCart from '@/pages/MyCart';
import NotFound from '@/pages/NotFound';
import Product from '@/pages/Product';
import Verification from '@/pages/Verification';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

import ResetScroll from '@/components/ResetScroll';
import useResize from '@/hooks/useResize';

import './index.css';

function App() {
  const isSmall = useResize(900);

  if (isSmall) {
    return (
      <main className="flex items-center justify-center flex-col h-[100vh]">
        <i className="fi fi-rs-tools grid place-items-center text-7xl" />

        <h1 className="font-bold text-xl mt-8 mb-2">Under Development</h1>

        <p className="text-center text-sm w-3/4">Saat ini Shopfinity tidak mendukung tampilan mobile, nantikan update berikutnya.</p>
      </main>
    );
  }
  
  return (
    <BrowserRouter>
      <Navbar />
      <ResetScroll>
        <div className="py-28 px-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<Verification />} />
            <Route path="/sign-up" element={<Verification />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/my-cart" element={<MyCart />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </ResetScroll>
      <Footer />
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app')!);
