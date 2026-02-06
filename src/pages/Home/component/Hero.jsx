import HeroImg from "./motivate-someone.svg";
const Hero = () => {
  return (
    <section className="hero">
      <h2>Igniting Innovation.</h2>
      <h1>Empowering Entrepreneurs.</h1>
      <p>
        Building a culture of innovation and entrepreneurship at EMEA College
        through impactful programs and student-driven initiatives.
      </p>
      <div>
        <button>View Events</button>
        <button>Join IEDC</button>
      </div>
      <img src={HeroImg} alt="Hero Image" />

      <div className="buble2" />
      <div className="buble1" />
    </section>
  );
};

export default Hero;
