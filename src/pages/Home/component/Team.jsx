

const Team = () => {
  return (
    <div className="flex items-center gap-6">
        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Team Member 1" className="w-24 h-24 rounded-full" />
        <div>
            <h3 className="text-xl font-bold">John Doe</h3>
            <p className="text-gray-700">Founder & CEO</p>
        </div>
    </div>
  );
}

export default Team;