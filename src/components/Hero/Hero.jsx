import React from "react";
import HeroImage from "../../assets/hero.png";

function Hero() {
  return (
    <div>
      <section class="bg-white dark:bg-gray-900">
        <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div class="mr-auto place-self-center lg:col-span-5 text-start">
            <h1 class="max-w-2xl mb-4 text-4xl text-gray-800 font-extrabold tracking-tight leading-none md:text-5xl xl:text-5xl dark:text-white">
              INNOVATION AND ENTREPRENEURSHIP DEVELOPMENT CENTRE
            </h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-2xl dark:text-gray-400">
              INNOVATE | INSPIRE | INCUBATE
            </p>
            <a href="https://innovate.startupmission.in/#/register" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-400 ">
                Join now
                <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
          <div class="lg:mt-0 lg:col-span-7 lg:flex">
            <img src={HeroImage} alt="mockup" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
