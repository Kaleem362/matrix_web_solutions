import React from "react";
import { ASSETS } from "../src/Global/GlobalImages.jsx";
import Input from "../Elements/Input.jsx";
import Button from "../Elements/Button.jsx";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-around h-16 shadow-md bg-white">
      <div className="img-logo h-12 w-12">
        <img
          src={ASSETS.logo}
          alt=""
          className="animate-[spin_6s_linear_infinite]"
        />
      </div>

      <ul className="nav-items flex gap-2 xs:gap-1 md:gap-4 lg:gap-6 xl:gap-8 items-center justify-around">
        {["Home", "Our Work", "Projects", "Contact", "About", "Blog"].map(
          (item) => (
            <li
              key={item}
              className="relative group text-indigo-600 cursor-pointer 
                xs:text-xs md:text-lg lg:text-xl xl:text-lg hover:text-indigo-500"
            >
              {item}
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-0 
                   bg-indigo-500 transition-all duration-300 
                   group-hover:w-full"
              ></span>
            </li>
          )
        )}
      </ul>

      <div className="search-input flex items-center xs:gap-1 md:gap-1 lg:gap-2 xl:gap-3">
        <Input
          type="text"
          style="outline-none border-1 border-[#8CA9FF] focus:border-2 active:border-[#8CA9FF] bg-white  py-1 px-3 rounded-lg text-black"
          placeholder="search here"
        />
        <Button
          type="button"
          style="bg-indigo-400 text-white py-[5px] rounded-full hover:bg-indigo-500 px-4 ml-2 cursor-pointer"
          value="Search"
        ></Button>
      </div>
    </nav>
  );
};

export default Navbar;
