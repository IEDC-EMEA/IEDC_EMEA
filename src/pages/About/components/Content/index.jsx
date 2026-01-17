import React, { useState } from 'react'
import { inFront, BootCamp, Image3, Image4, Image5, Image6, Image7 } from "@/assets/images/Us";

import {
    motion,
    AnimatePresence,
    easeIn,
    easeOut,
} from "framer-motion";

// Motion variants
const imageVariants = {
    enter: (direction) => ({
        x: direction === 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: easeOut },
    },
    exit: (direction) => ({
        x: direction === 0 ? -300 : 300,
        opacity: 0,
        scale: 1.2,
        transition: { duration: 0.5, ease: easeIn },
    }),
};
function Content() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        inFront,
        Image3,
        Image7,
        Image6,
        BootCamp,
        Image4,
        Image5,

    ];
    const [direction, setDirection] = useState(0); // 0 forward, 1 backward
    const handleImageChange = () => {
        setDirection(0);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className='flex flex-col lg:flex-row justify-between w-limit gap-6 lg:gap-0'>
            <div className='my-6 lg:my-0 lg:w-1/2 flex items-center justify-center mx-auto'>
            <div className="flex items-center justify-center">
      <div className="relative h-[300px] w-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute z-10 w-[300px] h-[300px] border-2 border-black rounded-xl overflow-hidden cursor-pointer select-none bg-orange-400"
            onClick={handleImageChange}
            initial={{ rotate: 6, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -6, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              loading="lazy"
              src={images[currentIndex]}
              alt="Rotating card"
              className="absolute inset-0 object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Background "next" preview card */}
        <motion.div
          key={(currentIndex + 1) % images.length}
          className="absolute w-[300px] h-[300px] border-2 border-black rounded-xl overflow-hidden bg-orange-400"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 6, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <img
            loading="lazy"
            src={images[(currentIndex + 1) % images.length]}
            alt="Next card preview"
            className="absolute inset-0 object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </div>
            </div>

            <div className='lg:w-1/2 text-white mx-auto space-y-4 lg:space-y-2  text-lg md:text-xl lg:text-left text-center'>
                <p>
                    Four years ago, in the halls of EMEA College, four passionate students—Salman CC, Afeef, Aseel, and Nahyan—shared a common dream. They wanted to create something meaningful for their fellow students. Driven by their determination, they proposed developing a college software application to our college principal.
                </p>
                <p>
                    Recognizing their potential, the principal entrusted them with the task. They worked tirelessly, day and night, which not only strengthened their teamwork but also provided invaluable industry experience. Their hard work paid off, as the project opened doors to internships and job opportunities for them.
                </p>
                <p>
                    Inspired by their success, Salman, Afeef, Aseel, and Nahyan envisioned a platform to offer similar opportunities to all EMEA College students. Thus, Connect was born—a community dedicated to bridging the gap between industry and academia.
                </p>
            </div>
        </div>
    )
}

export default Content
