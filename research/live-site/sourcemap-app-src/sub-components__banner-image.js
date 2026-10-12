import React from 'react'

const BannerImage = () => {
    return (
        <div className="relative">
            <img src="/assets/202124.png" alt="" className="w-full h-[120px] object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
    )
}

export default BannerImage