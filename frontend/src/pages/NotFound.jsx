import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f1ed] px-6 text-center">
      <h1 className="text-[10rem] font-bold text-[#c9945c] leading-none">404</h1>
      <h2 className="text-4xl font-bold text-[#2d2d2d] mt-6">
        Oops! Page Not Found
      </h2>
      <p className="text-[#3d3d3d] mt-4 max-w-xl">
        The page you’re looking for doesn’t exist or has been moved. 
        Maybe try going back to the homepage.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block bg-[#c9945c] hover:bg-[#b88650] text-white font-medium px-6 py-3 rounded-xl transition"
      >
        Go to Homepage
      </Link>

      {/* Optional illustration */}
      <img
        src= 'Nfound.png'
        alt="404 illustration"
        className="w-64 h-64 mt-10 opacity-70"
      />
    </div>
  );
}

export default NotFound;
