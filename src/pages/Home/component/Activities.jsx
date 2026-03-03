import React, { useState, Component } from "react";
import { ArrowLeft, ArrowRight, ChevronsRight, Calendar } from "lucide-react";
import Eventimg from "../../../assets/event.jpg";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import '@/assets/styles/slides.css';
import EmblaCarousel from "./Carousel/Carousel";


const Activities = () => {
  const [selected, setSelected] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const OPTIONS = { align: 'start' ,  loop: true }
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


  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      {/* <div className="flex items-center justify-between mb-6 w-full max-w-[1200px]">
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
      </div> */}


      <div className="slider-container max-w-[1200px] w-full">
         <EmblaCarousel slides={activities} options={OPTIONS} />
      </div>


      <button className="primary-color bg-white px-6 py-2 text-sm group rounded-full font-medium flex items-center gap-2 transition-all duration-300 mt-10">
        View All Activities{" "}
        <span className="group-hover:ml-3 transition-all duration-300">
          <ArrowRight size={16} />
        </span>
      </button>

    
    </div>
  );
};

export default Activities;
