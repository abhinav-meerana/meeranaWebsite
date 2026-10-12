import React from 'react'
import { Link } from 'react-router-dom'
import BannerImage from '../../sub-components/banner-image'

const legalOfService = () => {
    return (
        <div className='bg-[#ffff]'>
            <BannerImage />

            <section className='relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden'>
                <div className=''>
                    <h4 className='text-[14px] font-thin text-[#333333]'><Link to='/'>Home</Link> / Legal of Service</h4>
                    <h1 className='text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333] '>Legal of Service</h1>
                    <p className='text-[14px] lg:text-[16px] font-normal text-justify text-[#333333] leading-8 my-5 '>
                        Our website's Terms of Service govern the use of our platform, outlining the rights and responsibilities of both users and the platform itself.
                        By accessing or using our website, users agree to abide by these terms. The Terms of Service cover various aspects, including content ownership,
                        user conduct, and limitations of liability. Users are expected to comply with applicable laws and regulations while using the website. The platform
                        retains the right to suspend or terminate user accounts for violations of these terms or any activity deemed harmful. Additionally, our Terms of
                        Service may be updated periodically, and users are responsible for reviewing these changes. The platform aims to provide accurate and up-to-date
                        information but does not guarantee the completeness or accuracy of content. Users are encouraged to use the website responsibly and report any
                        unauthorized or suspicious activities. The Terms of Service also address dispute resolution mechanisms and applicable governing laws.
                        By continuing to use our website, users acknowledge their acceptance of these terms and any subsequent modifications.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default legalOfService
