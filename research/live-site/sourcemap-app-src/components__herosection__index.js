import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Landingpage from '../landingpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Herosection() {

  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD;

  const [heroInfo, setHeroInfo] = useState([]);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  const getHeroSectionInfo = () => {

    fetch(`${baseUrl}/allDataInfo/homepageInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        setHeroInfo(data)
      }).catch((error) => {
        console.error('Error fetching data:', error);
      })

  }

  useEffect(() => {
    getHeroSectionInfo();
  }, [])
  const navigate = useNavigate();
  const navigateToAbout = () => {
    navigate("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const scrollOptions = {
          behavior: "smooth",
        };
        const offset = -60;
        window.scrollTo({
          top: aboutSection.offsetTop + offset,
          ...scrollOptions,
        });
      }
    }, 100);
  }

  return (
    <>
      <div className="banner-container relative top-0 overflow-hidden">
        <div className="swiper-blur-gradient"></div>
        <Swiper
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          mousewheel={false} // Disable mousewheel
          mousewheelControl={false} // Enable mousewheel control
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="swiper-container bg-black bg-opacity-40"
        >
          {heroInfo.length > 0 && heroInfo.map((hero, index) => (
            <SwiperSlide key={index}>
              <div className="banner-overlay"></div>


              <img src={`/assets/${hero.heroBanner}`} alt="" className="banner-image h-[80vh] w-full lg:h-[100vh] xl:h-auto object-cover" />


              <div className="absolute top-[30%] md:top-[30%] lg:top-[30%] z-10 w-[250px] min-[375px]:min-w-[300px] min-[425px]:w-[355px] md:w-[600px] text-[#f5f5f5] mx-8 md:mx-10 xl:ml-[calc((100%-1200px)/2)] lg:mr-[calc((100%-1200px)/2)]">


                <h1 className='text-[17px] font-bold md:text-[28px] lg:text-[40px]'>{hero.title}</h1>
                <p className='block mt-2 text-[14px] md:text-[20px] font-thin !leading-7 md:!leading-9 text-justify !tracking-tight'>{hero.content}</p>
                <button className='md:mt-5 h-[35px] lg:w-[183px] lg:h-[50px] p-2 text-[#f5f5f5] rounded-[10px] md:rounded-xl text-[12px] lg:text-lg font-normal md:font-semibold bg-[#072FA5] mt-2' onClick={navigateToAbout}>Read More</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
      <Landingpage />

    </>
  )
}
