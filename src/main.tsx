import { render } from 'preact';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/my-cart' element={<div>My cart</div>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app')!);
