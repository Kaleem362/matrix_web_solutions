import React from "react";
import CoverProjectsPage from "./coversforpages/CoverProjectsPage";
import { FiExternalLink, FiArrowRight, FiCode, FiLayers, FiSmartphone } from "react-icons/fi";
import { useStore } from "../src/Context/UseStore";

const ProjectsPage = () => {
  const { isQuoteOpen, setIsQuoteOpen, whatsappicon } = useStore(useStore);

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "A full-featured online store with payment integration, inventory management, and real-time analytics dashboard.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["React", "Node.js", "MongoDB"],
      year: "2024",
      icon: FiCode,
    },
    {
      id: 2,
      title: "Corporate Landing Page",
      category: "UI/UX Design",
      description: "Modern, responsive landing page with smooth animations and conversion-focused design for a fintech startup.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
      tags: ["Figma", "Tailwind CSS", "GSAP"],
      year: "2024",
      icon: FiLayers,
    },
    {
      id: 3,
      title: "Mobile Banking App",
      category: "App Development",
      description: "Cross-platform mobile application with biometric authentication, bill payments, and account management features.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      tags: ["React Native", "Firebase", "Stripe"],
      year: "2023",
      icon: FiSmartphone,
    },
    {
      id: 4,
      title: "SaaS Dashboard",
      category: "Web Application",
      description: "Feature-rich analytics dashboard with real-time data visualization, team collaboration, and export capabilities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["Next.js", "PostgreSQL", "Chart.js"],
      year: "2023",
      icon: FiCode,
    },
    {
      id: 5,
      title: "Restaurant POS System",
      category: "Custom Software",
      description: "Point-of-sale system with kitchen display, inventory tracking, staff management, and comprehensive reporting.",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop",
      tags: ["Electron", "React", "MySQL"],
      year: "2023",
      icon: FiLayers,
    },
    {
      id: 6,
      title: "Healthcare Portal",
      category: "Web Development",
      description: "Patient management system with appointment scheduling, telemedicine integration, and medical records access.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      tags: ["Angular", "Node.js", "HL7"],
      year: "2022",
      icon: FiSmartphone,
    },
  ];

  const stats = [
    { number: "120+", label: "Projects Delivered" },
    { number: "98%", label: "Client Retention" },
    { number: "50+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
  ];

  const categories = ["All", "Web Development", "UI/UX Design", "App Development", "Custom Software"];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Cover */}
      <CoverProjectsPage />

      {/* Stats Section */}
      <section className="bg-linear-to-r from-indigo-800 via-indigo-700 to-violet-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.number}</p>
                <p className="text-indigo-200 text-sm md:text-base mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Our Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Featured Projects
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              A showcase of our finest work — from sleek websites to powerful applications, each project tells a story of innovation and quality.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <div
                  key={project.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-indigo-200"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
                      <span className="text-xs font-semibold text-indigo-700">{project.category}</span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full shadow-md">
                      <span className="text-xs font-semibold text-white">{project.year}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300 leading-tight pt-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2 text-sm">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View Project Link */}
                    <div className="pt-4 border-t border-slate-100">
                      <button className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:gap-3 transition-all duration-300">
                        View Project
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-linear-to-br from-indigo-900 via-indigo-800 to-violet-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
            Let's turn your ideas into reality. Get in touch and let's discuss how we can help build something amazing together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-800 font-semibold rounded-xl hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
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
      </section>
    </div>
  );
};

export default ProjectsPage;
