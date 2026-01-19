import React, { useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const projects = [
  {
    title: "Business Website",
    category: "Web",
    desc: "Modern responsive website with clean UI and fast performance.",
    tech: ["React", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
  },
  {
    title: "E-Commerce Landing",
    category: "Web",
    desc: "High-converting landing page for product sales and leads.",
    tech: ["UI/UX", "SEO"],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
  },
  {
    title: "Mobile App UI",
    category: "App",
    desc: "App interface design focused on smooth user experience.",
    tech: ["Design", "Prototype"],
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200",
  },
  {
    title: "Brand Identity Kit",
    category: "Design",
    desc: "Logo + branding assets for strong brand presence.",
    tech: ["Logo", "Branding"],
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "SEO Growth Plan",
    category: "SEO",
    desc: "On-page SEO + content strategy for ranking improvements.",
    tech: ["SEO", "Content"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
  },
  {
    title: "YouTube Thumbnails",
    category: "Design",
    desc: "CTR-focused thumbnails for YouTube and social media.",
    tech: ["Thumbnails", "Design"],
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200",
  },
];

const OurWorkSection = () => {
  const { theme, setIsQuoteOpen } = useStore();

  const filters = ["All", "Web", "App", "Design", "SEO"];
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 25, scale: 0.98, transition: { duration: 0.25 } },
  };

  return (
    <section
      id="ourwork"
      className={`w-full px-4 sm:px-8 lg:px-16 py-14 sm:py-16 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-indigo-950 via-black to-black text-white"
          : "bg-linear-to-b from-white via-indigo-50 to-white text-gray-900"
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
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
        >
          Our Work
        </h2>

        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${
            theme === "dark" ? "text-white/70" : "text-gray-600"
          }`}
        >
          Some of our recent projects and creative work to help businesses grow
          online.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95
              ${
                activeFilter === f
                  ? theme === "dark"
                    ? "bg-indigo-500 text-white border-indigo-400/30"
                    : "bg-indigo-700 text-white border-indigo-700"
                  : theme === "dark"
                  ? "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p) => (
            <motion.div
              key={p.title}
              variants={cardVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className={`group relative rounded-3xl overflow-hidden border shadow-xl transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 shadow-black/40"
                    : "bg-white border-gray-200 shadow-indigo-200/60"
                }`}
            >
              {/* Image */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  loading="lazy"
                />
                {/* Overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-linear-to-t from-black/70 via-black/30 to-transparent"
                      : "bg-linear-to-t from-black/60 via-black/20 to-transparent"
                  }`}
                ></div>

                {/* Category badge */}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md
                    ${
                      theme === "dark"
                        ? "bg-white/10 text-white border-white/15"
                        : "bg-white/70 text-gray-900 border-white"
                    }`}
                >
                  {p.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-indigo-900"
                  }`}
                >
                  {p.title}
                </h3>

                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    theme === "dark" ? "text-white/70" : "text-gray-600"
                  }`}
                >
                  {p.desc}
                </p>

                {/* Tech pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        theme === "dark"
                          ? "bg-indigo-500/10 text-indigo-200 border-indigo-400/20"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => alert("Project details coming soon!")}
                    className={`px-4 py-2 hover:border hover:border-indigo-400 hover:text-indigo-400 text-sm font-semibold border transition-all active:scale-95 ${
                      theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-gray-300 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    View
                  </button>

                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${theme === "dark" ? "bg-indigo-600 text-white hover:bg-transparent hover:text-white hover:border hover:border-white" : "bg-indigo-600 hover:bg-transparent hover:text-indigo-600 text-white hover:border hover:border-indigo-600"}  transition-all active:scale-9`}
                  >
                    Get a Quote
                  </button>
                </div>
              </div>

              {/* Bottom highlight */}
              <div
                className={`absolute bottom-0 left-0 w-full h-0.75 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  theme === "dark" ? "bg-indigo-400/60" : "bg-indigo-700/60"
                }`}
              ></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default OurWorkSection;
