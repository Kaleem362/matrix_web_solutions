import { useContext, useEffect, useState } from "react";
import { ASSETS } from "../src/Global/GlobalImages.jsx";
import { useStore } from "../src/Context/UseStore.jsx";

const Navbar = () => {
  const { theme, themeChanger, sun, moon } = useStore(useContext);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = ["Home", "Our Work", "Projects", "Contact", "About", "Blog"];

  // Close mobile menu on resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`shadow-md ${
          theme === "dark"
            ? "bg-linear-to-r from-indigo-400 to-indigo-900"
            : "bg-white"
        }`}
      >
        {/* Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="img-logo h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center">
              <img
                src={ASSETS.logo}
                alt="Matrix Web Solutions"
                className="animate-[spin_6s_linear_infinite] w-full h-full object-contain"
                title="Matrix Web Solutions"
              />
            </div>

            {/* Brand text (hidden on very small screens) */}
            <div className="hidden sm:block leading-tight">
              <p
                className={`font-roboto font-semibold text-sm sm:text-base ${
                  theme === "dark" ? "text-white" : "text-indigo-700"
                }`}
              >
                Matrix Web Solutions
              </p>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-500"
                }`}
              >
                Digital Services Agency <span className="text-[8px ]">1.0.1</span>
              </p>
            </div>
          </div>

          {/* Center: Desktop Menu */}
          <ul className="nav-items hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((item) => (
              <li
                key={item}
                className={`relative group font-roboto cursor-pointer text-[15px] xl:text-base ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-700"
                } ${theme === "dark" ? "hover:text-white" : "hover:text-indigo-500"}`}
              >
                {item}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-0 ${
                    theme === "dark" ? "bg-white" : "bg-indigo-500"
                  } transition-all duration-300 group-hover:w-full`}
                ></span>
              </li>
            ))}
          </ul>

          {/* Right: CTA + Theme + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CTA (Desktop only) */}
            <button
              className={`hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-full font-roboto font-semibold text-sm transition-all duration-200 ${
                theme === "dark"
                  ? "bg-white text-indigo-900 hover:bg-transparent hover:shadow-sm hover:shadow-white hover:text-white active:scale-95 transition-transform duration-75"
                  : "bg-indigo-700 text-white hover:bg-white hover:border hover:border-indigo-900 border-white hover:text-indigo-900 hover:text-shadow-indigo-900"
              }`}
            >
              Get a Quote
            </button>

            {/* Theme Toggle */}
            <button
              className={`themetoggle-icon w-fit h-auto rounded-full p-2 cursor-pointer transition-all duration-200 `}
              onClick={themeChanger}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <img src={sun} alt="Sun" className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <img src={moon} alt="Moon" className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* Hamburger Button (Mobile/Tablet) */}
            <button
              className={`lg:hidden p-2 rounded-lg border shadow-md transition-all ${
                theme === "dark"
                  ? "bg-white border-black/20 shadow-white/20"
                  : "bg-white border-gray-200 shadow-black/20"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
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
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } ${
            theme === "dark"
              ? "bg-linear-to-r from-indigo-400 to-indigo-900"
              : "bg-white"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
            <ul className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <li
                  key={item}
                  onClick={() => setIsOpen(false)}
                  className={`font-roboto cursor-pointer text-sm sm:text-base ${
                    theme === "dark" ? "text-indigo-100" : "text-indigo-700"
                  } ${
                    theme === "dark"
                      ? "hover:text-white"
                      : "hover:text-indigo-500"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Mobile CTA */}
            <div className="mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full py-3 rounded-lg font-roboto font-semibold transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-white text-indigo-800 hover:bg-indigo-100"
                    : "bg-indigo-700 text-white hover:bg-indigo-800"
                }`}
              >
                Get
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
