import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/lib/createClient';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          email: formData.email,
          message: formData.message,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      toast.success('Message sent successfully!');
      
      // Reset form
      setFormData({
        email: '',
        message: ''
      });
      
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#ECF0ED] py-12 px-4 w-full mx-auto">
      <div className="max-w-[1200px] flex flex-col-reverse sm:flex-row gap-6 items-center justify-between w-full mx-auto">

        <div >
          <h1 className="text-5xl font-medium mb-4 text-center sm:text-left hidden sm:block">Contact Us</h1>
        
          <p className="secondary-color mb-6 max-w-[500px]">
            We are committed to processing the information in order to contact
            you and talk about your project. 
          </p>

          <div className="flex gap-6 items-center">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <Mail color="#1D7E53" />
            </span>
            <a href="mailto:iedcemea@gmail.com" className="hover:underline">
              iedcemea@gmail.com
            </a>
          </div>
          <div className="flex gap-6 items-center mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <Phone color="#1D7E53" />
            </span>
            <a href="tel:+919633798513" className="hover:underline">
              +91 96337 98513
            </a>
          </div>
          <div className="flex gap-6 items-center mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin color="#1D7E53" />
            </span>
            <p className="text-gray-700">
              EMEA College of Arts and Science <br />
              Kondotty, Kerala
            </p>
          </div>
        </div>
        
            <form onSubmit={handleSubmit} className="flex flex-col gap-3  max-w-[400px]">
          <h1 className="text-5xl font-medium mb-4 text-center sm:text-left sm:hidden">Contact Us</h1>

          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email/phone
          </label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[340px]"
            placeholder="Enter your Contact details"
            required
            disabled={isSubmitting}
          />
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full min-h-[100px] max-h-[200px] px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[340px]"
            placeholder="Enter your message"
            rows="4"
            required
            disabled={isSubmitting}
          ></textarea>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="primary-bg mt-4 max-w-[340px] px-6 py-2 justify-center text-white group rounded-full font-medium flex items-center gap-2 transition-all duration-300 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'} 
            <ArrowRight color="white" />
          </button>
        </form>
      
      </div>
    </div>
  );
};

export default Contact;