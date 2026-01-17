import React from "react";
import { motion } from "framer-motion";
import { EventsBG, PlacementBG, MembersBG } from "@/assets/avatars";

const points = [
  {
    title: "Work on Real Projects",
    content: (
      <>
        Get hands-on experience with{" "}
        <span className="font-semibold text-orange-500">
          collaborative projects
        </span>{" "}
        that solve real-world problems. Perfect for rebels who want to make an
        impact now.
      </>
    ),
  },
  {
    title: "Free Skill Development",
    content: (
      <>
        Access a wide range of resources to{" "}
        <span className="font-semibold text-orange-500">
          build new skills
        </span>{" "}
        across different fields—completely free. Because your passion shouldn’t
        come with a price tag.
      </>
    ),
  },
  {
    title: "Network with Peers",
    content: (
      <>
        <span className="font-semibold text-orange-500">Connect</span> with
        supportive, like-minded friends who share your drive and ambition. Build
        a community that fuels your passion.
      </>
    ),
  },
  {
    title: "Free Mentorship",
    content: (
      <>
        Learn directly from{" "}
        <span className="font-semibold text-orange-500">industry pros</span> who
        have been where you want to go. Gain insights, advice, and guidance
        without spending a dime.
      </>
    ),
  },
  {
    title: "Leadership Opportunities",
    content: (
      <>
        Step up and take on{" "}
        <span className="font-semibold text-orange-500">
          leadership roles
        </span>{" "}
        to sharpen your management and organizational skills. Show the world
        what you’re capable of.
      </>
    ),
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const pointVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const isMobile = window.innerWidth < 768;

const Chapter = () => {
  return (
    <section className="flex flex-col gap-4 p-4 my-10">
      <motion.h1
        className="font-semibold text-center my-4 text-[28px] sm:text-[38px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Why you should join{" "}
        <span className="text-orange-500 block">Connect</span>
      </motion.h1>

      <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-20 md:gap-10 mx-auto">
        <motion.div
          className="col-span-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        >
          <ul className="space-y-4 list-disc list-inside px-4">
            {points.map((item, index) => (
              <motion.li
                key={index}
                className=""
                custom={index}
                variants={pointVariants}
              >
                <strong className="font-semibold text-xl md:text-2xl">
                  {item.title}:
                </strong>
                <span className="ml-5 block text-md md:text-lg">
                  {item.content}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right side stats section */}
        <motion.div
          className="relative flex h-full items-center justify-center select-none"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex relative items-end gap-6 md:-mt-20 mb-24 md:mb-0">
            <motion.div
              className="min-h-64 w-40 bg-gray-400 border border-black rounded-full flex items-center justify-center overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                src={MembersBG}
                alt="Members"
                className="absolute inset-0 object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <span className="relative text-white mx-auto text-center p-2">
                <h1 className="text-3xl font-black">100+</h1>
                <p className="font-semibold text-xl">Members</p>
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="min-h-52 w-36 bg-gray-400 border border-black rounded-full flex items-center justify-center overflow-hidden relative"
            >
              <img
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                src={EventsBG}
                alt="Events"
                className="absolute inset-0 object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <span className="relative text-white mx-auto text-center p-2">
                <h1 className="text-3xl font-black">40+</h1>
                <p className="font-semibold text-xl">Events</p>
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="min-h-52 w-36 bg-gray-400 border border-black rounded-full flex items-center justify-center absolute -bottom-32 left-24 overflow-hidden"
            >
              <img
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                src={PlacementBG}
                alt="Placements"
                className="absolute inset-0 object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <span className="relative text-white mx-auto text-center p-2">
                <h1 className="text-3xl font-black">20+</h1>
                <p
                  className="font-semibold text-xl"
                  style={{ overflowWrap: "anywhere" }}
                >
                  Placements
                </p>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter;
