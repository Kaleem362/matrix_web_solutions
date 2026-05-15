import { useStore } from "../src/Context/UseStore";
import PhoneInput from "react-phone-input-2";
import { FiMail, FiPhone, FiMapPin, FiSend, FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getApiBase } from "../src/utils/api.js";
import axios from "axios";
import { playContactSound } from "../src/utils/notificationSound";

const ContactPage = () => {
  const {
    theme,
    gmail,
    github,
    facebook,
    location,
    callIcon,
    instagram,
    linkedin,
    send,
    loading,
    setLoading,
    success,
    setSuccess,
    error,
    setError,
  } = useStore(useStore);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    concern: "",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const API_URL = `${getApiBase()}/api/contact`;

  const submitContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(API_URL, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.concern,
      });
      playContactSound();
      setTimeout(() => {
        setSuccess("Thank you for contacting us! We'll get back to you within 24 hours.");
        setTimeout(() => setSuccess(""), 5000);
        setFormData({ name: "", email: "", phone: "", subject: "", concern: "" });
      }, 150);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: gmail,
      label: "Email",
      value: "matrixdev19@gmail.com",
      gradient: "from-indigo-600 to-violet-700",
      hover: "hover:shadow-indigo-500/30",
    },
    {
      icon: callIcon,
      label: "Phone",
      value: "+92 313 9908631",
      gradient: "from-indigo-700 to-purple-700",
      hover: "hover:shadow-indigo-500/30",
    },
    {
      icon: location,
      label: "Location",
      value: "Mingora Swat, Pakistan",
      gradient: "from-violet-600 to-indigo-800",
      hover: "hover:shadow-violet-500/30",
    },
  ];

  const socialLinks = [
    { icon: facebook, href: "#", alt: "Facebook", color: "hover:bg-blue-600" },
    { icon: github, href: "#", alt: "GitHub", color: "hover:bg-slate-800" },
    { icon: instagram, href: "#", alt: "Instagram", color: "hover:bg-linear-to-br hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600" },
    { icon: linkedin, href: "#", alt: "LinkedIn", color: "hover:bg-blue-600" },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === "dark" ? "bg-slate-950" : "bg-slate-100"}`}>
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${theme === "dark" ? "bg-indigo-600" : "bg-indigo-400"} animate-pulse`} />
        <div className={`absolute bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 ${theme === "dark" ? "bg-violet-600" : "bg-violet-400"} animate-pulse`} style={{ animationDelay: "1s" }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl opacity-10 ${theme === "dark" ? "bg-indigo-800" : "bg-indigo-300"}`} />

        {/* Floating Geometric Shapes */}
        <div className={`absolute top-32 right-1/4 w-4 h-4 ${theme === "dark" ? "bg-indigo-500" : "bg-indigo-400"} rotate-45 animate-bounce`} style={{ animationDuration: "3s" }} />
        <div className={`absolute bottom-40 left-1/4 w-3 h-3 rounded-full ${theme === "dark" ? "bg-violet-500" : "bg-violet-400"} animate-bounce`} style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
        <div className={`absolute top-1/3 left-10 w-6 h-6 rounded-lg ${theme === "dark" ? "bg-indigo-400" : "bg-indigo-300"} rotate-12 animate-spin`} style={{ animationDuration: "8s" }} />
      </div>

      {/* Hero Section */}
      <div className={`relative transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-violet-900 py-20 px-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAnIGhlaWdodD0nNjAnIHZpZXdCb3g9JzAgMCA2MCA2MCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMzAgMEwzMCA2MFMzMCA2MCAzMCAwJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYmMoMTY5LDEwMywyNDMsMC4xMCknIHN0cm9rZS13aWR0aD0nMScgLz48L3N2Zz4=')] opacity-30" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm font-medium mb-6">
              We'd love to hear from you
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Let's <span className="text-transparent bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text">Talk</span>
            </h1>
            <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto">
              Have a project in mind? Drop us a message and let's create something amazing together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Contact Info */}
          <div className={`lg:col-span-4 space-y-6 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            {/* Contact Cards with Gradients */}
            <div className="space-y-4">
              {contactMethods.map((item, index) => (
                <div
                  key={index}
                  className={`group relative p-1 rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  } ${item.hover} shadow-lg`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`relative p-5 rounded-2xl h-full ${theme === "dark" ? "bg-slate-800" : "bg-white"} group-hover:bg-transparent transition-colors duration-500`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-linear-to-r ${item.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                        <img src={item.icon} alt={item.label} className="w-7 h-7 object-contain" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                          {item.label}
                        </p>
                        <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                          {item.value}
                        </p>
                      </div>
                      <FiChevronRight className={`w-5 h-5 ml-auto ${theme === "dark" ? "text-slate-600" : "text-slate-400"} group-hover:text-white group-hover:translate-x-2 transition-all duration-300`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links Card */}
            <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-slate-800/80 backdrop-blur-xl border border-slate-700" : "bg-white/80 backdrop-blur-xl border border-white shadow-xl"}`}>
              <p className={`text-sm font-medium mb-4 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                Connect With Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${theme === "dark" ? "bg-slate-700 hover:text-white" : "bg-slate-100 hover:text-white"} ${link.color}`}
                  >
                    <img src={link.icon} alt={link.alt} className="w-6 h-6 object-contain" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-linear-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-xl border border-indigo-700/50" : "bg-linear-to-br from-indigo-600 to-violet-600"}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">50+</p>
                  <p className="text-indigo-200 text-sm">Happy Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">24h</p>
                  <p className="text-indigo-200 text-sm">Response Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className={`lg:col-span-8 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className={`relative rounded-3xl overflow-hidden ${theme === "dark" ? "bg-slate-800/80 backdrop-blur-xl border border-slate-700" : "bg-white shadow-2xl"}`}>
              {/* Decorative Corner */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-2xl`} />

              <div className="relative p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <FiSend className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      Send a Message
                    </h2>
                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      Fill out the form below and we'll get back to you soon
                    </p>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-3 animate-pulse">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {success}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={submitContact} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none ${
                          theme === "dark"
                            ? "bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none ${
                          theme === "dark"
                            ? "bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        Phone Number
                      </label>
                      <PhoneInput
                        country="pk"
                        onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        enableSearch
                        value={formData.phone}
                        required
                        containerClass="w-full"
                        inputClass={`!w-full !py-4 !rounded-2xl !border !outline-none ${
                          theme === "dark"
                            ? "!bg-slate-900/50 !text-white !border-slate-600"
                            : "!bg-slate-50 !text-slate-900 !border-slate-200"
                        }`}
                        buttonClass={`!rounded-l-2xl ${theme === "dark" ? "!bg-slate-700" : "!bg-slate-100"}`}
                        dropdownClass={`rounded-2xl shadow-xl ${theme === "dark" ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        maxLength={50}
                        required
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none ${
                          theme === "dark"
                            ? "bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                      Your Message
                    </label>
                    <textarea
                      name="concern"
                      value={formData.concern}
                      onChange={handleChange}
                      placeholder="Tell us about your project, idea, or any questions you have..."
                      rows={6}
                      required
                      className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 outline-none resize-none ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 group ${
                      theme === "dark"
                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:shadow-2xl hover:shadow-indigo-500/30"
                        : "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending Your Message...
                      </>
                    ) : (
                      <>
                        <img src={send} alt="Send" className="w-6 h-6" />
                        Send Message
                        <FiChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
};

export default ContactPage;
