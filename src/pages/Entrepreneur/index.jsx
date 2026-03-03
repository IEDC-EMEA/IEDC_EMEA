import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, Briefcase } from "lucide-react";
import { supabase } from "@/lib/createClient";

// Animation presets
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
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

const Entrepreneur = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('entrepreneurs') // Assuming table name is 'entrepreneurs'
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntrepreneurs(data || []);
    } catch (err) {
      console.error('Error fetching entrepreneurs:', err);
      setError('Failed to load entrepreneurs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique designations for filtering
  const uniqueDesignations = [...new Set(entrepreneurs.map(e => e.designation).filter(Boolean))];
  
  // Filter entrepreneurs based on selected filter
  const filteredEntrepreneurs = filter === "all" 
    ? entrepreneurs 
    : entrepreneurs.filter(e => e.designation === filter);

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
          onClick={fetchEntrepreneurs}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-limit mx-auto">
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="text-center py-12 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-emerald-700">
            Our Entrepreneurs
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8">
            Meet the visionary entrepreneurs and innovators who are shaping the future with IEDC EMEA
          </p>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            Our entrepreneurs represent the spirit of innovation and determination. 
            They're building solutions, creating impact, and inspiring the next generation of changemakers.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full">
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">{entrepreneurs.length} Entrepreneurs</span>
          </div>
        </div>
      </motion.section>


      {/* Entrepreneurs Grid */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.1 }}
        className="py-8 px-4"
      >
        {filteredEntrepreneurs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredEntrepreneurs.map((entrepreneur, index) => (
              <motion.div
                key={entrepreneur.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Entrepreneur Image */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-gray-100">
                  {entrepreneur.image_url ? (
                    <img
                      src={entrepreneur.image_url}
                      alt={entrepreneur.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Briefcase className="w-10 h-10 text-emerald-400" />
                        </div>
                        <p className="text-gray-400">No image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Designation Badge */}
                  {entrepreneur.designation && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        {entrepreneur.designation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Entrepreneur Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{entrepreneur.name}</h3>
                  
                  {entrepreneur.designation && (
                    <p className="text-emerald-600 font-medium mb-4">{entrepreneur.designation}</p>
                  )}

                  {/* Social Links (if you add these fields later) */}
                  <div className="flex gap-3 mt-4">
                    {/* Example social links - you can add these fields to your table if needed */}
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Added {new Date(entrepreneur.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div> */}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-gray-50 rounded-full mb-6">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {filter === "all" ? "No Entrepreneurs Found" : `No ${filter} Found`}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {filter === "all" 
                ? "There are currently no entrepreneurs in our database. Please check back later."
                : `No entrepreneurs found in the ${filter} category. Try selecting a different category.`
              }
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                View All Entrepreneurs
              </button>
            )}
          </div>
        )}
      </motion.section>

    
    </div>
  );
};

export default Entrepreneur;