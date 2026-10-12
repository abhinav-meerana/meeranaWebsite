import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {

  const baseUrl = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_BASE_URL_DEV
  : process.env.REACT_APP_BASE_URL_PROD;
  
  const [isFormSubmitted2, setIsFormSubmitted2] = useState(false);
  const [formData2, setFormData2] = useState({
    email: '',
   
  });
  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {

      const formDataObject = new FormData();
      formDataObject.append("email", formData2.email);

      const response = await axios.post(
        `${baseUrl}/allDataInfo/subscribersInfo.php`,
        formDataObject,
      );

      if (response.data['isSuccess']) {
        setIsFormSubmitted2(true);
      } else {
        console.error("Form submission error", response.data);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
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

  const navigateToPartners = () => {
    navigate("/");
    setTimeout(() => {
      const partnerSection = document.getElementById("partner");
      if (partnerSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -100;
        window.scrollTo({
          top: partnerSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  const navigateToSolution = () => {
    navigate("/");
    setTimeout(() => {
      const solutionSection = document.getElementById("solution");
      if (solutionSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -100;
        window.scrollTo({
          top: solutionSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  const SocialLinks = () => (
    <div className='flex space-x-3 mt-4 justify-start'>
      <a href="https://www.instagram.com/meeranatechnologies" target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
      <a href="https://www.linkedin.com/company/meerana" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0A66C2] text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg" aria-label="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>
      <a href="https://x.com/MeeranaTech1" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#000000] text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg border border-[#333]" aria-label="Twitter (X)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
    </div>
  );


  return (
    <>
      <section className='bg-[#3A3A3A] overflow-hidden'>
        <div className='relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:space-x-10 my-5 mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)]'>
        <div className='mt-5 block'>
            <h1 className='text-[20px] lg:text-[20px] font-medium  text-[#f5f5f5]'>About</h1>
            <p className='text-[14px] lg:text-[14px] font-normal text-justify  text-[#f5f5f5] mt-2'>Meerana's mission is to build the most trusted community and deliver the highest quality products & services. Meerana is targeting highest customer satisfaction & user experience through innovative approaches, use of modern technologies and highly competent resources.</p>
        </div>
        <div className='mt-5 block md:!ml-20'>
        <h1 className='text-[20px] lg:text-[20px] font-medium text-[#f5f5f5]'>Company</h1>
            <ul className='text-[14px] lg:text-[14px] font-normal text-justify  text-[#f5f5f5] mt-2 leading-8 cursor-pointer list-none'>
              <li onClick={navigateToAbout}>About Us</li>
              <li onClick={navigateToTeam}>Our Team</li>
              <li onClick={navigateToPartners}>Clients & Partners</li>
              <li onClick={navigateToSolution}>Solutions</li>
            <Link to='/career'><li>Careers</li></Link>
              <Link to='/latest-news'> <li>Latest News</li> </Link>
        </ul>
        </div>
        <div className='mt-5 block'>
        <h1 className='text-[20px] lg:text-[20px] font-medium  text-[#f5f5f5]'>Policies</h1>
        <ul className='text-[14px] lg:text-[14px] font-normal text-justify  text-[#f5f5f5] mt-2 leading-8 cursor-pointer list-none'>
            <Link to='/privacy'><li>Privacy</li></Link>
            <Link to='/site-terms'><li>Site Terms</li></Link>
            <Link to='/legal-of-service'><li>Legal Of Service</li></Link>
        </ul>
        </div>
          <div className='mt-5 block lg:!-ml-10 xl:!-ml-0 md:hidden lg:block'>
            <h1 className='text-[18px] lg:text-[20px] font-medium text-[#f5f5f5] -mt-1 xl:-mt-1.5'>Newsletter</h1>
            <form
              className="mt-5"
              onSubmit={handleSubmit2}
            >
              <input
                type="email"
                name="email"
                value={formData2.email}
                onChange={handleInputChange2}
                required
                placeholder='Enter your email address'
                className='w-full lg:w-[258px] h-[48px] indent-4 bg-transparent shadow-2xl rounded-[10px] placeholder:text-xs !text-white border border-[#f5f5f5]' />

              <button type='submit' className='w-full lg:w-[258px] h-[49px] text-[#ffff] font-normal bg-[#072FA5] rounded-[10px] mt-3 md:mt-2'>Subscribe Now</button>
              {isFormSubmitted2 && (
                <p className="text-[#fff] font-semibold mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </form>
            <SocialLinks />
          </div>
          <div className='mt-5 hidden md:!flex !flex-col lg:!hidden absolute top-[245px] md:right-[calc((100%-430px)/2)]'>
            <h1 className='text-[20px] lg:text-[20px]   text-[#f5f5f5] -mt-1 xl:-mt-1.5'>Newsletter</h1>
            <form
              className="mt-2 !flex flex-col"
              onSubmit={handleSubmit2}
            >
              <input
                type="email"
                name="email"
                value={formData2.email}
                onChange={handleInputChange2}
                required
                placeholder='Enter your email address'
                className='w-[258px] h-[50px] indent-4 bg-transparent shadow-2xl rounded-[10px] placeholder:text-xs !text-white border border-[#f5f5f5]' />

              <button type='submit' className='w-[258px] h-[48px] text-[#ffff] font-normal bg-[#072FA5] rounded-[10px] mt-3 md:mt-2'>Subscribe Now</button>
              {isFormSubmitted2 && (
                <p className="text-[#f5f5f5] font-semibold mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </form>
            <SocialLinks />
          </div>
        </div>
        
        
        <div className='w-full border-t-2 border-[#fff] lg:mx-[calc((100%-1200px)/2) lg:pr-[calc((100%-1200px)/2)] md:mt-12 lg:mt-0'></div>
        <div className='my-5 mx-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)]'>
          <h1 className='text-[14px] md:text-[14px]  text-[#f5f5f5] text-center'>© All rights reserved - 2024 Meerana Technologies LLC</h1>
        </div>
      </section>
      
    </>
  )
}
