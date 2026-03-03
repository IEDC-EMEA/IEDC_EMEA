import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { NextButton, PrevButton, usePrevNextButtons } from "./Arrowbtn";
import { ChevronsRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selected, setSelected] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const handleClick = (id, index) => {
    setSelected(slides.find((slide) => slide._id === id));
    // navigate('/event/' + id)
  };

  return (
    <div className="embla">
      <div className="flex items-center justify-between mb-6 w-full max-w-[1200px]">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-4xl ">IEDC Activities</h2>
          <p className="secondary-color mb-4">
            Stay updated with our latest programs and opportunities
          </p>
        </div>
        <div className="flex space-x-4">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((event, index) => (
            <div className="embla__slide" key={event._id}>
              {/* <div className="embla__slide__number">
                <span>{index + 1}</span>
              </div> */}
              <motion.div
                key={event._id}
                className="px-2"
                layoutId={`card-${event._id}`}
                onClick={() => handleClick(event._id, index)}
              >
                <div className="relative w-[350px] h-[400px] rounded-2xl overflow-hidden cursor-pointer border-2">
                  {/* Skeleton Loader */}
                  {!imgLoaded && (
                    <div className="absolute top-0 left-0 w-full h-[300px] bg-gray-200 animate-pulse rounded-2xl" />
                  )}
                  <motion.img
                    layoutId={`image-${event._id}`}
                    src={event.image}
                    alt={event.title}
                    className={classNames(
                      "transition-opacity duration-500 w-full h-[400px] object-cover rounded-2xl",
                      imgLoaded ? "opacity-100" : "opacity-0",
                    )}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                  />

                  <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl max-w-[300px] w-full text-left">
                    <h3 className="text-lg font-bold mb-2 primary-color">
                      {event.title}
                    </h3>
                    <span className=" text-gray-800 flex items-center gap-1 items-center justify-start">
                      <Calendar size={18} />
                      {event.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

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
              layoutId={`card-${selected._id}`}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
            >
              <motion.img
                layoutId={`image-${selected._id}`}
                src={selected.image}
                alt={selected.title}
                className="w-full max-h-[300px] object-contain bg-black/70"
              />
              <div className="p-5">
                <p className="text-xs uppercase text-gray-500">
                  {selected.category}
                </p>
                <h2 className="text-xl font-bold mb-2 primary-color">
                  {selected.title}
                </h2>
                <p className="text-gray-600">{selected.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="px-4 py-1 bg-black/80 text-white rounded-lg"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                  <div className="flex justify-end w-full">
                    <button
                      onClick={() => handleClickAction(selected.id)}
                      className=" primary-bg rounded-md px-4 py-1 uppercase flex gap-2 items-center text-[12px] justify-center font-semibold text-white transition-all ease-in-out hover:bg-orange-400 "
                    >
                      open
                      <ChevronsRight className="w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmblaCarousel;
