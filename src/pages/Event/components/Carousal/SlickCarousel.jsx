import React, { useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Special } from "../EventCard";
import classNames from 'classnames';
import { ChevronRight, ChevronsRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';


function SampleNextArrow(props) {
    const { className, style, onClick, color } = props;
    const isDisabled = className && className.includes("slick-disabled");
    // console.log('color:', color);
    return (
        <div
            className={classNames(className, `rounded-xl flex items-center justify-center   absolute left-[20px] top-[310px] sm:top-[330px] z-10 custom-arrow `,
                {
                    '!text-gray-500': isDisabled,
                    [`${color === 'black' ? '!text-black' : '!text-white'}`]: !isDisabled
                })}
            style={{
                ...style,
                display: "block",
                background: "",
                fontSize: "40px",
                lineHeight: "1",
            }}
            onClick={onClick}
        >
            <ChevronRight size={40} />
        </div>
    );
}


function SamplePrevArrow(props) {
    const { className, style, onClick, color } = props;
    // console.log('color:', color);
    const isDisabled = className && className.includes("slick-disabled");
    return (
        <div
            className={classNames(className, `rounded-xl flex items-center justify-center  absolute left-[-10px] top-[310px] sm:top-[330px] z-10 custom-arrow  `,
                {
                    '!text-gray-500': isDisabled,
                    [`${color === 'black' ? '!text-black' : '!text-white'}`]: !isDisabled
                }
            )}
            style={{
                ...style,
                display: "block",
                background: "",
                fontSize: "40px",
                lineHeight: "1",
            }}
            onClick={onClick}
        >
            <ChevronLeft size={40} />
        </div >
    );
}




function SlickCarousel(props) {
    const { slides, color } = props;
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow color={color} />,
        prevArrow: <SamplePrevArrow color={color} />,
        responsive: [
            // {
            //     breakpoint: 1124,
            //     settings: {
            //         slidesToShow: 3,
            //         slidesToScroll: 1,
            //     }
            // },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const handleClickAction = (id) => {
        navigate('/event/' + id);
    }

    return (
        <div className="slider-container w-full max-w-[1100px] mx-auto relative overflow-hidden">
            <Slider {...settings} >
                {slides.map((event, index) => (
                    <div className="rounded-xl  sm:mx-0" key={event.id}>
                        <Special data={event} color={color}
                            onClick={() => setSelected(event)} key={event.id} />
                    </div>
                ))}
            </Slider>

            {/* Expanded Event Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            layoutId={`card1-${selected.id}`}
                            className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
                        >
                            <motion.img
                                loading="lazy"
                                layoutId={`image1-${selected.id}`}
                                src={selected.image}
                                alt={selected.title}
                                className="w-full max-h-[300px] object-contain bg-black"
                            />
                            <div className="p-5">
                                <p className="text-xs uppercase text-gray-500">
                                    {selected.category}
                                </p>
                                <h2 className="text-xl font-bold mb-2">{selected.title}</h2>
                                <p className="text-gray-600">{selected.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        className="px-4 py-1 bg-black text-white rounded-lg"
                                        onClick={() => setSelected(null)}
                                    >
                                        Close
                                    </button>
                                    <div className='flex justify-end w-full'>
                                        <button onClick={() => handleClickAction(selected.id)} className=' bg-orange-500 rounded-md px-4 py-1 uppercase flex gap-2 items-center text-[12px] justify-center font-semibold text-white transition-all ease-in-out hover:bg-orange-400 '>open<ChevronsRight className='w-4' /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SlickCarousel;
