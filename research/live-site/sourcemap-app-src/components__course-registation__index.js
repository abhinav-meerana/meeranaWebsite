import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BannerImage from '../../sub-components/banner-image';

const CourseRegistration = () => {
  const { id } = useParams();
  const baseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD;

  const [courseDetails, setCourseDetails] = useState(null);
  // console.log(courseDetails)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Qualification: '',
    PhoneNumber: '',
    Location: '',
    cvUrl: null,
  });

  const getCourseDetails = () => {
    fetch(`${baseUrl}/allDataInfo/courseInfo.php?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCourseDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCourseDetails();
  }, [id]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        cvUrl: file,
      });
    } else {
      console.error("No file selected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObject = new FormData();
      formDataObject.append('FullName', formData.FullName);
      formDataObject.append('Email', formData.Email);
      formDataObject.append('Qualification', formData.Qualification);
      formDataObject.append('PhoneNumber', formData.PhoneNumber);
      formDataObject.append('Location', formData.Location);
      formDataObject.append('cvUrl', formData.cvUrl);
      formDataObject.append('CourseId', id);
      formDataObject.append('CourseName', courseDetails?.course_name);
      formDataObject.append('ProviderId', courseDetails?.provider_id);
      formDataObject.append('Price', courseDetails?.course_price);
      formDataObject.append('Decs', courseDetails?.course_description);
      formDataObject.append('Duration', courseDetails?.course_duration);

      for (let [key, value] of formDataObject.entries()) {
        // console.log(key, value);
      }

      const response = await fetch(
        `${baseUrl}/allDataInfo/courseRegistrationInfo.php`,
        {
          method: 'POST',
          body: formDataObject
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess) {
          setIsFormSubmitted(true);
          setFormData({
            FullName: '',
            Email: '',
            Qualification: '',
            PhoneNumber: '',
            Location: '',
            cvUrl: ''
        });
        } else {
          console.error("Form submission error", data);
        }
      }

    } catch (error) {
      console.error("Form submission error:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-[#ffff]">
      <BannerImage />
      <section className="mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 space-x-10 mt-5 h-auto">
          <div>
            <h4 className="text-[14px] text-[#333333]">
              <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / {courseDetails?.course_name}
            </h4>
            <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333]">
              {courseDetails?.course_name}
            </h1>
            <p className="text-[18px] mt-3 text-[#333333]">
              Provider: {courseDetails?.provider_id}
            </p>
            <p className="text-[18px] mt-3 text-[#333333]">
              Price: {courseDetails?.course_price}
            </p>
            <p className="text-[18px] mt-3 text-[#333333]">
              Duration: {courseDetails?.course_duration}
            </p>
            <p className="text-[14px] lg:text-[18px] font-normal text-justify text-[#333333] leading-8 mt-5">
              {courseDetails?.course_description}
            </p>

          </div>
          <div className="flex flex-col items-center justify-center mt-5">
            <img src="../assets/course_provider1.jpeg" alt="Course" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex flex-col relative md:my-1 lg:my-6 xl:my-8 pb-10 md:pb-0">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              required
              placeholder="Enter full name"
              name="FullName"
              value={formData.FullName}
              onChange={handleInputChange}
              className="w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] border border-1 border-[#999999] bg-[#f5f5f5] rounded-[10px] indent-3 bg-transparent"
            />

            <input
              type="email"
              name="Email"
              required
              value={formData.Email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="border border-1 border-[#999999] bg-[#f5f5f5] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5"
            />

            <input
              type="text"
              name="Qualification"
              required
              value={formData.Qualification}
              onChange={handleInputChange}
              placeholder="Enter qualification"
              className="border border-1 border-[#999999] bg-[#f5f5f5] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5"
            />

            <input
              type="tel"
              name="PhoneNumber"
              required
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="border border-1 border-[#999999] bg-[#f5f5f5] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5"
            />

            <input
              type="text"
              name="Location"
              required
              value={formData.Location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="border border-1 border-[#999999] bg-[#f5f5f5] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5"
            />


            <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333]">
              Upload CV / Resume
            </h1>

            <div className="flex relative">
              <input
                type="file"
                name="cvUrl"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="border border-1 border-[#999999] bg-[#EEEEEE] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5 pt-3 file:bg-[#072FA5] file:text-[#f5f5f5] file:border-[#072FA5]"
              />
              <button
                type="button"
                className="mt-5 w-[108px] h-[50px] rounded-[10px] bg-[#072FA5] text-center p-2 text-[#f5f5f5] absolute right-[4px] md:right-[calc((100%+20px)/2)] top-[3px] md:top-[2px]"
              >
                Upload
              </button>
            </div>

            <button
              type="submit"
              className="mt-5 w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[52px] rounded-[10px] bg-[#072FA5] text-center p-2 text-[#f5f5f5]"
            >
              Register
            </button>
          </form>
          {isFormSubmitted && (
            <p className="text-[#333333] font-semibold mt-2">
              Thank you for registering! We will contact you soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CourseRegistration;
