import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../src/Context/UseStore";

const Hero = () => {
  const {
    theme,
    services,
    webdev,
    designlogo,
    fastdel,
    seo,
    setIsQuoteOpen,
  } = useStore(useStore);

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const startX = useRef(0);
  const endX = useRef(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 3500);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!services?.length) return;
    startAutoSlide();
    return () => stopAutoSlide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services.length]);

  // swipe
  const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (endX.current = e.touches[0].clientX);

  const handleTouchEnd = () => {
    const distance = startX.current - endX.current;
    if (distance > 50) {
      nextSlide();
      startAutoSlide();
    } else if (distance < -50) {
      prevSlide();
      startAutoSlide();
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`w-full px-4 sm:px-8 lg:px-16 py-6 sm:py-10 transition-all duration-300 ${
        isDark
          ? "bg-linear-to-b from-indigo-950 via-black to-black"
          : "bg-linear-to-b from-indigo-400 to-white"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Carousel */}
        <div
          className={`lg:col-span-7 relative rounded-2xl overflow-hidden
          h-[55vh] sm:h-[60vh] lg:h-[80vh] transition-all duration-300 ${
            isDark ? "shadow-2xl shadow-black/70" : "shadow-2xl shadow-black/40"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="h-full w-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-full h-full relative bg-cover bg-center"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              >
                {/* overlay (dark theme me thoda zyada strong) */}
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-linear-to-t from-black/70 via-black/45 to-black/20"
                      : "bg-linear-to-t from-black/55 via-black/35 to-black/10"
                  }`}
                ></div>

                {/* label */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-lg">
                    {service.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => {
              prevSlide();
              startAutoSlide();
            }}
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md
            transition-all duration-200 active:scale-90 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                : "bg-white/15 border border-white/25 text-white hover:bg-white/25"
            }`}
          >
            ❮
          </button>

          <button
            onClick={() => {
              nextSlide();
              startAutoSlide();
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md
            transition-all duration-200 active:scale-90 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                : "bg-white/15 border border-white/25 text-white hover:bg-white/25"
            }`}
          >
            ❯
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {services.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  startAutoSlide();
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  current === index ? "bg-white scale-125" : "bg-white/45"
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* RIGHT: Catchy Text Content */}
        <div
          className={`lg:col-span-5 rounded-2xl backdrop-blur-md shadow-xl p-6 sm:p-8 flex flex-col justify-center h-full transition-all duration-300 ${
            theme === "dark" ? "bg-white/5 border border-white/10 shadow-xs shadow-indigo-600" : "bg-white/60"
          }`}
        >
          <h1
            className={`text-3xl sm:text-4xl font-poppins font-extrabold leading-tight transition-all duration-300 ${
              isDark ? "text-white" : "text-indigo-900"
            }`}
          >
            Grow Your Business Online with{" "}
            <span
              className={`font-poppins font-bold px-2 py-1 rounded-md border transition-all duration-300 ${
                isDark
                  ? "text-indigo-200 bg-indigo-950/60 border-indigo-400/20"
                  : "text-white bg-indigo-900 border-indigo-900"
              }`}
            >
              Matrix Web Solutions
            </span>
          </h1>

          <p
            className={`mt-4 text-sm sm:text-base font-poppins transition-all duration-300 ${
              isDark ? "text-white/75" : "text-gray-700"
            }`}
          >
            We build high-converting websites, powerful mobile apps, and SEO
            strategies that help your business rank, convert, and scale.
          </p>

          {/* points */}
          <div
            className={`mt-5 space-y-2 text-sm sm:text-base transition-all duration-300 ${
              isDark ? "text-white/80" : "text-gray-800"
            }`}
          >
            <p className="flex items-center gap-2">
              <img
                src={webdev}
                alt=""
                className="h-4 w-4 hover:scale-150 duration-300 transition-all"
              />
              Modern Website & App Development
            </p>
            <p className="flex items-center gap-2">
              <img
                src={seo}
                alt=""
                className="h-4 w-4 hover:scale-150 duration-300 transition-all"
              />
              SEO + Google Ranking Growth
            </p>
            <p className="flex items-center gap-2">
              <img
                src={designlogo}
                alt=""
                className="h-4 w-4 hover:scale-150 duration-300 transition-all"
              />
              Branding (Logo, Thumbnails, Designs)
            </p>
            <p className="flex items-center gap-2">
              <img
                src={fastdel}
                alt=""
                className="h-4 w-4 hover:scale-150 duration-300 transition-all"
              />
              Fast Delivery + Affordable Packages
            </p>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Get a Quote */}
            <button
              onClick={() => setIsQuoteOpen(true)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer border ${
                isDark
                  ? "bg-indigo-500 text-white border-indigo-400/20 hover:bg-transparent hover:text-white hover:border-white/40"
                  : "bg-white text-indigo-900 border-indigo-900 hover:bg-transparent hover:text-indigo-900 hover:border-indigo-900"
              }`}
            >
              Get a Quote
            </button>

            {/* View Services */}
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer border ${
                isDark
                  ? "bg-white/10 text-white border-white/20 hover:bg-white hover:text-indigo-900 hover:border-indigo-200"
                  : "bg-linear-to-r from-indigo-700 to-indigo-900 text-white border-white hover:bg-white hover:text-indigo-900 hover:border-indigo-900"
              }`}
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Services
            </button>
          </div>

          {/* trust line */}
          <p
            className={`mt-4 text-xs transition-all duration-300 ${
              isDark ? "text-white/60" : "text-gray-600"
            }`}
          >
            ⚡ Trusted by startups & small businesses for digital growth.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Hero;
