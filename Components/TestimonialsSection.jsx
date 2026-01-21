import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const TestimonialsSection = () => {
  const { theme, setIsQuoteOpen } = useStore();
  const isDark = theme === "dark";

  const testimonials = [
    {
      name: "Ali Khan",
      role: "Small Business Owner",
      text: "Matrix Web Solutions delivered a clean website and improved our online presence. Great communication and fast delivery!",
      rating: 5,
    },
    {
      name: "Ayesha Noor",
      role: "Startup Founder",
      text: "Their SEO guidance helped us rank better and get real traffic. Highly recommended for growing businesses.",
      rating: 5,
    },
    {
      name: "Usman Shah",
      role: "Content Creator",
      text: "The thumbnails were high quality and boosted my CTR. Professional work and quick revisions.",
      rating: 5,
    },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const card = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="testimonials"
      className={`w-full px-4 sm:px-8 lg:px-16 py-14 sm:py-16 transition-all duration-300 ${
        isDark
          ? "bg-linear-to-b from-black via-indigo-950 to-black text-white"
          : "bg-linear-to-b from-white via-indigo-50 to-indigo-300/40 text-gray-900"
      }`}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2
          className={`text-3xl sm:text-4xl font-extrabold font-poppins ${
            isDark ? "text-white" : "text-indigo-900"
          }`}
        >
          What Clients Say
        </h2>

        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${
            isDark ? "text-white/70" : "text-gray-600"
          }`}
        >
          Trusted by startups and small businesses for design, development and
          digital growth.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-7"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={card}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={`group relative rounded-3xl p-6 border shadow-xl overflow-hidden transition-all duration-300 ${
              isDark
                ? "bg-white/5 border-white/10 shadow-black/40"
                : "bg-white border-gray-200 shadow-indigo-200/60"
            }`}
          >
            {/* glow */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isDark
                  ? "bg-linear-to-br from-indigo-500/15 via-transparent to-purple-500/10"
                  : "bg-linear-to-br from-indigo-200/40 via-transparent to-purple-200/30"
              }`}
            ></div>

            {/* Stars */}
            <div className="relative flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <span key={idx} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
            </div>

            {/* Text */}
            <p
              className={`relative mt-4 text-sm leading-relaxed ${
                isDark ? "text-white/75" : "text-gray-600"
              }`}
            >
              “{t.text}”
            </p>

            {/* Person */}
            <div className="relative mt-6 flex items-center justify-between">
              <div>
                <h4 className={`${isDark ? "text-white" : "text-indigo-900"} font-bold`}>
                  {t.name}
                </h4>
                <p className={`${isDark ? "text-white/60" : "text-gray-500"} text-xs`}>
                  {t.role}
                </p>
              </div>

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border ${
                  isDark
                    ? "bg-indigo-500/15 border-indigo-400/20 text-indigo-200"
                    : "bg-indigo-50 border-indigo-200 text-indigo-700"
                }`}
              >
                {t.name?.[0]}
              </div>
            </div>

            {/* bottom line */}
            <div
              className={`absolute bottom-0 left-0 w-full h-0.75 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isDark ? "bg-indigo-400/60" : "bg-indigo-700/60"
              }`}
            ></div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mt-12 text-center"
      >
        <p className={`${isDark ? "text-white/70" : "text-gray-600"} text-sm`}>
          Ready to grow your business online? Let’s talk.
        </p>

        <button
          onClick={() => setIsQuoteOpen(true)}
          className="mt-5 px-7 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
        >
          Get a Free Quote
        </button>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
