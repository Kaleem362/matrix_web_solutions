import React from "react";
import CoverOurServicesPage from "./coversforpages/CoverOurServicesPage";
import {useStore} from "../src/Context/UseStore";
import { AiFillCaretRight } from "react-icons/ai";

const OurServicesPage = () => {
  // const store = useStore;
  // eslint-disable-next-line no-unused-vars
  const { theme, isQuoteOpen, setIsQuoteOpen, whatsappicon, close } =
    useStore(useStore);
  const websiteDevelopmentContent = [
    {
      title: "Professional Website Development",
      description:
        "In today’s fast-growing digital world, your website is the foundation of your online presence. It is often the first place where potential customers learn about your business. A professionally designed website not only represents your brand but also builds trust, attracts customers, and helps your business grow fasterWe design and develop high-quality modern websites that are visually appealing fast and optimized to deliver the best user experience Our goal is to create a website that not only looks professional but also works as a powerful tool to generate leads and grow your business",
    },
    {
      title: "Build a Strong First Impression",
      description:
        "Your website is the digital face of your business. A clean, modern, and professional design creates a strong first impression and builds credibility with potential customers.",
    },
    {
      title: "24/7 Business Availability",
      description:
        "Unlike a physical store, your website works for you 24 hours a day, 7 days a week. Customers can learn about your services, explore your products, and contact you anytime.",
    },
    {
      title: "Reach a Wider Audience",
      description:
        "A website allows your business to reach customers beyond your local area. With the power of the internet, your brand can be discovered by people from different cities and even around the world.",
    },
    {
      title: "Increase Customer Trust",
      description:
        "Today, most customers search online before choosing a business. A professional website gives your brand authenticity and makes customers feel confident about choosing your services.",
    },
    {
      title: "Powerful Marketing and Growth Tool",
      description:
        "Your website becomes the central hub for all your marketing efforts. It works with search engines, social media, and digital marketing strategies to attract new customers and grow your business.",
    },
    {
      title: "Showcase Your Services and Expertise",
      description:
        "A website allows you to present your services, portfolio, and achievements in a professional way that convinces visitors to become customers.",
    },
  ];
  return (
    <div>
      <CoverOurServicesPage />

      <div className="Website-development p-20">
        <h3 className="text-5xl font-extrabold">
          {websiteDevelopmentContent[0].title}
          <span className="block h-6 w-210 transform skew-x-20 bg-linear-to-r from-indigo-600 to-indigo-900 my-4"></span>
        </h3>
        <p className="mt-3 p-4 text-xl xs:text-md sm:text-lg md:text-xl lg:text-xl">
          {websiteDevelopmentContent[0].description}
        </p>
        {websiteDevelopmentContent.slice(1).map((item, index) => (
          <div key={index} className="container P-4">
            <h3 className="text-2xl font-bold flex items-center uppercase">
              <AiFillCaretRight size={50} className="text-indigo-600" />
              {item.title}
            </h3>
            <p className="ml-10 text-lg p-3">{item.description}</p>
          </div>
        ))}

        <strong className="bg-indigo-200/50 my-6">
          Start your journey today and take your business to the next level with
          a powerful website.
        </strong>
      <div className="CTA-buttons p-20">
        <div className="whatsapp-us">
          <button className="flex items-center border-2 border-green-500 bg-white hover:bg-green-500 p-4 rounded-full gap-3">
            <img src={whatsappicon} className="h-6 w-6 text-green-500" />
            Whatsapp us
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OurServicesPage;
