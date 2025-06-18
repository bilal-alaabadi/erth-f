import React from 'react';
import { Link } from 'react-router-dom';
import img1 from "../../assets/IMG_5013.jpg";
import img2 from "../../assets/IMG_3018.jpg";
import img3 from "../../assets/pox.png";
import img4 from "../../assets/IMG_4427.jpg";
import img5 from "../../assets/IMG_4595.jpg";
import img6 from "../../assets/ChatGPT Image Jun 11, 2025, 03_55_47 PM.png";
import img7 from "../../assets/7.jpeg";


const cards = [
    { id: 1, image: img1, trend: '', title: 'مصار' },
    { id: 2, image: img2, trend: '', title: 'كميم' }, // تأكد من تطابق الأسماء مع الفئات في ShopPage
    { id: 3, image: img3, trend: '', title: 'بوكسات الهدايا' },
    { id: 4, image: img4, trend: '', title: 'أقمشة' },
    { id: 5, image: img5, trend: '', title: 'غتر' },
    { id: 6, image: img6, trend: '', title: 'عود' },
];

const HeroSection = () => {
    return (
<section className='section__container grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
  {cards.map((card) => (
    <Link 
      to={`/Shop?category=${encodeURIComponent(card.title)}`}
      key={card.id}
      className='block aspect-square group'
    >
      <div className='hero__card relative w-full h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'>
        {/* الصورة مع تأثير التكبير */}
        <img 
          src={card.image} 
          alt={card.title} 
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        
        {/* طبقة التدرج اللوني مع النص في المنتصف السفلي */}
        <div className='absolute inset-0 flex flex-col justify-end'>
          <div className='bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white text-center'>
            <p className='text-xs sm:text-sm font-semibold text-gray-300'>{card.trend}</p>
            <h4 className='text-lg sm:text-xl font-bold mt-1'>{card.title}</h4>
          </div>
        </div>
      </div>
    </Link>
  ))}
</section>
    );
};

export default HeroSection;