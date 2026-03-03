import HeroImg from "./motivate-someone.svg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'

const Hero = () => {
  const navigate = useNavigate()
  return (
      <div className="flex flex-col justify-around z-10 gap-10 min-h-[calc(100dvh-100px)] py-10 mx-auto  w-full overflow-x-hidden overflow-y-auto ">
    <section className="hero flex flex-col items-center justify-center text-center px-4 py-10 relative max-w-[1000px] mx-auto">
      <h2 className=" text-[40px] leading-tight sm:text-[50px] font-semibold">Igniting Innovation.</h2>
      <h1 className="primary-color leading-tight text-[40px] sm:text-[50px] font-semibold">Empowering Entrepreneurs.</h1>
      <p className="secondary-color text-[20px] sm:text-[24px]  ">
        Building a culture of innovation and entrepreneurship at EMEA College
        through impactful programs and student-driven initiatives.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
        <button className="primary-border !border-2 primary-color rounded-full px-6 py-3 font-semibold text-lg hover:bg-[#1D7E53] hover:text-white transition-all duration-300" onClick={() => navigate('/events')}>View Events</button>
        <button className="primary-bg  border-2 rounded-full px-6 py-2.5  text-white font-semibold flex items-center gap-2 text-lg group hover:bg-white hover:text-[#1D7E53] transition-all duration-300 hover:border-2 border-[#1D7E53]" onClick={() =>navigate('/team')}>Join IEDC <span className="bg-white/50 rounded-full p-2 group-hover:bg-[#1D7E53]/50 group-hover:ml-4 transition-all duration-300"><ArrowRight size={18} strokeWidth={3.5}/></span></button>
      </div>
      <img src={HeroImg} alt="Hero Image" />

    
    </section>

      <motion.div
    className="z-10 absolute top-52 -left-[250px] sm:-left-[80px] w-[300px] h-[300px] bg-gradient-to-r from-[#249267] via-[#249267] to-[#249267] rounded-full blur-2xl opacity-40"
    initial={{ scale: 1, x: 0 }}
    // animate={{
    //   scale: [1, 1.2, 1], // Pulsating effect
    //   x: [0, -20, 0], // Slight horizontal movement
    //   y: [0, 20, 0], // Up and down motion
    // }}
    // transition={{
    //   duration: 6, // Total animation duration
    //   repeat: Infinity, // Infinite loop
    //   ease: "easeInOut",
    // }}
  ></motion.div>

    <motion.div
    className="z-10 absolute -top-[100px] -right-[50px] w-[300px] h-[300px] bg-gradient-to-r from-[#51b28d] via-[#249267] to-[#6ab297] rounded-full blur-2xl opacity-50"
    initial={{ scale: 1, x: 0 }}
    // animate={{
    //   scale: [1, 1.3, 1], // Pulsating effect
    //   x: [0, 20, 0], // Slight horizontal movement
    //   y: [0, -20, 0], // Up and down motion
    // }}
    // transition={{
    //   duration: 7, // Slightly different duration for variation
    //   repeat: Infinity, // Infinite loop
    //   ease: "easeInOut",
    // }}
  ></motion.div>
    </div>
  );
};

export default Hero;
