import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const FAQSection = () => {
  const { theme } = useStore();
  const isDark = theme === "dark";

  const faqs = [
    { q: "What is the delivery time?", a: "Websites: 5–12 days (depending on pages/features)\nApps: 3–6 weeks (depending on scope) \n Websites: 1–2 weeks\nApps: 3–8 weeks\nSEO: 4–8 weeks to start seeing improvements \n(If you want fast service positioning) \nWebsites: 7–10 days\nApps: 2–6 weeks" },
    { q: "Do you offer revisions?", a: "Yes, revisions are included based on the package. Premium includes unlimited revisions." },
    { q: "What payment methods do you accept?", a: "We accept bank transfer, Easypaisa, JazzCash and other local payment methods." },
    { q: "Do you provide support after delivery?", a: "Yes, we provide support and maintenance depending on the plan." },
    { q: "How long does SEO take to show results?", a: "SEO is long-term. Most websites start seeing improvement in 4–8 weeks." },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className={`w-full px-4 sm:px-8 lg:px-16 py-14 sm:py-16 transition-all duration-300 ${
        isDark
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
        <h2 className={`text-3xl sm:text-4xl font-extrabold font-poppins ${isDark ? "text-white" : "text-indigo-900"}`}>
          Frequently Asked Questions
        </h2>
        <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${isDark ? "text-white/70" : "text-gray-600"}`}>
          Answers to the most common questions our clients ask.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto mt-12 space-y-4">
        {faqs.map((item, i) => {
          const isOpen = open === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className={`font-semibold ${isDark ? "text-white" : "text-indigo-900"}`}>{item.q}</span>
                <span className={`${isDark ? "text-white/70" : "text-gray-600"} text-xl`}>
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className={`px-5 pb-4 text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  {item.a}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
