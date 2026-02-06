

const About = () => {

    const cards = [
        {
            icon: "🎯",
            title: "Our Vision",
            description: "To transform Kerala into a global hub of student-led innovation and sustainable entrepreneurship by empowering students to become job creators and bridging academia with industry."
        },
        {
            icon: "🚀",
            title: "Our Mission",
            description: "To cultivate an innovation-driven and entrepreneurial mindset among students by providing platforms, mentorship, and resources to transform ideas into viable ventures through collaboration and hands-on programs."
        },
        {
            icon: "🤝",
            title: "Objectives",
            description: "Promoting technology-driven startups through incubation, innovation, research, and strong industry collaboration."
        },
        {
            icon: "🌐",
            title: "Functions",
            description: "IEDC nurtures innovation through skill development, mentorship, industry exposure, entrepreneurship training, and hands-on programs like hackathons and innovation camps."
        }
    ];
  return (
    <section className="about-section" id="about">
        <h2>ABOUT <span>IEDC</span></h2>
        <p>
           Innovation & Entrepreneurship Development Centre
        </p>
        <p>
         Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of Kerala Startup Mission to promote innovation and entrepreneurship among the student and academic fraternity in the educational institutions in the State of Kerala and is considered as an umbrella programme that would play an instrumental role in fostering innovation culture in Academic institutions.
        </p>

        <div>
            {cards.map((card, index) => (
                <div key={index} className="about-card">
                    <div className="icon">{card.icon}</div>     
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                </div>
            ))}
        </div>
    </section>
    );  
};
export default About;