import QuoteIcon from "@/assets/avatars/quote.svg";
const Testmonials = () => {
  return (
    <div className="flex items-center gap-6 flex-col text-center p-8  rounded-2xl max-w-[1200px] w-full mx-auto">
      <div className="py-10">
        <h1 className="text-2xl font-semibold uppercase">TEAM IEDC EMEA</h1>
        <p className="secondary-color">
          Innovation & Entrepreneurship Development Centre
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-2xl shadow-md w-full max-w-[800px]">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="John Doe"
          className="w-36 h-36 rounded-full mr-4"
        />
        <div className="flex flex-col gap-4 text-left">
          <div className="flex justify-between items-end ">
            <div className="flex flex-col items-start ">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-500">Founder, Startup XYZ</p>
            </div>
            <img
              src={QuoteIcon}
              alt="Quote Icon"
              className="w-10 h-10 text-gray-300 mt-2"
            />
          </div>
          <p className="secondary-color">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
            nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna
            eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus
            venenatis felis id augue sit cursus pellentesque enim Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec
            turpis orci lectus maecenas. Suspendisse”
          </p>
        </div>
      </div>
        <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-2xl shadow-md w-full max-w-[800px]">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="John Doe"
          className="w-36 h-36 rounded-full mr-4"
        />
        <div className="flex flex-col gap-4 text-left">
          <div className="flex justify-between items-end ">
            <div className="flex flex-col items-start ">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-500">Founder, Startup XYZ</p>
            </div>
            <img
              src={QuoteIcon}
              alt="Quote Icon"
              className="w-10 h-10 text-gray-300 mt-2"
            />
          </div>
          <p className="secondary-color">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
            nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna
            eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus
            venenatis felis id augue sit cursus pellentesque enim Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec
            turpis orci lectus maecenas. Suspendisse”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testmonials;
