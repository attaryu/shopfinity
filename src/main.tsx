import { render } from 'preact';

import './index.css';

function App() {
  return (
    <div className="w-full h-screen grid place-items-center">
      <h1 className="text-3xl font-outfit font-extrabold">
        Hello World{' '}
        <i className="fi fi-rs-home" />
      </h1>
  </div>
  );
}

render(<App />, document.getElementById('app')!);
