import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useStore } from "../src/Context/UseStore";

const ServicesSection = () => {
  const {
    theme,
    designlogo,
    appdev,
    webdev,
    thumbnaildesign,
    seo,
    cv,
    setIsQuoteOpen,
    setActiveService,
    setIsServiceOpen,
  } = useStore();

  const servicesList = [
    {
      id: "website-development",
      title: "Website Development",
      tag: "Best for Businesses",
      icon: webdev,
      shortDesc: "Fast, responsive and modern websites for your business.",
      longDesc:
        "We design and develop modern, responsive, and high-performing websites that help your business build trust and convert visitors into customers. Whether you need a landing page, portfolio, or complete business website, we focus on speed, user experience, and SEO-ready structure.",

      deliverables: [
        "Responsive design (Mobile, Tablet, Desktop)",
        "Modern UI/UX with smooth animations",
        "Fast loading speed & performance optimization",
        "SEO-friendly structure (headings + clean layout)",
        "WhatsApp button + Contact form integration",
        "Basic security & best practices",
        "Deployment support (if needed)",
      ],

      bestFor: ["Startups", "Local businesses", "Agencies", "Online services"],

      process: [
        "Requirement & content collection",
        "Layout + design approval",
        "Development + responsive implementation",
        "Testing (mobile + desktop)",
        "Final delivery + revisions",
        "Support & maintenance guidance",
      ],

      timeline: "7–14 days (depending on pages and features)",
      startingPrice: "Starting from 9,999 PKR",

      faqs: [
        {
          q: "Will my website be mobile responsive?",
          a: "Yes, your website will be fully responsive on mobile, tablet and desktop screens.",
        },
        {
          q: "Can you integrate WhatsApp and contact forms?",
          a: "Yes, we can integrate WhatsApp button, contact form and lead capture system.",
        },
        {
          q: "Will the website be SEO-friendly?",
          a: "Yes, we build SEO-ready structure so your website can rank better on Google.",
        },
      ],
    },

    {
      id: "app-development",
      title: "App Development",
      tag: "Android / iOS",
      icon: appdev,
      shortDesc: "Powerful mobile apps with smooth UI and performance.",
      longDesc:
        "We develop modern mobile applications with clean UI, smooth performance, and scalable structure. Whether it's a business app, service app, or booking system, we build apps that help you grow and engage your customers.",

      deliverables: [
        "Modern UI screens with smooth UX",
        "Performance optimized development",
        "Authentication (Login / Signup) (optional)",
        "API integration support (optional)",
        "Bug fixing & testing",
        "App build & deployment guidance",
      ],

      bestFor: ["Businesses", "Startups", "Online services", "Booking systems"],

      process: [
        "Requirement gathering & app flow planning",
        "UI screens design / wireframes",
        "App development (features implementation)",
        "Testing + optimization",
        "Delivery + support",
      ],

      timeline: "3–6 weeks (depending on features)",
      startingPrice: "Starting from 39,999 PKR",

      faqs: [
        {
          q: "Can you build both Android and iOS apps?",
          a: "Yes, depending on your budget and requirements we can plan Android and iOS both.",
        },
        {
          q: "Will you publish the app on Play Store?",
          a: "We guide you through the publishing process and help you prepare the release build.",
        },
        {
          q: "Can you integrate payment gateways?",
          a: "Yes, payment integration is possible depending on the platform and business model.",
        },
      ],
    },

    {
      id: "seo-services",
      title: "SEO Services",
      tag: "Google Growth",
      icon: seo,
      shortDesc: "Rank higher on Google and get real organic traffic.",
      longDesc:
        "We help your business rank higher on Google with strong on-page SEO, technical improvements, and keyword strategy. Our SEO services focus on long-term growth, more visibility, and real organic traffic that converts into leads.",

      deliverables: [
        "Keyword research & competitor analysis",
        "On-page SEO (titles, headings, content structure)",
        "Technical SEO checks (speed, indexing, errors)",
        "Internal linking + structure improvement",
        "SEO reporting & improvements plan",
        "Local SEO (optional)",
      ],

      bestFor: ["Business websites", "Local services", "E-commerce", "Blogs"],

      process: [
        "Website audit & SEO analysis",
        "Keyword research & targeting",
        "On-page optimization",
        "Technical fixes recommendations",
        "Tracking setup (optional)",
        "Monthly improvement + reporting",
      ],

      timeline: "4–8 weeks (to start seeing improvements)",
      startingPrice: "Starting from 14,999 PKR / month",

      faqs: [
        {
          q: "How long does SEO take to show results?",
          a: "SEO usually takes 4–8 weeks to start showing improvements, and strong results take consistent work.",
        },
        {
          q: "Do you provide guaranteed ranking?",
          a: "No one can guarantee #1 ranking, but we follow best SEO practices to improve your visibility and traffic.",
        },
        {
          q: "Do you also write content for SEO?",
          a: "Yes, content optimization and SEO-friendly content guidance can be included.",
        },
      ],
    },

    {
      id: "logo-design",
      title: "Logo Design",
      tag: "Brand Identity",
      icon: designlogo,
      shortDesc: "Professional branding that builds trust instantly.",
      longDesc:
        "We design professional logos that match your brand personality and make your business look premium. A strong logo improves trust, brand recall, and gives your business a professional identity.",

      deliverables: [
        "Unique logo concepts (multiple options)",
        "High-quality PNG + JPG files",
        "Vector source file (optional)",
        "Color variations (light/dark background)",
        "Social media profile version",
        "Revisions included (based on package)",
      ],

      bestFor: ["New brands", "Startups", "Businesses", "Personal branding"],

      process: [
        "Brand info collection (name, niche, style)",
        "Concept creation",
        "Client feedback + revisions",
        "Final delivery in all formats",
      ],

      timeline: "2–5 days (depending on revisions)",
      startingPrice: "Starting from 2,999 PKR",

      faqs: [
        {
          q: "Will I get the source file?",
          a: "Yes, source file can be provided depending on the selected package.",
        },
        {
          q: "How many revisions do you offer?",
          a: "Revisions depend on the package, but we always ensure you are satisfied with the final result.",
        },
        {
          q: "Can you design minimalist logos?",
          a: "Yes, minimalist and modern logo styles are our specialty.",
        },
      ],
    },

    {
      id: "thumbnail-design",
      title: "Thumbnail Design",
      tag: "More Clicks",
      icon: thumbnaildesign,
      shortDesc: "High CTR thumbnails for YouTube and social media.",
      longDesc:
        "We design attention-grabbing thumbnails that increase clicks and improve engagement. Our thumbnails are optimized for YouTube and social media platforms with strong visuals, readable text, and professional layout.",

      deliverables: [
        "High CTR thumbnail design",
        "Modern typography + layout",
        "Color correction + enhancements",
        "Revisions included",
        "YouTube + social media optimized sizes",
      ],

      bestFor: [
        "YouTubers",
        "Content creators",
        "Businesses",
        "Marketing campaigns",
      ],

      process: [
        "Topic + style understanding",
        "Design draft creation",
        "Revisions & improvements",
        "Final delivery (HD export)",
      ],

      timeline: "24–48 hours (depending on workload)",
      startingPrice: "Starting from 499 PKR",

      faqs: [
        {
          q: "Can you match my channel branding style?",
          a: "Yes, we can follow your brand colors, fonts, and theme for consistency.",
        },
        {
          q: "Do you provide multiple variations?",
          a: "Yes, variations can be provided depending on the package.",
        },
        {
          q: "Will the thumbnail be HD?",
          a: "Yes, we deliver high-resolution thumbnails optimized for YouTube.",
        },
      ],
    },

    {
      id: "cv-resume-making",
      title: "CV / Resume Making",
      tag: "Professional CV",
      icon: cv,
      shortDesc: "ATS-friendly CV that increases job interview chances.",
      longDesc:
        "We create professional and ATS-friendly CVs that help you stand out and increase your chances of getting interviews. Our CVs are modern, well-structured, and optimized for recruiters and job portals.",

      deliverables: [
        "ATS-friendly CV format",
        "Modern professional layout",
        "Proper headings + clean structure",
        "Optimized content & wording improvement",
        "PDF + editable file (Word/Docs)",
        "Cover letter (optional)",
      ],

      bestFor: ["Students", "Fresh graduates", "Professionals", "Job seekers"],

      process: [
        "Information collection (education, skills, experience)",
        "Draft creation",
        "Content optimization & formatting",
        "Final delivery (PDF + editable)",
      ],

      timeline: "1–3 days (depending on details)",
      startingPrice: "Starting from 1,499 PKR",

      faqs: [
        {
          q: "Will my CV be ATS-friendly?",
          a: "Yes, we build ATS-friendly format so it passes job portal screening systems.",
        },
        {
          q: "Do you include a cover letter?",
          a: "Cover letter is optional and can be added depending on your requirements.",
        },
        {
          q: "Can you update my old CV?",
          a: "Yes, we can redesign and improve your existing CV professionally.",
        },
      ],
    },
  ];

  // container stagger
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // card animation (alternate left/right)
  const cardVariant = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -70 : 70,
      y: 25,
      scale: 0.98,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  });

  return (
    <section
      id="services"
      className={`w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-16 transition-all duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-black via-indigo-950 to-indigo-900/70 text-white"
          : "bg-linear-to-b from-indigo-400 to-white text-gray-900"
      }`}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins text-white`}
        >
          Our Services
        </h2>

        <p
          className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${
            theme === "dark" ? "text-white/70" : "text-white"
          }`}
        >
          We provide complete digital solutions to help you grow online, attract
          customers, and increase sales.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {servicesList.map((s, i) => (
          <motion.div
            key={i}
            variants={cardVariant(i)}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={`group relative rounded-3xl p-6 border overflow-hidden cursor-pointer transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 shadow-xl shadow-black/40"
                  : "bg-white border-gray-200 shadow-xl shadow-indigo-200/60"
              }`}
          >
            {/* Glow Layer */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-linear-to-br from-indigo-500/15 via-transparent to-purple-500/10"
                  : "bg-linear-to-br from-indigo-200/40 via-transparent to-purple-200/30"
              }`}
            ></div>

            {/* Icon + Tag Row */}
            <div className="relative flex items-center justify-between gap-3">
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border backdrop-blur-md
                transition-all duration-300 group-hover:rotate-6 group-hover:scale-110
                ${
                  theme === "dark"
                    ? "bg-white rounded-full hover:scale-115 border-indigo-400/20"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <img
                  src={s.icon}
                  alt={s.title}
                  className="w-10 h-10 object-contain"
                  draggable="false"
                />
              </div>

              {/* Tag */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-indigo-500/15 text-indigo-200 border-indigo-400/20"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}
              >
                {s.tag}
              </div>
            </div>

            {/* Title */}
            <h3
              className={`relative mt-6 text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-indigo-900"
              }`}
            >
              {s.title}
            </h3>

            {/* Desc */}
            <p
              className={`relative mt-2 text-sm leading-relaxed ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              {s.desc}
            </p>

            {/* Buttons */}
            <div className="relative mt-7 flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveService(s);
                  setIsServiceOpen(true);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95 ${
                  theme === "dark"
                    ? "border-white/20 hover:border-white text-white hover:bg-white/10"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                View Details
              </button>

              <button
                onClick={() => setIsQuoteOpen(true)}
                className="px-4 py-2 rounded-full hover:scale-110 hover:bg-transparent hover:border-indigo-900 hover:border text-sm font-semibold bg-indigo-600 text-white transition-all active:scale-95 hover:text-indigo-900"
              >
                Get a Quote
              </button>
            </div>

            {/* Bottom line */}
            <div
              className={`absolute bottom-0 left-0 w-full h-0.75 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                theme === "dark" ? "bg-indigo-400/60" : "bg-indigo-700/60"
              }`}
            ></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mt-14 text-center"
      >
        <p
          className={`${theme === "dark" ? "text-white/70" : "text-gray-600"} text-sm`}
        >
          Want a custom package? Let’s build something amazing for your
          business.
        </p>

        <button
          onClick={() => setIsQuoteOpen(true)}
          className="mt-5 px-7 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95"
        >
          Get Free Quote
        </button>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
