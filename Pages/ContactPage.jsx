/* eslint-disable no-unused-vars */
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
} from "react-icons/fa";
import CoverContactPage from "./coversforpages/CoverContactPage";

const contactCards = [
  {
    title: "Call Us",
    value: "+92 348 5427362",
    detail: "Mon - Sat, 9:00 AM to 7:00 PM",
    icon: FaPhoneAlt,
  },
  {
    title: "Email",
    value: "matrixdev19@gmail.com",
    detail: "We usually reply within a few hours",
    icon: FaEnvelope,
  },
  {
    title: "Remote",
    value: "Mingora, Swat 19130",
    detail: "Pakistan",
    icon: FaMapMarkerAlt,
  },
  {
    title: "Working Hours",
    value: "Monday - Saturday",
    detail: "9:00 AM - 7:00 PM",
    icon: FaClock,
  },
];

const ContactPage = () => {
  return (
    <>
    <CoverContactPage />
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-24 sm:px-8 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs tracking-[0.22em] uppercase">
            Let&apos;s Build Together
          </p>
          <h1 className=" [-webkit-text-stroke:1px_white] bg-transparent bg-clip-text text-4xl font-black text-transparent sm:text-6xl lg:text-7xl">
            Contact Us
          </h1>
          <p className="mt-5 text-base text-slate-300 sm:text-lg">
             Share your ideas with us. From complete strategy to product launch, we provide full support to deliver a comprehensive digital solution.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Talk to our team
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
              Whether it’s a business inquiry, support concern, or collaboration request, our team will connect with you directly
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              
              {contactCards.map(({ title, value, detail, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/12 bg-slate-900/55 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40"
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200">
                    <Icon size={16} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
                  <p className="mt-1 text-base font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{detail}</p>
                </article>
              ))}
            </div>
          </div>

          <form className="rounded-3xl border border-white/15 bg-slate-900/75 p-6 shadow-2xl shadow-indigo-500/15 backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Send Message
            </h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Fill the Form & you'll get response later.
            </p>

            <div className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-cyan-300/70"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-indigo-300/70"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-cyan-300/70"
              />

              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-none rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-cyan-300/70"
              />

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-900 via-indigo-400 to-indigo-900 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <FaPaperPlane size={14} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};

export default ContactPage;
