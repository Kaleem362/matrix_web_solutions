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

  return (
    <div
      id="home"
      className={`w-full px-4 min-[475px]:px-5 sm:px-8 lg:px-16 py-6 sm:py-10 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-indigo-950 via-black to-black"
          : "bg-linear-to-b from-indigo-400 to-white"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Carousel */}
        <div
          className={`lg:col-span-7 relative rounded-2xl overflow-hidden
          h-[55vh] sm:h-[60vh] lg:h-[80vh] transition-all duration-300 ${
            theme === "dark" ? "shadow-2xl shadow-black/70" : "shadow-2xl shadow-black/40"
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
                    theme === "dark"
                      ? "bg-linear-to-t from-black/70 via-black/45 to-black/20"
                      : "bg-linear-to-t from-black/55 via-black/35 to-black/10"
                  }`}
                ></div>

                {/* label */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h2 className="text-white font-bold text-lg min-[475px]:text-xl sm:text-2xl md:text-3xl xl:text-4xl drop-shadow-lg">
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
              theme === "dark"
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
              theme === "dark"
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
            className={`xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-poppins font-extrabold leading-16 transition-all duration-300 ${
              theme === "dark" ? "text-white" : "text-indigo-900"
            }`}>
            Grow Your Business Online with{" "}
            <span
              className={`inline-block font-poppins font-bold px-2 py-1 min-[475px]:px-2.5 sm:px-3 rounded-md border transition-all duration-300 ${
                theme === "dark"
                  ? "text-indigo-200 bg-indigo-950/60 border-indigo-400/20"
                  : "text-white bg-indigo-900 border-indigo-900"
              }`}
            >
              Matrix Web Solutions
            </span>
          </h1>

          <p
            className={`mt-4 xs:text-sm sm:text-base md:text-md lg:text-lg xl:text-xl font-poppins leading-relaxed transition-all duration-300 ${
              theme === "dark" ? "text-white/75" : "text-gray-700"
            }`}
          >
            We build high-converting websites, powerful mobile apps, and SEO
            strategies that help your business rank, convert, and scale.
          </p>

          {/* points */}
          <div
            className={`mt-5 space-y-4 mb-4 xs:text-sm sm:text-base md:text-md lg:text-lg xl:text-xl transition-all duration-300 ${
              theme === "dark" ? "text-white/80" : "text-gray-800"
            }`}
          >
            <p className="flex items-center gap-2.5 leading-snug">
              <img
                src={webdev}
                alt=""
                className="h-4 w-4 min-[475px]:h-4.5 min-[475px]:w-4.5 sm:w-8 sm:h-8 shrink-0 hover:scale-150 duration-300 transition-all"
              />
              Modern Website & App Development
            </p>
            <p className="flex items-center gap-2.5 leading-snug">
              <img
                src={seo}
                alt=""
                className="h-4 w-4 min-[475px]:h-4.5nmin-[475px]:w-4.5:h-5 sm:w-8 sm:h-8 shrink-0 hover:scale-150 duration-300 transition-all"
              />
              SEO + Google Ranking Growth
            </p>
            <p className="flex items-center gap-2.5 leading-snug">
              <img
                src={designlogo}
                alt=""
                className="h-4 w-4 min-[475px]:h-4.5 min-[475px]:w-4.5 sm:w-8 sm:h-8 shrink-0 hover:scale-150 duration-300 transition-all"
              />
              Branding (Logo, Thumbnails, Designs)
            </p>
            <p className="flex items-center gap-2.5 leading-snug">
              <img
                src={fastdel}
                alt=""
                className="h-4 w-4 min-[475px]:h-4.5 min-[475px]:w-4.5 sm:w-8 sm:h-8 shrink-0 hover:scale-150 duration-300 transition-all"
              />
              Fast Delivery + Affordable Packages
            </p>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3 min-[475px]:grid-cols-2 sm:flex sm:flex-wrap sm:gap-4 xl:flex-nowrap">
            {/* Get a Quote */}
            <button
              onClick={() => setIsQuoteOpen(true)}
              className={`w-full sm:w-auto sm:min-w-45 lg:min-w-50 px-4 min-[475px]:px-5 sm:px-6 xl:px-7 py-2.5 sm:py-3 xl:py-3.5 text-sm sm:text-base xl:text-lg rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer border ${
                theme === "dark"
                  ? "bg-indigo-500 text-white border-indigo-400/20 hover:bg-transparent hover:text-white hover:border-white/40"
                  : "bg-white text-indigo-900 border-indigo-900 hover:bg-transparent hover:text-indigo-900 hover:border-indigo-900"
              }`}
            >
              Get a Quote
            </button>

            {/* View Services */}
            <button
              className={`w-full sm:w-auto sm:min-w-45 lg:min-w-50 px-4 min-[475px]:px-5 sm:px-6 xl:px-7 py-2.5 sm:py-3 xl:py-3.5 text-sm sm:text-base xl:text-lg rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer border ${
                theme === "dark"
                  ? "bg-white/10 text-white border-white/20 hover:bg-white hover:text-indigo-900 hover:border-indigo-200"
                  : "bg-indigo-900 text-white hover:bg-transparent hover:border hover:border-indigo-900 hover:text-indigo-900"
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
            className={`mt-4 text-[11px] min-[475px]:text-xs sm:text-sm transition-all duration-300 ${
              theme === "dark" ? "text-white/60" : "text-gray-600"
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
