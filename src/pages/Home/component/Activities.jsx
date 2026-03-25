import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import '@/assets/styles/slides.css';
import EmblaCarousel from "./Carousel/Carousel";
import { supabase } from '@/lib/createClient';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const Activities = () => {
  const navigate = useNavigate();
  const OPTIONS = { align: 'start', loop: true };
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false });

      if (error) throw error;

      const formattedActivities = (data || []).map((event) => ({
        _id: event.id,
        title: event.name,
        description: event.description,
        image: event.image_url,
        date: event.start_at
          ? new Date(event.start_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '',
        category: event.type,
      }));

      setActivities(formattedActivities);
    } catch (fetchError) {
      console.error("Error fetching events:", fetchError);
      setError("Failed to load events. Please try again.");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-[240px] w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center min-h-[240px] w-full text-center gap-3">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex justify-center items-center min-h-[240px] w-full text-gray-500">
          No activities found.
        </div>
      ) : (
        <div className="slider-container max-w-[1200px] w-full">
          <EmblaCarousel slides={activities} options={OPTIONS} />
        </div>
      )}

      <button
        onClick={() => {
          navigate('/events');
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
        className="primary-color bg-white px-6 py-2 text-sm group rounded-full font-medium flex items-center gap-2 transition-all duration-300 mt-10"
      >
        View All Activities{" "}
        <span className="group-hover:ml-3 transition-all duration-300">
          <ArrowRight size={16} />
        </span>
      </button>

    
    </div>
  );
};

export default Activities;
