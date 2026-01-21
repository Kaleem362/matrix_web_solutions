import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const ProcessSection = () => {
  const { theme } = useStore(useStore);

  const steps = [
    {
      title: "Requirement",
      desc: "We understand your goals and requirements clearly.",
    },
    {
      title: "Planning",
      desc: "We plan the best strategy for design + development.",
    },
    { title: "Design", desc: "Modern UI/UX that matches your brand identity." },
    {
      title: "Development",
      desc: "Clean code, fast performance and responsive build.",
    },
    { title: "Delivery", desc: "On-time delivery with revisions and testing." },
    { title: "Support", desc: "We provide support and future improvements." },
  ];

  return (
    <section
      id="process"
      className={`w-full px-4 sm:px-8 lg:px-16 py-14 sm:py-16 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-black via-indigo-950 to-black text-white"
          : "bg-linear-to-b from-white via-indigo-50 to-white text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2
          className={`text-3xl sm:text-4xl font-extrabold font-poppins ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
        >
          How We Work
        </h2>
        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
        >
          A simple, transparent process that delivers results.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-7">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`rounded-3xl p-7 border shadow-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 shadow-black/40 hover:bg-linear-to-br hover:from-indigo-900 to:indigo-700"
                : "bg-white border-gray-200 shadow-indigo-200/60 hover:bg-linear-to-br hover:border hover:border-indigo-900 hover:from-indigo-300 to:indigo-500"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-knewave font-bold border ${
                theme === "dark"
                  ? "bg-indigo-500/15 border-indigo-400/20 text-indigo-200"
                  : "bg-indigo-50 border-indigo-200    text-indigo-700"
              }`}
            >
              <span className="">{String(i + 1).padStart(2, "0")}</span>
            </div>

            <h3
              className={`mt-5 text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
            >
              {s.title}
            </h3>
            <p
              className={`mt-2 text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
            >
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
