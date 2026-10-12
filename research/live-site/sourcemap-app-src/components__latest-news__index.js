import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerImage from "../../sub-components/banner-image";

const Latest_News = () => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

  const [latestNewsInfo, setLatestNewsInfo] = useState([]);

  const getLatestNewsInfo = () => {
    fetch(`${baseUrl}/allDataInfo/latestnewsInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Sort data by date descending (latest first)
        const sortedData = [...data].map(item => {
          // Fix known typos in DB to help JavaScript's Date parsing
          let cleanDateStr = item.dateString
            .replace('Novemeber', 'November')
            .replace('Decemeber', 'December');
          
          let parsedDate = new Date(cleanDateStr);
          
          // If invalid date, fallback to 0 so it doesn't break sorting
          if (isNaN(parsedDate.getTime())) {
             parsedDate = new Date(0);
          }
          
          return { ...item, parsedDate };
        }).sort((a, b) => b.parsedDate - a.parsedDate);
        
        // Update state with the properly sorted data
        setLatestNewsInfo(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    getLatestNewsInfo();
  }, []);

  return (
    <>
      <div className="bg-[#ffff]">
        <BannerImage />
        <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
          <div className="">
            <h4 className="text-[14px] font-thin text-[#333333]">
              <Link to="/">Home</Link> / Latest News
            </h4>
            <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333] ">
              Latest News
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
              {latestNewsInfo.map((news, index) => (
                <div className="mb-5 pb-5" key={index}>
                  <div
                    className="w-[275px] md:w-[280px] h-[480px] border-1  bg-[#f5f5f5] shadow-xl rounded-[10px] relative mt-10 mx-auto overflow-hidden"
                  >
                    <a href={news.redirectLink}>
                      <img
                        src={`./assets/${news.imgUrl}`}
                        alt=""
                        className="w-full h-80 object-cover rounded-t-[10px]"
                      />
                      <div className="p-2.5">
                        <p className="text-[12px] lg:text-[14px] font-normal text-[#072FA5]">
                          {news.dateString}
                        </p>
                        <p className="text-[14px] lg:text-[16px] font-normal text-[#333333] !leading-7 line-clamp-3">
                          {news.content}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Latest_News;
