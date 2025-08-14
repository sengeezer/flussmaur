export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Streamwall
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          View multiple live streams in a customizable grid layout. 
          Perfect for monitoring multiple streams simultaneously.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Multi-Platform Support</h3>
          <p className="text-gray-600">
            Support for YouTube, Twitch, and other streaming platforms with automatic detection.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Real-time Collaboration</h3>
          <p className="text-gray-600">
            Share sessions with others and collaborate on stream layouts in real-time.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Responsive Grid</h3>
          <p className="text-gray-600">
            Customizable grid layouts that adapt to any screen size and viewing preference.
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Create Session
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors">
            Browse Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
