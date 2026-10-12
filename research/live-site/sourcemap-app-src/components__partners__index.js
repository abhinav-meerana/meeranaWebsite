import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerImage from "../../sub-components/banner-image";
import { useLocation, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Landingpage from "../landingpage";

export default function Partners() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

  const [ourPartners, setPartners] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Country: "",
    Message: "",
  });
  const getPartnersInfo = () => {
    fetch(`${baseUrl}/allDataInfo/partners_clientsInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPartners(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const [ourPartnerss, setPartnerss] = useState([]);

  const getPartnersinfoInfo = () => {
    fetch(`${baseUrl}/allDataInfo/partnerinfoInfo.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPartnerss(data);
      })
      .catch((error) => {
        console.error("Error fetching team info:", error);
      });
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    getPartnersInfo();
    getPartnersinfoInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObject = new FormData();
      formDataObject.append("FirstName", formData.FirstName);
      formDataObject.append("LastName", formData.LastName);
      formDataObject.append("PhoneNumber", formData.PhoneNumber);
      formDataObject.append("Country", formData.Country);
      formDataObject.append("Email", formData.Email);
      formDataObject.append("Message", formData.Message);

      formData.FirstName = "";
      formData.LastName = "";
      formData.PhoneNumber = "";
      formData.Country = "";
      formData.Email = "";
      formData.Message = "";

      const response = await axios.post(
        `${baseUrl}/allDataInfo/partnerformInfo.php`,
        formDataObject
      );

      if (response.data["isSuccess"]) {
        setIsFormSubmitted(true);
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

  const navigate = useNavigate();
  const navigateToPartner = () => {
    navigate("/partners");
    setTimeout(() => {
      const aboutSection = document.getElementById("bepartner");
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
  };

  return (
    <>
      <div className=" bg-[#ffff]">
        <BannerImage />


        {ourPartners && (
          <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
       
            <div className="grid grid-cols-1 md:grid-cols-2 space-x-10 mt-5 h-auto">
              <div className="">
                <h4 className="text-[14px] font-thin text-[#333333]">
                  <Link to="/">Home</Link> / {ourPartners.heading}
                </h4>

                <h1 className="text-[24px] lg:text-[28px] font-semibold mt-5 text-[#333333] ">
                  {ourPartners.heading}
                </h1>
          
                <div className="mt-5">
                  <h1 className="text-[22px] xl:text-[24px] font-bold  text-[#072FA5]">
                    {ourPartners.title}
                  </h1>
                  <p className="text-[14px] lg:text-[18px] font-normal text-justify text-[#333333]  leading-8 mt-5 ">
                    {ourPartners.subTitle}
                  </p>
                
                  <button className="text-[16px] lg:text-[18px] font-semibold border  border-[#072FA5] rounded-md  text-[#072FA5] mt-5 p-4" onClick={navigateToPartner}>
                    Become a Partner
                  </button>
                  <p className="text-[14px] lg:text-[18px] font-normal text-justify text-[#333333]  leading-8 mt-5 ">
                  </p>
                  <button className="">
                  </button>
                </div>
              </div>
              <div className="container mx-auto flex items-center justify-center md:justify-normal mt-5 relative right-16 md:right-0 -top-20 md:-top-32">
                <div className="w-1/2 h-96 bg-cover bg-center rounded-2xl">
                  <img src={`/assets/${ourPartners.image}`} alt="" />
                </div>
                <div className="w-1/2 h-96 rounded-2xl text-white absolute right-0 top-28 md:top-36 md:right-28">
                  <img src={`/assets/${ourPartners.image2}`} alt="" />
                </div>
              </div>
            </div>

            <div className="-mt-52 md:-mt-28 lg:mt-0 mb-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-14">
                {ourPartners.companyLogo &&
                  ourPartners.companyLogo.length > 0 &&
                  ourPartners.companyLogo.map((logo, index) => (
                    <div key={index}>
                      <img
                        src={`/assets/${logo}`}
                        alt=""
                        className="w-full grayscale"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <section id="bepartner" className="bg-[#202124] w-full h-auto">
        <div className="mx-5 mt-5 pb-10 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
          <h1 className="text-[24px] lg:text-[28px] font-semibold  text-[#f5f5f5]">
            Be a Partner
          </h1>
          {/* <div className='border-b-[3px] border-b-[#f5f5f5] w-[82px]'></div> */}
          {ourPartnerss.map((logo, index) => (
            <p className="text-[14px] lg:text-[16px] font-normal text-justify text-[#f5f5f5]  leading-8  w-full md:w-[60%] mt-4">
              {logo.description}
            </p>
          ))}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1  lg:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  required
                  placeholder="First Name"
                  className="border border-1 border-[#f5f5f5] text-[#f5f5f5] w-full md:w-[355px] lg:w-[235px] xl:w-[280px] h-[48px] rounded-[10px] indent-3 bg-transparent"
                />
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  required
                  className="border border-1 border-[#f5f5f5] text-[#f5f5f5] w-full md:w-[355px] lg:w-[235px] xl:w-[280px] h-[48px] rounded-[10px] indent-3 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3  mt-5">
                <input
                  type="text"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="PhoneNumber"
                  className="border border-1 border-[#f5f5f5] text-[#f5f5f5] w-full md:w-[355px] lg:w-[235px] xl:w-[280px] h-[48px] rounded-[10px] indent-3 bg-transparent"
                />
                <select
                  id="country"
                  value={formData.country}
                  placeholder="Country"
                  name="country"
                  onChange={handleInputChange}
                  className="border border-1 border-[#f5f5f5] w-full md:w-[355px] lg:w-[235px] xl:w-[280px] h-[48px] rounded-[10px] indent-3 bg-transparent"
                >
                  <option value="">Select a Country</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Åland Islands">Åland Islands</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American Samoa">American Samoa</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Anguilla">Anguilla</option>
                  <option value="Antarctica">Antarctica</option>
                  <option value="Antigua and Barbuda">
                    Antigua and Barbuda
                  </option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bermuda">Bermuda</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">
                    Bosnia and Herzegovina
                  </option>
                  <option value="Botswana">Botswana</option>
                  <option value="Bouvet Island">Bouvet Island</option>
                  <option value="Brazil">Brazil</option>
                  <option value="British Indian Ocean Territory">
                    British Indian Ocean Territory
                  </option>
                  <option value="Brunei Darussalam">Brunei Darussalam</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Cayman Islands">Cayman Islands</option>
                  <option value="Central African Republic">
                    Central African Republic
                  </option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Christmas Island">Christmas Island</option>
                  <option value="Cocos (Keeling) Islands">
                    Cocos (Keeling) Islands
                  </option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Congo, The Democratic Republic of The">
                    Congo, The Democratic Republic of The
                  </option>
                  <option value="Cook Islands">Cook Islands</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cote D'ivoire">Cote D'ivoire</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Falkland Islands (Malvinas)">
                    Falkland Islands (Malvinas)
                  </option>
                  <option value="Faroe Islands">Faroe Islands</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="French Guiana">French Guiana</option>
                  <option value="French Polynesia">French Polynesia</option>
                  <option value="French Southern Territories">
                    French Southern Territories
                  </option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Gibraltar">Gibraltar</option>
                  <option value="Greece">Greece</option>
                  <option value="Greenland">Greenland</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guadeloupe">Guadeloupe</option>
                  <option value="Guam">Guam</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guernsey">Guernsey</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-bissau">Guinea-bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Heard Island and Mcdonald Islands">
                    Heard Island and Mcdonald Islands
                  </option>
                  <option value="Holy See (Vatican City State)">
                    Holy See (Vatican City State)
                  </option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran, Islamic Republic of">
                    Iran, Islamic Republic of
                  </option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Isle of Man">Isle of Man</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea, Democratic People's Republic of">
                    Korea, Democratic People's Republic of
                  </option>
                  <option value="Korea, Republic of">Korea, Republic of</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Lao People's Democratic Republic">
                    Lao People's Democratic Republic
                  </option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libyan Arab Jamahiriya">
                    Libyan Arab Jamahiriya
                  </option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macao">Macao</option>
                  <option value="Macedonia, The Former Yugoslav Republic of">
                    Macedonia, The Former Yugoslav Republic of
                  </option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Martinique">Martinique</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mayotte">Mayotte</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia, Federated States of">
                    Micronesia, Federated States of
                  </option>
                  <option value="Moldova, Republic of">
                    Moldova, Republic of
                  </option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Netherlands Antilles">
                    Netherlands Antilles
                  </option>
                  <option value="New Caledonia">New Caledonia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Niue">Niue</option>
                  <option value="Norfolk Island">Norfolk Island</option>
                  <option value="Northern Mariana Islands">
                    Northern Mariana Islands
                  </option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestinian Territory, Occupied">
                    Palestinian Territory, Occupied
                  </option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Pitcairn">Pitcairn</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Puerto Rico">Puerto Rico</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Romania">Romania</option>
                  <option value="Russian Federation">Russian Federation</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Helena">Saint Helena</option>
                  <option value="Saint Kitts and Nevis">
                    Saint Kitts and Nevis
                  </option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Pierre and Miquelon">
                    Saint Pierre and Miquelon
                  </option>
                  <option value="Saint Vincent and The Grenadines">
                    Saint Vincent and The Grenadines
                  </option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">
                    Sao Tome and Principe
                  </option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Georgia and The South Sandwich Islands">
                    South Georgia and The South Sandwich Islands
                  </option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Svalbard and Jan Mayen">
                    Svalbard and Jan Mayen
                  </option>
                  <option value="Swaziland">Swaziland</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syrian Arab Republic">
                    Syrian Arab Republic
                  </option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania, United Republic of">
                    Tanzania, United Republic of
                  </option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-leste">Timor-leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tokelau">Tokelau</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">
                    Trinidad and Tobago
                  </option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Turks and Caicos Islands">
                    Turks and Caicos Islands
                  </option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="United States Minor Outlying Islands">
                    United States Minor Outlying Islands
                  </option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Viet Nam">Viet Nam</option>
                  <option value="Virgin Islands, British">
                    Virgin Islands, British
                  </option>
                  <option value="Virgin Islands, U.S.">
                    Virgin Islands, U.S.
                  </option>
                  <option value="Wallis and Futuna">Wallis and Futuna</option>
                  <option value="Western Sahara">Western Sahara</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              </div>
              <input
                type="text"
                name="Email"
                value={formData.Email}
                placeholder="Email"
                onChange={handleInputChange}
                required
                className="w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[48px] border border-1 border-[#f5f5f5] text-[#f5f5f5] rounded-[10px] indent-4 bg-transparent mt-5"
              />
              <textarea
                className="w-full md:w-[355px] lg:w-[486px] xl:w-[575px] h-[187px] border border-1 border-[#f5f5f5] text-[#f5f5f5] rounded-[10px] indent-4 pt-2 bg-transparent mt-5"
                name="Message"
                value={formData.Message}
                onChange={handleInputChange}
                placeholder="Message"
                required
              ></textarea>
              <button
                type="submit"
                className="mt-5 lg:w-[388px] w-full md:w-[335p] xl:w-full h-[52px]  rounded-[10px] bg-[#072FA5] text-center p-2 text-[#f5f5f5]"
              >
                Send Message
              </button>

              {isFormSubmitted && (
                <p className="text-[#fff] font-semibold mt-2">
                  Thank you for your Interest! Our Team will contact you as soon
                  as possible
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
