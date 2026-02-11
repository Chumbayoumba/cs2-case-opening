export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to CS2 Case Opening</h1>
        <p className="text-xl text-gray-400">
          Open cases and win amazing CS2 skins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-blue-500 mb-2">1000+</div>
          <div className="text-gray-400">Cases Opened</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
          <div className="text-gray-400">Active Users</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-yellow-500 mb-2">$50K+</div>
          <div className="text-gray-400">Total Value</div>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/cases"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
        >
          Browse Cases
        </a>
      </div>
    </div>
  );
}
