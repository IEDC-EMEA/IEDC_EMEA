"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components2/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

const Gallery = () => {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg ">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-200 h-32 rounded-lg w-[200px] mx-auto flex items-center justify-center"
                >
                    <span className="text-gray-500 px-4">Image {index + 1}</span>
                </div>
            ))}
        </div>
    )
}

const Highlights = ({ data }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Highlights</h2>
            {data}
        </div>
    )
}

const Objectives = ({ data }) => {
    return (
        <div >
            <h2 className="text-xl font-semibold mb-4">Objectives</h2>
            {data}
        </div>
    )
}

const MotionWrapper = ({ children, tab }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={tab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

const Tab = ({ about }) => {
    return (
        <div className="p-4 bg-white w-full">
            <Tabs defaultValue="objectives" className="p-2 w-full">
                <TabsList className="max-w-[400px]">
                    <TabsTrigger value="objectives" className="text-black">Objectives</TabsTrigger>
                    <TabsTrigger value="highlights" className="text-black">Highlights</TabsTrigger>
                    {/* <TabsTrigger value="gallery" className="text-black">Gallery</TabsTrigger> */}
                </TabsList>
                <div className="p-4 bg-gray-50 rounded-lg shadow-md overflow-auto h-[300px]">
                    <TabsContent value="objectives">
                        <MotionWrapper tab="objectives">
                            <Objectives data={about.objectives} />
                        </MotionWrapper>
                    </TabsContent>

                    <TabsContent value="highlights">
                        <MotionWrapper tab="highlights">
                            <Highlights data={about.highlights} />
                        </MotionWrapper>
                    </TabsContent>
                    {/* <TabsContent value="gallery">
          <MotionWrapper tab="gallery">
            <Gallery />
          </MotionWrapper>
        </TabsContent> */}
                </div>
            </Tabs>
        </div>
    )
}

export default Tab
