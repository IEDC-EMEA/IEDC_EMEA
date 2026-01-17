import React from 'react';
import QouteUp from '@/assets/avatars/QouteUp.png';
import QouteDown from '@/assets/avatars/QuoteDown.png';

function Card({ item }) {
  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 relative rounded-2xl overflow-hidden flex flex-col lg:flex-row max-w-2xl mx-auto shadow-lg ${item.id % 2 !== 0 ? '' : 'lg:flex-row-reverse'}`}>
      {/* Image Container */}
      <div className="relative flex  justify-center lg:justify-start items-center p-6 md:p-0">
        <div className={`w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full absolute ${item.id % 2 !== 0 ? 'lg:-left-6 -bottom-2' : 'lg:-right-6 -bottom-2'} z-0`} />
        <div className="relative z-10 border-4 border-white rounded-full overflow-hidden shadow-md lg:absolute lg:bottom-0 lg:w-32 lg:h-32 ">
          <img
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            src={item.image}
            alt={item.name}
            className="object-cover w-28 h-28 md:w-36 md:h-36 "
          />
        </div>
        <div className='hidden lg:flex relative z-0 w-32'></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 p-6 md:p-8 md:py-6 relative">
        {/* Quote Icon - Top */}
        <div className={`absolute left-0 top-2 opacity-20`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-700 mb-4 leading-relaxed text-lg italic relative z-10">
          {item.content}
        </p>

        {/* Author Info */}
        <div className={`flex flex-col ${item.id % 2 !== 0 ? 'items-start md:items-end' : 'items-start'} border-t pt-4 border-gray-200`}>
          <p className="font-bold text-gray-900 text-lg">{item.name}</p>
          <p className="text-sm text-amber-600 font-medium">{item.role}</p>
          <p className="text-sm text-amber-600 ">{item.office}</p>
        </div>

        {/* Decorative Quote - Bottom */}
        <div className={`absolute ${item.id % 2 !== 0 ? 'bottom-28' : 'bottom-[105px]'} right-6  opacity-20 rotate-180`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Card;