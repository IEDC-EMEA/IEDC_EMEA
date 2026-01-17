import React from "react";
import About from "../../components/About/About";
import Cards from "../../components/Cards/Cards";
import Faculty from "../../components/Faculty/Faculty";
import Hero from "../../components/Hero/Hero";
import Support from "../../components/Support/Support";
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
function Home() {
  return (
    <div>
       <NavBar/>
      <Hero />
      <Cards />
      <About />
      <Faculty/>
      <Support/>
      <Footer/>
    </div>
  );
}

export default Home;
