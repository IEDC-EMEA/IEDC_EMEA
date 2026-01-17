import {
  BootCamp,
  inFront,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
} from "@/assets/images/Us";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  Variants,
  // easeIn,
  // easeOut,
} from "framer-motion";

interface Point {
  title: string;
  content: JSX.Element;
}

const points: Point[] = [
  {
    title: "Beyond the Classroom",
    content: (
      <>
        True learning happens outside textbooks and lectures. While academic
        knowledge is vital,{" "}
        <span className="font-semibold text-orange-500">community and hands-on experience</span> are
        where students truly grow.
      </>
    ),
  },
  {
    title: "Bridging the Gap",
    content: (
      <>
        The traditional education system often lacks real-world application.{" "}
        <span className=" font-semibold text-orange-500">Connect steps in</span> to fill that gap,
        offering opportunities for students to apply what they've learned.
      </>
    ),
  },
  {
    title: "Supportive Environment",
    content: (
      <>
        We create a space where students can{" "}
        <span className=" font-semibold text-orange-500">turn theory into practice</span>, surrounded
        by like-minded peers who share their drive for success.
      </>
    ),
  },
  {
    title: "Collaborative Growth",
    content: (
      <>
        At Connect, we{" "}
        <span className=" font-semibold text-orange-500">challenge, inspire, and support</span> each
        other, achieving more together than we could alone.
      </>
    ),
  },
];

// Motion variants
// const imageVariants: Variants = {
//   enter: (direction: number) => ({
//     x: direction === 0 ? 300 : -300,
//     opacity: 0,
//     scale: 0.8,
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//     scale: 1,
//     transition: { duration: 0.5, ease: easeOut },
//   },
//   exit: (direction: number) => ({
//     x: direction === 0 ? -300 : 300,
//     opacity: 0,
//     scale: 1.2,
//     transition: { duration: 0.5, ease: easeIn },
//   }),
// };

const pointVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const WhyWe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [direction, setDirection] = useState(0); // 0 forward, 1 backward

  const images = [BootCamp, Image5, Image6, Image7, inFront, Image4, Image3];

  const handleImageChange = () => {
    // setDirection(0);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const isMobile = window.innerWidth < 768;
  return (
    <section className="flex flex-col gap-6 p-4">
      <div className="grid md:grid-cols-2 w-full gap-10">
        {/* Images */}
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
        {/* Text points */}
        <div className="flex flex-col gap-6">
          <motion.h1
            className="font-semibold md:indent-10 mx-auto md:mx-0 my-4 md:my-0 text-[28px] sm:text-[38px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Why we exist
          </motion.h1>

          {points.map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4 md:gap-0"
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
              variants={pointVariants}
            >
              <div className="px-2">
                <div className="w-6 h-6 flex items-center justify-center bg-white border-4 border-orange-500 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <div className="md:px-2 space-y-1">
                <h1 className="font-semibold text-xl md:text-2xl -mt-1">
                  {item.title}
                </h1>
                <p className="text-md md:text-lg">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWe;
