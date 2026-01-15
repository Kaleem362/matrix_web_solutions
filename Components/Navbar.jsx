import { useContext } from "react";
import { ASSETS } from "../src/Global/GlobalImages.jsx";
import { useStore } from "../src/Context/UseStore.jsx";
const Navbar = () => {
  const { theme, themeChanger, sun, moon } = useStore(useContext);
  return (
    <nav className="flex items-center justify-around h-16 shadow-md bg-white">
      <div className="img-logo h-12 w-12">
        <img
          src={ASSETS.logo}
          alt=""
          className="animate-[spin_6s_linear_infinite]"
          title="Matrix Web Solutions"
        />
      </div>

      <ul className="nav-items flex gap-2 xs:gap-1 md:gap-4 lg:gap-6 xl:gap-8 items-center justify-around">
        {["Home", "Our Work", "Projects", "Contact", "About", "Blog"].map(
          (item) => (
            <li
              key={item}
              className="relative group font-roboto text-indigo-600 cursor-pointer 
                xs:text-xs md:text-lg lg:text-xl xl:text-lg hover:text-indigo-500 "
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
      <div
        className="themetoggle-icon w-fit  h-auto bg-indigo-900 rounded-full p-2 cursor-pointer"
        onClick={themeChanger}
      >
        {theme === "dark" ? <img src={sun} alt="Sun" className="w-6 h-6" /> : <img src={moon} alt="Moon" className="w-6 h-6" />}
      </div>
    </nav>
  );
};

export default Navbar;
