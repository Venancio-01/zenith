import { useGlobalStore } from '../store';

export const Counter = () => {
  const count = useGlobalStore((state) => state.count);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-900 dark:text-white">
        Count from React: {count}
      </p>
    </div>
  );
};
