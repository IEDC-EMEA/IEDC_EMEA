import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: "John Doe",
      role: "President",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      designation: "/team/john-doe",
    },
    {
      name: "Jane Smith",
      role: "Vice President",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      designation: "/team/jane-smith",
    },
    {
      name: "Michael Johnson",
      role: "Secretary",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      designation: "/team/michael-johnson",
    },
    {
      name: "Emily Davis",
      role: "Treasurer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      designation: "/team/emily-davis",
    },
    {
      name: "Sarah Wilson",
      role: "Member",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      designation: "/team/sarah-wilson",
    },
    {
      name: "Emily Davis",
      role: "Treasurer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      designation: "/team/emily-davis",
    },
    {
      name: "Emily Davis",
      role: "Treasurer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      designation: "/team/emily-davis",
    },
      {
      name: "David Brown",
      role: "Member",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      designation: "/team/david-brown",
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
