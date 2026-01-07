import React from "react";

const ThemeToggler = () => {
  return (
    <label class="relative inline-flex items-center cursor-pointer">
      <input class="sr-only peer" type="checkbox" />
      <div class="w-13 h-6 rounded-full bg-linear-to-r from-indigo-700 to-white-400 peer-checked:from-white-400 peer-checked:to-black transition-all duration-500 after:content-['☀️'] after:absolute after:top-0.5 after:left-1  after:rounded-full after:h-5 after:w-5 after:flex after:items-center checked:after:bg-black after:justify-center after:transition-all after:duration-500 peer-checked:after:translate-x-6 peer-checked:after:content-['🌙'] after:shadow-md after:text-lg"></div>
    </label>
  );
};

export default ThemeToggler;
