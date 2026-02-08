import React from "react";
import { useStore } from "../src/Context/UseStore";

const Footer = () => {
  const { theme, setIsQuoteOpen, whatsappicon, gmail, github } =
    useStore(useStore);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <footer
        id="contact"
        className={`w-full flex justify-center px-4 sm:px-8 lg:px-16 pt-14 pb-8 transition-all duration-300 ${
          theme === "dark"
            ? "bg-linear-to-b from-indigo-900 to-black text-white"
            : "bg-linear-to-b from-indigo-400 to-white text-gray-900"
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <h3
              className={`xs:text-2xl md:text-3xl lg:text-4xl font-extrabold font-poppins ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              Matrix Web Solutions
            </h3>

            <p
              className={`mt-3 text-sm leading-relaxed ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              We help startups and small businesses grow online with modern
              websites, apps, SEO, and creative design solutions.
            </p>

            <button
              onClick={() => setIsQuoteOpen(true)}
              className={`mt-5 px-6 py-3 rounded-full cursor-pointer ${theme === "dark" ? "bg-transparent border border-white text-white hover:bg-indigo-700" : "bg-indigo-600 hover:bg-white text-white hover:text-indigo-900 hover:border hover:border-indigo-900 hover:shadow-xl hover:shadow-indigo-500/20"} font-semibold transition-all active:scale-95`}
            >
              Get a Free Quote
            </button>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4
              className={`${theme === "dark" ? "text-white" : "text-indigo-900"} font-bold md:text-xl`}
            >
              Quick Links
            </h4>

            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Home", id: "home" },
                { label: "Services", id: "services" },
                { label: "Our Work", id: "ourwork" },
                { label: "Testimonials", id: "testimonials" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className={`hover:underline hover:text-indigo-200/90 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "text-white hover:text-white"
                        : "text-gray-600 hover:text-indigo-800"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h4
              className={`${theme === "dark" ? "text-white" : "text-indigo-900"} font-bold md:text-xl`}
            >
              Services
            </h4>

            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Website Development",
                "App Development",
                "SEO Services",
                "Logo Design",
                "Thumbnail Design",
                "CV / Resume Making",
              ].map((service) => (
                <li
                  key={service}
                  className={`hover:underline hover:text-indigo-200/90 transition-all cursor-pointer ${
                    theme === "dark"
                      ? "text-white hover:text-white"
                      : "text-gray-600 hover:text-indigo-800"
                  }`}
                >
                  {service}
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6 space-y-4 text-sm grid-cols-2 w-fit grid-rows-2">
              <a
                className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} flex items-center`}
                href="mailto:Matrixdev19@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={gmail} alt="" className="inline w-6 h-6 mr-4" />
                <span
                  className={`${theme === "dark" ? "text-white hover:underline" : "text-indigo-900 hover:underline"} font-semibold`}
                >
                  matrixdev19@gmail.com
                </span>
              </a>

              <a
                className={` ${theme === "dark" ? "text-white hover:underline" : "text-indigo-900 hover:underline"}flex items-center font-semibold`}
                href="https://wa.me/923139908631"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={whatsappicon}
                  alt="WhatsApp"
                  className="inline w-6 h-6 mr-4"
                />
                Whatsapp Us
              </a>
              <a
                href="https://www.github.com/kaleem362"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === "dark" ? "text-white hover:underline" : "text-indigo-900 hover:underline"} font-semibold mx-6`}
              >
                <img
                  src={github}
                  alt="WhatsApp"
                  className="inline w-6 h-6 mr-4"
                />
                Github
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
      </footer>
      <div
        className={`w-full pb-6 mx-auto  pt-6 border-t text-center text-xs ${
          theme === "dark"
            ? "border-white/10 text-white/60 bg-black"
            : "border-gray-200 text-gray-500"
        }`}
      >
        © {new Date().getFullYear()} Matrix Web Solutions. All Rights Reserved.
      </div>
    </>
  );
};

export default Footer;
