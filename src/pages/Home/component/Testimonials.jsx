

const Testmonials = () => {
  return (
    <div className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">What Our Members Say</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-700 mb-4">"IEDC EMEA has been a game-changer for me. The mentorship and resources provided helped me turn my idea into a successful startup."</p>
                    <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="John Doe" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold">John Doe</p>
                            <p className="text-sm text-gray-600">Founder, Tech Startup</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-700 mb-4">"The workshops and networking events organized by IEDC EMEA have been invaluable in helping me grow as an entrepreneur."</p>
                    <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Jane Smith" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold">Jane Smith</p> 
                            <p className="text-sm text-gray-600">Co-founder, Social Enterprise</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-700 mb-4">"IEDC EMEA's support and guidance have been instrumental in helping me navigate the challenges of entrepreneurship."</p>
                    <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Michael Lee" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold">Michael Lee</p>
                            <p className="text-sm text-gray-600">CEO, Fintech Startup</p>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    </div>
  );
}

export default Testmonials;