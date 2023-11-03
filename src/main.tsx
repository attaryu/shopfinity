import { render } from 'preact';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<div>Home</div>} />
        <Route path='/my-cart' element={<div>My cart</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app')!);
