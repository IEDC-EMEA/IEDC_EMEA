import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsRight } from "lucide-react";
import { supabase } from "@/lib/createClient";
import NormalCard from "./components/EventCard";

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match your NormalCard component
      const transformedEvents = (data || []).map(event => ({
        id: event.id,
        title: event.name,
        description: event.description,
        image: event.image_url,
        category: event.type,
        date: event.start_at,
        endDate: event.end_at,
        venue: event.venue,
        registrationLink: event.registration_link,
        status: event.status,
        type: event.type,
        createdAt: event.created_at
      }));

      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickAction = (id) => {
    navigate('/event/' + id);
  };

  const isMobile = window.innerWidth < 768;

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
          onClick={fetchEvents}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.1 }}
        className="flex flex-col p-1 md:p-4 gap-4 w-limit overflow-hidden"
      >
        <div className="px-2 md:px-6 mb-2">
          <h2 className="font-semibold text-[20px] sm:text-[24px]">IEDC Activities</h2>
          <p className="text-gray-400">Stay updated with our latest programs and opportunities</p>
        </div>
        
        {events.length > 0 ? (
          <div className="flex-grow w-full mx-0 md:mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="mx-auto w-full"
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
          <div className="flex flex-col justify-center items-center my-10 w-full min-h-[200px]">
            <h1 className="text-2xl font-bold mb-2">No events found</h1>
            <p className="text-gray-500">Check back later for new events!</p>
          </div>
        )}
      </motion.section>

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
              className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
            >
              {selected.image && (
                <motion.img
                  loading="lazy"
                  layoutId={`image1-${selected.id}`}
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-48 object-cover bg-gray-100"
                />
              )}
              
              <div className="p-6">
                {selected.type && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full mb-3">
                    {selected.type}
                  </span>
                )}
                
                <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
                
                <div className="space-y-3 mb-6">
                  {selected.date && (
                    <div className="text-gray-600">
                      <p className="font-medium">
                        {new Date(selected.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {selected.endDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          Ends: {new Date(selected.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {selected.venue && (
                    <div className="text-gray-600">
                      <p className="font-medium">Venue:</p>
                      <p>{selected.venue}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">{selected.description}</p>

                   {selected.registrationLink && (
                      <a
                        href={selected.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        Register Now
                      </a>
                    )}
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
                  <button
                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                 
                    
                    <button 
                      onClick={() => handleClickAction(selected.id)} 
                      className='bg-emerald-500 rounded-md px-5 py-2 uppercase flex gap-2 items-center text-sm justify-center font-semibold text-white transition-all ease-in-out hover:bg-emerald-400 w-full sm:w-auto'
                    >
                      View Details <ChevronsRight className='w-4 h-4' />
                    </button>
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