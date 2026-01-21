import React from "react";
import { useStore } from "../src/Context/UseStore";

const ServiceDetailsModal = () => {
  const {
    theme,
    isServiceOpen,
    setIsServiceOpen,
    activeService,
    setIsQuoteOpen,
  } = useStore(useStore);

  if (!isServiceOpen || !activeService) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsServiceOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden ${
          theme === "dark"
            ? "bg-black/70 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 sm:p-8 border-b ${
            theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setIsServiceOpen(false)}
            className={`absolute top-4 right-4 text-xl ${
              theme === "dark"
                ? "text-white/70 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-white/10" : "bg-indigo-50"
              }`}
            >
              <img
                src={activeService.icon}
                alt={activeService.title}
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <p
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                  theme === "dark"
                    ? "bg-indigo-500/20 text-indigo-200 border-indigo-400/20"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}
              >
                {activeService.tag}
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold font-poppins">
                {activeService.title}
              </h2>

              <p className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} mt-2`}>
                {activeService.longDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {/* Starting Price + Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`rounded-2xl p-4 border ${
                theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
              }`}
            >
              <p className={`${theme === "dark" ? "text-white/60" : "text-gray-500"} text-xs`}>
                Starting Price
              </p>
              <p className="text-lg font-bold text-indigo-500">
                {activeService.startingPrice}
              </p>
            </div>

            <div
              className={`rounded-2xl p-4 border ${
                theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
              }`}
            >
              <p className={`${theme === "dark" ? "text-white/60" : "text-gray-500"} text-xs`}>
                Estimated Timeline
              </p>
              <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-sm font-semibold`}>
                {activeService.timeline}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          <div className="mt-7">
            <h3 className="text-lg font-bold">What you get</h3>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {activeService.deliverables?.map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2 rounded-xl p-3 border ${
                    theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-indigo-500 font-bold">✔</span>
                  <span className={`${theme === "dark" ? "text-white/75" : "text-gray-700"}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best For */}
          <div className="mt-7">
            <h3 className="text-lg font-bold">Best for</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeService.bestFor?.map((b, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white/80"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700"
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="mt-7">
            <h3 className="text-lg font-bold">Our process</h3>
            <ol className="mt-3 space-y-2 text-sm">
              {activeService.process?.map((step, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-3 rounded-xl p-3 border ${
                    theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className={`${theme === "dark" ? "text-white/75" : "text-gray-700"}`}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* FAQs */}
          <div className="mt-7">
            <h3 className="text-lg font-bold">FAQs</h3>
            <div className="mt-3 space-y-3">
              {activeService.faqs?.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border ${
                    theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="font-semibold">{faq.q}</p>
                  <p className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} mt-1 text-sm`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Line */}
          <p className={`mt-7 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
            ⚡ Quick response • Professional support • Quality delivery
          </p>

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
              className={`px-6 py-3 rounded-full font-semibold border transition-all active:scale-95 text-center ${
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
    </div>
  );
};

export default ServiceDetailsModal;
