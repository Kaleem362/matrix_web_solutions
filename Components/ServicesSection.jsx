import React, { useState } from "react";
import { useStore } from "../src/Context/UseStore";

const ServicesSection = ({ onQuoteClick }) => {
  const { theme } = useStore(useStore);
  const isDark = theme === "dark";

  const servicesList = [
    {
      title: "Website Development",
      desc: "Fast, responsive and modern websites for your business.",
      tag: "Best for Businesses",
    },
    {
      title: "App Development",
      desc: "Powerful mobile apps with smooth UI and performance.",
      tag: "Android / iOS",
    },
    {
      title: "SEO Services",
      desc: "Rank higher on Google and get real organic traffic.",
      tag: "Google Growth",
    },
    {
      title: "Logo Design",
      desc: "Professional branding that builds trust instantly.",
      tag: "Brand Identity",
    },
    {
      title: "Thumbnail Design",
      desc: "High CTR thumbnails for YouTube and social media.",
      tag: "More Clicks",
    },
    {
      title: "CV / Resume Making",
      desc: "ATS-friendly CV that increases job interview chances.",
      tag: "Professional CV",
    },
  ];

  const [active, setActive] = useState(null);

  return (
    <section
      id="services"
      className={`w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-16 transition-all duration-300 ${
        theme === "dark" ? "bg-linear-to-b from-black to-indigo-800/80 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className={`text-3xl sm:text-4xl font-extrabold font-poppins ${
            isDark ? "text-white" : "text-indigo-900"
          }`}
        >
          Our Services
        </h2>

        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${
            isDark ? "text-white/70" : "text-gray-600"
          }`}
        >
          We provide complete digital solutions to help you grow online, attract
          customers, and increase sales.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer
            ${theme === "dark" ? "bg-white/5 border-white/10 shadow-xs shadow-indigo-800" : "bg-white shadow-xl shadow-indigo-300 border-gray-200"}
            ${active === i ? "scale-[1.02]" : "scale-100"}
            `}
          >
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
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
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
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <p className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} text-sm`}>
          Want a custom package? Let’s build something amazing for your business.
        </p>

        <button
          onClick={onQuoteClick}
          className="mt-4 px-7 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
        >
          Get a Free Quote
        </button>
      </div>
    </section>
  );
};

export default ServicesSection;
