import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;