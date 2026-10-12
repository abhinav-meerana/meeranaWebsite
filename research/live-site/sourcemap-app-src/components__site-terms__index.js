import React from 'react'
import { Link } from 'react-router-dom'
import BannerImage from '../../sub-components/banner-image'

const siteTerms = () => {
  return (
    <div className='bg-[#ffff]'>
      <BannerImage />

      <section className='relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden pb-10'>
        <div className=''>
          <h4 className='text-[14px] font-thin text-[#333333]'><Link to='/'>Home</Link> / Site Terms</h4>
          <h1 className='text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333] '>Site Terms</h1>
          <p className='text-[14px] lg:text-[16px] font-normal text-justify text-[#333333] leading-8 my-5 '>
            By submitting this application, you are confirming that all information provided is accurate and complete to the best of your knowledge.
            Our company reserves the right to verify the authenticity of the information and may disqualify applicants with false or misleading details.
            Personal data collected through this form will be processed in accordance with our privacy policy, used solely for recruitment purposes,
            and will not be shared with third parties without your consent. Submission of this application does not guarantee employment, and the
            company retains the discretion to select candidates based on its hiring criteria. Any attempt to influence the hiring process through
            external means may result in disqualification. We are an equal opportunity employer, and all candidates will be considered without
            regard to race, gender, age, religion, disability, or any other protected status. By submitting this form, you agree to be contacted
            via the provided email or phone number for further communication regarding your application. If selected for an interview, you commit
            to participating in the interview process as scheduled. All intellectual property shared during the application process becomes the property
            of the company. The company reserves the right to modify these terms and conditions without prior notice, and it is your responsibility to
            review them periodically. Your submission indicates that you have read, understood, and agree to abide by these terms and conditions.
          </p>
        </div>
      </section>
    </div>
  )
}

export default siteTerms