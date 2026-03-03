import { Outlet, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { motion } from "motion/react";

function GuestLayout() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-[#F4F4F2] overflow-x-hidden overflow-y-auto">
      {/* NavBar fade + slide down */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavBar />
      </motion.div>

      {/* Main page content fade */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow mt-[130px] sm:mt-[152px] bg-[#F4F4F2]  "
      >
        <Outlet />
      </motion.main>

      {/* Footer fade + slide up */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}

export default GuestLayout;
