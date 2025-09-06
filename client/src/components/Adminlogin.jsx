// src/components/AdminLogin.jsx
import React, { useState } from "react";
import axiosInstance from "./axiosInstance"; // adjust path if needed
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/login", { email, password });
      // console.log("Login success:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      onLoginSuccess(); 
    } catch (err) {
      setError("Invalid credentials ❌");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-100"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Login to Access</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-2 rounded-lg hover:from-orange-500 hover:to-orange-600 transition"
        >
          Login
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
