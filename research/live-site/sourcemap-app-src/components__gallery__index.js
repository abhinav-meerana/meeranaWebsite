import React, { useEffect, useState } from "react";
import BannerImage from "../../sub-components/banner-image";
import { useLocation } from "react-router-dom";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [error, setError] = useState(null);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchImages = async () => {
        try {
          const apiKey = "ee0147459319234fd006b8b1af0f2e67";
          const targetUrl = encodeURIComponent(
            "https://www.instagram.com/meerana.technologies/"
          );
      
          const response = await fetch(
            `http://api.scrapestack.com/scrape?access_key=${apiKey}&url=${targetUrl}`
          );
      
          if (!response.ok) {
            throw new Error("Failed to fetch HTML");
          }
      
          const htmlData = await response.text();
          console.log(htmlData); // Log the raw response for debugging
      
          // Parse the HTML to locate the data
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlData, "text/html");
      
          // Locate the script tag containing the JSON data
          const scripts = Array.from(doc.querySelectorAll("script"));
          const jsonDataScript = scripts.find((script) =>
            script.textContent.includes("window._sharedData")
          );
      
          if (!jsonDataScript) {
            throw new Error("Instagram data not found in scripts");
          }
      
          // Extract JSON data from the script tag
          const jsonData = JSON.parse(
            jsonDataScript.textContent.match(/window\._sharedData = (.*);/)[1]
          );
      
          const images =
            jsonData.entry_data.ProfilePage[0].graphql.user
              .edge_owner_to_timeline_media.edges;
      
          const imageUrls = images.map(
            (item) => item.node.thumbnail_src || item.node.display_url
          );
      
          setGalleryImages(imageUrls);
        } catch (err) {
          console.error("Error fetching Instagram data:", err);
          setError("Unable to load gallery images");
        }
      };
      

    fetchImages();
  }, []);

  return (
    <div className="bg-[#ffff]">
      <BannerImage />
      <section className="relative mx-5 mt-5 xl:pl-[calc((100%-1200px)/2)] xl:pr-[calc((100%-1200px)/2)] overflow-hidden">
        <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#333333] mt-5">
          Gallery
        </h1>
        <p className="text-[14px] lg:text-[18px] font-normal text-[#333333] mt-3">
          Explore our latest moments captured on Instagram.
        </p>

        {error ? (
          <p className="text-red-500 mt-5">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
            {galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Loading images...</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
