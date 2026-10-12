import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import BannerImage from '../../../sub-components/banner-image';

export default function Construction() {

  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD;



  const [openTitle, setOpenTitle] = useState(null);

  const toggleDataManagement = (title) => {
    if (openTitle === title) {
      setOpenTitle(null);
    } else {
      setOpenTitle(title);
    }
  };


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const solutionid = searchParams.get('id');

  const [solutionData, setSolutionData] = useState(null);
  useEffect(() => {
    if (solutionid) {
      fetch(`${baseUrl}/allDataInfo/solutionInfo.php?id=${solutionid}`, {

      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {

          if (Array.isArray(data) && data.length > 0) {
            setSolutionData(data[0]);
          } else {
            console.error('No manager data found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [solutionid]);

  if (solutionData === null) {
    return <>Loading...</>;
  }


  return (
    <>
      <div className="bg-[#020617] text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-hidden min-h-screen pb-20">
        <BannerImage />

        {/* Breadcrumb & Premium Header Section */}
        <div className="relative border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12 px-6 sm:px-12 lg:px-16 text-left">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <nav className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <span className="mx-2 text-slate-700">/</span>
              <span className="text-slate-500">Solutions</span>
              <span className="mx-2 text-slate-700">/</span>
              <span className="text-blue-400">{solutionData.title}</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight mb-2">
                  {solutionData.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

        <section className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-16 overflow-hidden">
          <div className="mb-12">
            <h2 className="text-justify text-[14px] lg:text-[18px] font-normal text-white leading-relaxed">
              {solutionData.subTitle}
            </h2>
          </div>

          {solutionData.solutionInfo && solutionData.solutionInfo.length > 0 && (
            <div className="space-y-12 mt-12 w-full">
              {solutionData.solutionInfo
                .filter(sol => sol.solution_title !== "Smart Office Application" && sol.solution_title !== "Smart Office Solution")
                .map((sol) => (
                  <div 
                    className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-xl relative overflow-hidden" 
                    key={sol.solution_title}
                  >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="relative w-full">
                    {/* Header */}
                    <div className="border-l-4 border-blue-500 pl-4 mb-6">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {sol.solution_title}
                      </h3>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-7 text-slate-350 text-sm leading-relaxed space-y-6">
                        <p className="text-base">{sol.solution_description}</p>
                        
                        {sol.solution_features.length > 1 && (
                          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 mt-6">
                            <h4 className="text-lg text-blue-400 font-bold mb-4">
                              Key Features
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
                              {sol.solution_features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-slate-300">
                                  <span className="text-blue-500 text-xs mt-1">✔</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Image Frame */}
                      <div className="lg:col-span-5 flex justify-center">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
                          <img 
                            src={`/assets/${sol.solution_image}`} 
                            alt={sol.solution_title} 
                            className="w-full h-auto object-cover max-h-[350px] hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
