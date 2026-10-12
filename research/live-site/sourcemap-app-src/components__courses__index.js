import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerImage from "../../sub-components/banner-image";

const Courses = () => {
    const baseUrl =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BASE_URL_DEV
            : process.env.REACT_APP_BASE_URL_PROD;

    const [courseProviders, setCourseProviders] = useState([]);

    // Function to fetch course providers data from the API
    const getCourseProviders = () => {
        fetch(`${baseUrl}/allDataInfo/courseProviderInfo.php`) // Adjusted endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                // Assuming `data` is an array of providers with courses
                setCourseProviders(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        getCourseProviders();
    }, []);

    return (
        <div className="bg-[#ffff]">
            <BannerImage />
            <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
                <div>
                    <h4 className="text-[14px] font-thin text-[#333333]">
                        <Link to="/">Home</Link> / Course Providers
                    </h4>
                    <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333]">
                        Course Providers
                    </h1>
                    <p className="my-2 text-[#333333]">
                        Explore a wide range of training courses from top providers. Whether you're looking to develop new skills, enhance your career, or pursue a personal passion, our providers offer a diverse array of courses. Join us and embark on a journey of learning and growth!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
                        {courseProviders.map((provider) => (
                            <div className="mb-5 carousel-item pb-5" key={provider.id}>
                                <div
                                    className="w-[275px] md:w-[280px] h-auto min-h-0 border-1 bg-[#f5f5f5] shadow-xl rounded-[10px] relative mt-10 min-[375px]:ml-11 min-[425px]:ml-16 md:ml-5 lg:ml-0"
                                >
                                    <img
                                        src={provider.img_url ? '../assets/' + provider.img_url : '../assets/default.jpg'}
                                        alt={provider.provider_name}
                                        className="w-full h-auto object-cover rounded-t-[10px]"
                                    />
                                    <div className="p-2.5">
                                        <p className="text-[18px] lg:text-[20px] font-bold text-black text-center py-2">
                                            {provider.provider_name}
                                        </p>
                                        <p className="text-[14px] lg:text-[16px] font-normal text-[#333333] !leading-7 text-center">
                                            {provider.provider_description}
                                        </p>
                                        {/* <p className="text-[14px] lg:text-[16px] font-normal text-[#333333] !leading-7 text-center">
                                            {provider.courses && provider.courses.length > 0
                                                ? provider.courses.map(course => course.course_name).join(", ")
                                                : "No courses available"}
                                        </p> */}
                                        <Link
                                            to={`/course-provider/${provider.id}`}
                                            className="block w-full border-2 border-blue-800 text-blue-800 font-bold bg-transparent py-2 my-4 px-4 text-center rounded-md hover:bg-blue-100"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Courses;
