import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, FileDown, Calendar, Eye } from "lucide-react";
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

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("report_date", { ascending: false });
      // const data = [
      //   {
      //     id: 1,
      //     title: "Annual Report 2023",
      //     report_date: "2023-12-31",
      //     link: "https://example.com/reports/annual-2023.pdf",
      //   },
      //   {
      //     id: 2,
      //     title: "testing",
      //     report_date: "2005-11-20",
      //     link: "testing"
      //   },
      //   {
      //     id: 2,
      //     title: "testing",
      //     report_date: "2005-11-20",
      //     link: "testing"
      //   },
      // ]
      console.log("Fetched reports:", data);
      if (error) {
        throw error;
      }

      setReports(data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  const isMobile = window.innerWidth < 768;

  const handleView = (link) => () => {
    if (link) {
      window.open(link, "_blank");
    } else {
      alert("No link available for this report.");
    }
  }

  const handleDownload = (link) => () => {
    if (link) {
      const anchor = document.createElement("a");
      anchor.href = link;
      anchor.download = link.split("/").pop();
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      alert("No link available for this report.");
    }
  }

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
          onClick={fetchReports}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }



  return (
    <div>
      {/* Reports Grid Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: isMobile ? 0.05 : 0.1 }}
        className="py-8 px-4 md:px-6"
      >
         <div className="px-2 md:px-6 mb-2">
          <h2 className="font-semibold text-[20px] sm:text-[24px]">IEDC Reports</h2>
          <p className="text-gray-400">
              {/* i need a short description here around 50 characters max*/}
              Explore our comprehensive reports showcasing IEDC's impact, growth, and future plans. Dive into insights, success stories, and strategic initiatives that drive our mission forward.
          </p>
        </div>
        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                className="bg-white flex p-2 w-full rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex-1 flex flex-col justify-between p-2 px-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800  pt-2">
                    {report.title || "Untitled Report"}
                  </h3>
                  <p className="flex items-center ">
                    {report.report_date ? (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(report.report_date)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Date not specified</span>
                    )}
                  </p>
                </div>
                <div className="flex justify-between px-4 py-3 gap-4">
                  <span onClick={handleView(report.link)} className="primary-color flex items-center justify-center rounded-full p-3 border-[0.01px] border-emerald-100 cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors">
                    <Eye className="" />
                  </span>
                  <span onClick={handleDownload(report.link)} className="primary-bg flex items-center justify-center border rounded-full p-3 text-white cursor-pointer hover:border-[0.01px] hover:border-emerald-100 hover:bg-white hover:text-emerald-600 transition-all ease-in-out">
                    <FileDown />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-gray-50 rounded-full mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Reports Available</h3>
            <p className="text-gray-500 text-center max-w-md">
              There are currently no reports available. Please check back later
              for updates.
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Reports;
