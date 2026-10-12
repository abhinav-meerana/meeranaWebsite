import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BannerImage from "../../sub-components/banner-image";
import { Link } from "react-router-dom";

const CourseProviderDetails = () => {
    const { id } = useParams();
    const baseUrl =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BASE_URL_DEV
            : process.env.REACT_APP_BASE_URL_PROD;

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch course provider data by ID
    const getCourseProviderDetails = () => {
        fetch(`${baseUrl}/allDataInfo/courseProviderInfo.php?id=${id}`) // Adjusted endpoint for single provider
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setProvider(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getCourseProviderDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-[#ffff]">
            <BannerImage />
            <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
                <div>
                    <h4 className="text-[14px] font-thin text-[#333333]">
                        <Link to="/">Home</Link> / <Link to="/courses">Course Providers</Link> / {provider.provider_name}
                    </h4>
                    <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333]">
                        {provider.provider_name}
                    </h1>
                    <img
                        src={provider.img_url ? '../assets/' + provider.img_url : '../assets/default.jpg'}
                        alt={provider.provider_name}
                        className="w-full h-auto object-cover rounded-t-[10px] mt-5"
                    />
                    <p className="my-4 text-[#333333]">
                        {provider.provider_description || "No description available"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {provider.courses && provider.courses.length > 0 ? (
                            provider.courses.map((course) => (
                                <div
                                    className="border border-gray-200 rounded-lg p-4 shadow-lg"
                                    key={course.id}
                                >
                                    <h3 className="text-xl font-semibold mb-2">
                                        {course.course_name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Duration: {course.course_duration}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Price: AED {course.course_price}
                                    </p>
                                    <Link
                                            to={`/course-registration/${course.id}`}
                                            className="block w-full border-2 border-blue-800 text-blue-800 font-bold bg-transparent py-2 my-4 px-4 text-center rounded-md hover:bg-blue-100"
                                        >
                                            Learn More
                                        </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-600 font-bold text-[18px] py-4"> Currently, there are no courses available.Please check back soon.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseProviderDetails;
