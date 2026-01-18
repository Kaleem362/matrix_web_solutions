import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../src/Context/UseStore";

const Hero = () => {
  const { services,webdev,appdev,designlogo,fastdel,seo } = useStore(useStore);

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
    <div className="bg-linear-to-b from-indigo-400 to-white w-full px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: Carousel */}
        <div
          className="lg:col-span-7 relative rounded-2xl shadow-2xl shadow-black/40 overflow-hidden
          h-[55vh] sm:h-[60vh] lg:h-[80vh]"
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
                {/* light overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/35 to-black/10"></div>

                {/* small label */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h2 className="text-white font-bold text-xl sm:text-2xl">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full flex items-center justify-center
            bg-white/15 border border-white/25 backdrop-blur-md
            text-white hover:bg-white/25 transition-all duration-200 active:scale-90"
          >
            ❮
          </button>

          <button
            onClick={() => {
              nextSlide();
              startAutoSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full flex items-center justify-center
            bg-white/15 border border-white/25 backdrop-blur-md
            text-white hover:bg-white/25 transition-all duration-200 active:scale-90"
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
        <div className="lg:col-span-5 rounded-2xl bg-white/60 backdrop-blur-md shadow-xl p-6 sm:p-8 flex flex-col justify-center h-full">
          <h1 className="text-3xl sm:text-4xl font-poppins font-extrabold text-indigo-900 leading-tight ">
            Grow Your Business Online with{" "}
            <span className="text-white border border-indigo-900 bg-indigo-900 font-Poppins font-bold">&nbsp;Matrix Web Solutions&nbsp;</span>
          </h1>

          <p className="text-gray-700 mt-4 text-sm sm:text-base font-poppins">
            We build high-converting websites, powerful mobile apps, and SEO
            strategies that help your business rank, convert, and scale.
          </p>

          {/* points */}
          <div className="mt-5 space-y-2 text-gray-800 text-sm sm:text-base">
            <p className="flex items-center gap-2"><img src={webdev} alt="" className="h-4 w-4 hover:scale-150 duration-300 transition-all" />Modern Website & App Development</p>
            <p className="flex items-center gap-2"><img src={seo} alt="" className="h-4 w-4 hover:scale-150 duration-300 transition-all"/>SEO + Google Ranking Growth</p>
            <p className="flex items-center gap-2"><img src={designlogo} alt="" className="h-4 w-4 hover:scale-150 duration-300 transition-all"/>Branding (Logo, Thumbnails, Designs)</p>
            <p className="flex items-center gap-2"><img src={fastdel} alt="" className="h-4 w-4 hover:scale-150 duration-300 transition-all"/>Fast Delivery + Affordable Packages</p>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95">
              Get a Quote
            </button>

            <button className="px-6 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-all active:scale-95">
              View Services
            </button>
          </div>

          {/* mini trust line */}
          <p className="mt-4 text-xs text-gray-600">
            ⚡ Trusted by startups & small businesses for digital growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
