import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "react-phone-number-input/style.css";
import Location from "../location";
import PhoneInput from "react-phone-number-input";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { countries } from "../../data/countries";
import Alert from "../../sub-components/Alert";
// ..
AOS.init();

export default function Landingpage() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

  const routerLocation = useLocation();
  const videoRef = useRef(null);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const [email, setEmail] = useState("");
  const [activePopup, setActivePopup] = useState(null);

  const openEmailPopup = (index) => {
    setActivePopup(index);
  };

  const closeEmailPopup = () => {
    setActivePopup(null);
  };

  const downloadWithPopup = async (pdfUrl, index) => {
    try {
      if (validateEmail(email)) {
        const formDataObject = new FormData();
        formDataObject.append("email", email);

        const response = await axios.post(
          `${baseUrl}/allDataInfo/profiledownlodersInfo.php`,
          formDataObject
        );

        if (response.data["isSuccess"]) {
          // Create a temporary anchor element to initiate download
          const anchor = document.createElement('a');
          anchor.href = `/assets/${pdfUrl}`;
          anchor.download = `MEERANA-CP-DE-V1.0 2026.pdf`;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);

          closeEmailPopup();
        } else {
          console.error("Form submission error", response.data);
        }
      } else {
        alert("Please enter a valid email address.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange1 = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // intergration

  const [aboutus, setAboutusInfo] = useState([]);
  const [chooseus, setChooseusInfo] = useState([]);
  const [ourTeam, setOurTeam] = useState([]);
  const [ourTeamInfo, setOurTeamInfo] = useState([]);
  const [solution, setSolution] = useState([]);
  const [testimonal, setTestimonal] = useState([]);
  const [ourPartners, setPartners] = useState([]);
  const [experience, setExperience] = useState([]);
  const [location, setLocation] = useState([]);
  const [contactusinfo, setContactusinfo] = useState([]);
  const [latestNewsInfo, setLatestNewsInfo] = useState([]);
  const [phone, changePhone] = useState();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Country: "",
    Product: "",
    Message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const getAboutusInfo = () => {
    fetch(`${baseUrl}/allDataInfo/aboutusInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAboutusInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getLatestNewsInfo = () => {
    fetch(`${baseUrl}/allDataInfo/latestnewsInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLatestNewsInfo([...data].reverse());
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getChooseusInfo = () => {
    fetch(`${baseUrl}/allDataInfo/chooseusInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setChooseusInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getTeamInfo = () => {
    fetch(`${baseUrl}/allDataInfo/ourteamInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOurTeam(data);
        setOurTeamInfo(data[0].team_members);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const getSolutionInfo = () => {
    fetch(`${baseUrl}/allDataInfo/solutionInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {

        // Remove Smart Office Application from bullet list if present in DB description
        const cleanedData = data.map(item => {
          if (item.description) {
            item.description = item.description
              .replace(/<li>[-\s]*Smart Office Application<\/li>/i, "")
              .replace(/[-\s]*Smart Office Application<\/li>/i, "");
          }
          return item;
        });
        setSolution(cleanedData);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

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

  const getPartnersInfo = () => {
    fetch(`${baseUrl}/allDataInfo/partners_clientsInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPartners(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const getTestimonalsInfo = () => {
    fetch(`${baseUrl}/allDataInfo/testimonalsInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTestimonal(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const getExperience = () => {
    fetch(`${baseUrl}/allDataInfo/experienceInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExperience(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const getLocation = () => {
    fetch(`${baseUrl}/allDataInfo/locationInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLocation(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const getContactusinfo = () => {
    fetch(`${baseUrl}/allDataInfo/contactusinfoInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setContactusinfo(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  useEffect(() => {
    getAboutusInfo();
    getChooseusInfo();
    getTeamInfo();
    getSolutionInfo();
    getTestimonalsInfo();
    getPartnersInfo();
    getExperience();
    getLocation();
    getContactusinfo();
    getLatestNewsInfo();
  }, []);

  useEffect(() => {
    if (routerLocation.hash === "#contact") {
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const yOffset = -100;
          const y = contactSection.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 1500);
    }
  }, [routerLocation]);



  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    type: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObject = new FormData();
      formDataObject.append("FullName", formData.FullName);
      formDataObject.append("Email", formData.Email);
      formDataObject.append("Phone", formData.Phone);
      formDataObject.append("Country", formData.Country);
      formDataObject.append("Product", formData.Product);

      formDataObject.append("Message", formData.Message);

      const response = await axios.post(
        `${baseUrl}/allDataInfo/contactformInfo.php`,
        formDataObject,
      );

      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

      if (data && data["isSuccess"]) {
        setIsFormSubmitted(true);
        setAlertConfig({
          message: "Thanks for contacting us, we have received your response and we will get back to you soon.",
          type: "success",
        });
        setShowAlert(true);
        setFormData({
          FullName: "",
          Email: "",
          Phone: "",
          Country: "",
          Product: "",
          Message: "",
        });
      } else {
        console.error("Form submission error", data);
        setAlertConfig({
          message: data?.message || "Failed to submit form. Please try again.",
          type: "error",
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setAlertConfig({
        message: "Unable to reach server. Please check your connection and try again.",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // dropdwon
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };
  //

  const handleMouseEnter = (index) => {
    if (ourTeamInfo && ourTeamInfo.length > 0) {
      const updatedTeam = [...ourTeamInfo];
      updatedTeam[index].isHover = "true";
      setOurTeamInfo(updatedTeam);
    }
  };

  const handleMouseLeave = (index) => {
    if (ourTeamInfo && ourTeamInfo.length > 0) {
      const updatedTeam = [...ourTeamInfo];
      updatedTeam[index].isHover = "false";
      setOurTeamInfo(updatedTeam);
    }
  };

  const [activeTab, setActiveTab] = useState("content-1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="bg-[#ffff] pt-10">
        {/* About Us */}
        {aboutus && aboutus.length > 0 && (
          <section
            className="mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden"
            id="about"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full">
              <div className="flex items-start md:items-center md:justify-center transform md:-rotate-90 rotate-0 md:-ml-32 xl:-ml-80">
                <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#333333] ">
                  {aboutus[0].heading}
                </h1>
              </div>

              <div className="flex items-center justify-center w-full md:w-[350px] lg:w-[400px] xl:w-[600px] md:-ml-36 xl:-ml-[280px]">
                <div className="block">
                  <h1 className="text-[22px] xl:text-[45px] font-bold  text-[#072FA5]">
                    {aboutus[0].title}
                  </h1>

                  <div className="flex space-x-2 mt-5">
                    {/* <div className='h-[2px] bg-[#3f3f46] w-4 min-[375px]:w-6 xl:w-[60px] mt-3'></div> */}
                    <p className="text-[14px] min-[375px]:text-[16px] lg:text-[18px] text-[#333333] tracking-wide font-bold -mt-2 ">
                      {aboutus[0].subtitle}
                    </p>
                    <div className="h-[2px] bg-[#444444] w-3 min-[375px]:w-7 xl:w-[190px] mt-3 "></div>
                  </div>
                  <div className="mt-5">
                    <p className="text-[14px] lg:text-[18px] font-normal text-justify text-[#333333]  leading-8 ">
                      {aboutus[0].description}
                    </p>

                    <h2 className="lg:text-[20px] font-bold text-[#072FA5] mt-5">
                      Our Vision
                    </h2>
                    <p className="text-[14px] lg:text-[18px] font-normal  text-justify text-[#333333]  leading-8 mt-5">
                      “Build the most trusted community to deliver the highest
                      quality technological services” - Meerana Community
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="mt-5 flex">
                  <img
                    src="/assets/bg-vector.png"
                    alt=""
                    className=" w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] "
                  />
                  <img
                    src={`/assets/${aboutus[0].image}`}
                    alt=""
                    className=" -ml-[250px] lg:-ml-[380px] w-[250px] h-[250px] lg:w-[370px] lg:h-[370px] rounded-full"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* about breif */}

        <section className=" mt-10 bg-[#f9f9f9] w-full overflow-hidden">
          {chooseus && chooseus.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-10 mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] pb-2 overflow-hidden  mt-2 ">
              <div className="mt-5">
                <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#333333] ">
                  {chooseus[0].heading}
                </h1>
                {/* <div data-aos="fade-right"
                  data-aos-easing="linear"
                  data-aos-duration="1000">
                  <div className='border-t-[3px] border-t-[#3f3f46] h-[2px] bg-[#3f3f46] w-[83px]'></div></div> */}

                <p
                  className="text-[14px] lg:text-[18px] font-normal mt-5 text-justify text-[#444444] leading-8  "
                  dangerouslySetInnerHTML={{ __html: chooseus[0].description }}
                ></p>
              </div>
              <div className="mt-5 md:mt-12 lg:mt-32 container">
                <iframe
                  className="responsive-iframe"
                  src="https://www.youtube.com/embed/VRD8hzICcYQ"
                  title="Dubai Dreamers: From Dubai to the World with Meerana Technologies"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          )}
        </section>
        {/* Solution */}

        <section className=" bg-[#202124] w-full overflow-hidden mt-10">
          <div className="w-full xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1250px)/2)]   p-5 md:p-10  ">
            <div className="block mt-5 ">
              <h1
                className="text-[24px] lg:text-[28px] font-semibold  text-[#f5f5f5]  lg:ml-0 "
                id="solution"
              >
                Solutions
              </h1>
            </div>



            <div className="w-full flex  md:gap-5">
              <div className="carousel ">
                {solution.map((solution, index) => (
                  <div className="mb-10 carousel-item mx-2">
                    <div
                      className="w-[280px] md:w-[284px] h-[480px] border-1  bg-[#f5f5f5] rounded-[10px] relative mt-10  min-[375px]:ml-11 min-[425px]:ml-16 md:ml-5 lg:ml-0"
                      key={index}
                    >
                      <div className="p-4">
                        <img
                          src={`/assets/${solution.image}`}
                          alt=""
                          className="w-full"
                        />
                        <h1 className="lg:text-[20px] font-medium text-[#072FA5] mt-2">
                          {solution.title}
                        </h1>
                        <div
                          className="text-[14px] lg:text-[16px] font-normal text-left text-[#333333]  leading-6 my-[10px] "
                          dangerouslySetInnerHTML={{
                            __html: solution.description.slice(0, 410),
                          }}
                        ></div>
                      </div>

                      <Link to={getProductRoute(solution.title, solution.id)}>
                        <div className="w-full h-[42px] bg-[#072FA5] rounded-b-md  text-center p-1 absolute bottom-0 cursor-pointer">
                          <p className=" text-[#f5f5f5] text-[16px] md:text-[20px] font-medium">
                            Read More
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </section>

        {/* Team */}
        {ourTeam && ourTeam.length > 0 && (
          <section
            className="mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] mt-10 overflow-hidden"
            id="team"
          >
            <div className="overflow-hidden">
              <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#333333] ">
                {ourTeam[0].heading}
              </h1>
              <p className="text-[14px] lg:text-[18px] font-normal mt-5 text-justify text-[#333333] leading-8 lg:w-[700px]">
                {ourTeam[0].description}
              </p>
            </div>

            <div className="flex flex-row space-x-5 w-full h-auto">
              <div className="block w-full mt-10 gap-3">
                {ourTeamInfo.map((team, index) => (
                  <div
                    className={`z-0 flex-grow text-white cursor-pointer mb-5 ${activeTab === `content-${index + 1}`
                      ? "opacity-100"
                      : "opacity-40"
                      }`}
                    onClick={() => handleTabClick(`content-${index + 1}`)}
                    key={index}
                  >
                    <div className="md:h-[149px] w-[165px] h-[124px] border md:w-[388px] lg:w-[488px] shadow-xl pl-5 p-5 items-center bg-[#f9f9f9] rounded-lg flex flex-col md:flex-row space-x-3">
                      <img
                        src={`/assets/${team.teamImage}`}
                        alt=""
                        className="rounded-full w-[60px] border-0 border-[#2563eb]  border-opacity-50"
                      />
                      <h1 className="text-[10px] md:text-[18px] font-medium text-[#444444] mt-3 md:mt-0">
                        {team.teamName}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-grow w-full h-auto">
                {ourTeamInfo.map((team, index) => (
                  <div
                    key={index}
                    className={`h-auto overflow-y-auto ${activeTab === `content-${index + 1}` ? "block" : "hidden"
                      }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-[16px] md:text-[18px] font-normal text-[#444444] text-justify mt-10 md:mt-0 flex flex-col justify-center items-center">
                        <img
                          src={`/assets/${team.teamImage}`}
                          alt=""
                          className="rounded-full w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[300px] lg:h-[300px] border-0 border-[#2563eb]  border-opacity-50"
                        />
                        <h1 className="text-[14px] md:text-[20px] font-bold text-[#444444] mt-2 text-center">
                          {team.teamName}
                        </h1>
                        <h3 className="text-[12px] md:text-[18px] font-medium text-[#072FA5] mt-2 text-center">
                          {team.teamPosition}
                        </h3>
                        <a
                          href={team.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col justify-center items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="40"
                            height="40"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#2563eb"
                              d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M14 19H18V34H14zM15.988 17h-.022C14.772 17 14 16.11 14 14.999 14 13.864 14.796 13 16.011 13c1.217 0 1.966.864 1.989 1.999C18 16.11 17.228 17 15.988 17zM35 24.5c0-3.038-2.462-5.5-5.5-5.5-1.862 0-3.505.928-4.5 2.344V19h-4v15h4v-8c0-1.657 1.343-3 3-3s3 1.343 3 3v8h4C35 34 35 24.921 35 24.5z"
                            ></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* /banner */}

        <div className="mt-10 bg-[#202124] w-full h-auto lg:h-[288px] overflow-hidden p-5 xl:p-28 flex justify-center">
          {experience.map((exp, index) => (
            <div
              className="mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] block lg:flex gap-10 justify-center"
              key={index}
            >
              <h1 className="text-[18px] md:text-[28px] xl:text-[40px] font-bold text-[#ffff] text-center lg:text-justify lg:mt-[105px] xl:mt-0 !tracking-wider">
                {exp.description}
              </h1>
              <div className="flex flex-col justify-center items-center">
                <button
                  className="w-[200px] md:w-[285px] h-[40px] md:h-[50px] text-[18px] md:text-[24px] text-[#f5f5f5] font-normal bg-[#072FA5] rounded-[10px] mt-5 lg:mt-0"
                  onClick={() => openEmailPopup(index)}
                >
                  Download Profile
                </button>
              </div>
              {activePopup === index && (
                <div
                  className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-40"
                  onClick={closeEmailPopup}
                >
                  <div className="modal-bg absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
                  <div className="email-popup bg-white p-4 w-full md:w-[600px] mx-5 h-[200px] rounded-lg shadow-lg z-40 ">
                    <h1 className="md:text-center md:mt-5">
                      If you want to download profile, submit your email !
                    </h1>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={handleInputChange1}
                      onClick={(e) => e.stopPropagation()} //to stop
                      className="w-full py-2 px-4 my-3 border border-gray-300 rounded-lg placeholder:text-[#787878] bg-white"
                    />
                    <button
                      onClick={() => downloadWithPopup(exp.pdfUrl, index)}
                      className="bg-[#072FA5] text-white px-4 py-2 rounded-lg mr-2"
                    >
                      OK
                    </button>
                    <button
                      onClick={closeEmailPopup}
                      className="border border-[#072FA5]  text-[#072FA5] px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* News */}
        <section
          className="w-full overflow-hidden mt-10 bg-[#f5f5f5]"
          id="news"
        >
          <div className="w-full xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1250px)/2)] p-5">
            <div className="block mt-5 ">
              <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#333333] ">
                Latest News
              </h1>
              <p className="text-[14px] lg:text-[18px] font-normal mt-5 text-justify text-[#333333] leading-8 lg:w-[700px]">
                Explore our news feed for new updates and compelling new stories
              </p>
            </div>



            <div className="w-full flex md:gap-5">
              <div className="carousel">
                {latestNewsInfo.map((news, index) => (
                  <div className="mb-10 carousel-item mx-2" key={index}>
                    <div
                      className="w-[284px] h-[465px] border-1  bg-[#fff] shadow-xl rounded-[10px] relative mt-10 ml-0 overflow-hidden"
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



            <div className="flex justify-center items-center mt-2">
              <Link to="/latest-news">
                <button className="p-2 w-[280px] text-[16px] lg:text-[18px] font-semibold border border-[#072FA5] rounded-md  text-[#072FA5]">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* partners& client */}
        {ourPartners && ourPartners.length > 0 && (
          <section className=" mt-10 mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
            <h1
              className="text-[24px] lg:text-[28px] font-semibold  text-[#333333] "
              id="partner"
            >
              {ourPartners[0].heading}
            </h1>

            <div className="">
              <p className="text-[14px] lg:text-[18px] font-normal  text-justify text-[#333333]  leading-8 mt-5 ">
                We are proud to partner with a wide range of organizations on
                emerging technologies. Together we bring unique and global
                solutions for reinventing business.
              </p>{" "}
            </div>

            {ourPartners.map((partner, index) => (
              <div className="flex mt-5 carousel " key={index}>
                {partner.companyLogo.slice(0, 4).map((partner, index) => (
                  <div className="carousel-item h-[100px]">
                    <img
                      src={`/assets/${partner}`}
                      alt=""
                      className=" grayscale object-cover xl:w-[290px] h-[70px] "
                    />
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-center items-center mt-2">
              <Link to="/partners">
                <button className="p-2 w-[280px] text-[16px] lg:text-[18px] font-semibold border  border-[#072FA5] rounded-md  text-[#072FA5]">
                  See more
                </button>
              </Link>
            </div>

            {/* </Swiper> */}
          </section>
        )}
        {/* Contact */}

        <section
          className="bg-[#202124] w-full h-auto  mt-5 pb-10"
          id="contact"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5 mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
            <div className="block mt-5 w-full">
              <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#f5f5f5]  ">
                Contact Us
              </h1>

              {contactusinfo.map((continfo, index) => (
                <p className="text-[14px] lg:text-[18px] font-normal  text-justify text-[#f5f5f5]  leading-8 mt-5">
                  {continfo.description}{" "}
                </p>
              ))}

              <form className="mt-5 !block" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="FullName"
                  value={formData.FullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="border border-1 border-[#f5f5f5] w-full  h-[48px] rounded-[10px] indent-3 bg-transparent text-[#f5f5f5]"
                />
                <input
                  type="text"
                  name="Email"
                  value={formData.Email}
                  placeholder="Email Address *"
                  onChange={handleInputChange}
                  required
                  className="border border-1 border-[#f5f5f5]  w-full  h-[48px] rounded-[10px] indent-3 mt-5 bg-transparent text-[#f5f5f5]"
                />

                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  placeholder='Phone Number'
                  onChange={handleInputChange}

                  className='border border-1 border-[#f5f5f5]  w-full  h-[48px] rounded-[10px] indent-3 mt-5 bg-transparent text-[#f5f5f5]'
                />

                {/* <PhoneInput
                  placeholder="Enter phone number"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  numberInputProps={{
                    className: "bg-transparent",
                  }}
                  className="border border-1 border-[#271f1f]  w-full  h-[48px] rounded-[10px] indent-3 mt-5 px-2"
                /> */}

                <select
                  id="Country"
                  value={formData.Country}
                  name="Country"
                  onChange={handleInputChange}
                  className="border border-1 border-[#f5f5f5] w-full h-[48px] rounded-[10px] indent-3 mt-5 bg-transparent text-[#f5f5f5]"
                >
                  <option value="" className="text-[#202124]">Select a Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country} className="text-[#202124]">
                      {country}
                    </option>
                  ))}
                </select>

                <select
                  id="Product"
                  value={formData.Product}
                  name="Product"
                  onChange={handleInputChange}
                  className="border border-1 border-[#f5f5f5] w-full h-[48px] rounded-[10px] indent-3 mt-5 bg-transparent text-[#f5f5f5]"
                >
                  <option value="" className="text-[#202124]">Our Products</option>
                  <option value="Mandoobee" className="text-[#202124]">Mandoobee</option>
                  <option value="Tasree3" className="text-[#202124]">Tasree3</option>
                  <option value="Asset Tracking" className="text-[#202124]">Asset Tracking</option>
                  <option value="NAZO" className="text-[#202124]">NAZO</option>
                  <option value="Wasel" className="text-[#202124]">Wasel</option>
                  <option value="Voice Assistance" className="text-[#202124]">Voice Assistance</option>
                  <option value="Zing HR" className="text-[#202124]">Zing HR</option>
                  <option value="Yisbir" className="text-[#202124]">Yisbir</option>
                </select>

                <textarea
                  className="w-full h-[187px] border border-1 border-[#f5f5f5] rounded-[10px] indent-4 pt-2 bg-transparent mt-5 text-[#f5f5f5]"
                  name="Message"
                  value={formData.Message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`mt-5 w-full h-[52px] rounded-[10px] text-center p-2 bg-[#072FA5] text-[#f5f5f5] flex justify-center items-center transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#062480]'}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
              {showAlert && (
                <Alert
                  message={alertConfig.message}
                  type={alertConfig.type}
                  onClose={handleCloseAlert}
                />
              )}
            </div>

            {/* /Location */}

            <div className="bg-[#202124] w-full hidden lg:block">
              <Location />
            </div>
          </div>
        </section>

        {/* Globe */}
        {/* <div className="bg-[#202124] w-full hidden lg:block">
          <Location/>
        </div> */}

      </div>
    </>
  );
}
