

const Contact = () => {
  return (
    <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <p className="text-gray-700 mb-2"><strong>Email:</strong>
                    <a href="mailto:iedcemea@gmail.com" className="text-orange-500 hover:underline">
                        iedcemea@gmail.com
                    </a>
                    </p>
                    <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 12345 67890</p>
                    <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Innovation Street, Tech City, Country</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700">Name</label>
                            <input type="text" id="name" className="w-full px-3 py-2 border rounded" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input type="email" id="email" className="w-full px-3 py-2 border rounded" placeholder="Your Email" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-700">Message</label>
                            <textarea id="message" className="w-full px-3 py-2 border rounded" placeholder="Your Message" rows="4"></textarea>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                    <div className="flex items-center gap-4">
                        <a href="https://www.facebook.com/iedcemea" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">    
                            Facebook
                        </a>
                        <a href="https://www.twitter.com/iedcemea" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900"> 
                            Twitter
                        </a>
                        <a href="https://www.linkedin.com/company/iedcemea" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">    
                            LinkedIn
                        </a>
                        <a href="https://www.instagram.com/iedcemea" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Contact;