import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BannerImage from '../../sub-components/banner-image';

const Careers = () => {
    const baseUrl = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BASE_URL_DEV
        : process.env.REACT_APP_BASE_URL_PROD;

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Message: '',
        pdfUrl:  null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formDataObject = new FormData();
            formDataObject.append("FullName", formData.FullName);
            formDataObject.append("Email", formData.Email);
            formDataObject.append("Message", formData.Message);
            formDataObject.append("pdfUrl", formData.pdfUrl); 
    
            // console.log("FormData:", formDataObject); 
    
            const response = await axios.post(
                `${baseUrl}/allDataInfo/carrerformInfo.php`,
                formDataObject,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", 
                    },
                }
            );
    
            if (response.data.isSuccess) {
                setIsFormSubmitted(true);
                setFormData({
                    FullName: "",
                    Email: "",
                    Message: "",
                    pdfUrl: null
                });
                // console.log("Form submission successful");
            } else {
                console.error("Form submission error", response.data);
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
    const handleImageUpload = (e) => {
        const file = e.target.files[0]; 
        setFormData({
            ...formData,
            pdfUrl: file,
        });
    };

    return (
        <>
            <div className=' bg-[#ffff]'>
                <BannerImage />
                <section className='relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden'>
                    <div className='grid grid-cols-1 md:grid-cols-2 space-x-10 mt-5 h-auto'>
                        <div className=''>
                            <h4 className='text-[14px]  text-[#333333]'><Link to='/'>Home</Link> / Careers</h4>
                            <h1 className='text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333] '>Careers</h1>
                            <div className='mt-5'>
                                <h1 className='text-[24px] md:text-[42px] xl:text-[64px] font-bold  text-[#333333] lg:leading-[70px]'>Be a part of <br />
                                   <span className='text-[#072FA5]'> Something Great </span> </h1>
                                <p className='text-[14px] lg:text-[18px] font-normal text-justify text-[#333333]  leading-8 mt-5 '>
                                    Welcome to our career application form! Take the first step towards joining our dynamic team by providing your essential details and showcasing your qualifications
                                </p>
                            </div>

                        </div>
                        <div className="flex flex-col items-center justify-center mt-5 !-ml-0 md:!ml-5">
                            <img src="./assets/career.png" alt="" className='w-full h-auto' />
                        </div>
                    </div>

                    <div className='!flex !flex-col relative md:-top-10 lg:-top-36 xl:-top-52 pb-10 md:pb-0'>
                        <form  className='!flex !flex-col' onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                required
                                placeholder='Enter full name'
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleInputChange}
                            className='w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] border border-1 border-[#999999]  bg-[#f5f5f5] rounded-[10px] indent-3 bg-transparent'
                            />

                            <input
                                type="text"
                                name="Email"
                                required
                                value={formData.Email}
                                onChange={handleInputChange}
                                placeholder='Enter email'
                                className='border border-1 border-[#999999] bg-[#f5f5f5] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5'
                            />

                            <textarea
                                className='w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[187px] border border-1 border-[#999999] bg-[#f5f5f5] rounded-[10px] indent-4 pt-2 bg-transparent mt-5'
                                name="Message"
                                value={formData.Message}
                                onChange={handleInputChange}
                                placeholder='Message' required
                            ></textarea>

                            <div className='flex relative'>
                            <input
                            type="file"
                            name="pdfUrl"
                            onChange={handleImageUpload}
                                    className='border border-1 border-[#999999] bg-[#EEEEEE] w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[56px] rounded-[10px] indent-3 bg-transparent mt-5 pt-3 file:bg-[#072FA5] file:text-[#f5f5f5] file:border-[#072FA5]'
                        />
                        <button 
                            type='button' 
                                    className='mt-5 w-[108px] h-[50px] rounded-[10px] bg-[#072FA5] text-center p-2 text-[#f5f5f5] absolute right-[4px] md:right-[calc((100%+20px)/2)] top-[3px] md:top-[2px]'
                        >
                            Upload
                        </button>
                            </div>
                            <button type='submit' className='mt-5 w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[52px]  rounded-[10px] bg-[#072FA5] text-center p-2 text-[#f5f5f5]'>Send Message</button>
                        </form>
                        {isFormSubmitted && (
                            <p className="text-[#333333] font-semibold mt-2">
                                Thank You for your interest, We will call you back as soon as possible!
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Careers
