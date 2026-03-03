import HeroImg from "./motivate-someone.svg";
import { ArrowRight } from "lucide-react";
const Hero = () => {
  return (
    <section className="hero flex flex-col items-center justify-center text-center px-4 py-10 relative max-w-[1000px] mx-auto">
      <h2 className=" text-[40px] leading-tight sm:text-[50px] font-semibold">Igniting Innovation.</h2>
      <h1 className="primary-color leading-tight text-[40px] sm:text-[50px] font-semibold">Empowering Entrepreneurs.</h1>
      <p className="secondary-color text-[20px] sm:text-[24px]  ">
        Building a culture of innovation and entrepreneurship at EMEA College
        through impactful programs and student-driven initiatives.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
        <button className="primary-border !border-2 primary-color rounded-full px-6 py-3 font-semibold text-lg hover:bg-[#1D7E53] hover:text-white transition-all duration-300">View Events</button>
        <button className="primary-bg  border-2 rounded-full px-6 py-2.5  text-white font-semibold flex items-center gap-2 text-lg group hover:bg-white hover:text-[#1D7E53] transition-all duration-300 hover:border-2 border-[#1D7E53]">Join IEDC <span className="bg-white/50 rounded-full p-2 group-hover:bg-[#1D7E53]/50 group-hover:ml-4 transition-all duration-300"><ArrowRight size={18} strokeWidth={3.5}/></span></button>
      </div>
      <img src={HeroImg} alt="Hero Image" />

      <div className="buble2" />
      <div className="buble1" />
    </section>
  );
};

export default Hero;
