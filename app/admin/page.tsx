"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("isloggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Login Function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "tara378581@gmail.com" && password === "22446688") {
      localStorage.setItem("isloggedIn", "true");
      setIsLoggedIn(true);
      Swal.fire("Success!", "Login successful", "success");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  // Logout Function
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("isloggedIn");
        setIsLoggedIn(false);
        Swal.fire("Logged Out!", "You have been logged out.", "success");
        router.push("/admin/login"); // Redirect to login page
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {!isLoggedIn ? (
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-800">
            Admin Login
          </h1>

          <div className="mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={email === "" || password === ""}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Admin</h1>
          <p className="mt-4 text-gray-600">You are logged in.</p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
