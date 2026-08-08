import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[70vh] bg-hub-cream flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="space-y-6">
        <span className="material-symbols-outlined text-8xl text-hub-yellow animate-bounce">
          error
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-hub-navy font-display-lg">
          Page Not Found (404)
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Let's get you back on track!
        </p>
        <div>
          <Link
            to="/"
            className="btn-black-yellow px-8 py-3.5 rounded-full font-extrabold shadow-md inline-flex items-center gap-2 active-press text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
