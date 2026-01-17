import EventSection from './components/Events';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import WtConnect from './components/WhatWe';
import WhyWe from './components/WhyWe';
import Chapter from './components/Chapter';
// import Journey from './components/Journey';
import Welcome from './components/Welcome';
import ViewMotion from '@/components2/viewmotion';
import { TimelineDemo } from './components/Journey/test';
import { motion } from 'framer-motion'


const Home = () => {
  return (
    <div className='w-limit bg-white'>
      <Welcome />

      <ViewMotion delay={0.1}>
        <EventSection />
      </ViewMotion>

      <ViewMotion delay={0.1}>
        <WtConnect />
      </ViewMotion>

      <ViewMotion delay={0.2}>
        <WhyWe />
      </ViewMotion>

      <ViewMotion delay={0.2}>
        <Testimonials />
      </ViewMotion>

      <ViewMotion delay={0.3}>
        <Chapter />
      </ViewMotion>

{/* <Journey /> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="my-10"
      >
        <TimelineDemo />
      </motion.div>

      <ViewMotion delay={0.3}>
        <About />
      </ViewMotion>

      <ViewMotion delay={0.4}>
        <Contact />
      </ViewMotion>

    </div>
  );
};
export default Home;
