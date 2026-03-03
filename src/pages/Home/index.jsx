import Hero from "./component/Hero";
import Emirise from "./component/Emirise";
import Activities from "./component/Activities";
import About from "./component/About";
import Testmonials from "./component/Testimonials";
import Team from "./component/Team";
import Contact from "./component/Contact";
const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Activities />
      <Emirise />
      <Testmonials />
      <Team />
      <Contact />
    </div>
  );
};

export default Home;
