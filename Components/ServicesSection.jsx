import React, { useState } from "react";
import { useStore } from "../src/Context/UseStore";

const ServicesSection = ({ onQuoteClick }) => {
  const { theme, designlogo, appdev, webdev, thumbnaildesign, seo, cv } =
    useStore(useStore);
  const servicesList = [
    {
      title: "Website Development",
      desc: "Fast, responsive and modern websites for your business.",
      tag: "Best for Businesses",
      icon: webdev,
    },
    {
      title: "App Development",
      desc: "Powerful mobile apps with smooth UI and performance.",
      tag: "Android / iOS",
      icon: appdev,
    },
    {
      title: "SEO Services",
      desc: "Rank higher on Google and get real organic traffic.",
      tag: "Google Growth",
      icon: seo,
    },
    {
      title: "Logo Design",
      desc: "Professional branding that builds trust instantly.",
      tag: "Brand Identity",
      icon: designlogo,
    },
    {
      title: "Thumbnail Design",
      desc: "High CTR thumbnails for YouTube and social media.",
      tag: "More Clicks",
      icon: thumbnaildesign,
    },
    {
      title: "CV / Resume Making",
      desc: "ATS-friendly CV that increases job interview chances.",
      tag: "Professional CV",
      icon: cv,
    },
  ];

  const [active, setActive] = useState(null);

  return (
    <section
      id="services"
      className={`w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-16 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-black to-indigo-800/80 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className={`text-3xl sm:text-4xl font-extrabold font-poppins ${
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
        >
          Our Services
        </h2>

        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${
            theme === "dark" ? "text-white/70" : "text-gray-600"
          }`}
        >
          We provide complete digital solutions to help you grow online, attract
          customers, and increase sales.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer
            ${theme === "dark" ? "bg-white/5 border-white/10 shadow-xs shadow-indigo-800" : "bg-white shadow-xl shadow-indigo-300 border-gray-200"}
            ${active === i ? "scale-[1.02]" : "scale-100"}
            `}
            >
              {/* Icon Box */}
              <div
                className={`w-20 h-20  object-cover m-2 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    theme === "dark"
                      ? "bg-indigo-500/20 border border-indigo-400/20"
                      : "bg-indigo-50 border border-indigo-200"
                  }
                  group-hover:scale-110 group-hover:rotate-6`}
              >
                <img
                  alt={s.title}
                  size={22}
                  src={Icon}
                  // className={`${theme === "dark" ? "text-indigo-200" : "text-indigo-700"}`}
                />
              </div>
              {/* Tag */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  theme === "dark"
                    ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/20"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                {s.tag}
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                {s.title}
              </h3>

              {/* Desc */}
              <p
                className={`mt-2 text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
              >
                {s.desc}
              </p>

              {/* Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => alert(`${s.title} details coming soon!`)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                    theme === "dark"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  View Details
                </button>

                <button
                  onClick={onQuoteClick}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <p
          className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} text-sm`}
        >
          Want a custom package? Let’s build something amazing for your
          business.
        </p>

        <button
          type="submit"
          class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg hover:bg-indigo-500 backdrop-blur-md lg:font-semibold isolation-auto  mt-4 hover:border-indigo-500 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500  border-indigo-800 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
        onClick={onQuoteClick}>
          Get Free Quote
          <svg
            class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              class="fill-gray-800 group-hover:fill-gray-800"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ServicesSection;
