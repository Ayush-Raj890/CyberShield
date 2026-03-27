import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";
import { sanitizeObject } from "../../utils/sanitizer";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const sanitized = sanitizeObject(form);
      const { data } = await API.post("/auth/register", sanitized);

      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Registration successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form className="card w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4 font-semibold">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="input mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="input mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input mb-3"
          onChange={handleChange}
        />

        <button className="btn btn-primary w-full">
          {loading ? "Processing..." : "Register"}
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
