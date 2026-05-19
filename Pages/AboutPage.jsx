import React, { useEffect, useState } from "react";
//import CoverAboutPage from "./coversforpages/CoverAboutPage";
import { useStore } from "../src/Context/UseStore";
import {
  FiMonitor, FiSmartphone, FiSearch, FiPenTool, FiImage, FiFileText,
  FiEye, FiHeart, FiTrendingUp, FiZap, FiDollarSign, FiClock,
  FiGlobe, FiSend, FiUsers, FiAward, FiTarget
} from "react-icons/fi";

// Animated section component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

// Section wrapper with scroll animation
const SectionWrapper = ({ children, className = "", id }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(id);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [id]);

  return (
    <div
      id={id}
      className={`transition-all duration-700 ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const AboutPage = () => {
  const { isQuoteOpen, setIsQuoteOpen, whatsappicon } = useStore(useStore);

  const services = [
    { icon: FiMonitor, title: "Website Development", desc: "Professional websites built for performance and growth" },
    { icon: FiSmartphone, title: "App Development", desc: "Android & iOS apps that users love" },
    { icon: FiSearch, title: "SEO & Ranking", desc: "Google ranking optimization for visibility" },
    { icon: FiPenTool, title: "Brand Identity", desc: "Logo and complete brand design" },
    { icon: FiImage, title: "Creative Design", desc: "Thumbnails, banners, and visual content" },
    { icon: FiFileText, title: "CV Services", desc: "Professional resume and CV making" },
  ];

  const whyChooseUs = [
    {
      icon: FiEye,
      title: "Modern & Professional Designs",
      desc: "Visually appealing and user-friendly digital experiences that leave a lasting impression.",
    },
    {
      icon: FiTrendingUp,
      title: "Business-Focused Development",
      desc: "Websites and apps built to generate results — not just look good.",
    },
    {
      icon: FiGlobe,
      title: "SEO & Growth Strategy",
      desc: "Improve online visibility and reach more customers through effective SEO.",
    },
    {
      icon: FiDollarSign,
      title: "Affordable Packages",
      desc: "Cost-effective solutions for startups and small businesses.",
    },
    {
      icon: FiClock,
      title: "Fast Delivery",
      desc: "Efficient project delivery without compromising quality.",
    },
    {
      icon: FiZap,
      title: "Scalable Solutions",
      desc: "Build systems that grow with your business needs.",
    },
  ];

  const stats = [
    { icon: FiSend, number: "120+", label: "Projects Delivered" },
    { icon: FiUsers, number: "50+", label: "Happy Clients" },
    { icon: FiAward, number: "5+", label: "Years Experience" },
    { icon: FiTarget, number: "98%", label: "Success Rate" },
  ];

  const goals = [
    { text: "Increase visibility", icon: FiEye },
    { text: "Build trust", icon: FiHeart },
    { text: "Generate leads", icon: FiTrendingUp },
    { text: "Improve conversions", icon: FiZap },
    { text: "Grow faster online", icon: FiSend },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Cover */}
      {/* <CoverAboutPage /> */}

      {/* Stats Section */}
      <section className="bg-linear-to-r from-indigo-800 via-indigo-700 to-violet-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-white">{stat.number}</p>
                  <p className="text-indigo-200 text-sm md:text-base mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <SectionWrapper id="welcome" className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6">
            Welcome to Matrix Web Solutions
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Where creativity, technology, and strategy come together to help businesses grow online.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            At Matrix Web Solutions, we believe every business deserves a powerful digital presence. Whether you're a startup, small business, entrepreneur, or growing brand, our mission is simple: <span className="font-semibold text-indigo-700">help you build, grow, and succeed</span> in the digital world.
          </p>
        </div>
      </SectionWrapper>

      {/* Who We Are Section */}
      <SectionWrapper id="who-we-are" className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6">
                A Modern Digital Agency
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Matrix Web Solutions is a modern digital services agency focused on delivering smart, affordable, and result-oriented online solutions. We combine clean design, user-friendly development, and strategic digital marketing to create experiences that attract customers and drive real business growth.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our goal is not just to build websites — we build digital systems that help brands:
              </p>

              {/* Goals List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map((goal, index) => (
                  <AnimatedSection key={index} delay={index * 100}>
                    <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <goal.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-slate-800">{goal.text}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop"
                  alt="Our Team"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-semibold text-lg">
                    Building Digital Success Stories
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <p className="text-3xl font-bold text-indigo-600">5+</p>
                <p className="text-slate-600 text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* What We Do / Services Section */}
      <SectionWrapper id="what-we-do" className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Our Core Services
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Complete digital services tailored for businesses that want to scale online. Every project is designed with performance, speed, user experience, and business growth in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Why Choose Us Section */}
      <SectionWrapper id="why-us" className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Our Promise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Why Choose Matrix Web Solutions?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Our Vision Section */}
      <SectionWrapper id="vision" className="py-16 md:py-24 px-6 bg-linear-to-br from-indigo-900 via-indigo-800 to-violet-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <FiTarget className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Vision
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-6">
            To become a trusted digital growth partner for businesses worldwide by delivering innovative, reliable, and scalable digital solutions.
          </p>
          <p className="text-indigo-200 leading-relaxed">
            We aim to empower brands with technology that helps them compete confidently in the modern online marketplace.
          </p>
        </div>
      </SectionWrapper>

      {/* Let's Build Section (CTA) */}
      <SectionWrapper id="cta" className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Get Started
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6">
            Let's Build Something Amazing
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            At Matrix Web Solutions, we don't just create websites and apps — we create opportunities for businesses to grow, connect, and succeed online.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            Whether you need a professional business website, a powerful mobile app, SEO services, or complete branding solutions, <span className="font-semibold text-indigo-700">we are ready to bring your ideas to life.</span>
          </p>

          <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
            <p className="text-xl font-bold text-indigo-700">
              Your growth is our mission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Project
            </button>

            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <img src={whatsappicon} alt="WhatsApp" className="w-6 h-6" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;
