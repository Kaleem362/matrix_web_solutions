import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const ServicesSection = () => {
  const { theme, designlogo, appdev, webdev, thumbnaildesign, seo, cv, setIsQuoteOpen } =
    useStore();

  const isDark = theme === "dark";

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

  // container stagger
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // card animation (alternate left/right)
  const cardVariant = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -70 : 70,
      y: 25,
      scale: 0.98,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  });

  return (
    <section
      id="services"
      className={`w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-16 transition-all duration-300 ${
        isDark
          ? "bg-linear-to-b from-black via-indigo-950 to-indigo-900/70 text-white"
          : "bg-linear-to-b from-white via-indigo-50 to-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
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
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {servicesList.map((s, i) => (
          <motion.div
            key={i}
            variants={cardVariant(i)}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={`group relative rounded-3xl p-6 border overflow-hidden cursor-pointer transition-all duration-300
              ${
                isDark
                  ? "bg-white/5 border-white/10 shadow-xl shadow-black/40"
                  : "bg-white border-gray-200 shadow-xl shadow-indigo-200/60"
              }`}
          >
            {/* Glow Layer */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300
              ${
                isDark
                  ? "bg-linear-to-br from-indigo-500/15 via-transparent to-purple-500/10"
                  : "bg-linear-to-br from-indigo-200/40 via-transparent to-purple-200/30"
              }`}
            ></div>

            {/* Icon + Tag Row */}
            <div className="relative flex items-center justify-between gap-3">
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border backdrop-blur-md
                transition-all duration-300 group-hover:rotate-6 group-hover:scale-110
                ${
                  isDark
                    ? "bg-indigo-500/20 border-indigo-400/20"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <img
                  src={s.icon}
                  alt={s.title}
                  className="w-10 h-10 object-contain"
                  draggable="false"
                />
              </div>

              {/* Tag */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                  isDark
                    ? "bg-indigo-500/15 text-indigo-200 border-indigo-400/20"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}
              >
                {s.tag}
              </div>
            </div>

            {/* Title */}
            <h3
              className={`relative mt-6 text-xl font-bold ${
                isDark ? "text-white" : "text-indigo-900"
              }`}
            >
              {s.title}
            </h3>

            {/* Desc */}
            <p
              className={`relative mt-2 text-sm leading-relaxed ${
                isDark ? "text-white/70" : "text-gray-600"
              }`}
            >
              {s.desc}
            </p>

            {/* Buttons */}
            <div className="relative mt-7 flex items-center gap-3">
              <button
                onClick={() => alert(`${s.title} details coming soon!`)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                View Details
              </button>

              <button
                onClick={() => setIsQuoteOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95"
              >
                Get a Quote
              </button>
            </div>

            {/* Bottom line */}
            <div
              className={`absolute bottom-0 left-0 w-full h-0.75 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isDark ? "bg-indigo-400/60" : "bg-indigo-700/60"
              }`}
            ></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mt-14 text-center"
      >
        <p className={`${isDark ? "text-white/70" : "text-gray-600"} text-sm`}>
          Want a custom package? Let’s build something amazing for your business.
        </p>

        <button
          onClick={() => setIsQuoteOpen(true)}
          className="mt-5 px-7 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
        >
          Get Free Quote
        </button>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
