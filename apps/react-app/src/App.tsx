import { Counter } from './components/Counter';
import './App.css';

function App() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          React Remote App
        </h1>
        <Counter />
      </div>
    </div>
  );
}

export default App;
