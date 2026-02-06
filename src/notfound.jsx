import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, Search, Navigation } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 to-white">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-4 pt-44 sm:pt-52 pb-16">
                <div className="max-w-2xl w-full text-center">
                    {/* Animated 404 Display */}
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 blur-3xl opacity-20 rounded-full"></div>
                        <div className="relative">
                            <h1 className="text-8xl md:text-9xl font-black text-emerald-700 tracking-tighter mb-2">
                                404
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-10">
                        <div className="inline-flex items-center justify-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <AlertTriangle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Page Not Found
                            </h2>
                        </div>
                        
                        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                            <Search className="h-4 w-4" />
                            <span className="text-sm">iedc.emeacollege.ac.in</span>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border border-emerald-100">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                            <Navigation className="h-5 w-5 text-emerald-500" />
                            Quick Navigation
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <NavLink
                                to="/"
                                className="block p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/events"
                                className="block p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
                            >
                                Events
                            </NavLink>
                            <NavLink
                                to="/reports"
                                className="block p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
                            >
                                Reports
                            </NavLink>
                            <NavLink
                                to="/team"
                                className="block p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
                            >
                                Team
                            </NavLink>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <NavLink
                            to="/"
                            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-emerald-200"
                        >
                            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="text-lg">Go to Homepage</span>
                        </NavLink>
                        
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center justify-center gap-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-lg">Go Back</span>
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-500 text-sm">
                            Still lost? Contact us at{" "}
                            <a 
                                href="mailto:connect@emea.ac.in" 
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                iedcemea@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default NotFound;