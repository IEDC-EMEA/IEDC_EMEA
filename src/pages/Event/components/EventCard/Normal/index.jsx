import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronsRight } from 'lucide-react'
import { motion } from "framer-motion";

function NormalCard({ data, onClick, layoutId, key }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/event/' + data.id);
    }
    return (

        <motion.div className='p-1 md:p-4   mx-auto  max-w-[280px] space-y-2 flex-grow cursor-pointer ' layoutId={layoutId} key={key} onClick={onClick}>
            <div className='customMinimumHeight w-full bg-gray-300 relative flex flex-col justify-end p-3 rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
                <motion.img
                    loading="lazy"
                    effect="blur"
                    layoutId={`image-${data.id}`} src={data.image} alt={data.title} className='w-full h-full object-cover absolute top-0 bottom-0 left-0 right-0 rounded-md' />
                <div className='absolute top-2 right-2 cursor-pointer z-10 text-white' onClick={handleClick}>
                    <ArrowUpRight className='w-6' />
                </div>
                <div className='text-[9px] sm:text-[12px] flex justify-between z-10 flex-wrap '>
                    <p>Date: {data.date}</p>
                    <p>Time: {data.time}</p>
                </div>
                <h1 className='z-10 font-semibold text-xs sm:text-sm line-clamp-2 sm:line-clamp-none'>{data.title}</h1>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
            </div>

        </motion.div>
    )
}

export default NormalCard