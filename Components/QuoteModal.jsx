import React, { useEffect, useState } from "react";
import { useStore } from "../src/Context/UseStore";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../src/index.css";
import axios from "axios";

const QuoteModal = () => {
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_URL;
      
  const API_URL = `${BASE_URL}/api/testimonials`;
  const { theme, isQuoteOpen, setIsQuoteOpen, whatsappicon } =
    useStore(useStore);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const QUOTE_API_URL = `${BASE_URL}/api/quotes`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.length < 8) {
      alert("Please enter a valid phone number");
      return;
    }
    if(!name || !email || !service) {
      alert("Please fill in all required fields");
      return;
    }
    // Future: API call here

    try {
      await axios.post(
        QUOTE_API_URL,
        { name, email, phone, service, description },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(email,phone,service,description);
      alert("Quote request submitted successfully!");
      
    setName("");
    setEmail("");
    setPhone("");
    setService("");
    setDescription("");
    setIsQuoteOpen(false);
   

  } catch (error) {
    alert("Error submitting quote request: " + error.message);
  } 
}

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 placeholder:text-white/40 focus:border-white/30"
                : "bg-white border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 placeholder:text-white/40 focus:border-white/30"
                : "bg-white border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          {/* 🌍 International Phone Input */}
          <div
            className={`relative w-full rounded-xl transition-all ${
              theme === "dark"
                ? "bg-indigo-900 border border-indigo-600"
                : "bg-white border border-indigo-200"
            }`}
          >
            <PhoneInput
              country={"pk"}
              value={phone}
              onChange={(value) => setPhone(value)}
              enableSearch={true}
              containerClass="!w-full"
              inputClass={`!w-full !py-2 !pl-14 !pr-3 !bg-transparent !border-0 !outline-none ${
                theme === "dark"
                  ? "!text-white placeholder:!text-white/50"
                  : "!text-gray-900 placeholder:!text-gray-400"
              }`}
              buttonClass={`!border-0 !bg-transparent ${
                theme === "dark" ? "!bg-indigo-900" : "!bg-white"
              }`}
              dropdownClass={`!rounded-xl !shadow-xl ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 placeholder:text-white/40 text-indigo-900 focus:border-white/30"
                  : "bg-white border-gray-300 placeholder:text-indigo-400 text-indigo-800 focus:border-indigo-500"
              }`}
            />
          </div>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl outline-none border transition-all ${
              theme === "dark"
                ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
            }`}
          >
            <option value="">Select Service</option>
            <option value="Website Development">Website Development</option>
            <option value="App Development">App Development</option>
            <option value="SEO">SEO</option>
            <option value="Logo / Branding">Logo / Branding</option>
            <option value="Thumbnail Design">Thumbnail Design</option>
            <option value="CV / Resume">CV / Resume</option>
          </select>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              className="w-full px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
            >
              Submit Quote Request
            </button>
            <span>or</span>
            <a
              href="https://wa.me/923485427362?text=Hi%20Matrix%20Web%20Solutions!%20I%20want%20a%20quote%20for%20my%20project."
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
