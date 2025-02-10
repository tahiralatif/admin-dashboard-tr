'use client'

import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-teal-400 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard!</h1>

      <Link href="/admin">
        <button className="transition duration-300 ease-in-out transform hover:scale-105 bg-white text-teal-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-500 hover:text-white">
          Go to Login Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Page;
