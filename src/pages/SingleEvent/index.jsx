import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, Calendar, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/createClient";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
};

function SingleEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Transform data to match expected structure
      const transformedEvent = data ? {
        id: data.id,
        title: data.name,
        description: data.description,
        image: data.image_url,
        category: data.type,
        date: data.start_at,
        endDate: data.end_at,
        venue: data.venue,
        registrationLink: data.registration_link,
        status: data.status,
        type: data.type,
        createdAt: data.created_at,
        big_description: data.description // Using description for big_description
      } : null;

      setEvent(transformedEvent);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}. ${event.description?.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Event URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event URL copied to clipboard!');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };

  const isMobile = window.innerWidth < 768;

  if (loading) return <Spinner />;

  if (error || !event) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] p-4">
        <div className="text-red-500 text-lg mb-2">Error</div>
        <div className="text-gray-600 mb-4">{error || 'Event not found'}</div>
        <div className="flex gap-3">
          <button
            onClick={fetchEvent}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-limit px-4 py-8 mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Events
      </button>

      {/* Event Header */}
      <motion.div
        className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left: Event Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="rounded-2xl overflow-hidden bg-gray-100 p-2 shadow-lg">
            {event.image ? (
              <img
                id="poster"
                src={event.image}
                alt={event.title}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                loading="eager"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-emerald-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar size={48} className="text-emerald-300 mx-auto mb-3" />
                  <p className="text-gray-400">No image available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Event Details */}
        <div className="lg:w-1/2 space-y-6">
          {/* Event Type Badge */}
          {event.type && (
            <span className="inline-block px-4 py-1 text-sm font-semibold text-emerald-600 bg-emerald-100 rounded-full">
              {event.type}
            </span>
          )}

          {/* Event Title */}
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
            {event.title}
          </h1>

          {/* Event Description */}
          <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Date & Time</p>
                <p className="text-gray-600">{formatDate(event.date)}</p>
                {event.endDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Ends: {formatDate(event.endDate)}
                  </p>
                )}
              </div>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Venue</p>
                  <p className="text-gray-600">{event.venue}</p>
                </div>
              </div>
            )}

            {/* Status */}
            {event.status && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Status</p>
                  <p className={`font-medium ${
                    event.status.toLowerCase() === 'active' 
                      ? 'text-emerald-500' 
                      : event.status.toLowerCase() === 'upcoming'
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}>
                    {event.status}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Registration Link Button */}
            {event.registrationLink && (
              <motion.a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink size={18} />
                Register Now
              </motion.a>
            )}

            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-500 text-emerald-500 font-semibold rounded-lg hover:bg-emerald-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={18} />
              Share Event
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Event Created Info */}
      {event.createdAt && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Event added on {new Date(event.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            {/* Additional actions if needed */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/events')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleEvent;