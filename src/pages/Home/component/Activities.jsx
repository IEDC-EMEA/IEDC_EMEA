

const Activities = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">IEDC Activities</h2>
        <p className="text-gray-700 mb-4">
            Stay updated with our latest programs and opportunities
            </p>
            <div>
                <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Emirise 2024 - The flagship innovation and entrepreneurship initiative of IEDC EMEA</li>
                    <li>IEDC EMEA Annual Summit - A gathering of student entrepreneurs, mentors, and industry leaders</li>
                    <li>Startup Bootcamp - Intensive workshops and mentorship for early-stage startups</li>
                </ul>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                View All Activities
            </button>
    </div>
  );
};

export default Activities;