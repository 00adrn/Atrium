"use client"

import { redirect } from "next/navigation"

const Navbar = ({ headshot }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <a 
        className="cursor-pointer"
        onClick={() => redirect("/")}>
        <img src="/alpha.svg" alt="Logo" className="h-7 w-7" /></a>
        <img 
          src={headshot} 
          alt="Profile" 
          className="h-8 w-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
        />
      </div>
    </nav>
  );
}

export default Navbar