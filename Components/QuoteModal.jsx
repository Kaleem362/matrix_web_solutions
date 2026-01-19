import React, { useEffect } from "react";
import { useStore } from "../src/Context/UseStore";

const QuoteModal = () => {
  const { theme, isQuoteOpen, setIsQuoteOpen,whatsappicon } = useStore(useStore);

  // ESC press to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsQuoteOpen(false);
    };

    if (isQuoteOpen) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isQuoteOpen, setIsQuoteOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isQuoteOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isQuoteOpen]);

  if (!isQuoteOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsQuoteOpen(false)}
      ></div>

      {/* Modal Box */}
      <div
        className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-7 shadow-2xl border backdrop-blur-md transition-all 
        max-h-[85vh] overflow-y-auto no-scrollbar 
        ${
          theme === "dark"
            ? "bg-black/60 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Get a Free Quote</h2>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              Tell us what you need and we’ll get back to you ASAP.
            </p>
          </div>

          <button
            onClick={() => setIsQuoteOpen(false)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Form (UI only for now) */}
        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 placeholder:text-white/40 focus:border-white/30"
                : "bg-white border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <input
            type="email"
            placeholder="Email Address"
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 placeholder:text-white/40 focus:border-white/30"
                : "bg-white border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <select
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
            }`}
          >
            <option value="" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>Select Service</option>
            <option value="Website Development" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>Website Development</option>
            <option value="App Development" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>App Development</option>
            <option value="SEO" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>SEO</option>
            <option value="Logo / Branding" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>Logo / Branding</option>
            <option value="Thumbnail Design" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>Thumbnail Design</option>
            <option value="CV / Resume" className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>CV / Resume</option>
          </select>

          <textarea
            rows="4"
            placeholder="Describe your project..."
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all resize-none ${
              theme === "dark"
                ? "bg-white/5 border-white/10 placeholder:text-white/40 focus:border-white/30"
                : "bg-white border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          ></textarea>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 items-center">
            <button
              type="submit"
              onClick={(e) => e.preventDefault()}
              className="w-full px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
            >
              Submit Quote Request
            </button>
            <span>or</span>
            <a
              href="https://wa.me/923XXXXXXXXX?text=Hi%20Matrix%20Web%20Solutions!%20I%20want%20a%20quote%20for%20my%20project."
              target="_blank"
              rel="noreferrer"
              className={`w-full flex items-center justify-center gap-4 px-5 py-3 rounded-full font-semibold text-center border transition-all active:scale-95 ${
                theme === "dark"
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
            >
              WhatsApp Us
              <img src={whatsappicon} alt="" className="h-5 w-5" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
