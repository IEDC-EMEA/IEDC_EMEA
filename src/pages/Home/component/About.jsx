import { VisionIcon, MissionIcon, ObjectivesIcon, FunctionsIcon } from "@/assets/avatars";

const About = () => {

    const cards = [
        {
            icon: VisionIcon,
            title: "Our Vision",
            description: "To transform Kerala into a global hub of student-led innovation and sustainable entrepreneurship by empowering students to become job creators and bridging academia with industry."
        },
        {
            icon: MissionIcon,
            title: "Our Mission",
            description: "To cultivate an innovation-driven and entrepreneurial mindset among students by providing platforms, mentorship, and resources to transform ideas into viable ventures through collaboration and hands-on programs."
        },
        {
            icon: ObjectivesIcon,
            title: "Objectives",
            description: "Promoting technology-driven startups through incubation, innovation, research, and strong industry collaboration."
        },
        {
            icon: FunctionsIcon,
            title: "Functions",
            description: "IEDC nurtures innovation through skill development, mentorship, industry exposure, entrepreneurship training, and hands-on programs like hackathons and innovation camps."
        }
    ];
  return (
    <section className="flex flex-col items-center py-10 justify-center mx-auto text-center px-6" id="about">
        <h2 className="font-semibold text-4xl">ABOUT <span className="primary-color">IEDC</span></h2>
        <p className="secondary-color mb-4 mt-1">
           Innovation & Entrepreneurship Development Centre
        </p>
        <p className="text-xl max-w-[1200px] font-medium">
         Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of Kerala Startup Mission to promote innovation and entrepreneurship among the student and academic fraternity in the educational institutions in the State of Kerala and is considered as an umbrella programme that would play an instrumental role in fostering innovation culture in Academic institutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-5 mt-10 max-w-[1200px]">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-3xl p-10 shadow-md text-left flex flex-col items-start gap-4">
                    <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16" />
                    <h3 className="text-2xl font-semibold capitalize">{card.title}</h3>
                    <p className="secondary-color">{card.description}</p>
                </div>
            ))}
        </div>
    </section>
    );  
};
export default About;