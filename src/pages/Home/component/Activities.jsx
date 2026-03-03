import React, { useState, Component } from "react";
import { ArrowLeft, ArrowRight, ChevronsRight, Calendar } from "lucide-react";
import Eventimg from "../../../assets/event.jpg";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <span
      className="absolute -top-[85px] right-0 z-10 primary-bg rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors duration-300"
      onClick={onClick}
    >
      <ArrowRight color="white" />
    </span>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
     <span
      className="absolute -top-[85px] right-14 z-10 primary-bg rounded-full p-2  cursor-pointer hover:bg-emerald-600 transition-colors duration-300"
      onClick={onClick}
    >
      <ArrowLeft color="white" />
    </span>
  );
}

const Activities = () => {
  const [selected, setSelected] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const activities = [
    {
      _id: 1,
      title: "Emirise 2024",
      description:
        "The flagship innovation and entrepreneurship initiative of IEDC EMEA",
      image: Eventimg,
      date: "2024-09-15",
    },
    {
      _id: 2,
      title: "IEDC EMEA Annual Summit",
      description:
        "A gathering of student entrepreneurs, mentors, and industry leaders",
      image: Eventimg,
      date: "2024-10-20",
    },
    {
      _id: 3,
      title: "Startup Bootcamp",
      description:
        "Intensive workshops and mentorship for early-stage startups",
      image: Eventimg,
      date: "2024-11-05",
    },
    {
      _id: 4,
      title: "Innovation Challenge",
      description:
        "A competition to encourage innovative solutions to real-world problems",
      image: Eventimg,
      date: "2024-12-10",
    },
    {
      _id: 5,
      title: "Entrepreneurship Workshop",
      description:
        "Hands-on sessions to develop entrepreneurial skills and mindset",
      image: Eventimg,
      date: "2025-01-15",
    },
  ];

  const handleClick = (id, index) => {
    // console.log('clicked')
    setSelected(activities.find((slide) => slide._id === id));
    // navigate('/event/' + id)
  };

  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    swipeToSlide: true,
     slidesToShow: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // afterChange: function (index) {
    //   console.log(
    //     `Slider Changed to: ${index + 1}, background: #222; color: #bada55`,
    //   );
    // },
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       infinite: true,
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //       initialSlide: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //     },
    //   },
    // ],
  };


  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      <div className="flex items-center justify-between mb-6 w-full max-w-[1200px]">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-4xl ">IEDC Activities</h2>
          <p className="secondary-color mb-4">
            Stay updated with our latest programs and opportunities
          </p>
        </div>
        <div className="flex space-x-4">
          <span
            className="primary-bg rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors duration-300"
          >
            <ArrowLeft color="white" />
          </span>
          <span
            className="primary-bg rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors duration-300"
          >
            <ArrowRight color="white" />
          </span>
        </div>
      </div>
      <div className="slider-container max-w-[1200px] w-full">
        <Slider {...settings}>
          {activities.map((event, index) => (
            <motion.div key={event._id} className="px-2" layoutId={`card-${event._id}`} onClick={() => handleClick(event._id, index)}>

              <div
                className="relative w-[350px] h-[400px] rounded-2xl overflow-hidden cursor-pointer border-2"
              >
                {/* Skeleton Loader */}
                {!imgLoaded && (
                  <div className="absolute top-0 left-0 w-full h-[300px] bg-gray-200 animate-pulse rounded-2xl" />
                )}
                <img
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

          ))}
        </Slider>
      </div>
      <button className="primary-color bg-white px-6 py-2 text-sm group rounded-full font-medium flex items-center gap-2 transition-all duration-300">
        View All Activities{" "}
        <span className="group-hover:ml-3 transition-all duration-300">
          <ArrowRight size={16} />
        </span>
      </button>

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

export default Activities;
