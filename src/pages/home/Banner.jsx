import React from 'react';
import timings from "../../assets/mm.png";
import '../../../src/App';

const Banner = () => {
    return (
        <div className="py-3 px-4 relative">
            <div className="text-right" dir='rtl'>
                {/* يمكن إضافة محتوى هنا إذا لزم الأمر */}
            </div>
            
            <div className="mt-8 relative overflow-hidden banner-container">
                <img
                    src={timings}  // الصورة الوحيدة
                    alt="صورة البانر"
                    className="w-full h-auto object-contain max-w-[100%] mx-auto"
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default Banner;