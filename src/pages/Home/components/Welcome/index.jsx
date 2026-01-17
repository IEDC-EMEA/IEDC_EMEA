import React, { useState } from 'react';
import Icon from '@/assets/avatars/welcome.webp';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Welcome() {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/join');
    };

    const text = "For Students, By Students";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const child = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <section className='text-center flex flex-col gap-4 my-4'>
            <div className='text-center flex flex-col max-w-[600px] mx-auto'>
                <h1 className='text-[22px] sm:text-[34px] font-bold uppercase'>
                    WHERE&nbsp; <span className='text-orange-500'>STUDENTS&nbsp; </span>meet&nbsp; <span className='text-orange-500'>peers</span>&nbsp;
                    <br /><span className='text-orange-500'>purpose</span>&nbsp;and&nbsp;<span className='text-orange-500'>passion</span>&nbsp;
                </h1>

                {/* Animated Typing Text */}
                <motion.p
                    className='text-lg sm:text-xl font-semibold highlighted-text overflow-hidden inline-block'
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {text.split("").map((letter, index) => (
                        <motion.span key={index} variants={child}>
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </motion.p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-[240px] sm:max-w-[280px] mx-auto">


                <button
                    onClick={handleClick}
                    className="w-full px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-full font-bold tracking-normal transition-all hover:bg-orange-500 text-sm sm:text-[16px]"
                >
                    Register Now
                </button>

                <a
                    href="https://chat.whatsapp.com/HWUMSzHQWkyLv3VwWgnRFu"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button
                        className="w-full px-4 sm:px-6 py-1.5 border-2 border-orange-600 text-orange-600 rounded-full font-bold tracking-normal transition-all hover:bg-orange-50 hover:border-orange-500 text-sm sm:text-[16px]"
                    >
                        Join Our Community
                    </button>
                </a>
            </div>


            {!loaded && (
                <div className='absolute inset-0 bg-white flex items-center justify-center'>
                    <p className='text-gray-500'>Loading...</p>
                </div>
            )}

            <div className='relative'>
                <img
                    draggable={false} // prevent dragging
                    onDragStart={(e) => e.preventDefault()}
                    src={Icon}
                    alt='avatar'
                    className='w-full max-w-[700px] h-auto mx-auto mt-6'
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </section>
    );
}

export default Welcome;
