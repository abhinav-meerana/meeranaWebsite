import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {

  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD;

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [navbar, setNavbar] = useState(false);

  const handleSideMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  window.addEventListener('scroll', changeBackground);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);

  const handleSubMenuHover = () => {
    setIsSubMenuOpen(true);
  };

  const handleMenuHover = (isHovered) => {
    setIsMenuHovered(isHovered);
    if (!isHovered && !isSubMenuHovered) {
      setIsSubMenuOpen(false);
    }
  };

  const handleSubMenuContainerHover = (isHovered) => {
    setIsSubMenuHovered(isHovered);
    if (!isHovered && !isMenuHovered) {
      setIsSubMenuOpen(false);
    }
  };


  const closeNavbar = () => {
    setShowSideMenu(false);
  };


  const navigate = useNavigate();
  const navigateToAbout = () => {
    navigate("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -100;
        window.scrollTo({
          top: aboutSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  const navigateToTeam = () => {
    navigate("/");
    setTimeout(() => {
      const teamSection = document.getElementById("team");
      if (teamSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -100;
        window.scrollTo({
          top: teamSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  // const navigateToTest = () => {
  //   navigate("/");
  //   setTimeout(() => {
  //     const testSection = document.getElementById("test");
  //     if (testSection) {
  //       const scrollOptions = {
  //         behavior: "smooth",
  //       };
  //       const offset = -80;
  //       window.scrollTo({
  //         top: testSection.offsetTop + offset,
  //         ...scrollOptions,
  //       });
  //     }
  //   }, 100);
  // }

  const navigateToContact = () => {
    navigate("/");
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -100;
        window.scrollTo({
          top: contactSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  const getProductRoute = (title, id) => {
    const t = title.toLowerCase();
    if (t.includes("mandoobee") || t.includes("mandobee")) return "/mandobee";
    if (t.includes("yisbir")) return "/yisbir";
    if (t.includes("tasree3")) return "/tasree3";
    if (t.includes("nazoo") || t.includes("nazo")) return "/nazoo";
    if (t.includes("wasel")) return "/wasel";
    if (t.includes("asset tracking")) return "/asset-tracking";
    return `/construction?id=${id}`;
  };


  const [solutionSections, setSolutionSections] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/allDataInfo/solutionInfo.php`)
      .then((solutionResponse) => {
        const solutionSectionsData = solutionResponse.data;
        setSolutionSections(solutionSectionsData);
      })
      .catch((solutionError) => {
        console.error("Error fetching solution data:", solutionError);
      });
  }, []);


  return (
    <>
      <nav className={navbar ? 'nav-bar active' : 'nav-bar'}>
        <div className='pl-5 lg:pl-[calc((100%-1200px)/2)] lg:pr-[calc((100%-1200px)/2)] py-2 bg-transparent'>
          <Link to='/'>
            <img src='/assets/MEERANA Logo final transparent white-08.png' alt='' className='w-[230px] mt-2 md:w-[300px] lg:w-[400px] ml-[-30px] md:-ml-0 xl:-ml-6' />
          </Link>

          <div className='absolute right-2 top-3 xl:right-[calc((100%-1200px)/2)]'>
            <button className=''>
              {/* <svg className="btn btn-circle swap swap-rotate swap-off fill-[#2563eb]" xmlns="http://www.w3.org/2000/svg" width="24" height="24 " viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" onClick={handleSideMenu}/></svg> */}
              <span
                className=' btn-circle material-icons material-symbols-outlined w-10 h-10 mt-2 p-2 text-[#f5f5f5] bg-[#072FA5]'
                onClick={handleSideMenu}
              >
                menu
              </span>
            </button>
            <div
              className={
                !showSideMenu
                  ? 'fixed top-0 right-0 h-full w-full z-50 transition-transform duration-500 ease-in-out'
                  : ' w-full shadow-inner fixed bg-[#000000bf] top-0 right-0 h-full p-5 z-50 transition-transform duration-500 ease-in-out'
              }
              style={{
                transform: showSideMenu ? 'translateX(0)' : 'translateX(100%)',
              }}
            >
              <nav
                className={
                  !showSideMenu
                    ? 'hidden'
                    : '  w-[250px] md:w-[600px] shadow-inner fixed bg-[#202124] top-0 right-0 h-full p-2 md:p-5 z-50 transition-transform duration-500 ease-in-out'
                }
              >
                <ul className='text-sm z-20'>
                  <li className='h-5 ' onClick={handleSideMenu}>
                    <button className='absolute right-2 top-[19px] xl:right-[155px]'>
                      <span className='material-icons material-symbols-outlined w-10 h-10 p-2 rounded-full text-[#ffff] bg-gradient-to-r from-[#072FA5] to-[#072FA5]'>
                        close
                      </span>
                    </button>
                  </li>
                  <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5 mt-20 cursor-pointer' onClick={closeNavbar}>
                    <h1 onClick={navigateToAbout}>About Meerana</h1>
                  </li>
                  <div className=' relative cursor-pointer text-[#ffff]' onMouseLeave={() => handleMenuHover(false)}>
                    <div className='flex hover:text-[#1A73E8]' onMouseEnter={() => handleMenuHover(true)}>
                      <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5 mt-7 md:mt-10' onMouseEnter={handleSubMenuHover}>Solutions
                        <div className='text-white hover:text-[#1A73E8] text-2xl absolute top-7 md:top-9 right-12' >
                          <span className='material-symbols-outlined'>expand_more</span>
                        </div>
                      </li>
                    </div>


                    {isSubMenuOpen && (
                      <ul className='submenu ml-5 cursor-pointer' onMouseLeave={() => handleSubMenuContainerHover(false)}>
                        {solutionSections.map((solution, index) => (
                          <Link key={index} to={getProductRoute(solution.title, solution.id)}>
                            <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5 mt-5' onClick={() => {
                              closeNavbar();
                              setIsSubMenuOpen(false); // Close the submenu
                            }}>
                              {solution.title}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  </div>

                  <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10 cursor-pointer' onClick={closeNavbar}>
                    <h1 onClick={navigateToTeam}> Our Team</h1>
                  </li>
                  {/* <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10 cursor-pointer' onClick={closeNavbar}>
                    <h1 onClick={navigateToTest}> Testimonals </h1>
                  </li> */}
                  <Link to='/partners'>
                    <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10' onClick={closeNavbar}>
                      Partners & Clients
                    </li>
                  </Link>
                  <Link to='/courses'>
                    <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10' onClick={closeNavbar}>
                      Courses
                    </li>
                  </Link>
                  <Link to='/latest-news'>
                    <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10' onClick={closeNavbar}>
                      Latest News
                    </li>
                  </Link>
                  <Link to='/gallery'>
                    <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10' onClick={closeNavbar}>
                      Gallery
                    </li>
                  </Link>
                  {/*  <Link to='/openai-chatbot'>
                    <li className='flex items-center text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5 mt-7 md:mt-10' onClick={closeNavbar}>
                      <span className='text-xs font-bold text-red-500 mr-1'>Beta</span> OpenAI Chatbot
                    </li>
                  </Link>*/}
                  {/*  <Link to='/mandobee'>
                    <li className='flex items-center text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5 mt-7 md:mt-10' onClick={closeNavbar}>
                      <span className='text-xs font-bold text-red-500 mr-1'>New</span> Mandobee
                    </li>
                  </Link>*/}
                  <li className='text-[16px] md:text-[18px] font-medium text-[#f5f5f5] tracking-wide hover:text-[#1A73E8] mx-5  mt-7 md:mt-10 cursor-pointer' onClick={closeNavbar}>
                    <h1 onClick={navigateToContact}>Contact Us</h1>
                  </li>
                  {/* <li className='text-[16px] md:text-[18px] font-[600] text-[#ffff] hover:text-[#1A73E8] mx-5 mt-10' onClick={closeNavbar}>
                    CAREERS
                  </li> */}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}