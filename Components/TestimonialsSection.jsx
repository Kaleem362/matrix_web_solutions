import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useStore } from "../src/Context/UseStore";
import Loader from "./Loader";
import { io } from "socket.io-client";
import { getApiBase } from "../src/utils/api.js";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

const TestimonialsSection = () => {
  const { theme, setIsQuoteOpen } = useStore();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  const API_URL = `${getApiBase()}/api/testimonials`;

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(API_URL);
        setTestimonials(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();

    socket.on("testimonialApproved", () => fetchTestimonials());
    socket.on("testimonialDeleted", () => fetchTestimonials());

    return () => {
      socket.off("testimonialApproved");
      socket.off("testimonialDeleted");
    };
  }, []);

  // Check scroll position for arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [testimonials]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector(".testimonial-card")?.offsetWidth || 320;
      const gap = 24;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
        behavior: "smooth",
      });
    }
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
      {/* Heading */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          What Clients Say
        </h2>
        <p className="mt-3 text-sm max-w-2xl mx-auto text-white/80">
          Trusted by startups and small businesses worldwide.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            canScrollLeft
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 opacity-100"
              : "bg-gray-400/50 text-white/50 cursor-not-allowed opacity-0 sm:opacity-0"
          }`}
          disabled={!canScrollLeft}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            canScrollRight
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 opacity-100"
              : "bg-gray-400/50 text-white/50 cursor-not-allowed opacity-0 sm:opacity-0"
          }`}
          disabled={!canScrollRight}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
              No testimonials yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 px-2 sm:px-0"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="testimonial-card shrink-0 w-[300px] sm:w-[340px] snap-start"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`h-full rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${
                    theme === "dark"
                      ? "bg-white/5 border border-white/10 hover:bg-white/10"
                      : "bg-white border border-gray-200 hover:shadow-xl"
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < (t.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Message */}
                  <p
                    className={`text-sm leading-relaxed line-clamp-4 ${
                      theme === "dark" ? "text-white/75" : "text-gray-600"
                    }`}
                  >
                    "{t.message}"
                  </p>

                  {/* Person */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden ${
                      theme === "dark" ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = t.name?.[0] || "?";
                          }}
                        />
                      ) : (
                        t.name?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        {t.name}
                      </h4>
                      <p className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
                        {t.role || "Client"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scroll Indicators (dots) */}
        {!isLoading && testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  theme === "dark" ? "bg-white/30" : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className={`text-sm ${theme === "dark" ? "text-white/70" : "text-indigo-900/70"}`}>
          Ready to grow your business online? Get a free quote today!
        </p>
        <button
          onClick={() => setIsQuoteOpen(true)}
          className={`mt-4 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
            theme === "dark"
              ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105"
              : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105"
          }`}
        >
          Get a Free Quote
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
