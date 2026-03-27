import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">
        Welcome to CyberShield
      </h1>

      <p className="max-w-xl text-gray-600 mb-6">
        CyberShield helps you report cyber incidents, detect scams using AI,
        and learn about cybersecurity threats.
      </p>

      <div className="space-x-4">
        <Link to="/ai" className="btn btn-primary">Try AI Detector</Link>
        <Link to="/articles" className="btn btn-primary">Explore Knowledge Hub</Link>
      </div>

      <div className="mt-6 space-x-4">
        <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        <Link to="/register" className="text-indigo-600 font-semibold">Register</Link>
      </div>
    </div>
  );
}
