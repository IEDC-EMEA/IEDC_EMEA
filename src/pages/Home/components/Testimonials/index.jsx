import React from 'react';
import Cards from '@/const/data/Cards';
import Card from './Card';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Points() {
    return (
        <motion.div
            className="mx-auto px-4 my-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
        >
            <motion.h1
                className='font-semibold text-center my-8 text-[25px] sm:text-[38px]'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Your journey of growth right <br />
                at <span className="text-orange-500">your campus!</span>
            </motion.h1>

            <div className="columns-1 md:columns-2 gap-10">
                {Cards.map((item) => (
                    <motion.div
                        key={item.id}
                        variants={cardVariants}
                        className="mb-6 break-inside-avoid"
                    >
                        <Card item={item} />
                    </motion.div>
                ))}
            </div>


        </motion.div>
    );
}

export default Points;
