import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const workerRef = useRef(null);

  const stopWorker = () => {
    if (workerRef.current) {
      if (typeof workerRef.current.terminate === 'function') {
        workerRef.current.terminate();
      }
      workerRef.current = null;
    }
  };

  useEffect(() => stopWorker, []);

  const handleCalculate = () => {
    stopWorker();
    setResult('Calculating...');

    const worker = new Worker('/worker.js');
    workerRef.current = worker;

    worker.onmessage = (event) => {
      if (workerRef.current !== worker) return;
      setResult(`Result: ${event.data}`);
      stopWorker();
    };

    worker.onerror = () => {
      if (workerRef.current !== worker) return;
      setResult('Error');
      stopWorker();
    };

    worker.postMessage({ data: Number(value) });
  };

  return (
    <div className="app">
      <h1>Fibonacci 🌀</h1>
      <input
        type="number"
        placeholder="Insert a number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleCalculate}>Calculate</button>
      <div className="result" data-testid="result">
        {result}
      </div>
    </div>
  );
}

export default App;
