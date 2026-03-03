import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/createClient";
import TeamCard from "./TeamCard";
import { Users, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

// Animation settings
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.05 },
  }),
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setTeamMembers(data || []);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] p-4">
        <div className="text-red-500 text-lg mb-2">Error</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchTeamMembers}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-4 w-limit space-y-12">
      {/* Page Title & Stats */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        className="text-center"
      >
        <h1 className="font-semibold text-2xl md:text-3xl mb-4 primary-color uppercase">
          TEAM IEDC EMEA
        </h1>
        <p className="text-gray-600 mb-6">
          Meet our dedicated team driving innovation and entrepreneurship
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="font-semibold">{teamMembers.length}</span> Total
            Members
          </div>
        </div>
      </motion.div>
      <div className="flex items-center justify-center w-full flex-wrap gap-4">
        {/* All Team Members Grid */}
        {teamMembers.length > 0 ? (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
            className="px-4"
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 p-6  max-w-[400px]"
              >
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-36 h-36 rounded-full mr-4 "
                />
                <div className="flex flex-col items-center">
                  <p className="">{member.role}</p>
                  <p className="text-xl font-semibold primary-color">
                    {member.name}
                  </p>
                  <p className="text-sm secondary-color">
                    {member.designation}
                  </p>

                     <div className="flex flex-wrap gap-2 ">
                  {/* {member.linkedin_url && ( */}
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  {/* )} */}

                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
                </div>
             
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Team Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Our team information is being updated. Please check back later
                to meet the IEDC EMEA team.
              </p>
              <button
                onClick={fetchTeamMembers}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {/* <>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-gray-100">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-10 h-10 text-emerald-400" />
                        </div>
                        <p className="text-gray-400">No image</p>
                      </div>
                    </div>
                  )}
                  
                  {(member.role || member.designation) && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        {member.role || member.designation}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    {member.designation && (
                      <p className="text-emerald-600 font-medium">{member.designation}</p>
                    )}
                    
                    {member.place && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{member.place}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Phone"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Joined {new Date(member.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div> 
          </> */}
    </div>
  );
};

export default Team;
