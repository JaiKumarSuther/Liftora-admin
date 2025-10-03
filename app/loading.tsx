import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 font-medium">Loading...</p>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we load the application
        </p>
      </div>
    </div>
  );
}
