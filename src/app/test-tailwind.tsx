export default function TestTailwind() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-700 mb-6">
          This is a test component to verify if Tailwind CSS is working properly.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">Red</div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">Green</div>
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">Blue</div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">Yellow</div>
        </div>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          Test Button
        </button>
      </div>
    </div>
  );
} 