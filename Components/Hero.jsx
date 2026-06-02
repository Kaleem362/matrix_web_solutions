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

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? services.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === services.length - 1 ? 0 : prev + 1));

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

  const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (endX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const distance = startX.current - endX.current;
    if (distance > 50) { nextSlide(); startAutoSlide(); }
    else if (distance < -50) { prevSlide(); startAutoSlide(); }
  };

  const features = [
    { icon: webdev, label: "Web Development" },
    { icon: seo, label: "SEO & Rankings" },
    { icon: designlogo, label: "Branding" },
    { icon: fastdel, label: "Fast Delivery" },
  ];

  return (
    <div
      id="home"
      className={`w-full min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-[#0e0e10]" : "bg-[#fafaf8]"
      }`}
    >
      {/* ── Hero Body ── */}
      <div className="flex flex-col google-sans items-center text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-10">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`w-5 h-px ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-xs font-medium uppercase tracking-widest ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Digital Solutions · Built for Growth
          </span>
          <span
            className={`w-5 h-px ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Headline */}
        <h1
          className={`font-serif text-[2.6rem] sm:text-[3.4rem] lg:text-[4.2rem] font-black leading-[1.06] tracking-tight mb-6 max-w-3xl ${
            theme === "dark" ? "text-white" : "text-indigo-900"
          }`}
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Grow Your Business
          <br />
          <span
            className={`italic font-bold ${
              theme === "dark" ? "text-gray-400" : "text-indigo-500"
            }`}
          >
            Online
          </span>{" "}
          with{" "}
          <span
            className={`not-italic font-black px-2 rounded-md ${
              theme === "dark"
                ? "bg-indigo-950/80 text-indigo-300"
                : "bg-indigo-900 text-white"
            }`}
          >
            Matrix.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className={`text-sm sm:text-base font-light leading-relaxed max-w-lg mb-8 ${
            theme === "dark" ? "text-gray-500" : "text-gray-500"
          }`}
        >
          We build high-converting websites, powerful mobile apps, and SEO
          strategies that help your business rank, convert, and scale.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setIsQuoteOpen(true)}
            className={`flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
              theme === "dark"
                ? "bg-white hover:bg-transparent hover:text-white text-[#1a1a18] border-2 hover:border-2 hover:border-white"
                : "bg-indigo-600 border-2 hover:bg-white hover:border-2 hover:border-indigo-600 text-white hover:text-indigo-700"
            }`}
          >
            Get a Quote
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() =>
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
            }
            className={`text-sm font-normal px-6 py-2.5 rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer ${
              theme === "dark"
                ? "border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
                : "border-gray-300 shadow-sm shadow-indigo-800 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            View Services
          </button>
        </div>

        {/* Feature Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-12">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2"
            >
              <img
                src={f.icon}
                alt={f.label}
                className={`w-4 h-4 sm:w-5 sm:h-5 object-contain ${
                  theme === "dark" ? "opacity-70" : "opacity-60"
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-normal tracking-wide ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {f.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm ${
                theme === "dark" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              ·
            </span>
            <span
              className={`text-xs sm:text-sm font-normal ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              ⚡ Trusted by startups & small businesses
            </span>
          </div>
        </div>

        {/* ── Gallery Strip (Carousel) ── */}
        <div className="w-full max-w-5xl px-2 sm:px-4">
          {/* Desktop — tilted strip */}
          <div className="hidden sm:grid grid-cols-5 gap-3">
            {services.slice(0, 5).map((service, index) => {
              const rotations = [-2, 1, -0.5, 1.5, -1];
              const offsets = [12, 0, -8, 6, -4];
              return (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  style={{
                    transform: `rotate(${rotations[index]}deg) translateY(${offsets[index]}px)`,
                    transition: "transform 0.4s ease",
                  }}
                  onClick={() => {
                    setCurrent(index);
                    startAutoSlide();
                  }}
                >
                  <div
                    className="h-36 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${service.bgImage})` }}
                  />
                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      current === index
                        ? "opacity-0"
                        : "opacity-40 bg-black group-hover:opacity-20"
                    }`}
                  />
                  {/* Active ring */}
                  {current === index && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-500/60 pointer-events-none" />
                  )}
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
                    <p className="text-white text-xs font-medium truncate">
                      {service.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile — single slide carousel */}
          <div
            className="sm:hidden relative rounded-2xl overflow-hidden h-52"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="min-w-full h-full bg-cover bg-center relative shrink-0"
                  style={{ backgroundImage: `url(${service.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-semibold text-base">
                      {service.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile nav arrows */}
            <button
              onClick={() => { prevSlide(); startAutoSlide(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 text-sm"
            >
              ❮
            </button>
            <button
              onClick={() => { nextSlide(); startAutoSlide(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 text-sm"
            >
              ❯
            </button>

            {/* Mobile dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {services.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); startAutoSlide(); }}
                  className={`h-1.5 rounded-full transition-all ${
                    current === i ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          className={`w-full max-w-5xl mt-10 h-px ${
            theme === "dark" ? "bg-white/5" : "bg-gray-200"
          }`}
        />

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-8 pb-6">
          {[
            { value: "3K+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "5★", label: "Average Rating" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span
                className={`text-2xl font-bold tracking-tight ${
                  theme === "dark" ? "text-white" : "text-[#1a1a18]"
                }`}
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {s.value}
              </span>
              <span
                className={`text-xs font-normal tracking-wide uppercase ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;