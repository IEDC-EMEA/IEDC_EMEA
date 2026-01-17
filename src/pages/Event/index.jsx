import Events from "@/const/data/Events";
import { Normal } from "./components/EventCard";
import EmblaCarousel from "./components/Carousal/EmblaCarousel";
import EmblaCarousel2 from "./components/Carousal/EmblaCarousel2";
import NormalCard from "./components/EventCard/Normal";
import SlickCarousel from "./components/Carousal/SlickCarousel";
import SimpleGrid from "./components/Carousal/SimpleGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsRight } from "lucide-react";
import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/config/firebase';

const OPTIONS = { loop: false, align: "start" };

// Animation presets
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.05 },
  }),
};

const Event = () => {
  const [selected, setSelected] = useState(null);
  const currentDate = new Date();
  const navigate = useNavigate();
  // const [Events, setEvents] = useState([]);
  // const [loading, setLoading] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort events (latest first)
  const sortedEvents = Events.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
  });

  // Upcoming Events = today or future
  const UpcomingEvents = sortedEvents.filter((e) => {
    const [d, m, y] = e.date.split("/").map(Number);
    const eventDate = new Date(y, m - 1, d);
    eventDate.setHours(0, 0, 0, 0); // normalize event date
    return eventDate >= today;
  });

  // 3. Past Events = strictly before today
  let PastEvents = sortedEvents.filter((e) => {
    const [d, m, y] = e.date.split("/").map(Number);
    return new Date(y, m - 1, d) < currentDate;
  });

  // 4. Recent Events = latest 4 past events
  const RecentEvents = PastEvents.slice(0, 4);

  // 5. Balance Past Events (excluding recent ones)
  const OtherPastEvents = PastEvents.slice(4);


  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  // // Fetch events from Firebase
  // const fetchEvents = async () => {
  //   setLoading(true);
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "events"));
  //     const eventsData = [];
  //     querySnapshot.forEach((doc) => {
  //       eventsData.push({ id: doc.id, ...doc.data() });
  //     });
  //     // Sort events by date (newest first)
  //     eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
  //     setEvents(eventsData);
  //     console.log(eventsData)
  //   } catch (error) {
  //     console.error("Error fetching events: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleClickAction = (id) => {
    navigate('/event/' + id);
  }

  const isMobile = window.innerWidth < 768;

  return (
    <div>

      {/* Upcoming Events */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
        className="bg-black text-white w-full overflow-hidden"
      >
        <div className="w-limit w-full flex gap-4 p-4 min-h-60">
          <div className="flex flex-col items-start font-bold py-6 pt-8">
            <h2 className="text-[12px] md:text-[20px]">Upcoming</h2>
            <h1 className="text-[18px] md:text-[36px]">Events</h1>
          </div>

          {UpcomingEvents.length !== 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-full overflow-hidden py-4"
            >
              {UpcomingEvents.length > 3 ? (
                <SlickCarousel slides={UpcomingEvents} color="white" />
              ) : (
                <SimpleGrid slides={UpcomingEvents} color="white" />
              )}
            </motion.div>
          ) : (
            <div className="flex justify-center items-center my-10 w-full">
              <h1 className="text-2xl font-bold">No upcoming events</h1>
            </div>
          )}
        </div>
      </motion.section>

      {/* Recent Events */}
      {RecentEvents.length !== 0 && (
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
          className="flex p-4 gap-4 w-limit overflow-hidden bg-white"
        >
          <div className="flex flex-col items-start font-bold py-6">
            <h2 className="text-[12px] md:text-[20px]">Recent</h2>
            <h1 className="text-[18px] md:text-[36px]">Events</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-full overflow-hidden pb-4"
          >
            {RecentEvents.length > 3 ? (
              <SlickCarousel slides={RecentEvents} color="black" />
            ) : (
              <SimpleGrid slides={RecentEvents} color="black" />
            )}
          </motion.div>
        </motion.section>
      )}


      {/* All Events Grid */}

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.1 }}
        className="flex flex-col md:flex-row p-1 md:p-4 gap-4 w-limit overflow-hidden"
      >
        <div className="flex md:flex-col flex-row gap-2 items-center justify-center md:justify-start md:items-start font-bold py-6">
          <h2 className="text-[36px] md:text-[20px]">All</h2>
          <h1 className="text-[36px]">Events</h1>
        </div>
        {OtherPastEvents.length !== 0 ? (
          <div className="flex-grow w-full mx-0 md:mx-auto pastEventsGrid grid grid-cols-2 ">
            {OtherPastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="mx-auto w-full "
                variants={gridItemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
                custom={index}
              >
                <NormalCard
                  data={event}
                  layoutId={`card-${event.id}`}
                  onClick={() => setSelected(event)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center my-10 w-full">
            <h1 className="text-2xl font-bold">No past events</h1>
          </div>
        )}

      </motion.section>

      {/* No Events */}
      {Events.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center my-10"
        >
          <h1 className="text-2xl font-bold">No events to show</h1>
        </motion.div>
      )}

      {/* Expanded Event Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              layoutId={`card-${selected.id}`}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
            >
              <motion.img
                loading="lazy"
                layoutId={`image1-${selected.id}`}
                src={selected.image}
                alt={selected.title}
                className="w-full max-h-[300px] object-contain bg-black"
              />
              <div className="p-5">
                <p className="text-xs uppercase text-gray-500">
                  {selected.category}
                </p>
                <h2 className="text-xl font-bold mb-2">{selected.title}</h2>
                <p className="text-gray-600">{selected.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="px-4 py-1 bg-black text-white rounded-lg"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                  <div className='flex justify-end w-full'>
                    <button onClick={() => handleClickAction(selected.id)} className=' bg-orange-500 rounded-md px-4 py-1 uppercase flex gap-2 items-center text-[12px] justify-center font-semibold text-white transition-all ease-in-out hover:bg-orange-400 '>open<ChevronsRight className='w-4' /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Event;
