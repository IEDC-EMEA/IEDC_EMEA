import { useNavigate } from "react-router-dom";
import EmiriseImg from "./emirise.png";
import { ArrowRight } from "lucide-react";

const Emirise = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row p-8 bg-white rounded-2xl gap-8 max-w-[1200px] w-full items-center justify-center mx-auto">
      <img
        src={EmiriseImg}
        alt="Emirise Logo"
        className=" object-contain rounded-xl"
      />
      <div className="flex-grow flex flex-col gap-2 text-left">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-medium uppercase ">Emirise</h1>
            <p className="text-lg text-gray-800">
              Flagship Program of IEDC EMEA
            </p>
          </div>
          <button onClick={() => navigate('/entrepreneurs')} className="primary-color border-2 primary-border bg-white px-4 hover:bg-emerald-700 hover:text-white py-2 text-sm group rounded-full font-medium flex items-center gap-2 transition-all duration-300 h-10">
            View Details  <ArrowRight size={16} />
          </button>
        </div>
        <p className="secondary-color">
          EMIRISE is the flagship innovation and entrepreneurship initiative of
          IEDC EMEA, created to identify, nurture, and accelerate student-driven
          ideas into impactful and sustainable ventures. The program provides
          structured mentorship, expert guidance, hands-on workshops, and
          real-world exposure, enabling students to develop entrepreneurial
          skills, build viable products, and connect with industry leaders.
          Through EMIRISE, IEDC EMEA fosters a culture of innovation,
          leadership, and startup thinking within the academic ecosystem.
        </p>
      </div>
    </div>
  );
};

export default Emirise;
