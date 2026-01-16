import React from "react";

const Hero = () => {
  return (
    <div className="bg-linear-to-b bg-indigo-400 to-white h-full w-full p-16">
      <div className="carousal rounded-md shadow-2xl shadow-black bg-white p-4 flex items-center justify-between">
        <div className="background bg-white left-side w-[50%] text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, sed
          sint nobis, molestiae eligendi ex placeat repudiandae provident
          asperiores minima eum consectetur laboriosam illum! Suscipit officia
          temporibus ullam corporis perferendis! Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis, ullam quaerat! Minima voluptate
          aspernatur vel vero animi quam, necessitatibus repellendus accusantium
          ea! Fugit error minus voluptas, rem laborum ut voluptatum impedit
          repudiandae tenetur amet hic laudantium ab dolores repellat
          voluptatibus, officiis esse earum a beatae ex quam aperiam aut ipsa.
          Recusandae, quam possimus. Aut atque iure maiores at rerum
          reprehenderit porro earum sint, eos, aperiam vel ex animi repudiandae
          assumenda tenetur quasi. Praesentium, enim cupiditate molestiae
          deserunt itaque excepturi consectetur perspiciatis dolorem facere.
          Consectetur maxime in laudantium repellendus quos, ut, voluptate nisi
          adipisci repellat veritatis cum est ducimus odio quam.
        </div>
        <div className="right-side h-full w-[50%] bg-indigo-400 flex flex-col items-center-safe justify-around">
          <div className="icon">
            <i className="text-white">icon here</i>
            <p className="service-description">
              service desciption will be featured here
            </p>
          </div>
          <div className="Call-to-action-buttons">
            <button>reach out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
