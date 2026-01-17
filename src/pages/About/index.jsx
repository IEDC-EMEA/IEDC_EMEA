import { motion } from "motion/react";
import Communities from "./components/Communities";
import Content from "./components/Content";
import Mission from "./components/Mission";
import Vision from "./components/Vision";

const About = () => {
  const isMobile = window.innerWidth < 768;
  return (
    <>
      {/* Content section */}
      <motion.div
        initial={{ opacity: 0.6, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-black p-6 py-10 my-4"
      >
        <Content />
      </motion.div>

      {/* Mission, Vision, Communities */}
      <div className="w-limit my-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Mission />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Vision />
        </motion.div>

        <Communities />
      </div>
    </>
  );
};

export default About;
