import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Mehrin, Fidha, Najiya, Sinan, Sanan, Rinshida, Riya, Naseef, Noureen } from "../../assets/team";
import NodelOfficer from "./nodel.jpg";

const Team = () => {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: "Muhammed Faisal T",
      role: "Nodal Officer",
      image: NodelOfficer,
      designation: "Faculty (commerce)",
    },
    {
      name: "Mohammed Sinan",
      role: "CEO",
      image: Sinan,
      designation: "",
    },
    {
      name: "Riya hana",
      role: "CEO",
      image: Riya,
      designation: "",
    },
    {
      name: "Fidha Shirin",
      role: "COO",
      image: Fidha,
      designation: "",
    },
    {
      name: "Noureen zaineeb",
      role: "CFO",
      image: Noureen,
      designation: "",
    },
    {
      name: "Muhammed Naseef AK",
      role: "CMO",
      image: Naseef,
      designation: "",
    },  {
      name: "Fathima Mehrin",
      role: "CTO",
      image: Mehrin,
      designation: "",
    },
      {
      name: "Rinshida",
      role: "CWO",
      image: Rinshida,
      designation: "",
    }, 
    {
      name: "Muhammed Sanan",
      role: "Community lead",
      image: Sanan,
      designation: "",
    },
      {
      name: "Najiya Nasrin",
      role: "Research lead",
      image: Najiya,
      designation: "graphic designer",
    },
  ];

  return (
    <div className="flex items-center gap-6 flex-col text-center p-8  rounded-2xl max-w-[1200px] w-full mx-auto">
      <div className="flex justify-between items-center gap-4  w-full">
        <div className="flex flex-col items-start gap-1 py-10">
          <h1 className="text-2xl font-semibold uppercase">TEAM IEDC EMEA</h1>
          <p className="secondary-color">Our Members</p>
        </div>

        <button onClick={() => navigate('/team')} className="primary-color  bg-white px-4 hover:bg-emerald-700 hover:text-white py-2 text-sm group rounded-full font-medium flex items-center gap-2 transition-all duration-300 h-10">
          View IEDC Team
          <ArrowRight size={16} />
        </button>
      </div>

      {/* first 2 persons */}
      <div className="flex items-center justify-center w-full ">
        {teamMembers.slice(0, 2).map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-4 p-6  max-w-[400px]"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-36 h-36 rounded-full mr-4 "
            />
            <div className="flex flex-col items-center">
              <p className="">{member.role}</p>
              <p className="text-xl font-semibold primary-color">
                {member.name}
              </p>
              <p className="text-sm secondary-color">{member.designation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* other without first 2 persons */}
      <div className="flex items-center justify-center w-full flex-wrap gap-4">
        {teamMembers.slice(2).map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-4 p-6  max-w-[400px]"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-36 h-36 rounded-full mr-4 "
            />
            <div className="flex flex-col items-center">
              <p className="">{member.role}</p>
              <p className="text-xl font-semibold primary-color">
                {member.name}
              </p>
              <p className="text-sm secondary-color">{member.designation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
