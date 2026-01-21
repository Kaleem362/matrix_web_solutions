import React from "react";
import { useStore } from "../src/Context/UseStore";

const ServiceDetailsModal = () => {
  const { theme, isServiceOpen, setIsServiceOpen, activeService, setIsQuoteOpen } =
    useStore(useStore);

  if (!isServiceOpen || !activeService) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsServiceOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      ></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl ${
          theme === "dark" ? "bg-black/70 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Close */}
        <button
          onClick={() => setIsServiceOpen(false)}
          className={`absolute top-4 right-4 text-xl ${
            theme === "dark" ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          ✕
        </button>

        <div className="flex items-start gap-4">
          <img src={activeService.icon} alt="" className="w-16 h-16 rounded-2xl" />

          <div>
            <h2 className="text-2xl font-extrabold font-poppins">
              {activeService.title}
            </h2>
            <p className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} mt-2`}>
              {activeService.desc}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3 text-sm">
          <p className={`${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>
            ✅ Deliverables: Modern design, responsive layout, optimized performance.
          </p>
          <p className={`${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>
            ⏱ Timeline: Depends on scope (we confirm after requirements).
          </p>
          <p className={`${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>
            💡 Best for: Startups, small businesses, and growing brands.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setIsServiceOpen(false);
              setIsQuoteOpen(true);
            }}
            className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
          >
            Get a Quote
          </button>

          <a
            href="https://wa.me/923XXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            className={`px-6 py-3 rounded-full font-semibold border transition-all active:scale-95 ${
              theme === "dark"
                ? "border-white/15 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
