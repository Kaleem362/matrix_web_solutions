import { useContext, useEffect, useState } from "react";
import { useStore } from "../src/Context/UseStore.jsx";

const Navbar = () => {
  const { theme, themeChanger, sun, moon, setIsQuoteOpen, logo, setTheme } = useStore(useContext);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Our Work", id: "ourwork" },
    { label: "Projects", id: "ourwork" },
    { label: "Contact", id: "contact" },
    { label: "About", id: "process" },
    { label: "Blog", id: "faq" },
  ];

  // Close mobile menu on resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
  }, [setTheme]);

  const handleNavClick = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        className={`shadow-md supports-[backdrop-filter]:backdrop-blur ${
          theme === "dark"
            ? "bg-linear-to-r from-indigo-400 to-indigo-900"
            : "bg-white"
        }`}
      >
        {/* Container */}
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 min-[475px]:h-16 min-[475px]:px-4 sm:px-6 lg:px-10">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-2 min-[475px]:gap-3">
            <div className="img-logo flex h-9 w-9 items-center justify-center min-[475px]:h-10 min-[475px]:w-10 sm:h-11 sm:w-11">
              <a href="/">
                <img
                  src={logo}
                  alt="Matrix Web Solutions"
                  className="h-full w-full animate-[spin_6s_linear_infinite] object-contain"
                  title="Matrix Web Solutions"
                />
              </a>
            </div>

            {/* Brand text (hidden on very small screens) */}
            <div className="hidden min-[420px]:block leading-tight">
              <p
                className={`font-roboto font-semibold text-[clamp(0.85rem,1vw,1.1rem)] ${
                  theme === "dark" ? "text-white" : "text-indigo-700"
                }`}
              >
                Matrix Web Solutions
              </p>
              <p
                className={`text-[clamp(0.62rem,0.75vw,0.88rem)] ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-500"
                }`}
              >
                Digital Services Agency{" "}
                <span className="text-[clamp(0.5rem,0.6vw,0.65rem)]">1.0.1</span>
              </p>
            </div>
          </div>

          {/* Center: Desktop Menu */}
          <ul className="nav-items hidden items-center gap-5 lg:flex xl:gap-8 2xl:gap-10">
            {navLinks.map((item) => (
              <li
                key={item.label}
                onClick={() => handleNavClick(item.id)}
                className={`relative group font-roboto cursor-pointer text-[clamp(0.82rem,0.9vw,1rem)] ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-700"
                } ${theme === "dark" ? "hover:text-white" : "hover:text-indigo-500"}`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-0 ${
                    theme === "dark" ? "bg-white" : "bg-indigo-500"
                  } transition-all duration-300 group-hover:w-full`}
                ></span>
              </li>
            ))}
          </ul>

          {/* Right: CTA + Theme + Hamburger */}
          <div className="flex items-center gap-1.5 min-[475px]:gap-2 sm:gap-3">
            {/* CTA (Desktop only) */}
            <button
              className={`hidden lg:inline-flex items-center justify-center cursor-pointer px-4 py-2 rounded-full font-roboto font-semibold text-[clamp(0.82rem,0.9vw,1rem)] transition-all duration-200 ${
                theme === "dark"
                  ? "bg-white text-indigo-900 hover:bg-transparent hover:shadow-sm hover:shadow-white hover:text-white active:scale-95 transition-transform duration-75"
                  : "bg-indigo-700 text-white hover:bg-white hover:border hover:border-indigo-900 border-white hover:text-indigo-900 hover:text-shadow-indigo-900"
              }`}
              onClick={() => setIsQuoteOpen(true)}
            >
              Get a Quote
            </button>

            {/* Theme Toggle */}
            <button
              className={`themetoggle-icon h-auto w-fit cursor-pointer rounded-full p-1.5 transition-all duration-200 sm:p-2 ${theme === "dark" ? "bg-white/30" : "rounded-full bg-indigo-500/30"}`}
              onClick={themeChanger}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <img src={sun} alt="light mode" className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
              ) : (
                <img src={moon} alt="dark mode" className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Hamburger Button (Mobile/Tablet) */}
            <button
              className={`rounded-lg border p-1.5 shadow-md transition-all min-[475px]:p-2 lg:hidden ${
                theme === "dark"
                  ? "bg-white border-black/20 shadow-white/20"
                  : "bg-white border-gray-200 shadow-black/20"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="flex h-5 w-5 flex-col justify-center gap-1 sm:h-6 sm:w-6">
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
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            isOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          } ${
            theme === "dark"
              ? "bg-linear-to-r from-indigo-400 to-indigo-900"
              : "bg-white"
          }`}
        >
          <div className="mx-auto max-w-7xl overflow-y-auto px-3 py-4 min-[475px]:px-4 sm:px-6">
            <ul className="flex flex-col gap-2.5 min-[475px]:gap-3">
              {navLinks.map((item) => (
                <li
                  key={item.label}
                  onClick={() => handleNavClick(item.id)}
                  className={`cursor-pointer py-1 font-roboto text-[clamp(0.85rem,1.1vw,1.1rem)] ${
                    theme === "dark" ? "text-indigo-100" : "text-indigo-700"
                  } ${
                    theme === "dark"
                      ? "hover:text-white"
                      : "hover:text-indigo-500"
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Mobile CTA */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsQuoteOpen(true);
                }}
                className={`w-full py-3 rounded-lg font-roboto font-semibold text-[clamp(0.85rem,1vw,1rem)] transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-white text-indigo-800 hover:bg-indigo-100"
                    : "bg-indigo-700 text-white hover:bg-indigo-800"
                }`}
              >
                Get a Quote
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
