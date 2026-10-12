import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BannerImage from "../../sub-components/banner-image";

export default function Accelerator() {
  return (
    <>
      <div className=" bg-[#ffff] pb-10">
        <BannerImage />

        <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
          <h4 className="text-[14px] font-thin text-[#333333]">
            <Link to="/">Home / Solutions</Link> / Accelerator
          </h4>
          <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#333333] mt-5">
            Meerana Accelerator
          </h1>

          <div className=" gap-5 mt-5">
            {/* <img src={`/assets/${solutionData.image}`} alt='' className='w-full h-auto md:h-[350px]' /> */}
            <div className="">
              {/* <p dangerouslySetInnerHTML={{ __html: solutionData.description }}></p> */}
              <h1 className="text-justify text-[16px] md:text-[24px] lg:text-[32px] font-medium text-[#333333]">
                We've helped countless startups navigate their journey to
                success through our tailored consulting services, expert
                guidance, and support
              </h1>
            </div>
          </div>

          <div className="block mt-5">
            <div className="relative w-full">
              <input
                type="checkbox"
                className="peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
                id="dataManagementContent"
              />
              <div className="h-12 w-full pl-5 flex items-center border-l-4 border-[#072FA5]">
                <h1 className="!text-[#333333] text-[16px] font-semi-bold">
                  Green Hub
                </h1>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 pl-5 grid grid-cols-1 md:grid-cols-2 gap-5 
              ${"h-auto"}
                `}
                id="dataManagementContent"
              >
                <div className="text-[16px] md:text-[16px] font-normal text-[#333333]">
                  <p>
                    A green hub serving as a sustainable ecosystem fostering
                    environmental awareness, innovation, and collaboration
                    towards a greener future.
                  </p>
                  <div>
                    <h1 className="text-[20px] text-[#072FA5] !font-semibold my-5">
                      Features
                    </h1>
                      <ul className="list-disc md:leading-8 ml-5"><li>EV Charging Station</li></ul>
                      <ul className="list-disc md:leading-8 ml-5"><li>Donation Boxes</li></ul>
                      <ul className="list-disc md:leading-8 ml-5"><li>Locker Systems</li></ul>
                      <ul className="list-disc md:leading-8 ml-5"><li>Converter chargers</li></ul>
                      <ul className="list-disc md:leading-8 ml-5"><li>Plants & Food Corner</li></ul>
                  </div>
                </div>
                <div className="w-full h-auto md:h-[390px] object-cover">
                  <img src={`/assets/greenhub.webp`} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="block mt-5">
            <div className="relative w-full">
              <input
                type="checkbox"
                className="peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
                id="dataManagementContent"
              />
              <div className="h-12 w-full pl-5 flex items-center border-l-4 border-[#072FA5]">
                <h1 className="!text-[#333333] text-[16px] font-semi-bold">
                  Remotioo Smart Gate
                </h1>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 pl-5 grid grid-cols-1 md:grid-cols-2 gap-5 
              ${"h-auto"}
                `}
                id="dataManagementContent"
              >
                <div className="text-[16px] md:text-[16px] font-normal text-[#333333]">
                  <p>
                  The First end to end encripted Wi-Fi and bluetooth  enabled smart remote controller that let you control and monitor your gates and garage doors using your smartphone
                  </p>
                </div>
                <div className="w-full h-auto md:h-[390px] object-cover">
                  <img src={`/assets/remotioo.webp`} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
