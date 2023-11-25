import { render } from 'preact';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/Home';
import MyCart from '@/pages/MyCart';
import NotFound from '@/pages/NotFound';
import Product from '@/pages/Product';
import Verification from '@/pages/Verification';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
      <Footer />
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app')!);
