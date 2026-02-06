import EmiriseImg from "./emirise.png";
const Emirise = () => {
  return (
    <div className="flex p-4 gap-3">
      <img
        src={EmiriseImg}
        alt="Emirise Logo"
        className="w-32 h-32 object-contain rounded-xl"
      />
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex justify-between">
          <>
            <h1 className="text-4xl font-bold mb-4">Emirise</h1>
            <p className="text-lg text-gray-700">
              Flagship Program of IEDC EMEA
            </p>
          </>
          <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            View Details -
          </button>
        </div>
        <p className="text-lg text-gray-700">
          EMIRISE is the flagship innovation and entrepreneurship initiative of
          IEDC EMEA, created to identify, nurture, and accelerate student-driven
          ideas into impactful and sustainable ventures. The program provides
          structured mentorship, expert guidance, hands-on workshops, and
          real-world exposure, enabling students to develop entrepreneurial
          skills, build viable products, and connect with industry leaders.
          Through EMIRISE, IEDC EMEA fosters a culture of innovation,
          leadership, and startup thinking within the academic ecosystem.
        </p>
      </div>
    </div>
  );
};

export default Emirise;
