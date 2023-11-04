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
      <div className="py-28 px-14">
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app')!);
