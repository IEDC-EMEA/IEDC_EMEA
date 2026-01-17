import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Special } from "../EventCard";

const SimpleGrid = ({ slides, color }) => {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const handleClickAction = (id) => {
        navigate("/event/" + id);
    };

    return (
        <div className="w-full max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map((event) => (
                    <div
                        className="rounded-xl cursor-pointer"
                        key={event.id}
                        onClick={() => setSelected(event)}
                    >
                        <Special data={event} color={color} />
                    </div>
                ))}
            </div>

            {/* Expanded Event Modal (same as SlickCarousel) */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            layoutId={`card1-${selected.id}`}
                            className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
                        >
                            <motion.img
                                loading="lazy"
                                layoutId={`image1-${selected.id}`}
                                src={selected.image}
                                alt={selected.title}
                                className="w-full max-h-[300px] object-contain bg-black"
                            />
                            <div className="p-5">
                                <p className="text-xs uppercase text-gray-500">
                                    {selected.category}
                                </p>
                                <h2 className="text-xl font-bold mb-2">{selected.title}</h2>
                                <p className="text-gray-600">{selected.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        className="px-4 py-1 bg-black text-white rounded-lg"
                                        onClick={() => setSelected(null)}
                                    >
                                        Close
                                    </button>
                                    <div className="flex justify-end w-full">
                                        <button
                                            onClick={() => handleClickAction(selected.id)}
                                            className="bg-orange-500 rounded-md px-4 py-1 uppercase flex gap-2 items-center text-[12px] justify-center font-semibold text-white transition-all ease-in-out hover:bg-orange-400"
                                        >
                                            open <ChevronsRight className="w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SimpleGrid;
