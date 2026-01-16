import { useContext, useState } from "react";
import { ASSETS } from "../src/Global/GlobalImages.jsx";
import { useStore } from "../src/Context/UseStore.jsx";

const Navbar = () => {
  const { theme, themeChanger, sun, moon } = useStore(useContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`relative flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16 shadow-md ${
        theme === "dark"
          ? "bg-linear-to-r from-indigo-400 to-indigo-900"
          : "bg-white"
      }`}
    >
      {/* Logo */}
      <div className="img-logo h-10 w-10 sm:h-12 sm:w-12 flex items-center">
        <img
          src={ASSETS.logo}
          alt=""
          className="animate-[spin_6s_linear_infinite] w-full h-full object-contain"
          title="Matrix Web Solutions"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="nav-items hidden lg:flex items-center gap-4 xl:gap-8">
        {["Home", "Our Work", "Projects", "Contact", "About", "Blog"].map(
          (item) => (
            <li
              key={item}
              className={`relative group font-roboto ${
                theme === "dark" ? "text-indigo-100" : "text-indigo-600"
              } cursor-pointer 
              text-base xl:text-lg ${
                theme === "dark" ? "hover:text-white" : "hover:text-indigo-500"
              }`}
            >
              {item}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-0 
                ${
                  theme === "dark" ? "bg-white" : "bg-indigo-500"
                } transition-all duration-300 group-hover:w-full`}
              ></span>
            </li>
          )
        )}
      </ul>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <div
          className={`themetoggle-icon w-fit h-auto ${
            theme === "dark"
              ? "bg-white shadow-white border border-black shadow-md"
              : "bg-white shadow-black border shadow-md"
          } rounded-full p-2 cursor-pointer`}
          onClick={themeChanger}
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <img src={moon} alt="Moon" className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <img src={sun} alt="Sun" className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>

        {/* Hamburger Button (Mobile/Tablet) */}
        <button
          className={`lg:hidden p-2 rounded-md border shadow-md ${
            theme === "dark"
              ? "bg-white border-black shadow-white"
              : "bg-white border-gray-200 shadow-black"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {/* Icon */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center gap-1">
            <span
              className={`block h-0.5 w-full ${
                theme === "dark" ? "bg-indigo-900" : "bg-indigo-600"
              } transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full ${
                theme === "dark" ? "bg-indigo-900" : "bg-indigo-600"
              } transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-full ${
                theme === "dark" ? "bg-indigo-900" : "bg-indigo-600"
              } transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${
          theme === "dark"
            ? "bg-linear-to-r from-indigo-400 to-indigo-900"
            : "bg-white"
        }`}
      >
        <ul className="flex flex-col gap-2 py-4 px-4 sm:px-6">
          {["Home", "Our Work", "Projects", "Contact", "About", "Blog"].map(
            (item) => (
              <li
                key={item}
                onClick={() => setIsOpen(false)}
                className={`relative group font-roboto ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-600"
                } cursor-pointer 
                text-sm sm:text-base ${
                  theme === "dark"
                    ? "hover:text-white"
                    : "hover:text-indigo-500"
                }`}
              >
                {item}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-0 
                  ${
                    theme === "dark" ? "bg-white" : "bg-indigo-500"
                  } transition-all duration-300 group-hover:w-full`}
                ></span>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
