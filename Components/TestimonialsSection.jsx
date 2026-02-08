import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { useStore } from "../src/Context/UseStore";
import Loader from "./Loader";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


const TestimonialsSection = () => {
  const { theme, setIsQuoteOpen } = useStore();

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // ======================
  // Responsive cards count
  // ======================
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // ======================
  // Fetch testimonials
  // ======================
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/testimonials");
        setTestimonials(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
  fetchTestimonials();

  // 🔥 Listen for real-time updates
  socket.on("testimonialApproved", () => {
    fetchTestimonials();
  });
  // 🔔 When testimonial is deleted
  socket.on("testimonialDeleted", () => {
    console.log("🗑 Public: testimonial deleted");
    fetchTestimonials();
  });

  return () => {
    socket.off("testimonialApproved");
    socket.off("testimonialDeleted");
  };
}, []);

  const maxIndex = Math.max(testimonials.length - visibleCards, 0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section
      id="testimonials"
      className={`w-full px-4 sm:px-8 lg:px-16 py-16 ${
        theme === "dark"
          ? "bg-linear-to-b from-black via-indigo-950 to-black text-white"
          : "bg-linear-to-b from-indigo-400 to-white text-white"
      }`}
    >
      {/* ======================
          Heading
      ====================== */}
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          What Clients Say
        </h2>
        <p className="mt-3 text-sm max-w-2xl mx-auto text-white/80">
          Trusted by startups and small businesses worldwide.
        </p>
      </div>

      {/* ======================
          Slider
      ====================== */}
      <div className="relative max-w-6xl mx-auto mt-14 overflow-visible no-scrollbar">
        {!testimonials.length && isLoading && <Loader /> ? <div><h1>No testimonials available yet</h1></div> : null}
        
        {isLoading ? (
          <Loader />
        ) : (
          <motion.div
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="flex gap-7"
            style={{ width: `${(testimonials.length * 100) / visibleCards}%` }}
          >
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="w-full shrink-0"
                style={{ width: `${100 / testimonials.length}%` }}
              >
                <div
                  className={`group relative rounded-3xl p-6 border shadow-xl h-full ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating || 0 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Message */}
                  <p
                    className={`mt-4 text-sm leading-relaxed ${
                      theme === "dark"
                        ? "text-white/75"
                        : "text-gray-600"
                    }`}
                  >
                    “{t.message}”
                  </p>

                  {/* Person */}
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm opacity-70 font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>{t.name}</h4>
                      <p className={`text-xs opacity-70 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>{t.role}</p>
                    </div>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold bg-indigo-600">
                      {t.name?.[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ======================
            Controls
        ====================== */}
        {!isLoading && testimonials.length > visibleCards && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full"
            >
              ›
            </button>
          </>
        )}
       
      </div>

      {/* ======================
          CTA
      ====================== */}
      <div className="text-center mt-14">
        <p className={`text-sm opacity-70 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
          Ready to grow your business online? Quote Now to Discuss Your Project!
        </p>
        <button
          onClick={() => setIsQuoteOpen(true)}
          className="mt-5 px-7 py-3 rounded-full bg-indigo-600 font-semibold hover:bg-white hover:text-indigo-900 transition"
        >
          Get a Free Quote
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
