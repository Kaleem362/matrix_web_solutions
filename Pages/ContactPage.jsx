import { useStore } from "../src/Context/UseStore";
import PhoneInput from "react-phone-input-2";
import { WiDirectionUpRight } from "react-icons/wi";
import { BsFillSendArrowUpFill } from "react-icons/bs";
import { useState } from "react";
import { getApiBase } from "../src/utils/api.js"; // ✅ add this
import axios from "axios";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_URL;

  // ✅ AFTER — sirf yeh do lines
  const API_URL = `${getApiBase()}/api/contact`; // ✅ correct route

  const submitContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        API_URL,
        {
          name: formData.name,
          email: formData.email, // ✅
          phone: formData.phone, // ✅
          subject: formData.subject,
          message: formData.concern,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setSuccess(
        "Thank you for Contacting Us, We'll get back to you very soon.",
      );
      setTimeout(() => {
        setSuccess("");
      }, 5000);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "", // ✅
        concern: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`foreground-1 w-full h-full bg-linear-to-br ${theme === "dark" ? "from-indigo-950 via-indigo-400 to-indigo-500" : "from-indigo-500 via-indigo-200 to-indigo-700"}`}
    >
      <div className="contact-container-div w-full overflow-y-auto md:justify-center lg:flex p-6 sm:p-8 lg:p-20">
        {/* //---------------------------------------- 
          //LEFT SIDE DIV IN CONTACT
          //---------------------------------------- */}
        <div className="left-side w-full p-4 overflow-hidden google-sans">
          <h1
            className={`leading-10 sm:leading-16 text-5xl sm:text-[60px] md:text-[60px] m-4 md:m-0 tracking-tight font-extrabold google-sans ${
              theme === "light" ? "text-indigo-900" : "text-white"
            }`}
          >
            Lets Get in touch
          </h1>
          <p
            className={`google-sans text-lg m-4 ${theme === "light" ? "text-indigo-900" : "text-white"}`}
          >
            always feel easy to hello Us!
          </p>
          <ul className="contact-tabs mt-4 flex flex-col gap-3 w-full max-w-md">
            {/* EMAIL */}
            <li
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition
    ${
      theme === "light"
        ? "bg-white/70 text-indigo-900"
        : "bg-white/10 text-white shadow-md shadow-indigo-900/30"
    }`}
            >
              <img
                src={gmail}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                alt="email"
              />

              <div className="flex flex-col flex-1 min-w-0 px-1">
                <p className="text-xs sm:text-sm leading-tight opacity-70">
                  Email us
                </p>
                <p className="text-sm sm:text-base truncate">
                  matrixdev19@gmail.com
                </p>
              </div>

              <WiDirectionUpRight
                className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 border rounded-md p-0.5
      ${theme === "light" ? "text-indigo-900" : "text-white"}`}
              />
            </li>

            {/* CALL */}
            <li
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition
    ${
      theme === "light"
        ? "bg-white/70 text-indigo-900"
        : "bg-white/10 text-white shadow-md shadow-indigo-900/30"
    }`}
            >
              <img
                src={callIcon}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                alt="call"
              />

              <div className="flex flex-col flex-1 min-w-0 px-1">
                <p className="text-xs sm:text-sm leading-tight opacity-70">
                  Call us
                </p>
                <p className="text-sm sm:text-base truncate">+92 313 9908631</p>
              </div>

              <WiDirectionUpRight
                className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 border rounded-md p-0.5
      ${theme === "light" ? "text-indigo-900" : "text-white"}`}
              />
            </li>

            {/* ADDRESS */}
            <li
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition
    ${
      theme === "light"
        ? "bg-white/70 text-indigo-900"
        : "bg-white/10 text-white shadow-md shadow-indigo-900/30"
    }`}
            >
              <img
                src={location}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                alt="location"
              />

              <div className="flex flex-col flex-1 min-w-0 px-1">
                <p className="text-xs sm:text-sm leading-tight opacity-70">
                  Address
                </p>
                <p className="text-sm sm:text-base truncate">
                  Mingora Swat KP, Pakistan
                </p>
              </div>

              <WiDirectionUpRight
                className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 border rounded-md p-0.5
      ${theme === "light" ? "text-indigo-900" : "text-white"}`}
              />
            </li>
          </ul>

          {/* SOCIAL LINKS */}
          <ul
            className={`social-media-links mt-4 p-4 rounded-xl flex flex-wrap items-center gap-3 sm:gap-4 w-full max-w-md ${theme === "light" ? "bg-indigo-500/50" : "bg-indigo-900/50"}`}
          >
            <li className="text-white text-sm sm:text-base whitespace-nowrap">
              Follow us on
            </li>

            <a href="#" className="shrink-0">
              <img
                src={facebook}
                alt="facebook"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain hover:scale-110 transition"
              />
            </a>

            <a href="#" className="shrink-0">
              <img
                src={github}
                alt="github"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain hover:scale-110 transition"
              />
            </a>

            <a href="#" className="shrink-0">
              <img
                src={instagram}
                alt="instagram"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain hover:scale-110 transition"
              />
            </a>

            <a href="#" className="shrink-0">
              <img
                src={linkedin}
                alt="linkedin"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain hover:scale-110 transition"
              />
            </a>
          </ul>
        </div>
        {/* //---------------------------------------- 
          //RIGHT SIDE DIV IN CONTACT
          //---------------------------------------- */}
        <div
          className={`right-side w-full google-sans overflow-hidden ${theme === "light" ? "border-gray-200" : "bg-linear-to-b from-indigo-400 to-indigo-900 border-indigo-900"}bg-white  rounded-[40px] border-10 border-gray-200 py-10 px-4 `}
        >
          <h1
            className={` font-extrabold px-4  text-4xl text-transparent ${theme === "light" ? "[-webkit-text-stroke:2px_#312E81]" : "[-webkit-text-stroke:2px_#fff]"}`}
          >
            Contact Us
          </h1>
          {/* Success Message */}
          {success && (
            <div
              className={`
        mb-5 rounded-lg p-2 my-2 text-sm w-full max-w-lg text-center border transition-all duration-200
        ${
          theme === "dark"
            ? "bg-white/10 border border-indigo-600 text-indigo-100"
            : "bg-green-400/50 border border-white text-black"
        }
      `}
            >
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg p-4 text-sm border border-red-300 bg-red-50 text-red-700">
              {error}
            </div>
          )}
          <form
            action=""
            onSubmit={submitContact}
            className="mt-4 google-sans px-4 w-full max-w-2xl"
          >
            {/* GRID CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className={`${theme === "light" ? "text-indigo-900" : "text-white"} font-light`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`border p-2 rounded-lg focus:bg-white/10 
        ${
          theme === "light"
            ? "placeholder:text-indigo-900/50 border-indigo-900"
            : "placeholder:text-indigo-400 border-white"
        }
        placeholder:font-extralight outline-none`}
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className={`${theme === "light" ? "text-indigo-900" : "text-white"} font-light`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Johndoe@gmail.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border p-2 rounded-lg focus:bg-white/10 
        ${
          theme === "light"
            ? "placeholder:text-indigo-900/50 border-indigo-900"
            : "placeholder:text-indigo-400 border-white"
        }
        placeholder:font-extralight outline-none`}
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-col md:col-span-1 col-span-1">
                <label
                  htmlFor="phone"
                  className={`${theme === "light" ? "text-indigo-900" : "text-white"} font-light`}
                >
                  Phone
                </label>
                <PhoneInput
                  country="pk"
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: value,
                    }))
                  }
                  enableSearch
                  value={formData.phone}
                  required
                  name="phone"
                  containerClass="w-full"
                  inputClass={`!w-full !text-sm sm:!text-base !py-5 !rounded-lg !bg-transparent !border !outline-none !pl-12.5
        ${
          theme === "dark"
            ? "!text-white placeholder:!text-white/50 !placeholder:font-light"
            : "!text-gray-900 placeholder:!text-gray-400 !placeholder:font-light !border-indigo-900"
        }`}
                  buttonClass={`!border-0 !bg-transparent ${
                    theme === "dark" ? "!bg-indigo-900" : ""
                  }`}
                  dropdownClass={`!rounded-xl !shadow-xl ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-indigo-900"
                      : "bg-white border-gray-300 text-indigo-800"
                  }`}
                />
              </div>

              {/* SUBJECT */}
              <div className="flex flex-col">
                <label
                  htmlFor="subject"
                  className={`${theme === "light" ? "text-indigo-900" : "text-white"} font-light`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  maxLength={50}
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter Your Subject"
                  className={`border p-2 rounded-lg focus:bg-white/10 
        ${
          theme === "light"
            ? "placeholder:text-indigo-900/50 border-indigo-900"
            : "placeholder:text-indigo-400 border-white"
        }
        placeholder:font-extralight outline-none`}
                />
              </div>

              {/* TEXTAREA (FULL WIDTH) */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label
                  className={`${theme === "light" ? "text-indigo-900" : "text-white"} font-light`}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                  placeholder="Explain Your Concern here ....."
                  className={`p-4 outline-none rounded-lg w-full max-h-60 focus:bg-white/10 border
        ${
          theme === "light"
            ? "border-indigo-900 placeholder:text-indigo-900/50"
            : "border-white placeholder:text-indigo-400"
        }
        font-light`}
                ></textarea>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="mt-4">
              <button
                className={`w-full p-3 flex items-center justify-center gap-3 rounded-full transition-all duration-200 group
      ${
        theme === "light"
          ? "bg-indigo-900 text-white hover:bg-white hover:text-indigo-700"
          : "bg-white text-indigo-900 border border-indigo-900 hover:bg-transparent hover:text-white hover:border-white group"
      }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Contact"}
                <img
                  src={send}
                  className="h-8 w-8 rotate-40 group-hover:rotate-0 transition-all duration-200"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
