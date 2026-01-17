import Founders from "./components/Founders";
import Interns from "./components/Interns";
import TeamsData from "@/const/data/Teams";
import { AnimatedTooltip } from "@/components2/animated-tooltip2";
import { motion } from "framer-motion";

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



const Team = () => {

  const allMembers = [...TeamsData.InternsData, ...TeamsData.FoundersData];
  const alumni = allMembers.filter(member => member.status === "Alumni");
  const interns = allMembers.filter(member => member.status === "Active");
  const isMobile = window.innerWidth < 768;
  return (
    <div className="pb-4 w-limit space-y-12">
      {/* Page Title */}
      <motion.h1
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        className="font-semibold text-2xl flex items-center justify-center mb-4"
      >
        Our Team
      </motion.h1>

      {/* Founders Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
      >
        <Founders FoundersData={TeamsData.FoundersData} />
      </motion.div>

      <hr className="max-w-[600px] px-6 mx-auto bg-gray-300 h-[2px]" />

      {/* Interns Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
      >
        <Interns InternsData={interns} />
      </motion.div>

      {/* Alumni Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        className="mt-8"
      >
        <h1 className="font-semibold text-2xl flex items-center justify-center mb-4">
          Our Alumni
        </h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-row items-center justify-center mb-10 w-full max-w-[1200px] mx-auto p-2"
        >
          <AnimatedTooltip items={alumni} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Team;
