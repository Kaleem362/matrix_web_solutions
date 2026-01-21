import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const PricingSection = () => {
  const { theme, setIsQuoteOpen } = useStore(useStore);
  

  const plans = [
    {
      name: "Basic",
      price: "9,999 PKR",
      desc: "Best for small businesses starting online.",
      features: ["1 Page Website", "Responsive Design", "Basic SEO Setup", "2 Revisions"],
      popular: false,
    },
    {
      name: "Standard",
      price: "19,999 PKR",
      desc: "Perfect for growing brands and services.",
      features: ["Up to 5 Pages", "Modern UI/UX", "SEO Optimization", "WhatsApp Integration", "5 Revisions"],
      popular: true,
    },
    {
      name: "Premium",
      price: "39,999 PKR",
      desc: "For serious businesses that want scale.",
      features: ["Up to 10 Pages", "Full Optimization", "Advanced SEO", "Speed Optimization", "Unlimited Revisions"],
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className={`w-full px-4 sm:px-8 lg:px-16 py-14 sm:py-16 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-black via-indigo-950 to-black text-white"
          : "bg-linear-to-b from-indigo-400 to-white"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins ${theme === "dark" ? "text-white" : "text-white"}`}>
          Pricing Packages
        </h2>
        <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${theme === "dark" ? "text-white/70" : "text-white"}`}>
          Choose the best package for your business goals. You can also request a custom plan.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-7">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative group rounded-3xl p-7 hover:border hover:border-indigo-900 shadow-xl overflow-hidden transition-all duration-300 ${
              theme === "dark" ? "bg-white/5 border-white/10 shadow-black/40" : "bg-white border-gray-200 shadow-indigo-200/60"
            } ${plan.popular ? "ring-2 ring-indigo-500" : ""}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                Most Popular
              </div>
            )}

            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>{plan.name}</h3>
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>{plan.desc}</p>

            <p className="mt-5 text-3xl font-extrabold text-indigo-500">{plan.price}</p>

            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((f, idx) => (
                <li key={idx} className={`${theme === "dark" ? "text-white/75" : "text-gray-700"} flex items-center gap-2`}>
                  <span className="text-indigo-500">✔</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setIsQuoteOpen(true)}
              className="mt-7 w-full px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
            >
              Get a Quote
            </button>

            {/* Hover Glow */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-linear-to-br from-indigo-500/15 via-transparent to-purple-500/10"
                  : "bg-linear-to-br from-indigo-200/40 via-transparent to-purple-200/30"
              }`}
            ></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
