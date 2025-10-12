import { FaUser, FaGoogle } from "react-icons/fa";
import loginImage from "../assets/login-image.jpg";

const Login = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left side */}
      <div className="w-1/2 relative hidden md:flex items-center justify-center">
        <img
          src= "/assets/login-image.jpg"
          alt="Campus Learn"
          className="object-cover w-full h-full rounded-r-3xl"
        />
        <div className="absolute text-white text-center px-8">
          <h1 className="text-5xl font-bold mb-4">Campus Learn</h1>
          <p className="text-lg mb-6">Empowering learning through connection</p>
          <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-100 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
        <FaUser className="text-4xl text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-6">Login with Email</h2>

        <form className="w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 text-gray-500">or continue with</div>

        <button className="flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition">
          <FaGoogle className="text-red-500" /> Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
