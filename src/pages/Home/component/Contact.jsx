import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-[#ECF0ED] py-12 px-4  w-full mx-auto  ">
      <div className="max-w-[1200px] flex flex-col sm:flex-row gap-6 items-center justify-between w-full mx-auto">
        <div>
          <h1 className="text-5xl font-medium mb-4">Contact Us</h1>
          <p className="secondary-color mb-6 max-w-[500px]">
            We are committed to processing the information in order to contact
            you and talk about your project.{" "}
          </p>

          <div className="flex gap-6 items-center">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <Mail color="#1D7E53" />
            </span>
            <a href="mailto:contact@iedc-emea.org" className=" hover:underline">
              iedcemea@gmail.com
            </a>
          </div>
          <div className="flex gap-6 items-center mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <Phone color="#1D7E53" />
            </span>
            <a href="tel:+1234567890" className=" hover:underline">
              +91 96337 98513
            </a>
          </div>
          <div className="flex gap-6 items-center mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin color="#1D7E53" />
            </span>
            <p className="text-gray-700">
              EMEA College of Arts and Science <br />
              Kondotty, kerala
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[400px]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 "
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[340px]"
            placeholder="Enter your email"
          />
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mt-4 "
          >
            Message
          </label>
          <textarea
            id="message"
            className="w-full min-h-[100px] max-h-[200px] px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[340px]"
            placeholder="Enter your message"
            rows="4"
          ></textarea>
          <button className="primary-bg mt-4 max-w-[340px] px-6 py-2 justify-center text-white group rounded-full font-medium flex items-center gap-2 transition-all duration-300 hover:bg-emerald-600">
            Send Message <ArrowRight color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
